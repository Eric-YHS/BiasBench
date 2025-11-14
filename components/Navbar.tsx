"use client";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "https://osf.io/", label: "Research", external: true },
  { href: "/faq", label: "FAQ", external: false },
  { href: "/team", label: "Team", external: false },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="container-narrow flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg">
          BiasBench <span className="text-brand-700">MVP</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map(link => {
            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-brand-700"
                >
                  {link.label}
                </a>
              );
            }
            const href = link.href as Route;
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "hover:text-brand-700",
                  isActive ? "text-brand-700 font-medium" : "text-slate-700"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
