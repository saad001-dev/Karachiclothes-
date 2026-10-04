// src/admin/Admin.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  ShoppingBag,
  Plus,
  Package,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  LayoutDashboard,
  FileText,
} from "lucide-react";

const Admin = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    categories: 0,
    lowStock: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/products");
      const products = res.data.data || [];

      const categories = new Set(products.map((p) => p.category));
      const lowStock = products.filter((p) => p.stock <= 5).length;
      const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

      setStats({
        totalProducts: products.length,
        categories: categories.size,
        lowStock: lowStock,
        totalValue: totalValue,
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: LayoutDashboard,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      icon: AlertCircle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Value",
      value: `Rs. ${stats.totalValue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const quickActions = [
    {
      title: "Products",
      description: "View & manage all products",
      icon: ShoppingBag,
      link: "/admin/products",
      color: "bg-blue-500",
    },
    {
      title: "Add Product",
      description: "Add new product to store",
      icon: Plus,
      link: "/admin/add-product",
      color: "bg-green-500",
    },
    {
      title: "Orders",
      description: "View Telegram orders",
      icon: FileText,
      link: "/admin/orders",
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div
                    className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-white`}
                  >
                    <action.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mt-3">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Store Overview
            </h3>
            <span className="text-xs text-gray-400">Updated just now</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-400">Products</p>
              <p className="text-lg font-semibold text-gray-800">
                {stats.totalProducts}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Categories</p>
              <p className="text-lg font-semibold text-gray-800">
                {stats.categories}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Low Stock Items</p>
              <p
                className={`text-lg font-semibold ${stats.lowStock > 0 ? "text-red-600" : "text-green-600"}`}
              >
                {stats.lowStock}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Value</p>
              <p className="text-lg font-semibold text-gray-800">
                Rs. {stats.totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
