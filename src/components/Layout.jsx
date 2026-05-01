import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <NavLink to="/" className="text-xl font-bold text-primary-600">
            🍳 食刻
          </NavLink>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="bg-white border-t sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex-1 py-3 text-center text-sm ${isActive ? 'text-primary-600 font-medium' : 'text-gray-500'}`
            }
          >
            🏠 首页
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex-1 py-3 text-center text-sm ${isActive ? 'text-primary-600 font-medium' : 'text-gray-500'}`
            }
          >
            ❤️ 收藏
          </NavLink>
        </div>
      </nav>

      {/* Attribution */}
      <footer className="text-center text-xs text-gray-400 py-2">
        菜谱数据来自 HowToCook 开源项目 (MIT)
      </footer>
    </div>
  )
}
