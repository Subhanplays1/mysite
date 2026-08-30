'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Shield,
  Search,
  AlertTriangle,
  Key,
  Activity,
  Users,
  Globe,
  Lock,
  Unlock,
  Trash2,
  Download,
  RefreshCw,
  Eye,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Ban,
  AlertOctagon,
  ServerCrash,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';

const ACTION_TYPES = ['LOGIN_SUCCESS', 'LOGIN_FAILED', 'KEY_GENERATED', 'KEY_REVOKED', 'SETTINGS_CHANGED'] as const;
type ActionType = typeof ACTION_TYPES[number];

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: 'bg-green-500/20 text-green-400 border-green-500/30',
  FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
  WARNING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const STATUS_DOT: Record<string, string> = {
  SUCCESS: 'bg-green-500',
  FAILED: 'bg-red-500',
  WARNING: 'bg-amber-500',
};

const initialAuditLog = [
  { id: '1', timestamp: '2026-08-30T10:32:00Z', action: 'LOGIN_SUCCESS' as ActionType, user: 'admin', ip: '192.168.1.10', status: 'SUCCESS', details: 'Authenticated via session token' },
  { id: '2', timestamp: '2026-08-30T09:15:00Z', action: 'LOGIN_FAILED' as ActionType, user: 'unknown', ip: '45.33.32.156', status: 'FAILED', details: 'Invalid credentials - attempt 3/5' },
  { id: '3', timestamp: '2026-08-30T08:45:00Z', action: 'KEY_GENERATED' as ActionType, user: 'admin', ip: '192.168.1.10', status: 'SUCCESS', details: 'New API key generated: sk_live_***...x9K' },
  { id: '4', timestamp: '2026-08-29T22:10:00Z', action: 'LOGIN_FAILED' as ActionType, user: 'root', ip: '185.220.101.45', status: 'WARNING', details: 'Brute force attempt detected - 7 failures' },
  { id: '5', timestamp: '2026-08-29T18:30:00Z', action: 'KEY_REVOKED' as ActionType, user: 'admin', ip: '192.168.1.10', status: 'SUCCESS', details: 'API key sk_prod_***...mQ4 revoked' },
  { id: '6', timestamp: '2026-08-29T14:20:00Z', action: 'SETTINGS_CHANGED' as ActionType, user: 'admin', ip: '192.168.1.10', status: 'WARNING', details: 'Security policy updated: max login attempts 5 -> 3' },
  { id: '7', timestamp: '2026-08-28T11:05:00Z', action: 'LOGIN_SUCCESS' as ActionType, user: 'admin', ip: '10.0.0.5', status: 'SUCCESS', details: 'Authenticated via Discord OAuth' },
  { id: '8', timestamp: '2026-08-28T07:42:00Z', action: 'LOGIN_FAILED' as ActionType, user: 'admin', ip: '203.0.113.50', status: 'FAILED', details: 'Session expired - token invalid' },
];

const initialFailedAttempts = [
  { ip: '45.33.32.156', attempts: 3, lastAttempt: '2026-08-30T09:15:00Z', location: 'US (Virginia)', blocked: false },
  { ip: '185.220.101.45', attempts: 7, lastAttempt: '2026-08-29T22:10:00Z', location: 'Germany (Berlin)', blocked: true },
  { ip: '203.0.113.50', attempts: 1, lastAttempt: '2026-08-28T07:42:00Z', location: 'Singapore', blocked: false },
  { ip: '198.51.100.22', attempts: 5, lastAttempt: '2026-08-27T19:55:00Z', location: 'Brazil (São Paulo)', blocked: true },
];

const initialActiveSessions = [
  { id: 'sess_a1b2c3', user: 'admin', ip: '192.168.1.10', location: 'Local Network', lastActive: '2026-08-30T10:35:00Z', userAgent: 'Chrome 128 / Windows 11', current: true },
  { id: 'sess_d4e5f6', user: 'admin', ip: '10.0.0.5', location: 'Home Office', lastActive: '2026-08-30T08:12:00Z', userAgent: 'Firefox 130 / macOS', current: false },
];

