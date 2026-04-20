import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Home, PenLine, Zap, ShoppingBag, UserCheck, BarChart2, BookOpen, Settings } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Navbar() {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    base44.auth.me().then((user) => {
      base44.entities.AccountabilityRequest.filter({ to_email: user.email, status: 'pending' })
        .then((reqs) => setPendingCount(reqs.length))
        .catch(() => {});
    }).catch(() => {});
  }, [location.pathname]);

  const links = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/feed', label: 'Feed', icon: Flame },
    { path: '/new-post', label: 'Post', icon: PenLine },
    { path: '/my-journey', label: 'Journey', icon: Zap },
    { path: '/products', label: 'Products', icon: ShoppingBag },
    { path: '/coaching', label: 'Coaches', icon: UserCheck },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border md:top-0 md:bottom-auto md:border-b md:border-t-0"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - hidden on mobile */}
          <Link to="/" className="hidden md:flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">DBAB</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1 w-full md:w-auto justify-around md:justify-end md:gap-2">
            {links.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <span className="relative">
                    <Icon className="w-5 h-5" />
                    {label === 'Journey' && pendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                        {pendingCount}
                      </span>
                    )}
                  </span>
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
