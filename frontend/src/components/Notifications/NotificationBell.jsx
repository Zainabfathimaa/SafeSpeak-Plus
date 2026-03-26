import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, FileText, MessageSquare, ShieldAlert, AlertTriangle, Info, BookOpen, ArrowUpRight } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useToast } from '../../hooks/useToast';

const timeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const TYPE_CONFIG = {
  report_status_updated: { icon: FileText, bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700', label: 'Report Update' },
  story_approved:        { icon: BookOpen, bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-100 text-green-700', label: 'Story Approved' },
  story_rejected:        { icon: BookOpen, bg: 'bg-red-100',   text: 'text-red-600',   badge: 'bg-red-100 text-red-700',   label: 'Story Rejected' },
  message_received:      { icon: MessageSquare, bg: 'bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700', label: 'Message' },
  report_escalated:      { icon: ArrowUpRight, bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700', label: 'Escalation' },
  new_comment:           { icon: MessageSquare, bg: 'bg-indigo-100', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700', label: 'New Comment' },
  verification_required: { icon: AlertTriangle, bg: 'bg-yellow-100', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700', label: 'Action Required' },
  system_alert:          { icon: Info, bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700', label: 'System' },
};

const getConfig = (type) => TYPE_CONFIG[type] || { icon: Bell, bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700', label: 'Notification' };

export const NotificationBell = () => {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications(20, 0, false);
      if (response.success) {
        setNotifications(response.notifications || []);
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch { addToast('error', 'Failed to mark as read'); }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { addToast('error', 'Failed to mark all as read'); }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch { addToast('error', 'Failed to delete notification'); }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchNotifications(); }}
        className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        title="Notifications"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Slide-in Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden" style={{ maxHeight: '480px' }}>
            {/* Panel Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5">{unreadCount} new</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllAsRead} className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark font-semibold" title="Mark all as read">
                    <CheckCheck size={14} /> All read
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="py-14 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium text-sm">All caught up!</p>
                  <p className="text-gray-400 text-xs mt-1">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map(n => {
                    const cfg = getConfig(n.type);
                    const Icon = cfg.icon;
                    return (
                      <div key={n._id} className={`group px-4 py-3.5 hover:bg-gray-50/80 transition-colors relative ${!n.isRead ? 'bg-blue-50/40' : ''}`}>
                        {/* Unread dot */}
                        {!n.isRead && <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />}

                        <div className="flex items-start gap-3 pl-2">
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-9 h-9 ${cfg.bg} ${cfg.text} rounded-xl flex items-center justify-center mt-0.5`}>
                            <Icon size={16} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <span className={`inline-block text-[10px] font-bold rounded-full px-2 py-0.5 mb-1 ${cfg.badge}`}>{cfg.label}</span>
                                <p className="text-xs font-semibold text-gray-900 leading-snug">{n.title}</p>
                              </div>
                              <button onClick={() => handleDelete(n._id)} className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                                <X size={12} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[10px] text-gray-400">{timeAgo(n.createdAt)}</span>
                              {!n.isRead && (
                                <button onClick={() => handleMarkAsRead(n._id)} className="flex items-center gap-0.5 text-[10px] text-primary hover:text-primary-dark font-semibold">
                                  <Check size={10} /> Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
