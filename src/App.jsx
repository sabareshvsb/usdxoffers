import { HashRouter, Outlet, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './store/StoreContext'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import AnnouncementBar from './components/AnnouncementBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Offers from './pages/Offers'
import Lucky50 from './pages/Lucky50'
import TripleCar from './pages/TripleCar'
import Leaderboard from './pages/Leaderboard'
import LeaderProfile from './pages/LeaderProfile'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLeaders from './pages/admin/AdminLeaders'
import AdminOffers from './pages/admin/AdminOffers'
import AdminCampaign from './pages/admin/AdminCampaign'
import NotFound from './pages/NotFound'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-navy-950 grain flex flex-col">
      <Navbar />
      <AnnouncementBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/lucky-50" element={<Lucky50 />} />
            <Route path="/triple-car" element={<TripleCar />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/leader/:id" element={<LeaderProfile />} />
            <Route path="/my-progress" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="leaders" element={<AdminLeaders />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="campaign" element={<AdminCampaign />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}