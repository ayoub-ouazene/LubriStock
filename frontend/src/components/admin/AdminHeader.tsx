"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "./AdminAuthProvider";

export function AdminHeader() {
  const { user, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Tableau de bord" },
    { href: "/admin/stock", label: "Stock" },
    { href: "/admin/cache", label: "Spécifications" },
    { href: "/admin/cache?category=engine", label: "Moteurs" },
    { href: "/admin/cache?category=transmission", label: "Boîtes / transmissions" },
    { href: "/admin/orders", label: "Commandes" },
  ];

  return (
    <header className="bg-brand-dark border-b border-brand-dark-light shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/admin" className="text-sm font-bold tracking-wide text-white">
            <span className="text-brand-orange">LUBRI</span>STOCK <span className="text-white/50">/ ADMIN</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm px-3 py-1.5 rounded ${
                    active
                      ? "bg-brand-dark-light text-white font-medium"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs text-white/60">{user.username}</span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm border border-white/30 text-white px-3 py-1.5 rounded hover:bg-white/10"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
