"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { PAYMENT_STATUS_CONFIG, PAYMENT_ACTIONS, PaymentStatusKey } from "@/lib/paymentConfig";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { load } from "@cashfreepayments/cashfree-js";
import {
  CheckCircle2, XCircle, Clock, Loader2, LogOut, Ban, Timer,
  CalendarX2, RotateCcw, AlertTriangle, Banknote, Eye, RefreshCw,
  CreditCard, Package, Download, ShoppingBag, ShoppingCart,
  MessageCircle, ArrowLeft, ChevronDown, ChevronUp
} from "lucide-react";

// Icon mapper
const ICON_MAP: Record<string, any> = {
  CheckCircle2, XCircle, Clock, Loader2, LogOut, Ban, Timer,
  CalendarX2, RotateCcw, AlertTriangle, Banknote, Eye, RefreshCw,
  CreditCard, Package, Download, ShoppingBag, ShoppingCart, MessageCircle
};

interface PaymentStatusData {
  payment: {
    id: string;
    status: PaymentStatusKey;
    amount: number;
    currency: string;
    gateway: string;
    transactionId: string;
    paymentMethod: string | null;
    retryCount: number;
    maxRetries: number;
    failureReason: string | null;
    createdAt: string;
    updatedAt: string;
  };
  order: any;
  timeline: Array<{ id: string; event: string; description: string; timestamp: string }>;
  retryAllowed: boolean;
}

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const { clearCart } = useCartStore();

  const [data, setData] = useState<PaymentStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const cartCleared = useRef(false);

  const fetchStatus = useCallback(async () => {
    try {
      const result = await apiGet<PaymentStatusData>(`/payments/status/${orderId}`);
      setData(result);
      setError(null);

      // Clear cart on success/COD (only once)
      const config = PAYMENT_STATUS_CONFIG[result.payment.status];
      if (config?.clearCart && !cartCleared.current) {
        clearCart();
        cartCleared.current = true;
      }

      // Stop polling if terminal state
      const terminalStates: PaymentStatusKey[] = ['SUCCESS', 'FAILED', 'USER_DROPPED', 'CANCELLED', 'EXPIRED', 'TIMEOUT', 'REFUNDED', 'COD_PENDING', 'COD_CONFIRMED'];
      if (terminalStates.includes(result.payment.status)) {
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load payment status');
    } finally {
      setLoading(false);
    }
  }, [orderId, clearCart]);

  useEffect(() => {
    if (!orderId) return;
    fetchStatus();

    // Poll every 5 seconds for non-terminal states
    pollRef.current = setInterval(fetchStatus, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [orderId, fetchStatus]);

  // Browser unload warning during processing
  useEffect(() => {
    if (data?.payment.status === 'PROCESSING' || data?.payment.status === 'PENDING') {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handler);
      return () => window.removeEventListener('beforeunload', handler);
    }
  }, [data?.payment.status]);

  const handleRetry = async () => {
    if (retrying) return;
    setRetrying(true);

    try {
      const retryResult = await apiPost('/payments/retry', { orderId });

      const cashfree = await load({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "production" ? "production" : "sandbox",
      });

      if (!cashfree) {
        throw new Error("Cashfree initialization failed");
      }

      cashfree.checkout({
        paymentSessionId: retryResult.payment_session_id,
        redirectTarget: "_modal",
      }).then((result: any) => {
        if (result.paymentDetails) {
          toast.loading("Verifying payment...", { id: "verify" });
          apiPost('/payments/cashfree/verify', {
            order_id: retryResult.order_id,
            internalOrderId: orderId,
          }).then(() => {
            toast.success("Payment Successful!", { id: "verify" });
            fetchStatus();
          }).catch(() => {
            toast.error("Verification failed", { id: "verify" });
            fetchStatus();
          });
        } else {
          fetchStatus();
        }
        setRetrying(false);
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to retry payment");
      setRetrying(false);
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'track_order':
        router.push('/account');
        break;
      case 'continue_shopping':
        router.push('/products');
        break;
      case 'view_cart':
        router.push('/cart');
        break;
      case 'buy_again':
        router.push('/products');
        break;
      case 'contact_support':
        window.open('mailto:support@anukicrochet.in', '_blank');
        break;
      case 'retry_payment':
      case 'change_method':
        handleRetry();
        break;
      case 'refresh_status':
        fetchStatus();
        break;
      case 'download_invoice':
        toast.success("Invoice download coming soon!");
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-neutral-400 mx-auto" />
          <p className="text-neutral-500 text-sm">Loading payment status...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        
        <div className="text-center space-y-4 max-w-md">
          <XCircle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">Something went wrong</h2>
          <p className="text-neutral-500 text-sm">{error || "Unable to load payment status."}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/account')} className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl font-medium text-sm hover:bg-neutral-800 transition-colors">
              My Orders
            </button>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 border border-neutral-200 rounded-xl font-medium text-sm hover:bg-neutral-50 transition-colors">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { payment, order, timeline, retryAllowed } = data;
  const statusConfig = PAYMENT_STATUS_CONFIG[payment.status] || PAYMENT_STATUS_CONFIG.FAILED;
  const StatusIcon = ICON_MAP[statusConfig.icon] || CheckCircle2;

  const orderItems = order?.items || [];
  const formatDate = (d: string) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  const shortOrderId = order?.id?.slice(-8)?.toUpperCase() || 'N/A';

  return (
    <div className="min-h-screen bg-neutral-50">
      

      {/* Header */}
      <header className="bg-white border-b border-neutral-100 py-4 px-4 md:px-8 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/account')} className="p-2 hover:bg-neutral-50 rounded-full transition-colors -ml-2">
              <ArrowLeft size={20} className="text-neutral-700" />
            </button>
            <h1 className="text-lg font-bold text-neutral-900">Order Status</h1>
          </div>
          <span className="text-xs font-mono text-neutral-400">#{shortOrderId}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* ── Status Card ── */}
        <div
          className="rounded-2xl border-2 p-8 text-center transition-all"
          style={{ backgroundColor: statusConfig.bgColor, borderColor: statusConfig.borderColor }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${statusConfig.color}15` }}
            >
              <StatusIcon
                size={40}
                style={{ color: statusConfig.color }}
                className={statusConfig.showLoader ? 'animate-spin' : ''}
              />
            </div>
          </div>

          {/* Label */}
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">{statusConfig.label}</h2>
          <p className="text-neutral-600 text-sm max-w-md mx-auto leading-relaxed">
            {payment.failureReason || statusConfig.customerMessage}
          </p>

          {/* Key Details */}
          {payment.status === 'SUCCESS' && (
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm mx-auto text-left">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Order ID</p>
                <p className="text-sm font-bold text-neutral-900">#{shortOrderId}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Transaction ID</p>
                <p className="text-sm font-mono text-neutral-700 truncate">{payment.transactionId}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Amount Paid</p>
                <p className="text-sm font-bold text-neutral-900">₹{payment.amount}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Payment Method</p>
                <p className="text-sm text-neutral-700 capitalize">{payment.paymentMethod || payment.gateway}</p>
              </div>
            </div>
          )}

          {/* Retry info */}
          {retryAllowed && payment.retryCount > 0 && (
            <p className="mt-4 text-xs text-neutral-500">
              Retry attempt {payment.retryCount} of {payment.maxRetries}
            </p>
          )}
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap gap-3 justify-center">
          {statusConfig.actions.map(actionKey => {
            const action = PAYMENT_ACTIONS[actionKey];
            if (!action) return null;

            // Skip retry if not allowed
            if ((actionKey === 'retry_payment' || actionKey === 'change_method') && !retryAllowed) return null;

            const ActionIcon = ICON_MAP[action.icon] || Package;
            const isRetry = actionKey === 'retry_payment' || actionKey === 'change_method';

            let className = "px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ";
            if (action.variant === 'primary') {
              className += "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm";
            } else if (action.variant === 'secondary') {
              className += "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-300";
            } else {
              className += "text-neutral-600 hover:text-neutral-900 hover:bg-white";
            }

            return (
              <button
                key={actionKey}
                onClick={() => handleAction(actionKey)}
                disabled={isRetry && retrying}
                className={className}
              >
                {isRetry && retrying ? <Loader2 size={16} className="animate-spin" /> : <ActionIcon size={16} />}
                {action.label}
              </button>
            );
          })}
        </div>

        {/* ── Order Items ── */}
        {orderItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <h3 className="font-bold text-neutral-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {orderItems.map((item: any) => {
                const product = item.variant?.product;
                const image = product?.images?.[0]?.url;
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-14 h-14 bg-neutral-100 rounded-xl overflow-hidden shrink-0 relative">
                      {image && <Image src={image} alt={product?.name || ''} fill className="object-cover" unoptimized />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{product?.name || 'Product'}</p>
                      <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-neutral-900">₹{item.price}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between">
              <span className="font-bold text-neutral-900">Total</span>
              <span className="font-bold text-neutral-900">₹{payment.amount}</span>
            </div>
          </div>
        )}

        {/* ── Payment Timeline ── */}
        {timeline.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-bold text-neutral-900">Payment Timeline</h3>
              {showTimeline ? <ChevronUp size={18} className="text-neutral-400" /> : <ChevronDown size={18} className="text-neutral-400" />}
            </button>

            {showTimeline && (
              <div className="mt-4 space-y-0">
                {timeline.map((event, i) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full border-2 shrink-0"
                        style={{
                          borderColor: i === timeline.length - 1 ? statusConfig.color : '#D1D5DB',
                          backgroundColor: i === timeline.length - 1 ? statusConfig.color : 'transparent'
                        }}
                      />
                      {i < timeline.length - 1 && <div className="w-px h-8 bg-neutral-200" />}
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-medium text-neutral-800">{event.description || event.event}</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{formatDate(event.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Payment Time ── */}
        <div className="text-center text-xs text-neutral-400 pb-8">
          Payment initiated on {formatDate(payment.createdAt)}
        </div>
      </main>
    </div>
  );
}
