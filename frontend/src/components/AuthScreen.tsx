import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setErrorMsg(null);
  };

  const handleSwitchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    resetForm();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Login gagal, coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await register(username, email, password);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Pendaftaran gagal, coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1322] overflow-y-auto">
      <div className="absolute inset-0 bg-[#0d1322]/60 pointer-events-none z-0" />

      <div className="fixed top-0 left-0 w-full z-10 flex items-center px-8 h-20 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[#3B82F6] text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            science
          </span>
          <span className="font-extrabold text-2xl tracking-tight text-[#adc6ff]">StudyAI</span>
        </div>
      </div>

      <div className="w-full max-w-md px-6 z-10 my-16">
        {activeTab === 'login' ? (
          <div className="glass-card rounded-2xl p-8 shadow-2xl border border-white/15 bg-[#151b2b]/90 backdrop-blur-2xl animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="font-extrabold text-2xl md:text-3xl text-[#dde2f8] mb-2">Selamat Datang</h1>
              <p className="text-sm text-[#c2c6d6]">Masuk untuk melanjutkan ke StudyAI</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#c2c6d6] mb-2 uppercase tracking-wider" htmlFor="login-username">
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
                    className="input-glass w-full rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c2c6d6] mb-2 uppercase tracking-wider" htmlFor="login-password">
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
                    className="input-glass w-full rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs text-[#ffb4ab] bg-[#93000a]/20 border border-[#ffb4ab]/30 rounded-lg px-3 py-2">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#3B82F6] hover:bg-[#005ac2] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl flex justify-center items-center gap-2 mt-4 glow-btn transition-all active:scale-95 text-sm"
              >
                <span>{isSubmitting ? 'Memproses...' : 'Masuk'}</span>
                {!isSubmitting && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-[#c2c6d6]">
              <p>
                Belum punya akun?{' '}
                <button
                  onClick={() => handleSwitchTab('register')}
                  className="font-bold text-[#3B82F6] hover:text-[#adc6ff] transition-colors ml-1"
                >
                  Daftar sekarang
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 shadow-2xl border border-white/15 bg-[#151b2b]/90 backdrop-blur-2xl animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="font-extrabold text-2xl md:text-3xl text-[#dde2f8] mb-2">Buat Akun</h1>
              <p className="text-sm text-[#c2c6d6]">Bergabunglah dengan StudyAI hari ini</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#c2c6d6] mb-2 uppercase tracking-wider" htmlFor="reg-username">
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
                <label className="block text-xs font-semibold text-[#c2c6d6] mb-2 uppercase tracking-wider" htmlFor="reg-email">
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
                <label className="block text-xs font-semibold text-[#c2c6d6] mb-2 uppercase tracking-wider" htmlFor="reg-password">
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
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="input-glass w-full rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs text-[#ffb4ab] bg-[#93000a]/20 border border-[#ffb4ab]/30 rounded-lg px-3 py-2">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#3B82F6] hover:bg-[#005ac2] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl flex justify-center items-center gap-2 mt-4 glow-btn transition-all active:scale-95 text-sm"
              >
                <span>{isSubmitting ? 'Memproses...' : 'Daftar'}</span>
                {!isSubmitting && <span className="material-symbols-outlined text-sm">person_add</span>}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-[#c2c6d6]">
              <p>
                Sudah punya akun?{' '}
                <button
                  onClick={() => handleSwitchTab('login')}
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
