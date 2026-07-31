"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "sonner";
import { apiPost } from "../lib/api";
import { useAuthStore } from "../store/authStore";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "ORDER_FULFILLMENT", "CUSTOMER_SUPPORT", "MARKETING", "FINANCE"];

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function MobileLoginSheet({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await userCredential.user.getIdToken();
      
      const res = await apiPost("/auth/session", { idToken });
      
      setIsSuccess(true);
      toast.success("Successfully logged in!");
      
      setTimeout(() => {
        setAuth(userCredential.user, res.user);
        onClose();
        reset();
        setIsSuccess(false);
        
        if (ADMIN_ROLES.includes(res.user.role)) {
          router.push("/admin");
        }
      }, 1500);
    } catch (error) {
      const err = error as Error & { code?: string };
      if (err.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else {
        toast.error(err.message || "Failed to log in");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      
      const res = await apiPost("/auth/session", { idToken });
      
      setIsSuccess(true);
      toast.success("Successfully logged in!");

      setTimeout(() => {
        setAuth(userCredential.user, res.user);
        onClose();
        setIsSuccess(false);
        if (ADMIN_ROLES.includes(res.user.role)) {
          router.push("/admin");
        }
      }, 1500);
    } catch (error) {
      const err = error as Error & { code?: string };
      toast.error(err.message || "Google sign-in failed");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className={`fixed inset-x-0 bottom-0 z-[101] bg-white rounded-t-3xl p-6 pb-10 shadow-2xl transition-transform duration-300 ease-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'} max-h-[85dvh] overflow-y-auto overscroll-contain`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Log In</h2>
          <button onClick={onClose} className="p-2 bg-neutral-100 rounded-full text-neutral-600 hover:bg-neutral-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="text-green-500 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 mb-2">Success!</h2>
            <p className="text-neutral-500 text-center">You are securely logged in.</p>
          </div>
        ) : (
          <>
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full mb-6 bg-white border border-neutral-200 text-neutral-700 p-3.5 rounded-xl font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200"></div></div>
              <span className="relative bg-white px-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Or continue with email</span>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Email address"
                    className="block w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-neutral-50/50 transition-colors"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="block w-full pl-11 pr-12 py-3.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-neutral-50/50 transition-colors"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full flex justify-center items-center gap-2 bg-neutral-900 text-white p-4 rounded-xl font-bold hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-lg shadow-neutral-900/20 active:scale-[0.98] mt-2"
              >
                {isSubmitting ? "Logging in..." : (
                  <>Log in <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-600">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" onClick={onClose} className="font-bold text-rose-600 hover:text-rose-500 transition-colors">
                Create an account
              </Link>
            </p>
          </>
        )}
      </div>
    </>
  );
}
