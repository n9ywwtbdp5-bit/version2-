import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../store.js";

const NAV = [
  { to: "/app/dashboard", label: "Home", emoji: "🏠" },
  { to: "/app/timer", label: "Study", emoji: "⏱️" },
  { to: "/app/progress", label: "Progress", emoji: "📊" },
  { to: "/app/achievements", label: "Badges", emoji: "🏆" },
  { to: "/app/pricing", label: "Upgrade", emoji: "⚡" },
];

export default function Layout() {
  const { user, currentStreak, xp, level, xpToNextLevel } = useStore();
  const navigate = useNavigate();
  const xpPct = Math.min(100, Math.round((xp / xpToNextLevel) * 100));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-primary text-primary">
      {/* Background Shapes */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-0 top-0 w-32 h-32 -left-16 -top-16 bg-gradient-to-br from-orange-400/20 to-transparent blur-3xl animate-float-slow delay-100"></div>
        <div className="absolute right-0 bottom-0 w-24 h-24 -right-12 -bottom-12 bg-gradient-to-tr from-purple-500/20 to-transparent blur-3xl animate-float-slow delay-300"></div>
        <div className="absolute left-1/2 bottom-1/2 w-48 h-48 -left-24 -bottom-24 bg-gradient-to-bl from-green-400/15 to-transparent blur-3xl animate-float-slow delay-500"></div>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-secondary/80 backdrop-blur-md border-r border-border/20 flex flex-col p-6">
          {/* Logo */}
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-3 mb-8 p-2 rounded-lg hover:bg-border/10 transition-colors"
          >
            <span className="text-2xl animate-streak-fire">🔥</span>
            <span className="font-display text-xl text-gradient">StudyStreak</span>
          </button>

          {/* User Card */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 text-white text-lg">
                {user.avatar}
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="flex items-center gap-1 text-sm text-muted">
                  <span className="badge badge-primary">Level {level}</span>
                  <span className="animate-pulse">⭐</span>
                </div>
              </div>
            </div>
            
            <div className="w-full">
              <div className="flex items-center justify-between mb-1 text-xs text-muted">
                <span>XP Progress</span>
                <span>{xp} / {xpToNextLevel}</span>
              </div>
              <div className="w-full bg-border/20 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-500" style={{ width: `${xpPct}%` }}></div>
              </div>
            </div>
          </div>

          {/* Streak Section */}
          <div className="glass-card p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl animate-streak-fire">🔥</span>
              <span className="font-display text-xl">{currentStreak}</span>
              <span className="text-sm text-muted">Day Streak</span>
            </div>
            <div className="text-xs text-muted">
              Best: {user.longestStreak || 0} days
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-2">
            {NAV.map(({ to, label, emoji }) => (
              <NavLink 
                key={to} 
                to={to} 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 
                    "glass-card-elevated text-primary hover:-translate-y-1 hover:shadow-md" : 
                    "text-border hover:text-primary hover:bg-border/10 hover:-translate-y-[1px]"}` 
                }
              >
                <span className="text-xl">{emoji}</span>
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Plan Badge */}
          <div className="glass-card p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {user.plan === "free" ? (
                <span className="text-sm font-medium">🆓 Free Plan</span>
              ) : user.plan === "pro" ? (
                <>
                  <span className="text-sm font-medium">⚡ Pro Plan</span>
                  <span className="animate-pulse text-xs">•</span>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium">👑 Premium Plan</span>
                  <span className="animate-pulse text-xs">•</span>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
'EOF
