'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileModal from '@/components/ui/ProfileModal';
import { Settings, Bell, Shield, Palette, Globe, Key, ChevronRight, ChevronDown, Eye, EyeOff, Copy, RefreshCw, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const TOGGLES_KEY = 'settings_toggles';
const PREFS_KEY = 'settings_preferences';

function loadToggles(): boolean[] {
  if (typeof window === 'undefined') return [true, true, false, true];
  try { const v = localStorage.getItem(TOGGLES_KEY); return v ? JSON.parse(v) : [true, true, false, true]; } catch { return [true, true, false, true]; }
}

function loadPrefs(): { fontSize: string; currency: string; apiKey: string; webhookUrl: string } {
  const defaults = { fontSize: 'medium', currency: 'USD', apiKey: 'fh_sk_a1b2c3d4e5f6g7h8i9j0', webhookUrl: '' };
  if (typeof window === 'undefined') return defaults;
  try { const v = localStorage.getItem(PREFS_KEY); return v ? { ...defaults, ...JSON.parse(v) } : defaults; } catch { return defaults; }
}

export default function SettingsPage() {
  const { trans, lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [toggles, setToggles] = useState<boolean[]>([true, true, false, true]);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [prefs, setPrefs] = useState(loadPrefs);
  const [showApiKey, setShowApiKey] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => { setToggles(loadToggles()); setPrefs(loadPrefs()); }, []);

  const handleToggle = useCallback((i: number) => {
    setToggles((prev) => {
      const next = prev.map((v, idx) => (idx === i ? !v : v));
      localStorage.setItem(TOGGLES_KEY, JSON.stringify(next));
      return next;
    });
    toast.success(trans.pages.settings.preferencesSaved);
  }, [trans]);

  const updatePref = useCallback((key: string, value: string) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const handleToggleSection = (i: number) => setActiveSection((prev) => (prev === i ? null : i));

  const handlePasswordChange = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) return;
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error(lang === 'tr' ? 'Şifreler eşleşmiyor' : 'Passwords do not match');
      return;
    }
    toast.success(trans.pages.settings.passwordChanged);
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const generateApiKey = () => {
    const key = 'fh_sk_' + Array.from({ length: 24 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
    updatePref('apiKey', key);
    toast.success(trans.pages.settings.keyGenerated);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(prefs.apiKey);
    toast.success(trans.pages.settings.keyCopied);
  };

  const settingSections = [
    { icon: Bell, label: trans.pages.settings.notifications, description: lang === 'tr' ? 'Uyarı tercihlerini ve bildirim kanallarını yönetin' : 'Manage alert preferences and notification channels', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { icon: Shield, label: trans.pages.settings.security, description: lang === 'tr' ? 'İki faktörlü doğrulama, oturumlar ve erişim kontrolü' : 'Two-factor authentication, sessions and access control', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { icon: Palette, label: trans.pages.settings.appearance, description: lang === 'tr' ? 'Tema, görüntü yoğunluğu ve renk tercihleri' : 'Theme, display density and colour preferences', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { icon: Globe, label: trans.pages.settings.localeCurrency, description: lang === 'tr' ? 'Saat dilimi, tarih formatı ve varsayılan para birimi' : 'Time zone, date format and default currency', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { icon: Key, label: trans.pages.settings.apiIntegrations, description: lang === 'tr' ? 'API anahtarları, web kancaları ve üçüncü taraf bağlantılar' : 'API keys, webhooks and third-party connections', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  const quickToggles = [
    { label: trans.pages.settings.emailNotif, sub: lang === 'tr' ? 'E-posta ile uyarı al' : 'Receive alerts via email' },
    { label: trans.pages.settings.riskAlerts, sub: lang === 'tr' ? 'Risk eşikleri aşıldığında bildir' : 'Notify when risk thresholds are breached' },
    { label: trans.pages.settings.dailyDigest, sub: lang === 'tr' ? 'Portföy aktivitesinin sabah özeti' : 'Morning summary of portfolio activity' },
    { label: trans.pages.settings.twoFactor, sub: lang === 'tr' ? 'Hesabınız için ekstra güvenlik' : 'Extra security for your account' },
  ];

  const accountDetails = [
    { label: lang === 'tr' ? 'Hesap Türü' : 'Account Type', value: 'Enterprise' },
    { label: lang === 'tr' ? 'Plan' : 'Plan', value: 'Pro Treasury' },
    { label: lang === 'tr' ? 'Üyelik Tarihi' : 'Member Since', value: 'Jan 2023' },
    { label: lang === 'tr' ? 'Son Giriş' : 'Last Login', value: lang === 'tr' ? '2 dk önce' : '2 min ago' },
  ];

  const renderSectionContent = (index: number) => {
    switch (index) {
      case 0: // Notifications
        return (
          <div className="space-y-3 pt-3 pl-13">
            {[
              { label: trans.pages.settings.transactionAlerts, sub: lang === 'tr' ? 'İşlem tamamlandığında bildirim al' : 'Get notified when transactions complete' },
              { label: trans.pages.settings.riskAlerts, sub: lang === 'tr' ? 'Risk seviyesi değiştiğinde uyar' : 'Alert when risk levels change' },
              { label: trans.pages.settings.weeklySummary, sub: lang === 'tr' ? 'Her pazartesi haftalık özet' : 'Weekly summary every Monday' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-xs font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.sub}</p>
                </div>
                <Switch defaultChecked={i < 2} />
              </div>
            ))}
          </div>
        );
      case 1: // Security
        return (
          <div className="space-y-4 pt-3 pl-13">
            <div className="grid grid-cols-1 gap-3 max-w-sm">
              <div className="space-y-1.5">
                <Label className="text-xs">{trans.pages.settings.currentPassword}</Label>
                <Input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))} className="h-8 text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{trans.pages.settings.newPassword}</Label>
                <Input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))} className="h-8 text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{trans.pages.settings.confirmPassword}</Label>
                <Input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))} className="h-8 text-xs" />
              </div>
              <Button size="sm" className="h-8 text-xs w-fit mt-1" onClick={handlePasswordChange} disabled={!passwordForm.current || !passwordForm.new || !passwordForm.confirm}>
                {trans.pages.settings.changePassword}
              </Button>
            </div>
          </div>
        );
      case 2: // Appearance
        return (
          <div className="space-y-4 pt-3 pl-13">
            <div>
              <Label className="text-xs mb-2 block">{trans.pages.settings.themeSelection}</Label>
              <div className="flex gap-2">
                <Button variant={theme === 'dark' ? 'default' : 'outline'} size="sm" className="h-8 text-xs gap-1.5" onClick={() => { if (theme !== 'dark') toggleTheme(); }}>
                  <Moon size={13} /> {trans.theme.dark}
                </Button>
                <Button variant={theme === 'light' ? 'default' : 'outline'} size="sm" className="h-8 text-xs gap-1.5" onClick={() => { if (theme !== 'light') toggleTheme(); }}>
                  <Sun size={13} /> {trans.theme.light}
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs mb-2 block">{trans.pages.settings.fontSizeLabel}</Label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Button key={size} variant={prefs.fontSize === size ? 'default' : 'outline'} size="sm" className="h-8 text-xs" onClick={() => { updatePref('fontSize', size); toast.success(trans.pages.settings.preferencesSaved); }}>
                    {trans.pages.settings[size]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3: // Locale & Currency
        return (
          <div className="space-y-4 pt-3 pl-13">
            <div>
              <Label className="text-xs mb-2 block">{trans.pages.settings.language}</Label>
              <div className="flex gap-2">
                <Button variant={lang === 'en' ? 'default' : 'outline'} size="sm" className="h-8 text-xs" onClick={() => { if (lang !== 'en') toggleLang(); }}>
                  English
                </Button>
                <Button variant={lang === 'tr' ? 'default' : 'outline'} size="sm" className="h-8 text-xs" onClick={() => { if (lang !== 'tr') toggleLang(); }}>
                  Türkçe
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs mb-2 block">{trans.pages.settings.currency}</Label>
              <div className="flex gap-2">
                {['USD', 'EUR', 'TRY'].map((c) => (
                  <Button key={c} variant={prefs.currency === c ? 'default' : 'outline'} size="sm" className="h-8 text-xs" onClick={() => { updatePref('currency', c); toast.success(trans.pages.settings.preferencesSaved); }}>
                    {c}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4: // API & Integrations
        return (
          <div className="space-y-4 pt-3 pl-13">
            <div>
              <Label className="text-xs mb-1.5 block">{trans.pages.settings.apiKey}</Label>
              <div className="flex items-center gap-2">
                <Input readOnly value={showApiKey ? prefs.apiKey : '••••••••••••••••••••'} className="h-8 text-xs font-mono flex-1" />
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowApiKey(!showApiKey)} title={showApiKey ? trans.pages.settings.hide : trans.pages.settings.show}>
                  {showApiKey ? <EyeOff size={13} /> : <Eye size={13} />}
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={copyApiKey} title={trans.pages.settings.copy}>
                  <Copy size={13} />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 mt-2" onClick={generateApiKey}>
                <RefreshCw size={12} /> {trans.pages.settings.generateKey}
              </Button>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">{trans.pages.settings.webhookUrl}</Label>
              <div className="flex items-center gap-2">
                <Input value={prefs.webhookUrl} onChange={(e) => updatePref('webhookUrl', e.target.value)} placeholder="https://your-server.com/webhook" className="h-8 text-xs flex-1" />
                <Button size="sm" className="h-8 text-xs" onClick={() => toast.success(trans.pages.settings.preferencesSaved)}>
                  {trans.pages.settings.savePreferences}
                </Button>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

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
                    <div key={i} className="border-b border-border last:border-0">
                      <Button
                        variant="ghost"
                        className="w-full flex items-center gap-4 py-4 h-auto -mx-2 px-2 justify-start rounded-none"
                        onClick={() => handleToggleSection(i)}
                      >
                        <div className={`w-9 h-9 rounded-xl ${section.bg} flex items-center justify-center shrink-0`}>
                          <section.icon size={16} className={section.color} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-foreground">{section.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 font-normal">{section.description}</p>
                        </div>
                        {activeSection === i
                          ? <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                          : <ChevronRight size={16} className="text-muted-foreground shrink-0" />}
                      </Button>
                      {activeSection === i && (
                        <div className="pb-4 px-2 animate-in slide-in-from-top-1 duration-200">
                          {renderSectionContent(i)}
                        </div>
                      )}
                    </div>
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
