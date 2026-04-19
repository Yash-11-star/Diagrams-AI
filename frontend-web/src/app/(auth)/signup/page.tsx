"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { setCookie } from "@/lib/cookies";

  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();

    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
      await signup(email, password);
      router.push("/dashboard");
      const msg = err instanceof Error ? err.message : String(err);
        msg.includes("email-already-in-use")
          : msg.includes("invalid-email")
          : "Sign up failed. Please try again."
    } finally {
    }

    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[400px]"
      <div className="bg-white rounded-2xl border border-apple-border shadow-xl shadow-black/5 px-8 py-10">
        <p className="text-[14px] text-apple-gray mb-8">
          <Link href="/login" className="text-apple-blue hover:underline font-medium">
          </Link>

          <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-5">
          </div>

          <div className="relative">
            <input
              value={email}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 border border-apple-border rounded-xl text-[14px] text-apple-dark placeholder:text-apple-gray/60 focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue/50 transition-all"
          </div>
          <div className="relative">
            <input
              value={password}
              placeholder="Password (min. 6 characters)"
              className="w-full pl-10 pr-10 py-3 border border-apple-border rounded-xl text-[14px] text-apple-dark placeholder:text-apple-gray/60 focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue/50 transition-all"
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-apple-gray">
            </button>

            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-gray" />
              type="password"
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            type="submit"
            className="flex items-center justify-center gap-2 bg-apple-blue hover:bg-apple-blue-hover disabled:opacity-50 text-white font-medium text-[15px] py-3 rounded-xl transition-colors mt-1"
            {loading && <Loader2 size={16} className="animate-spin" />}
          </button>

          <div className="flex-1 h-px bg-apple-border" />
          <div className="flex-1 h-px bg-apple-border" />

          onClick={async () => {
              await loginWithGoogle();
              router.push("/dashboard");
              setError("Google sign-in failed. Please try again.");
          }}
        >
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
          </svg>
        </button>
        <p className="text-[12px] text-apple-gray text-center mt-5">
        </p>
    </motion.div>
}
