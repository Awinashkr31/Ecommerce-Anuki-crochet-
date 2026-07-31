"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, User, MapPin, LogOut, Heart, Star, CreditCard, Wallet, Ticket, RotateCcw, Plus, Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { apiPost, apiGet } from "../../lib/api";
import useSWR from "swr";
import toast from "react-hot-toast";
import CustomerOrders from "../../components/orders/CustomerOrders";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "ORDER_FULFILLMENT", "CUSTOMER_SUPPORT", "MARKETING", "FINANCE"];

const fetcher = (url: string) => apiGet(url);

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const { profile, isLoading, logout: clearAuthStore } = useAuthStore();
  const router = useRouter();
  const { data: walletData, isLoading: isWalletLoading } = useSWR(
    activeTab === "wallet" && profile ? "/wallet" : null,
    fetcher
  );
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !profile) {
      router.replace("/auth");
    }
  }, [isLoading, profile, router]);

  const handleLogout = () => {
    // Fire and forget background tasks
    apiPost("/auth/logout", {}).catch(() => {});
    signOut(auth).catch(() => {});
    
    // Instant UI update
    clearAuthStore();
    router.push("/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!profile) return null;

  const isAdmin = ADMIN_ROLES.includes(profile.role);
  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const mockReviews = [
    { id: 1, product: "Custom Name Keychain", rating: 5, date: "2026-05-20", comment: "Absolutely loved it! Perfect for gifting." }
  ];

  const mockCards = [
    { id: 1, type: "Visa", last4: "4242", expiry: "12/28" },
    { id: 2, type: "Mastercard", last4: "8888", expiry: "08/27" }
  ];

  const mockCoupons = [
    { code: "WELCOME10", desc: "10% off your next order", validUntil: "2026-12-31" },
    { code: "FESTIVE20", desc: "20% off on orders above ₹2000", validUntil: "2026-10-31" }
  ];

  const mockReturns = [
    { id: "RET-1029", orderId: "ORD-71023", item: "Custom Name Keychain", status: "Approved", refundMethod: "Wallet" }
  ];

  const navItems = [
    { id: "orders", label: "Order History", icon: Package },
    { id: "profile", label: "Profile Details", icon: User },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "coupons", label: "Available Coupons", icon: Ticket },
    { id: "reviews", label: "My Reviews", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-rose-200">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-black mb-2 tracking-tight">My Account</h1>
          <p className="text-neutral-500">Manage your orders and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white rounded-3xl p-4 border border-neutral-200 mb-6 flex items-center gap-4">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-neutral-200" />
              ) : (
                <div className="w-12 h-12 bg-rose-100 text-rose-700 font-bold rounded-full flex items-center justify-center text-lg">
                  {getInitials(profile.fullName)}
                </div>
              )}
              <div>
                <p className="font-bold">{profile.fullName}</p>
                <p className="text-xs text-neutral-500">{profile.email}</p>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    <Shield size={10} />
                    {profile.role.replace("_", " ")}
                  </span>
                )}
              </div>
            </div>

            <nav className="space-y-1 bg-white p-2 rounded-3xl border border-neutral-200">
              {isAdmin && (
                <>
                  <Link
                    href="/admin"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
                  >
                    <Shield size={18} className="text-neutral-400" />
                    Admin Dashboard
                  </Link>
                  <div className="my-2 border-t border-neutral-100"></div>
                </>
              )}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                      activeTab === item.id 
                        ? "bg-rose-50 text-rose-700 font-bold" 
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                  >
                    <Icon size={18} className={activeTab === item.id ? "text-rose-600" : "text-neutral-400"} /> 
                    {item.label}
                  </button>
                );
              })}
              <div className="my-2 border-t border-neutral-100"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <CustomerOrders />
            )}

            {activeTab === "profile" && (
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-8">Profile Details</h2>
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Full Name</label>
                    <input type="text" defaultValue={profile.fullName} className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Email</label>
                    <input type="email" defaultValue={profile.email} disabled className="w-full border border-neutral-200 bg-neutral-50 rounded-xl p-3 text-neutral-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Phone Number</label>
                    <input type="tel" defaultValue="" placeholder="Enter your phone number" className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none transition-shadow" />
                  </div>
                  <button className="bg-neutral-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition-colors mt-4">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 text-center py-16">
                <MapPin className="mx-auto text-neutral-300 mb-6" size={64} />
                <h2 className="text-xl font-bold mb-2">No saved addresses</h2>
                <p className="text-neutral-500 mb-8">You haven't saved any addresses yet.</p>
                <button className="border-2 border-neutral-200 text-neutral-900 px-8 py-3 rounded-xl font-bold hover:border-neutral-900 transition-colors">
                  Add New Address
                </button>
              </div>
            )}





            {activeTab === "coupons" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Available Coupons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockCoupons.map((coupon, i) => (
                    <div key={i} className="bg-rose-50 border border-rose-100 rounded-3xl p-6 relative overflow-hidden">
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-100 rounded-full opacity-50"></div>
                      <div className="relative z-10">
                        <div className="bg-white inline-block px-4 py-1.5 rounded-lg border border-rose-200 font-black text-rose-600 tracking-widest mb-3">
                          {coupon.code}
                        </div>
                        <p className="font-bold mb-1">{coupon.desc}</p>
                        <p className="text-xs text-neutral-500">Valid until {coupon.validUntil}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}



            {activeTab === "reviews" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
                {mockReviews.map(review => (
                  <div key={review.id} className="bg-white border border-neutral-200 rounded-3xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold">{review.product}</h3>
                        <p className="text-xs text-neutral-500 mt-1">{review.date}</p>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-neutral-300" : ""} />)}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-700 bg-neutral-50 p-4 rounded-2xl italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}


          </div>
        </div>
      </main>
    </div>
  );
}
