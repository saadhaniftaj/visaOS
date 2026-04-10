"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getMe, logout, getAccessToken } from "@/lib/api";

interface User {
  id: string;
  email: string;
  full_name: string;
  subscription_tier: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token) { router.push("/login"); return; }
      const me = await getMe();
      setUser(me);
    } catch {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: "📊", section: "General" },
    { href: "/dashboard/questionnaire", label: "Questionnaire", icon: "✏️", section: "Assessment" },
    { href: "/dashboard/results", label: "Results", icon: "🎯", section: "Assessment" },
    { href: "/dashboard/documents", label: "Documents", icon: "📄", section: "Data" },
  ];

  const sections = [...new Set(navItems.map((n) => n.section))];

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} id="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="nav-logo" style={{ opacity: 1 }}>
            <span className="nav-logo-mark">V</span>
            VisaOS
          </Link>
        </div>

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section} className="sidebar-section">
              <div className="sidebar-section-title">{section}</div>
              {navItems
                .filter((n) => n.section === section)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sidebar-link-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={() => logout()}>
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.full_name || "Loading..."}</div>
              <div className="sidebar-user-email">{user?.email || ""}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: "none" }}
              id="sidebar-toggle"
            >
              ☰
            </button>
            <h1 className="topbar-title">
              {navItems.find((n) => n.href === pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="topbar-actions">
            <span className="badge badge-emerald">Free Plan</span>
            <button className="btn btn-ghost btn-sm" onClick={() => logout()}>
              Sign Out
            </button>
          </div>
        </header>

        <main className="page-content animate-in">{children}</main>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          #sidebar-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
