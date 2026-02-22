'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileModal from '@/components/ui/ProfileModal';
import { Settings, Bell, Shield, Palette, Globe, Key, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function SettingsPage() {
  const { trans, lang } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false);
  const [toggles, setToggles] = useState<boolean[]>([true, true, false, true]);

  const handleToggle = (i: number) => {
    setToggles((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const settingSections = [
    {
      icon: Bell,
      label: lang === 'tr' ? 'Bildirimler' : 'Notifications',
      description: lang === 'tr'
        ? 'Uyarı tercihlerini ve bildirim kanallarını yönetin'
        : 'Manage alert preferences and notification channels',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      icon: Shield,
      label: lang === 'tr' ? 'Güvenlik' : 'Security',
      description: lang === 'tr'
        ? 'İki faktörlü doğrulama, oturumlar ve erişim kontrolü'
        : 'Two-factor authentication, sessions and access control',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      icon: Palette,
      label: lang === 'tr' ? 'Görünüm' : 'Appearance',
      description: lang === 'tr'
        ? 'Tema, görüntü yoğunluğu ve renk tercihleri'
        : 'Theme, display density and colour preferences',
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
    },
    {
      icon: Globe,
      label: lang === 'tr' ? 'Yerel Ayar & Para Birimi' : 'Locale & Currency',
      description: lang === 'tr'
        ? 'Saat dilimi, tarih formatı ve varsayılan para birimi'
        : 'Time zone, date format and default currency',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      icon: Key,
      label: lang === 'tr' ? 'API & Entegrasyonlar' : 'API & Integrations',
      description: lang === 'tr'
        ? 'API anahtarları, web kancaları ve üçüncü taraf bağlantılar'
        : 'API keys, webhooks and third-party connections',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  const quickToggles = [
    {
      label: lang === 'tr' ? 'E-posta Bildirimleri' : 'Email Notifications',
      sub: lang === 'tr' ? 'E-posta ile uyarı al' : 'Receive alerts via email',
    },
    {
      label: lang === 'tr' ? 'Risk Uyarıları' : 'Risk Alerts',
      sub: lang === 'tr' ? 'Risk eşikleri aşıldığında bildir' : 'Notify when risk thresholds are breached',
    },
    {
      label: lang === 'tr' ? 'Günlük Özet' : 'Daily Digest',
      sub: lang === 'tr' ? 'Portföy aktivitesinin sabah özeti' : 'Morning summary of portfolio activity',
    },
    {
      label: lang === 'tr' ? 'İki Faktörlü Kimlik Doğrulama' : 'Two-Factor Authentication',
      sub: lang === 'tr' ? 'Hesabınız için ekstra güvenlik' : 'Extra security for your account',
    },
  ];

  const accountDetails = [
    { label: lang === 'tr' ? 'Hesap Türü' : 'Account Type', value: 'Enterprise' },
    { label: lang === 'tr' ? 'Plan' : 'Plan', value: 'Pro Treasury' },
    { label: lang === 'tr' ? 'Üyelik Tarihi' : 'Member Since', value: 'Jan 2023' },
    { label: lang === 'tr' ? 'Son Giriş' : 'Last Login', value: lang === 'tr' ? '2 dk önce' : '2 min ago' },
  ];

  return (
    <>
      <DashboardLayout>
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Settings size={20} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{trans.pages.settings.title}</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{trans.pages.settings.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="col-span-1 space-y-5">
              <div className="card">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5">{trans.pages.settings.profile}</h3>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold mb-3">
                    VT
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Velihan T.</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {lang === 'tr' ? 'Yönetici' : 'Administrator'}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">velihan@financehub.io</p>
                  <button
                    onClick={() => setProfileOpen(true)}
                    className="mt-4 h-8 px-4 rounded-lg bg-indigo-500/10 text-xs text-indigo-400 font-medium hover:bg-indigo-500/20 transition-colors w-full"
                  >
                    {trans.profile.editProfile}
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{trans.pages.settings.accountDetails}</h3>
                <div className="space-y-3">
                  {accountDetails.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
                      <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
                      <span className="text-xs font-medium text-[var(--text-primary)]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings Sections */}
            <div className="col-span-2 space-y-4">
              <div className="card">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5">{trans.pages.settings.preferences}</h3>
                <div className="space-y-0">
                  {settingSections.map((section, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center gap-4 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-tertiary)] -mx-6 px-6 transition-colors"
                    >
                      <div className={`w-9 h-9 rounded-xl ${section.bg} flex items-center justify-center shrink-0`}>
                        <section.icon size={16} className={section.color} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{section.label}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{section.description}</p>
                      </div>
                      <ChevronRight size={16} className="text-[var(--text-muted)] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5">{trans.pages.settings.quickToggles}</h3>
                <div className="space-y-4">
                  {quickToggles.map((toggle, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-[var(--text-primary)]">{toggle.label}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{toggle.sub}</p>
                      </div>
                      <button
                        onClick={() => handleToggle(i)}
                        className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                          toggles[i] ? 'bg-indigo-500' : 'bg-[var(--bg-tertiary)]'
                        }`}
                        role="switch"
                        aria-checked={toggles[i]}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                            toggles[i] ? 'left-[22px]' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {profileOpen && (
        <ProfileModal onClose={() => setProfileOpen(false)} />
      )}
    </>
  );
}
