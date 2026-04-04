"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home" },
  { href: "/history", label: "History" },
  { href: "/workout", label: "Workout" },
  { href: "/insights", label: "Insights" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-border bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-lg justify-around gap-1 px-2 py-2">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex min-h-12 flex-col items-center justify-center rounded-xl text-xs font-medium transition-colors ${
                  active
                    ? "bg-bg text-primary"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
