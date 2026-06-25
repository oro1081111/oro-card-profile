import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const allowedFolders = new Set(["avatars", "cards", "misc"]);
const maxFileSize = 10 * 1024 * 1024;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function extensionFromFile(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  const fromType = file.type.split("/").pop()?.toLowerCase();
  return fromType || "jpg";
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseSecretKey) {
    return jsonError("尚未設定圖片上傳環境變數。", 500);
  }

  const authorization = request.headers.get("authorization");
  const token = authorization?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return jsonError("請先登入後台。", 401);
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const adminClient = createClient(supabaseUrl, supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const {
    data: { user },
    error: userError
  } = await userClient.auth.getUser(token);

  if (userError || !user?.email) {
    return jsonError("登入狀態已過期，請重新登入。", 401);
  }

  const { data: admin, error: adminError } = await adminClient
    .from("site_admins")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();

  if (adminError || !admin) {
    return jsonError("此帳號沒有圖片上傳權限。", 403);
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderValue = String(formData.get("folder") || "misc");
  const folder = allowedFolders.has(folderValue) ? folderValue : "misc";

  if (!(file instanceof File)) {
    return jsonError("請選擇圖片檔。", 400);
  }

  if (!file.type.startsWith("image/")) {
    return jsonError("請選擇圖片檔。", 400);
  }

  if (file.size > maxFileSize) {
    return jsonError("圖片不可超過 10 MB。", 400);
  }

  const ext = extensionFromFile(file);
  const path = `${folder}/${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await adminClient.storage
    .from("profile-assets")
    .upload(path, bytes, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    return jsonError(`上傳失敗：${uploadError.message}`, 500);
  }

  const { data } = adminClient.storage.from("profile-assets").getPublicUrl(path);

  return NextResponse.json({ publicUrl: data.publicUrl });
}