export default function AdminSecurityPage() {
  const [auditLog, setAuditLog] = React.useState(initialAuditLog);
  const [failedAttempts, setFailedAttempts] = React.useState(initialFailedAttempts);
  const [sessions, setSessions] = React.useState(initialActiveSessions);
  const [search, setSearch] = React.useState('');
  const [actionFilter, setActionFilter] = React.useState<string>('all');
  const [showLockdownConfirm, setShowLockdownConfirm] = React.useState(false);
  const [showClearLogConfirm, setShowClearLogConfirm] = React.useState(false);
  const [lockdownActive, setLockdownActive] = React.useState(false);
  const [lockdownLoading, setLockdownLoading] = React.useState(false);
  const [clearLogLoading, setClearLogLoading] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<typeof initialAuditLog[number] | null>(null);

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      entry.user.toLowerCase().includes(search.toLowerCase()) ||
      entry.ip.includes(search) ||
      entry.details.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || entry.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const totalEvents = auditLog.length;
  const failedLogins = auditLog.filter((e) => e.action === 'LOGIN_FAILED').length;
  const activeSessions = sessions.length;
  const lockedIPs = failedAttempts.filter((a) => a.blocked).length;

  const handleLockdown = async () => {
    setLockdownLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLockdownActive(true);
    setLockdownLoading(false);
    setShowLockdownConfirm(false);
  };

  const handleClearLog = async () => {
    setClearLogLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setAuditLog([]);
    setClearLogLoading(false);
    setShowClearLogConfirm(false);
  };

  const handleBlockIP = (ip: string) => {
    setFailedAttempts((prev) =>
      prev.map((a) => (a.ip === ip ? { ...a, blocked: !a.blocked } : a))
    );
  };

  const handleTerminateSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10">
              <Shield className="h-7 w-7 text-orange-500" />
            </div>
            Security Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">Monitor security events, audit logs, and system access.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowClearLogConfirm(true)} disabled={lockdownActive}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Log
          </Button>
          <Button
            variant={lockdownActive ? 'default' : 'destructive'}
            onClick={() => setShowLockdownConfirm(true)}
            disabled={lockdownActive}
          >
            {lockdownActive ? (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Lockdown Active
              </>
            ) : (
              <>
                <AlertOctagon className="mr-2 h-4 w-4" />
                Emergency Lockdown
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total Events', value: totalEvents, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Failed Logins', value: failedLogins, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Active Sessions', value: activeSessions, icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Locked IPs', value: lockedIPs, icon: Globe, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={cn('p-3 rounded-xl', stat.bg)}>
                    <stat.icon className={cn('h-6 w-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Failed Login Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {failedAttempts.map((attempt, i) => (
                  <motion.div
                    key={attempt.ip}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border transition-colors',
                      attempt.blocked ? 'bg-red-500/5 border-red-500/20' : 'bg-card border-border'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2 rounded-lg', attempt.blocked ? 'bg-red-500/10' : 'bg-muted')}>
                        {attempt.blocked ? (
                          <Ban className="h-4 w-4 text-red-500" />
                        ) : (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm font-medium">{attempt.ip}</p>
                          {attempt.blocked && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">BLOCKED</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {attempt.location} &middot; {attempt.attempts} attempt{attempt.attempts !== 1 ? 's' : ''} &middot; {formatRelativeTime(attempt.lastAttempt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockIP(attempt.ip)}
                      className={cn(attempt.blocked ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600')}
                    >
                      {attempt.blocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session, i) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border',
                      session.current ? 'bg-green-500/5 border-green-500/20' : 'bg-card border-border'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2 rounded-lg', session.current ? 'bg-green-500/10' : 'bg-muted')}>
                        <ServerCrash className={cn('h-4 w-4', session.current ? 'text-green-500' : 'text-muted-foreground')} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{session.user}</p>
                          {session.current && (
                            <Badge variant="success" className="text-[10px] px-1.5 py-0">CURRENT</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">{session.id}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {session.userAgent} &middot; {session.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Last active: {formatRelativeTime(session.lastActive)}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
                {sessions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground/50 text-sm">
                    No active sessions
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Audit Log
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All Actions</option>
                  {ACTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Timestamp</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">IP</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Details</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredLog.map((entry, i) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2, delay: i * 0.02 }}
                        className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {formatRelativeTime(entry.timestamp)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {entry.action.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">{entry.user}</td>
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{entry.ip}</td>
                        <td className="py-3 px-4">
                          <span className="flex items-center gap-1.5">
                            <span className={cn('h-2 w-2 rounded-full', STATUS_DOT[entry.status])} />
                            <span className={cn('text-xs font-medium', entry.status === 'SUCCESS' ? 'text-green-400' : entry.status === 'FAILED' ? 'text-red-400' : 'text-amber-400')}>
                              {entry.status}
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-[200px] truncate text-xs text-muted-foreground">
                          {entry.details}
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedEvent(entry)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredLog.length === 0 && (
                <div className="text-center py-12 text-muted-foreground/50">
                  <Search className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No events found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showLockdownConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowLockdownConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-xl bg-card border border-border p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-red-500/10">
                  <AlertOctagon className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Emergency Lockdown</h2>
                  <p className="text-sm text-muted-foreground">This action is serious</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Activating emergency lockdown will terminate all active sessions, block new logins, and require manual intervention to restore access. Are you absolutely sure?
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowLockdownConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleLockdown} disabled={lockdownLoading}>
                  {lockdownLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  Activate Lockdown
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClearLogConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowClearLogConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-xl bg-card border border-border p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Trash2 className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Clear Audit Log</h2>
                  <p className="text-sm text-muted-foreground">Permanent deletion</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                This will permanently delete all {auditLog.length} audit log entries. This action cannot be undone. Are you sure?
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowClearLogConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleClearLog} disabled={clearLogLoading}>
                  {clearLogLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Clear Log
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-xl bg-card border border-border p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Event Details</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Action', value: selectedEvent.action.replace(/_/g, ' ') },
                  { label: 'User', value: selectedEvent.user },
                  { label: 'IP Address', value: selectedEvent.ip },
                  { label: 'Status', value: selectedEvent.status },
                  { label: 'Details', value: selectedEvent.details },
                  { label: 'Timestamp', value: new Date(selectedEvent.timestamp).toLocaleString() },
                ].map((field) => (
                  <div key={field.label} className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">{field.label}</span>
                    <span className="text-sm font-medium text-right max-w-[60%]">{field.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
