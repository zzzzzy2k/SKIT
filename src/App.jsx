import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import Favorites from './pages/Favorites'
import About from './pages/About'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="recipe/:id" element={<RecipeDetail />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
