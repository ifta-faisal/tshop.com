import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Account from './pages/Account.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import NotFound from './pages/NotFound.jsx'
import PrintingHub from './pages/PrintingHub.jsx'
import Brands from './pages/Brands.jsx'
import Deals from './pages/Deals.jsx'
import Contact from './pages/Contact.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import FloatingWidgets from './components/FloatingWidgets.jsx'

// Admin Components
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminTools from './pages/admin/AdminTools.jsx'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Admin Routes (Separate Layout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<div className="text-2xl font-bold">Welcome to Admin Dashboard</div>} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="tools" element={<AdminTools />} />
      </Route>

      {/* Main Storefront Routes */}
      <Route path="/*" element={
        <div className="min-h-full flex flex-col">
          <Navbar />
          <FloatingWidgets />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/printing-hub" element={<PrintingHub />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
              <Route path="/order/:orderNumber" element={<OrderSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
      </Routes>
    </>
  )
}
