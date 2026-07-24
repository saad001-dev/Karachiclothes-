import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "./components/Toast";
import Navbar from "./components/Navbar";
import Home from "./Home";
import Product from "./components/Product";
import About from "./components/About";
import News from "./components/News";
import Contact from "./components/Contact";
import Category, { CategorySection } from "./components/Category";
import SearchResults from "./components/SearchResults";
import ProductDetailPage from "./pages/ProductDetailPage";
import WhatsAppButton from "./components/WhatsAppButton";
import Video from "./components/Video";
import PerfumeSection from "./components/PerfumeSection";
import CollectionPage from "./pages/CollectionPage";

// ✅ Admin Imports
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Admin from "./admin/Admin";
import ProductList from "./admin/ProductList";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";

const App = () => {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <WhatsAppButton />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/new" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/video" element={<Video />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/perfume" element={<PerfumeSection />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/:categorySlug" element={<Category />} />
        <Route path="/mens-collection" element={<CategorySection />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route
          path="/collection/:collectionType"
          element={<CollectionPage />}
        />

        {/* ✅ Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
