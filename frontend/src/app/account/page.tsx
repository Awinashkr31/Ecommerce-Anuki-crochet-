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

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "ORDER_FULFILLMENT", "CUSTOMER_SUPPORT", "MARKETING", "FINANCE"];

const fetcher = (url: string) => apiGet(url);

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const { profile, isLoading, logout: clearAuthStore } = useAuthStore();
  const router = useRouter();
  const { data: myOrders, mutate: mutateOrders } = useSWR(profile ? '/orders/my-orders' : null, fetcher);
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

  // Mocked Data
  const mockOrders = [
    {
      id: "ORD-84392",
      date: "2026-06-25",
      status: "Processing",
      total: 2450,
      items: [
        { name: "Sunflower Bouquet", qty: 1 },
        { name: "Crochet Bunny", qty: 1 }
      ]
    },
    {
      id: "ORD-71023",
      date: "2026-05-12",
      status: "Delivered",
      total: 1200,
      items: [
        { name: "Custom Name Keychain", qty: 3 }
      ]
    }
  ];

  const mockWishlist = [
    { id: 1, name: "Lavender Fields Blanket", price: 4500, image: "https://images.unsplash.com/photo-1606228281437-dc2a9e3e020f?auto=format&fit=crop&q=80&w=200" },
    { id: 2, name: "Amigurumi Bear", price: 850, image: "https://images.unsplash.com/photo-1598282928509-000c4068593a?auto=format&fit=crop&q=80&w=200" }
  ];

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
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "wallet", label: "Wallet Balance", icon: Wallet },
    { id: "coupons", label: "Available Coupons", icon: Ticket },
    { id: "cards", label: "Saved Cards", icon: CreditCard },
    { id: "reviews", label: "My Reviews", icon: Star },
    { id: "returns", label: "Return Requests", icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-rose-200">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-black mb-2 tracking-tight">My Account</h1>
          <p className="text-neutral-500">Manage your orders, preferences, and wishlist.</p>
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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
                {!myOrders ? (
                  <p className="text-neutral-500">Loading orders...</p>
                ) : myOrders.length === 0 ? (
                  <p className="text-neutral-500">You have no recent orders.</p>
                ) : myOrders.map((order: any) => (
                  <div key={order.id} className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 hover:border-neutral-300 transition-colors">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 pb-6 border-b border-neutral-100 gap-4">
                      <div>
                        <p className="font-black text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm text-neutral-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="md:text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-800" : order.status === "CANCELLED" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                          {order.status}
                        </span>
                        <p className="font-bold text-lg mt-2 hidden md:block">₹{order.totalAmount}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center text-sm text-neutral-700">
                          <span className="font-medium">
                            <span className="text-neutral-400 mr-2">{item.quantity}x</span> 
                            {item.variant?.product?.name || 'Unknown Product'} {item.customization ? `(Custom: ${item.customization})` : ''}
                          </span>
                          <div className="flex items-center gap-4">
                            <span>₹{item.price * item.quantity}</span>
                            {order.status === 'DELIVERED' && (
                              <button 
                                onClick={async () => {
                                  const reason = window.prompt("Reason for return?");
                                  if (reason) {
                                    try {
                                      await apiPost('/returns', { orderItemId: item.id, reason, refundMethod: 'WALLET' });
                                      toast.success("Return requested successfully!");
                                    } catch(e: any) {
                                      toast.error(e.message || "Failed to request return");
                                    }
                                  }
                                }}
                                className="text-xs text-rose-600 font-bold hover:underline"
                              >
                                Request Return
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {expandedTimeline === order.id && order.timeline && (
                      <div className="mt-6 pt-4 border-t border-neutral-100 space-y-4">
                        <h4 className="font-bold text-sm text-neutral-700 mb-2">Order Timeline</h4>
                        {order.timeline.map((event: any) => (
                          <div key={event.id} className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-neutral-300"></div>
                            <div>
                              <p className="text-sm font-bold text-neutral-800">{event.status}</p>
                              <p className="text-xs text-neutral-500">{new Date(event.createdAt).toLocaleString()} - {event.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-neutral-100 flex flex-wrap gap-4">
                      <button 
                        onClick={() => setExpandedTimeline(expandedTimeline === order.id ? null : order.id)}
                        className="bg-neutral-100 text-neutral-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-neutral-200 transition-colors"
                      >
                        {expandedTimeline === order.id ? "Hide Tracking" : "Track Order"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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

            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {mockWishlist.map(item => (
                    <div key={item.id} className="bg-white border border-neutral-200 rounded-3xl p-4 flex gap-4 items-center group">
                      <div className="w-20 h-24 bg-neutral-100 rounded-2xl overflow-hidden relative flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm leading-tight mb-1">{item.name}</h3>
                        <p className="text-rose-600 font-bold mb-3">₹{item.price}</p>
                        <div className="flex gap-2">
                          <button className="bg-neutral-900 text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-neutral-800">Add to Cart</button>
                          <button className="text-neutral-400 hover:text-rose-600 p-2"><Heart size={16} fill="currentColor" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <Wallet size={28} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Available Balance</h2>
                    <p className="text-4xl font-black">₹1,250.00</p>
                  </div>
                </div>
                <h3 className="font-bold mb-4">Recent Transactions</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border border-neutral-100 rounded-2xl">
                    <div>
                      <p className="font-bold text-sm">Refund for ORD-71023</p>
                      <p className="text-xs text-neutral-500">2026-06-01</p>
                    </div>
                    <p className="text-emerald-600 font-bold">+₹1,250.00</p>
                  </div>
                </div>
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

            {activeTab === "cards" && (
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Saved Cards</h2>
                <p className="text-sm text-neutral-500 mb-8">We use Razorpay tokenization. Your raw card numbers are never stored on our servers.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {mockCards.map(card => (
                    <div key={card.id} className="bg-neutral-900 text-white rounded-3xl p-6 relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <CreditCard size={24} />
                        <span className="font-bold italic">{card.type}</span>
                      </div>
                      <div className="relative z-10">
                        <p className="text-xl font-mono tracking-widest mb-2">**** **** **** {card.last4}</p>
                        <p className="text-sm text-neutral-400">Expires {card.expiry}</p>
                      </div>
                    </div>
                  ))}
                  <button className="border-2 border-dashed border-neutral-300 rounded-3xl p-6 flex flex-col items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:border-neutral-400 transition-colors min-h-[160px]">
                    <Plus size={24} className="mb-2" />
                    <span className="font-bold">Add New Card</span>
                  </button>
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

            {activeTab === "returns" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Return Requests</h2>
                {mockReturns.map(req => (
                  <div key={req.id} className="bg-white border border-neutral-200 rounded-3xl p-6 flex justify-between items-center">
                    <div>
                      <p className="font-bold mb-1">{req.item}</p>
                      <p className="text-xs text-neutral-500">Order: {req.orderId} • Refund to: {req.refundMethod}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">{req.status}</span>
                      <p className="text-xs font-bold mt-2">{req.id}</p>
                    </div>
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
