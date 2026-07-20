'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Factory,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  BarChart3,
  Cpu,
  Loader2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const FEATURES = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'Role-based access control with end-to-end encryption for every node.',
    gradient: 'linear-gradient(135deg, rgba(0,240,255,0.12), rgba(59,130,246,0.10))',
    borderColor: 'rgba(0,240,255,0.2)',
    iconColor: '#00f0ff',
    animation: 'login-float-1 6s ease-in-out infinite',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    desc: 'Live OEE dashboards and predictive insights across every production line.',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.10))',
    borderColor: 'rgba(168,85,247,0.2)',
    iconColor: '#a855f7',
    animation: 'login-float-2 7s ease-in-out infinite',
  },
  {
    icon: Cpu,
    title: 'Smart Production',
    desc: 'Intelligent scheduling, anomaly detection, and autonomous line optimization.',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(0,240,255,0.10))',
    borderColor: 'rgba(59,130,246,0.2)',
    iconColor: '#3b82f6',
    animation: 'login-float-3 8s ease-in-out infinite',
  },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  /* Redirect if already authenticated */
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="login-loading-screen">
        <Loader2 size={32} className="animate-spin" style={{ color: '#00f0ff' }} />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="login-page">
      {/* left panel */}
      <div className="login-left-panel">
        {/* Ambient orbs */}
        <div className="login-orb1" />
        <div className="login-orb2" />
        {/* Grid overlay */}
        <div className="login-grid-overlay" />

        {/* Content */}
        <div className="login-left-content">
          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">
              <Factory size={28} color="#00f0ff" strokeWidth={1.8} />
            </div>
            <span className="login-brand-text">ManuVerse</span>
          </div>

          {/* Headline */}
          <h1 className="login-headline">
            The operating system{' '}
            <span className="login-headline-gradient">for smart factories</span>
          </h1>
          <p className="login-tagline">
            Command your entire production ecosystem from a single, intelligent
            dashboard — powered by real-time telemetry and smart algorithms.
          </p>

          {/* Feature cards */}
          <div className="login-feature-stack">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="login-feature-card"
                  style={{
                    background: f.gradient,
                    borderColor: f.borderColor,
                    animation: f.animation,
                    animationDelay: `${i * 0.4}s`,
                  }}
                >
                  <div
                    className="login-feature-icon-wrap"
                    style={{
                      background: `${f.iconColor}15`,
                      border: `1px solid ${f.iconColor}30`,
                    }}
                  >
                    <Icon size={20} color={f.iconColor} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="login-feature-title">{f.title}</div>
                    <div className="login-feature-desc">{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="login-left-footer">
          <Sparkles size={14} color="#64748b" />
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
            Enterprise Manufacturing Intelligence v1.0
          </span>
        </div>
      </div>

      {/* right panel - login form */}
      <div className="login-right-panel">
        <div className="login-form-card" style={{ animation: 'login-fade-in 0.6s ease-out both' }}>
          {/* Heading */}
          <h2 className="login-form-title">Welcome Back</h2>
          <p className="login-form-subtitle">
            Sign in to your factory dashboard
          </p>

          {/* Error */}
          {error && (
            <div
              className="login-error-box"
              style={{
                animation: shakeError ? 'login-shake 0.5s ease-in-out' : 'none',
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
            <div className="login-field-group">
              <label htmlFor="login-email" className="login-label">
                Email
              </label>
              <div className="login-input-wrap">
                <Mail
                  size={18}
                  color="#64748b"
                  className="login-input-icon"
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="admin@manuverse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field-group">
              <label htmlFor="login-password" className="login-label">
                Password
              </label>
              <div className="login-input-wrap">
                <Lock
                  size={18}
                  color="#64748b"
                  className="login-input-icon"
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-toggle-password-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#64748b" />
                  ) : (
                    <Eye size={18} color="#64748b" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="login-remember-row">
              <label className="login-checkbox-label" htmlFor="login-remember">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="login-checkbox"
                />
                <span className="login-checkbox-text">Remember me</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="login-submit-btn"
              style={{
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="login-demo-box">
            <div className="login-demo-title">Demo Credentials</div>
            <div className="login-demo-row">
              <span className="login-demo-label">Email</span>
              <code className="login-demo-code">admin@manuverse.com</code>
            </div>
            <div className="login-demo-row">
              <span className="login-demo-label">Password</span>
              <code className="login-demo-code">Admin@123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
