'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Factory,
  Monitor,
  Wrench,
  Package,
  Warehouse,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  Building2,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',   href: '/dashboard' },
  { icon: Factory,         label: 'Production',  href: '/dashboard/production' },
  { icon: Monitor,         label: 'Machines',    href: '/dashboard/machines' },
  { icon: Wrench,          label: 'Maintenance', href: '/dashboard/maintenance' },
  { icon: Package,         label: 'Inventory',   href: '/dashboard/inventory' },
  { icon: Warehouse,       label: 'Warehouse',   href: '/dashboard/warehouse' },
  { icon: ShieldCheck,     label: 'Quality',     href: '/dashboard/quality' },
  { icon: ShoppingCart,    label: 'Orders',      href: '/dashboard/orders' },
  { icon: Truck,           label: 'Dispatch',    href: '/dashboard/dispatch' },
  { icon: Users,           label: 'Employees',   href: '/dashboard/employees' },
  { icon: Building2,       label: 'Suppliers',   href: '/dashboard/suppliers' },
  { icon: BarChart3,       label: 'Analytics',   href: '/dashboard/analytics' },
  { icon: FileText,        label: 'Reports',     href: '/dashboard/reports' },
  { icon: Settings,        label: 'Settings',    href: '/dashboard/settings' },
] as const;

function pageTitleFromPath(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean).pop();
  if (!segment || segment === 'dashboard') return 'Dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // redirect if not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  /* Close sidebar on route change (mobile) */
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="login-loading-screen">
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid rgba(59,130,246,0.2)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const pageTitle = pageTitleFromPath(pathname);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#030712' }}>
      {/* mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
        />
      )}

      {/* sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? 'sidebar-mobile-open' : ''}`}
        style={{
          transform: sidebarOpen ? 'translateX(0)' : undefined,
        }}
      >
        {/* logo */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">
            <Factory size={20} color="#fff" />
          </div>
          <div>
            <div className="sidebar-brand-name">ManuVerse</div>
            <div className="sidebar-brand-tag">Smart Factory</div>
          </div>
        </div>

        {/* nav links */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const isActive =
              href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(href);

            return (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(href);
                }}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} className="sidebar-link-icon" />
                <span>{label}</span>
              </a>
            );
          })}
        </nav>

        {/* user info */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.avatar ?? 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {user?.name ?? 'User'}
            </div>
            <div className="sidebar-user-role">
              {user?.role ?? 'Member'}
            </div>
          </div>
          <button
            onClick={logout}
            className="sidebar-user-logout"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* main area */}
      <div
        className="main-content"
        style={{
          flex: 1,
          width: '100%',
        }}
      >
        {/* header */}
        <header className="header">
          {/* Left: Hamburger (mobile) + Page title */}
          <div className="header-left">
            <button
              className="dashboard-hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e2e8f0',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="page-title" style={{ fontSize: 20 }}>
              {pageTitle}
            </h1>
          </div>

          {/* Right: Search + Notifications + Avatar */}
          <div className="header-right">
            {/* Search bar */}
            <div
              className="header-search"
              style={{
                background: searchFocused ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                border: searchFocused
                  ? '1px solid rgba(59,130,246,0.4)'
                  : '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                padding: '8px 14px',
                gap: 8,
              }}
            >
              <Search size={15} color="#64748b" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search…"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="header-search-input"
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: 0,
                  fontSize: 13,
                }}
              />
              <kbd
                style={{
                  fontSize: 10,
                  color: '#475569',
                  background: 'rgba(255,255,255,0.06)',
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                ⌘K
              </kbd>
            </div>

            {/* Notification bell */}
            <button className="header-icon-btn">
              <Bell size={17} />
              <span className="notification-dot" style={{ top: 6, right: 6 }} />
            </button>

            {/* User avatar */}
            <div className="header-avatar">
              {user?.avatar ?? 'U'}
            </div>
          </div>
        </header>

        {/* content */}
        <main className="page-container">
          {children}
        </main>
      </div>

      {/* responsive css */}
      <style>{`
        /* Hide sidebar on small screens by default */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%) !important;
          }
          .sidebar.sidebar-mobile-open {
            transform: translateX(0) !important;
          }
          .main-content {
            margin-left: 0 !important;
          }
          .dashboard-hamburger {
            display: flex !important;
          }
        }

        /* Make search bar smaller on tablets */
        @media (max-width: 1024px) {
          .header-search {
            min-width: 120px !important;
          }
        }
      `}</style>
    </div>
  );
}
