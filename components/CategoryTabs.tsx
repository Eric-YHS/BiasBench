"use client";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import clsx from "clsx";

export default function CategoryTabs(){
  const pathname = usePathname();
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.slice(1).map(c => {
        const href = `/leaderboards/${c.key}` as Route;
        const active = pathname === href;
        return (
          <Link
            key={c.key}
            href={href}
            className={clsx(
              "px-3 py-1.5 rounded-full border text-sm",
              active ? "bg-brand-700 text-white border-brand-700" : "bg-white hover:bg-slate-50 border-slate-300"
            )}
          >
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
