"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../../../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast, Toaster } from "sonner";
import { apiPost } from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "ORDER_FULFILLMENT", "CUSTOMER_SUPPORT", "MARKETING", "FINANCE"];

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const password = watch("password") || "";

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculatePasswordStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-rose-500", "bg-amber-400", "bg-emerald-400", "bg-emerald-600"];

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Create Firebase User
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // 2. Update Firebase Profile
      await updateProfile(userCredential.user, { displayName: data.fullName });
      
      // 3. Sync with backend & create session
      const idToken = await userCredential.user.getIdToken();
      const res = await apiPost("/auth/session", { idToken });
      
      setAuth(userCredential.user, res.user);
      toast.success("Account created successfully!");
      
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect');
      
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (ADMIN_ROLES.includes(res.user.role)) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("An account with this email already exists.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      
      const res = await apiPost("/auth/session", { idToken });
      setAuth(userCredential.user, res.user);
      
      toast.success("Successfully signed in with Google!");
      
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect');
      
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (ADMIN_ROLES.includes(res.user.role)) {
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
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Or{" "}
          <Link href="/auth" className="font-bold text-rose-600 hover:text-rose-500 transition-colors">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-neutral-100">
          
          <button
            onClick={handleGoogleSignup}
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
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="Full Name"
                  className="block w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-neutral-50/50 transition-colors"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.fullName.message}</p>}
            </div>

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
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          strength >= level ? strengthColors[strength - 1] : "bg-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 font-medium text-neutral-500`}>
                    Password strength: <span className={strengthColors[strength - 1]?.replace('bg-', 'text-')}>{strengthLabels[strength - 1] || "Weak"}</span>
                  </p>
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="block w-full pl-11 pr-12 py-3.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-neutral-50/50 transition-colors"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-center">
              <input
                {...register("terms")}
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-neutral-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-neutral-900">
                I agree to the <Link href="#" className="text-rose-600 hover:underline">Terms & Conditions</Link>
              </label>
            </div>
            {errors.terms && <p className="mt-0 text-xs text-rose-500 font-medium">{errors.terms.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full flex justify-center items-center gap-2 bg-neutral-900 text-white p-4 rounded-xl font-bold hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-lg shadow-neutral-900/20 active:scale-[0.98]"
            >
              {isSubmitting ? "Creating Account..." : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
