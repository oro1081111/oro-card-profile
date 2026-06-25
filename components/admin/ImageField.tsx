"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ImageUp, Loader2, Move, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder?: "avatars" | "cards" | "misc";
  cropAspect?: number;
};

export function ImageField({
  label,
  value,
  onChange,
  folder = "misc",
  cropAspect
}: ImageFieldProps) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [cropFile, setCropFile] = useState<File | null>(null);

  const resolvedAspect = cropAspect ?? (folder === "avatars" ? 1 : 4 / 3);

  async function uploadImage(file: File) {
    setMessage("");

    if (!supabase) {
      setMessage("尚未設定 Supabase，請先使用圖片 URL。");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("請選擇圖片檔。");
      return;
    }

    setUploading(true);
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session?.access_token) {
      setUploading(false);
      setMessage("登入狀態已過期，請重新登入後再上傳。");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/admin/upload-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`
      },
      body: formData
    });

    const result = (await response.json()) as {
      publicUrl?: string;
      error?: string;
    };

    if (!response.ok || !result.publicUrl) {
      setUploading(false);
      setMessage(result.error || "上傳失敗，請稍後再試。");
      return;
    }

    onChange(result.publicUrl);
    setUploading(false);
    setMessage("圖片已上傳，記得儲存草稿。");
  }

  return (
    <div className="space-y-2">
      <label className="block space-y-2">
        <span className="admin-label">{label}</span>
        <input
          className="admin-field"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://..."
        />
      </label>

      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-slate-950/45 p-3 sm:flex-row sm:items-center">
        <label className="admin-button cursor-pointer">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImageUp className="h-4 w-4" aria-hidden="true" />
          )}
          {uploading ? "上傳中..." : "從手機選擇圖片"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading || Boolean(cropFile)}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) {
                setCropFile(file);
              }
            }}
          />
        </label>
        <span className="text-xs leading-5 text-slate-400">
          也可直接貼圖片 URL。上傳前可拖曳平移、縮放並預覽裁切畫面。
        </span>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/45">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={`${label} 預覽`} className="max-h-48 w-full object-contain" />
        </div>
      ) : null}

      {message ? <p className="text-xs text-cyan-100">{message}</p> : null}

      {cropFile ? (
        <ImageCropperDialog
          file={cropFile}
          aspect={resolvedAspect}
          uploading={uploading}
          folder={folder}
          onCancel={() => setCropFile(null)}
          onConfirm={async (file) => {
            setCropFile(null);
            await uploadImage(file);
          }}
        />
      ) : null}
    </div>
  );
}

type ImageCropperDialogProps = {
  file: File;
  aspect: number;
  uploading: boolean;
  folder: "avatars" | "cards" | "misc";
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void>;
};

type ImageSize = {
  width: number;
  height: number;
};

type Offset = {
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function outputSizeForAspect(aspect: number) {
  const longSide = 1200;
  if (aspect >= 1) {
    return {
      width: longSide,
      height: Math.round(longSide / aspect)
    };
  }

  return {
    width: Math.round(longSide * aspect),
    height: longSide
  };
}

function ImageCropperDialog({
  file,
  aspect,
  uploading,
  folder,
  onCancel,
  onConfirm
}: ImageCropperDialogProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: Offset;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);
  const ratioText =
    aspect === 1 ? "1:1" : aspect > 1 ? "4:3" : "3:4";

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setImageSize(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function getFrame() {
    return frameRef.current?.getBoundingClientRect() ?? null;
  }

  function getBaseScale(frame: DOMRect, size = imageSize) {
    if (!size) {
      return 1;
    }

    return Math.max(frame.width / size.width, frame.height / size.height);
  }

  function getOffsetBounds(nextZoom = zoom) {
    const frame = getFrame();
    if (!frame || !imageSize) {
      return { x: 0, y: 0 };
    }

    const scale = getBaseScale(frame) * nextZoom;
    return {
      x: Math.max(0, (imageSize.width * scale - frame.width) / 2),
      y: Math.max(0, (imageSize.height * scale - frame.height) / 2)
    };
  }

  function clampOffset(next: Offset, nextZoom = zoom) {
    const bounds = getOffsetBounds(nextZoom);
    return {
      x: clamp(next.x, -bounds.x, bounds.x),
      y: clamp(next.y, -bounds.y, bounds.y)
    };
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: offset
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    setOffset(
      clampOffset({
        x: drag.origin.x + event.clientX - drag.startX,
        y: drag.origin.y + event.clientY - drag.startY
      })
    );
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  async function createCroppedFile() {
    const image = imageRef.current;
    const frame = getFrame();
    if (!image || !frame || !imageSize) {
      throw new Error("圖片尚未載入完成。");
    }

    const scale = getBaseScale(frame) * zoom;
    const displayedWidth = imageSize.width * scale;
    const displayedHeight = imageSize.height * scale;
    const left = frame.width / 2 - displayedWidth / 2 + offset.x;
    const top = frame.height / 2 - displayedHeight / 2 + offset.y;
    const sourceX = clamp(-left / scale, 0, imageSize.width);
    const sourceY = clamp(-top / scale, 0, imageSize.height);
    const sourceWidth = clamp(frame.width / scale, 1, imageSize.width - sourceX);
    const sourceHeight = clamp(frame.height / scale, 1, imageSize.height - sourceY);
    const output = outputSizeForAspect(aspect);
    const canvas = document.createElement("canvas");
    canvas.width = output.width;
    canvas.height = output.height;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("無法建立裁切畫布。");
    }

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      output.width,
      output.height
    );

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (nextBlob) => {
          if (nextBlob) {
            resolve(nextBlob);
          } else {
            reject(new Error("裁切圖片失敗。"));
          }
        },
        "image/jpeg",
        0.92
      );
    });

    return new File([blob], `${folder}-cropped-${Date.now()}.jpg`, {
      type: "image/jpeg"
    });
  }

  async function handleConfirm() {
    setProcessing(true);
    const croppedFile = await createCroppedFile();
    setProcessing(false);
    await onConfirm(croppedFile);
  }

  const frame = getFrame();
  const previewScale = frame && imageSize ? getBaseScale(frame) * zoom : 1;
  const bounds = getOffsetBounds();
  const busy = uploading || processing;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 px-4 pb-4 pt-10 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-2xl border border-white/12 bg-slate-950 p-4 text-slate-100 shadow-glow">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-200">
              Crop Preview
            </p>
            <h3 className="mt-1 text-lg font-black">裁切圖片 {ratioText}</h3>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/12 text-slate-200"
            aria-label="取消裁切"
            onClick={onCancel}
            disabled={busy}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div
          ref={frameRef}
          className="relative mx-auto mt-4 w-full max-w-[300px] touch-none overflow-hidden rounded-xl border border-cyan-200/40 bg-slate-900"
          style={{ aspectRatio: aspect }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imageRef}
              src={previewUrl}
              alt="裁切預覽"
              className="absolute left-1/2 top-1/2 max-w-none select-none"
              draggable={false}
              style={{
                width: imageSize?.width,
                height: imageSize?.height,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${previewScale})`,
                transformOrigin: "center"
              }}
              onLoad={(event) => {
                setImageSize({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight
                });
                setOffset({ x: 0, y: 0 });
                setZoom(1);
              }}
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 border-2 border-white/75" />
          <div className="pointer-events-none absolute inset-x-1/3 top-0 h-full border-x border-white/30" />
          <div className="pointer-events-none absolute inset-y-1/3 left-0 w-full border-y border-white/30" />
        </div>

        <div className="mt-4 space-y-3">
          <label className="block space-y-2">
            <span className="admin-label">縮放</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              className="w-full accent-cyan-300"
              onChange={(event) => {
                const nextZoom = Number(event.target.value);
                setZoom(nextZoom);
                setOffset((current) => clampOffset(current, nextZoom));
              }}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="admin-label">左右平移</span>
              <input
                type="range"
                min={-bounds.x}
                max={bounds.x}
                step="1"
                value={offset.x}
                disabled={!bounds.x}
                className="w-full accent-cyan-300"
                onChange={(event) =>
                  setOffset((current) =>
                    clampOffset({ ...current, x: Number(event.target.value) })
                  )
                }
              />
            </label>
            <label className="block space-y-2">
              <span className="admin-label">上下平移</span>
              <input
                type="range"
                min={-bounds.y}
                max={bounds.y}
                step="1"
                value={offset.y}
                disabled={!bounds.y}
                className="w-full accent-cyan-300"
                onChange={(event) =>
                  setOffset((current) =>
                    clampOffset({ ...current, y: Number(event.target.value) })
                  )
                }
              />
            </label>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            className="admin-button flex-1"
            onClick={onCancel}
            disabled={busy}
          >
            取消
          </button>
          <button
            type="button"
            className="admin-button-primary flex-1"
            onClick={handleConfirm}
            disabled={busy || !imageSize}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Move className="h-4 w-4" aria-hidden="true" />
            )}
            {busy ? "處理中..." : "裁切並上傳"}
          </button>
        </div>
      </div>
    </div>
  );
}
