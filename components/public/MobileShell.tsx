import type { SiteContent } from "@/types/content";

type MobileShellProps = {
  content: SiteContent;
  children: React.ReactNode;
  previewLabel?: string;
};

export function MobileShell({
  content,
  children,
  previewLabel
}: MobileShellProps) {
  const theme = content.theme;

  return (
    <main
      className="min-h-screen px-4 py-5"
      style={{
        background:
          `linear-gradient(180deg, ${theme.backgroundColor} 0%, #111827 48%, #07111f 100%)`,
        color: theme.textColor
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-[430px] flex-col gap-8">
        {previewLabel ? (
          <div className="sticky top-3 z-30 mx-auto rounded-full border border-cyan-300/50 bg-slate-950/90 px-4 py-2 text-xs font-bold text-cyan-100 shadow-glow backdrop-blur">
            {previewLabel}
          </div>
        ) : null}
        {children}
      </div>
    </main>
  );
}
