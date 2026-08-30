import React, { useState } from 'react';
import { LOGIN_BG_IMAGE } from '../data/mockData';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('Alex Rivera');
  const [password, setPassword] = useState('password123');
  const [email, setEmail] = useState('alex.rivera@university.edu');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      username: username || 'Alex Rivera',
      email: email || 'alex.rivera@university.edu',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWX2I2_GG_mnV_jS9H9vqPoM-te7PrsVBZl8kICdZycCdVBcaNkZSDPGTeuMuUyUX9G3Ke29rFwdNShSy_CnAR2yjfQkAKlcEXR7QZzp5Azh6NI3pGjqt1psPmEWwDtrtlk8tL9vRgLx2God9xTUKftgmkAymXlxF7c6fXX-iDZ8ZumKtRW_wiIwuE_ISyBL3Ajxc2QM3MKd-VQstOZWArudQ9MoWWcilHL76S3fxjgcZu0Vp9P-Sb',
      isLoggedIn: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1322] overflow-y-auto">
      {/* Decorative Background */}
      <div
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url('${LOGIN_BG_IMAGE}')` }}
      />
      <div className="absolute inset-0 bg-[#0d1322]/60 backdrop-blur-xs pointer-events-none z-0" />

      {/* Top Nav Brand Header */}
      <div className="fixed top-0 left-0 w-full z-10 flex justify-between items-center px-8 h-20 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[#3B82F6] text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            science
          </span>
          <span className="font-extrabold text-2xl tracking-tight text-[#adc6ff]">
            StudyAI
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-[#c2c6d6] hover:text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10"
        >
          Tutup
        </button>
      </div>

      {/* Centered Auth Card */}
      <div className="w-full max-w-md px-6 z-10 my-16">
        {activeTab === 'login' ? (
          /* Login Panel */
          <div
            id="login-panel"
            className="glass-card rounded-2xl p-8 shadow-2xl border border-white/15 bg-[#151b2b]/90 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="text-center mb-8">
              <h1 className="font-extrabold text-2xl md:text-3xl text-[#dde2f8] mb-2">
                Selamat Datang
              </h1>
              <p className="text-sm text-[#c2c6d6]">
                Masuk untuk melanjutkan ke StudyAI
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block text-xs font-semibold text-[#c2c6d6] mb-2 uppercase tracking-wider"
                  htmlFor="login-username"
                >
                  Nama Pengguna
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c2c6d6] text-[20px]">
                    person
                  </span>
                  <input
                    id="login-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan nama pengguna"
                    className="input-glass w-full rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder:text-[#94A3B8] focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-[#c2c6d6] mb-2 uppercase tracking-wider"
                  htmlFor="login-password"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c2c6d6] text-[20px]">
                    lock
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-glass w-full rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder:text-[#94A3B8] focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#c2c6d6]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-black/40 border-white/20 text-[#3B82F6] focus:ring-0"
                  />
                  <span>Ingat saya</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Instruksi pemulihan kata sandi telah dikirim ke email Anda.')}
                  className="text-[#3B82F6] hover:text-[#adc6ff] font-semibold transition-colors"
                >
                  Lupa sandi?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3B82F6] hover:bg-[#005ac2] text-white font-semibold py-3.5 rounded-xl flex justify-center items-center gap-2 mt-4 glow-btn shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all active:scale-95 text-sm"
              >
                <span>Masuk</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-[#c2c6d6]">
              <p>
                Belum punya akun?{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-[#3B82F6] hover:text-[#adc6ff] transition-colors ml-1"
                >
                  Daftar sekarang
                </button>
              </p>
            </div>
          </div>
        ) : (
          /* Register Panel */
          <div
            id="register-panel"
            className="glass-card rounded-2xl p-8 shadow-2xl border border-white/15 bg-[#151b2b]/90 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="text-center mb-8">
              <h1 className="font-extrabold text-2xl md:text-3xl text-[#dde2f8] mb-2">
                Buat Akun
              </h1>
              <p className="text-sm text-[#c2c6d6]">
                Bergabunglah dengan StudyAI hari ini
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block text-xs font-semibold text-[#c2c6d6] mb-2 uppercase tracking-wider"
                  htmlFor="reg-username"
                >
                  Nama Pengguna
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c2c6d6] text-[20px]">
                    person
                  </span>
                  <input
                    id="reg-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Pilih nama pengguna"
                    className="input-glass w-full rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-[#c2c6d6] mb-2 uppercase tracking-wider"
                  htmlFor="reg-email"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c2c6d6] text-[20px]">
                    mail
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="input-glass w-full rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-[#c2c6d6] mb-2 uppercase tracking-wider"
                  htmlFor="reg-password"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c2c6d6] text-[20px]">
                    lock
                  </span>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="input-glass w-full rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3B82F6] hover:bg-[#005ac2] text-white font-semibold py-3.5 rounded-xl flex justify-center items-center gap-2 mt-4 glow-btn shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all active:scale-95 text-sm"
              >
                <span>Daftar</span>
                <span className="material-symbols-outlined text-sm">person_add</span>
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-[#c2c6d6]">
              <p>
                Sudah punya akun?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="font-bold text-[#3B82F6] hover:text-[#adc6ff] transition-colors ml-1"
                >
                  Masuk di sini
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
