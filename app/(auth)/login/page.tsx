"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, Lock, Mail } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back!");
            router.push("/");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-container">
                        <LayoutDashboard size={32} className="logo-icon" />
                    </div>
                    <h1>IMS Web Access</h1>
                    <p>Secure Inventory Management System</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                id="email"
                                type="email"
                                placeholder="admin@ims.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-block"
                    >
                        {loading ? "Authenticating..." : "Sign In to Dashboard"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Protected by Firebase Security Rules</p>
                </div>
            </div>

            <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgb(var(--background)) 0%, rgb(var(--primary) / 0.1) 100%);
          padding: 1rem;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgb(var(--surface));
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 2.5rem;
          border: 1px solid rgb(var(--border));
          animation: slideUp 0.5s ease-out;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-container {
          width: 64px;
          height: 64px;
          background: rgb(var(--primary) / 0.1);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .logo-icon {
          color: rgb(var(--primary));
        }

        h1 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: rgb(var(--text-primary));
        }

        p {
            color: rgb(var(--text-secondary));
            font-size: 0.875rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(var(--text-primary));
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgb(var(--text-secondary));
          pointer-events: none;
        }

        .input {
          padding-left: 2.75rem;
        }

        .btn-block {
          width: 100%;
          margin-top: 1rem;
        }
        
        .login-footer {
          margin-top: 2rem;
          text-align: center;
          opacity: 0.6;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
