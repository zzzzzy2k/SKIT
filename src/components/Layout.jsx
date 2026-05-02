import { Outlet, NavLink } from 'react-router-dom'

function HomeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function InfoIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

function HeartIcon({ className, filled }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-hero-gradient">
      {/* Floating glass header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3">
        <div className="max-w-5xl mx-auto glass-strong rounded-2xl px-5 py-3 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group">
            <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">🍳</span>
            <span className="font-display text-xl font-bold text-warm-800 tracking-tight">食刻</span>
          </NavLink>
          <span className="text-xs text-warm-400 hidden sm:block">知食时刻，乐在厨中</span>
        </div>
      </header>

      {/* Main content — account for floating header */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pt-20 pb-24">
        <Outlet />
      </main>

      {/* Floating glass bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-3">
        <div className="max-w-sm mx-auto glass-strong rounded-2xl px-2 py-2 flex items-center shadow-lg">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary-600 bg-primary-100/70 shadow-sm font-semibold'
                  : 'text-warm-500 hover:text-warm-700 hover:bg-warm-100/50'
              }`
            }
          >
            <HomeIcon className="w-5.5 h-5.5" />
            <span className="text-xs">首页</span>
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-accent-500 bg-accent-100/70 shadow-sm font-semibold'
                  : 'text-warm-500 hover:text-warm-700 hover:bg-warm-100/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <HeartIcon className="w-5.5 h-5.5" filled={isActive} />
                <span className="text-xs">收藏</span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-olive-600 bg-olive-100/70 shadow-sm font-semibold'
                  : 'text-warm-500 hover:text-warm-700 hover:bg-warm-100/50'
              }`
            }
          >
            <InfoIcon className="w-5.5 h-5.5" />
            <span className="text-xs">说明</span>
          </NavLink>
        </div>
      </nav>

      {/* Attribution footer */}
      <footer className="text-center text-xs text-warm-400 py-2 pb-16">
        菜谱数据来自 <a href="https://github.com/Anduin2017/HowToCook" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">HowToCook</a> 开源项目 (MIT)
      </footer>
    </div>
  )
}
