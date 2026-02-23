'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileModal from '@/components/ui/ProfileModal';
import { Settings, Bell, Shield, Palette, Globe, Key, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">{trans.pages.settings.title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{trans.pages.settings.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-7">
            {/* Profile Card */}
            <div className="col-span-1 space-y-5">
              <div className="card">
                <h3 className="text-sm font-semibold text-foreground mb-5">{trans.pages.settings.profile}</h3>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold mb-3">
                    VT
                  </div>
                  <p className="text-sm font-semibold text-foreground">Velihan T.</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === 'tr' ? 'Yönetici' : 'Administrator'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">velihan@financehub.io</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4 w-full h-8 text-xs text-primary"
                    onClick={() => setProfileOpen(true)}
                  >
                    {trans.profile.editProfile}
                  </Button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-sm font-semibold text-foreground mb-4">{trans.pages.settings.accountDetails}</h3>
                <div className="space-y-0">
                  {accountDetails.map((item, i) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between py-2.5">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className="text-xs font-medium text-foreground">{item.value}</span>
                      </div>
                      {i < accountDetails.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings Sections */}
            <div className="col-span-2 space-y-4">
              <div className="card">
                <h3 className="text-sm font-semibold text-foreground mb-5">{trans.pages.settings.preferences}</h3>
                <div className="space-y-0">
                  {settingSections.map((section, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full flex items-center gap-4 py-4 h-auto -mx-2 px-2 justify-start border-b border-border last:border-0 rounded-none"
                    >
                      <div className={`w-9 h-9 rounded-xl ${section.bg} flex items-center justify-center shrink-0`}>
                        <section.icon size={16} className={section.color} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">{section.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-normal">{section.description}</p>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-sm font-semibold text-foreground mb-5">{trans.pages.settings.quickToggles}</h3>
                <div className="space-y-4">
                  {quickToggles.map((toggle, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground">{toggle.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{toggle.sub}</p>
                      </div>
                      <Switch
                        checked={toggles[i]}
                        onCheckedChange={() => handleToggle(i)}
                      />
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
