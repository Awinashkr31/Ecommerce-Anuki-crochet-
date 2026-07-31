"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "../../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast, Toaster } from "sonner";

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ResetFormValues) => {
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setEmailSent(true);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster position="top-center" richColors />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 tracking-tight">
          Reset password
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Enter your email to receive a password reset link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-neutral-100">
          
          {emailSent ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900">Check your email</h3>
              <p className="mt-2 text-sm text-neutral-500">
                We've sent a password reset link to your email address. Please check your inbox.
              </p>
              <div className="mt-6">
                <Link
                  href="/auth"
                  className="w-full flex justify-center items-center gap-2 bg-neutral-900 text-white p-3.5 rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg active:scale-[0.98]"
                >
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
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

              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full flex justify-center items-center gap-2 bg-neutral-900 text-white p-4 rounded-xl font-bold hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-lg shadow-neutral-900/20 active:scale-[0.98]"
              >
                {isSubmitting ? "Sending..." : (
                  <>Send Reset Link <ArrowRight size={18} /></>
                )}
              </button>

              <div className="mt-4 text-center">
                <Link href="/auth" className="text-sm font-bold text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1">
                  <ArrowLeft size={16} /> Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
