// Payment Status Configuration — shared between frontend and backend
// Defines colors, icons, messages, and allowed actions for every payment state

export type PaymentStatusKey =
  | 'INITIATED'
  | 'PROCESSING'
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'USER_DROPPED'
  | 'CANCELLED'
  | 'TIMEOUT'
  | 'EXPIRED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'CHARGEBACK'
  | 'COD_PENDING'
  | 'COD_CONFIRMED'
  | 'PAYMENT_REVIEW'
  | 'RETRY_PAYMENT';

export interface PaymentStatusConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;          // Lucide icon name
  label: string;
  customerMessage: string;
  adminLabel: string;
  allowRetry: boolean;
  clearCart: boolean;
  createOrder: boolean;
  generateInvoice: boolean;
  showLoader: boolean;
  actions: string[];
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatusKey, PaymentStatusConfig> = {
  INITIATED: {
    color: '#6366F1',
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    icon: 'CreditCard',
    label: 'Payment Initiated',
    customerMessage: 'Redirecting to payment gateway...',
    adminLabel: 'Initiated',
    allowRetry: false,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: true,
    actions: [],
  },
  PROCESSING: {
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: 'Loader2',
    label: 'Processing Payment',
    customerMessage: 'Please wait while we process your payment. Do not close this page.',
    adminLabel: 'Processing',
    allowRetry: false,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: true,
    actions: [],
  },
  PENDING: {
    color: '#F97316',
    bgColor: '#FFF7ED',
    borderColor: '#FED7AA',
    icon: 'Clock',
    label: 'Payment Pending',
    customerMessage: 'Waiting for bank confirmation. This usually takes a few minutes.',
    adminLabel: 'Pending',
    allowRetry: false,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: true,
    actions: ['refresh_status', 'contact_support'],
  },
  SUCCESS: {
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    icon: 'CheckCircle2',
    label: 'Payment Successful',
    customerMessage: 'Thank you! Your payment was successful and your order is confirmed.',
    adminLabel: 'Paid',
    allowRetry: false,
    clearCart: true,
    createOrder: true,
    generateInvoice: true,
    showLoader: false,
    actions: ['track_order', 'download_invoice', 'continue_shopping', 'buy_again'],
  },
  FAILED: {
    color: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    icon: 'XCircle',
    label: 'Payment Failed',
    customerMessage: 'Your payment could not be processed. Please try again or use a different payment method.',
    adminLabel: 'Failed',
    allowRetry: true,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: false,
    actions: ['retry_payment', 'change_method', 'contact_support', 'continue_shopping'],
  },
  USER_DROPPED: {
    color: '#9333EA',
    bgColor: '#FAF5FF',
    borderColor: '#DDD6FE',
    icon: 'LogOut',
    label: 'Payment Incomplete',
    customerMessage: 'Your payment was interrupted. You can resume or retry your payment.',
    adminLabel: 'Dropped',
    allowRetry: true,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: false,
    actions: ['retry_payment', 'continue_shopping', 'view_cart'],
  },
  CANCELLED: {
    color: '#6B7280',
    bgColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    icon: 'Ban',
    label: 'Payment Cancelled',
    customerMessage: 'You cancelled the payment. Your cart items are still saved.',
    adminLabel: 'Cancelled',
    allowRetry: true,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: false,
    actions: ['retry_payment', 'change_method', 'continue_shopping'],
  },
  TIMEOUT: {
    color: '#B45309',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: 'Timer',
    label: 'Payment Session Expired',
    customerMessage: 'Your payment session timed out. Please try again.',
    adminLabel: 'Timed Out',
    allowRetry: true,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: false,
    actions: ['retry_payment', 'continue_shopping'],
  },
  EXPIRED: {
    color: '#78716C',
    bgColor: '#FAFAF9',
    borderColor: '#E7E5E4',
    icon: 'CalendarX2',
    label: 'Payment Link Expired',
    customerMessage: 'This payment link has expired. Please start a new checkout.',
    adminLabel: 'Expired',
    allowRetry: true,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: false,
    actions: ['retry_payment', 'continue_shopping'],
  },
  REFUNDED: {
    color: '#0891B2',
    bgColor: '#ECFEFF',
    borderColor: '#A5F3FC',
    icon: 'RotateCcw',
    label: 'Refund Processed',
    customerMessage: 'Your refund has been processed. It will be credited within 5-7 business days.',
    adminLabel: 'Refunded',
    allowRetry: false,
    clearCart: true,
    createOrder: false,
    generateInvoice: false,
    showLoader: false,
    actions: ['contact_support', 'continue_shopping'],
  },
  PARTIALLY_REFUNDED: {
    color: '#0D9488',
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
    icon: 'RotateCcw',
    label: 'Partially Refunded',
    customerMessage: 'A partial refund has been processed for your order.',
    adminLabel: 'Partial Refund',
    allowRetry: false,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: false,
    actions: ['contact_support', 'continue_shopping'],
  },
  CHARGEBACK: {
    color: '#BE123C',
    bgColor: '#FFF1F2',
    borderColor: '#FECDD3',
    icon: 'AlertTriangle',
    label: 'Chargeback',
    customerMessage: 'A chargeback has been initiated. Please contact support.',
    adminLabel: 'Chargeback',
    allowRetry: false,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: false,
    actions: ['contact_support'],
  },
  COD_PENDING: {
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    icon: 'Banknote',
    label: 'Cash on Delivery',
    customerMessage: 'Your COD order has been placed! Pay at the time of delivery.',
    adminLabel: 'COD Pending',
    allowRetry: false,
    clearCart: true,
    createOrder: true,
    generateInvoice: false,
    showLoader: false,
    actions: ['track_order', 'continue_shopping'],
  },
  COD_CONFIRMED: {
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    icon: 'CheckCircle2',
    label: 'COD Confirmed',
    customerMessage: 'Your Cash on Delivery order is confirmed and being processed.',
    adminLabel: 'COD Confirmed',
    allowRetry: false,
    clearCart: true,
    createOrder: true,
    generateInvoice: true,
    showLoader: false,
    actions: ['track_order', 'download_invoice', 'continue_shopping'],
  },
  PAYMENT_REVIEW: {
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: 'Eye',
    label: 'Under Review',
    customerMessage: 'Your payment is under review. We will update you shortly.',
    adminLabel: 'Under Review',
    allowRetry: false,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: true,
    actions: ['contact_support'],
  },
  RETRY_PAYMENT: {
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    icon: 'RefreshCw',
    label: 'Retry Payment',
    customerMessage: 'Please complete your payment to confirm your order.',
    adminLabel: 'Retry',
    allowRetry: true,
    clearCart: false,
    createOrder: false,
    generateInvoice: false,
    showLoader: false,
    actions: ['retry_payment', 'change_method', 'contact_support'],
  },
};

// Action button labels and icons
export const PAYMENT_ACTIONS: Record<string, { label: string; icon: string; variant: 'primary' | 'secondary' | 'outline' }> = {
  track_order: { label: 'Track Order', icon: 'Package', variant: 'primary' },
  download_invoice: { label: 'Download Invoice', icon: 'Download', variant: 'outline' },
  continue_shopping: { label: 'Continue Shopping', icon: 'ShoppingBag', variant: 'outline' },
  buy_again: { label: 'Buy Again', icon: 'ShoppingCart', variant: 'outline' },
  retry_payment: { label: 'Retry Payment', icon: 'RefreshCw', variant: 'primary' },
  change_method: { label: 'Change Payment Method', icon: 'CreditCard', variant: 'secondary' },
  contact_support: { label: 'Contact Support', icon: 'MessageCircle', variant: 'outline' },
  view_cart: { label: 'View Cart', icon: 'ShoppingCart', variant: 'secondary' },
  refresh_status: { label: 'Refresh Status', icon: 'RefreshCw', variant: 'primary' },
};
