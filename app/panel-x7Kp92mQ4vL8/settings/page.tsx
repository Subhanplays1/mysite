'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import { Settings, Globe, Palette, Search, Bell, Shield, Key, Save, Check, Loader2, Eye, EyeOff, Sun, Moon } from 'lucide-react';

export default function AdminSettingsPage() {
  const [savedSection, setSavedSection] = React.useState<string | null>(null);
  const [savingSection, setSavingSection] = React.useState<string | null>(null);
  const [showYouTubeKey, setShowYouTubeKey] = React.useState(false);
  const [showDiscordToken, setShowDiscordToken] = React.useState(false);
  const [show2FA, setShow2FA] = React.useState(false);

  const [general, setGeneral] = React.useState({ siteName: 'SubhanPlays', siteDescription: 'Minecraft hosting, development, and community tools.', siteUrl: 'https://subhanplays.qzz.io', siteLogo: '' });
  const [appearance, setAppearance] = React.useState({ theme: 'dark', primaryColor: '#6366f1', darkMode: true });
  const [seo, setSeo] = React.useState({ metaTitle: 'SubhanPlays - Minecraft Hosting & Development', metaDescription: 'Premium Minecraft hosting solutions and community tools.', keywords: 'minecraft, hosting, subhanplays, vexpanel' });
  const [notifications, setNotifications] = React.useState({ discordWebhook: 'https://discord.com/api/webhooks/1234567890/abcdefg', emailNotifications: true });
  const [security, setSecurity] = React.useState({ sessionDuration: '24', maxLoginAttempts: '5', twoFactorEnabled: false });
  const [apiKeys, setApiKeys] = React.useState({ youtubeApiKey: 'AIzaSyA-xxxxxxxxxxxxxxxxxxxxxxxxx', discordBotToken: 'MTIzNDU2Nzg5.xxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' });

  const handleSave = async (section: string) => {
    setSavingSection(section);
    await new Promise(r => setTimeout(r, 600));
    setSavingSection(null);
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2000);
  };

  const SaveButton = ({ section }: { section: string }) => (
    <Button size="sm" onClick={() => handleSave(section)} disabled={savingSection === section}>
      {savingSection === section ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : savedSection === section ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
      {savedSection === section ? 'Saved!' : 'Save'}
    </Button>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Settings</h1>
          <p className="mt-1 text-muted-foreground">Configure your platform settings, appearance, and integrations.</p>
        </div>
      </motion.div>

      {/* General Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10"><Globe className="h-5 w-5 text-blue-500" /></div>
              <CardTitle>General Settings</CardTitle>
            </div>
            <SaveButton section="general" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Site Name</label>
                <Input value={general.siteName} onChange={(e) => setGeneral({ ...general, siteName: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Site URL</label>
                <Input value={general.siteUrl} onChange={(e) => setGeneral({ ...general, siteUrl: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Site Description</label>
              <Input value={general.siteDescription} onChange={(e) => setGeneral({ ...general, siteDescription: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Logo URL</label>
              <Input placeholder="https://example.com/logo.png" value={general.siteLogo} onChange={(e) => setGeneral({ ...general, siteLogo: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10"><Palette className="h-5 w-5 text-purple-500" /></div>
              <CardTitle>Appearance</CardTitle>
            </div>
            <SaveButton section="appearance" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Theme</label>
                <select value={appearance.theme} onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={appearance.primaryColor} onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })} className="h-10 w-10 rounded border border-input cursor-pointer" />
                  <Input value={appearance.primaryColor} onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                {appearance.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <button
                onClick={() => setAppearance({ ...appearance, darkMode: !appearance.darkMode })}
                className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', appearance.darkMode ? 'bg-primary' : 'bg-muted')}
              >
                <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', appearance.darkMode ? 'translate-x-6' : 'translate-x-1')} />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* SEO */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><Search className="h-5 w-5 text-green-500" /></div>
              <CardTitle>SEO</CardTitle>
            </div>
            <SaveButton section="seo" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Meta Title</label>
              <Input value={seo.metaTitle} onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Meta Description</label>
              <Input value={seo.metaDescription} onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Keywords</label>
              <Input placeholder="comma, separated, keywords" value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10"><Bell className="h-5 w-5 text-yellow-500" /></div>
              <CardTitle>Notifications</CardTitle>
            </div>
            <SaveButton section="notifications" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Discord Webhook URL</label>
              <Input placeholder="https://discord.com/api/webhooks/..." value={notifications.discordWebhook} onChange={(e) => setNotifications({ ...notifications, discordWebhook: e.target.value })} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <span className="text-sm font-medium">Email Notifications</span>
              <button
                onClick={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
                className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', notifications.emailNotifications ? 'bg-primary' : 'bg-muted')}
              >
                <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1')} />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10"><Shield className="h-5 w-5 text-red-500" /></div>
              <CardTitle>Security</CardTitle>
            </div>
            <SaveButton section="security" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Session Duration (hours)</label>
                <Input type="number" value={security.sessionDuration} onChange={(e) => setSecurity({ ...security, sessionDuration: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Max Login Attempts</label>
                <Input type="number" value={security.maxLoginAttempts} onChange={(e) => setSecurity({ ...security, maxLoginAttempts: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Two-Factor Authentication</span>
              </div>
              <button
                onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}
                className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', security.twoFactorEnabled ? 'bg-primary' : 'bg-muted')}
              >
                <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1')} />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Keys */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10"><Key className="h-5 w-5 text-orange-500" /></div>
              <CardTitle>API Keys</CardTitle>
            </div>
            <SaveButton section="apikeys" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">YouTube API Key</label>
              <div className="relative">
                <Input type={showYouTubeKey ? 'text' : 'password'} value={apiKeys.youtubeApiKey} onChange={(e) => setApiKeys({ ...apiKeys, youtubeApiKey: e.target.value })} className="pr-10" />
                <button type="button" onClick={() => setShowYouTubeKey(!showYouTubeKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showYouTubeKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Discord Bot Token</label>
              <div className="relative">
                <Input type={showDiscordToken ? 'text' : 'password'} value={apiKeys.discordBotToken} onChange={(e) => setApiKeys({ ...apiKeys, discordBotToken: e.target.value })} className="pr-10" />
                <button type="button" onClick={() => setShowDiscordToken(!showDiscordToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showDiscordToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
