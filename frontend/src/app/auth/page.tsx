"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast, Toaster } from "sonner";
import { apiPost } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "ORDER_FULFILLMENT", "CUSTOMER_SUPPORT", "MARKETING", "FINANCE"];

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { setAuth } = useAuthStore();

  // Prefetch routes to make login navigation feel instant
  useEffect(() => {
    router.prefetch("/admin");
    router.prefetch("/");
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
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
      setAuth(userCredential.user, res.user);
      
      toast.success("Successfully logged in!");
      // Redirect admins/staff to admin dashboard, customers to storefront
      if (ADMIN_ROLES.includes(res.user.role)) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message || "Failed to log in");
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
      setAuth(userCredential.user, res.user);
      
      toast.success("Successfully signed in with Google!");
      if (ADMIN_ROLES.includes(res.user.role)) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster position="top-center" richColors />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-bold text-rose-600 hover:text-rose-500 transition-colors">
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-neutral-100">
          
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full mb-6 bg-white border border-neutral-200 text-neutral-700 p-3.5 rounded-xl font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200"></div></div>
            <span className="relative bg-white/0 backdrop-blur-md px-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Or continue with email</span>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
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

            <div className="flex items-center justify-end">
              <Link href="/auth/reset" className="text-sm font-bold text-rose-600 hover:text-rose-500">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full flex justify-center items-center gap-2 bg-neutral-900 text-white p-4 rounded-xl font-bold hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-lg shadow-neutral-900/20 active:scale-[0.98]"
            >
              {isSubmitting ? "Logging in..." : (
                <>Log in <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
