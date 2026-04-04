import { BottomNav } from "@/components/BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
