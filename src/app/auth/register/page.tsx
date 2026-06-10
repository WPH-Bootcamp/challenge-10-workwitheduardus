'use client';
 
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
 
export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      router.push("/login");
    } catch {
      setError("Pendaftaran gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-display-md-extrabold text-primary">Foody</span>
          <p className="text-md-regular text-neutral-600 text-center">
            Buat akun baru
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm-semibold text-neutral-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
              required
              className="h-11 px-4 rounded-[--radius-lg] border border-neutral-300 text-md-regular placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm-semibold text-neutral-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="h-11 px-4 rounded-[--radius-lg] border border-neutral-300 text-md-regular placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm-semibold text-neutral-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 karakter"
              required
              minLength={8}
              className="h-11 px-4 rounded-[--radius-lg] border border-neutral-300 text-md-regular placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          {error && <p className="text-sm-regular text-accent-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-[--radius-full] bg-primary text-white text-md-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-sm-regular text-neutral-600">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
