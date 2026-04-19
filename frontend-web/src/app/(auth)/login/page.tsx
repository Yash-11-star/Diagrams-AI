"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { setCookie } from "@/lib/cookies";
export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    setError(null);
    try {
      setCookie("afd_session", "1");
    } catch (err: unknown) {
      setError(
          ? "Incorrect email or password."
          ? "No account found with that email."
      );
      setLoading(false);
  };
  const handleReset = async () => {
    try {
      setResetSent(true);
    } catch {
    }

    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[400px]"
      <div className="bg-white rounded-2xl border border-apple-border shadow-xl shadow-black/5 px-8 py-10">
        <p className="text-[14px] text-apple-gray mb-8">
          <Link href="/signup" className="text-apple-blue hover:underline font-medium">
          </Link>

          <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-5">
          </div>
        {resetSent && (
            Password reset email sent — check your inbox.
        )}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <input
              value={email}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 border border-apple-border rounded-xl text-[14px] text-apple-dark placeholder:text-apple-gray/60 focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue/50 transition-all"
          </div>
          {}
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-gray" />
              type={showPw ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-apple-gray"
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </div>
          <div className="flex justify-end">
              type="button"
              className="text-[13px] text-apple-blue hover:underline"
              Forgot password?
          </div>
          <button
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
        </form>
        <div className="flex items-center gap-3 my-5">
          <span className="text-[12px] text-apple-gray">or</span>
        </div>
        <button
            try {
              setCookie("afd_session", "1");
            } catch {
            }
          className="w-full flex items-center justify-center gap-3 border border-apple-border hover:border-apple-gray/40 hover:bg-apple-light-gray/50 text-apple-dark font-medium text-[15px] py-3 rounded-xl transition-all"
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          Continue with Google
      </div>
  );
