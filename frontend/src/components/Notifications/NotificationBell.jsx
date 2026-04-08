import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, ShieldAlert, FileText, CheckCircle2, MessageSquare, AlertTriangle, ExternalLink, Inbox } from 'lucide-react';
import notificationService from '../../services/notificationService';
import useToast from '../../hooks/useToast';
import { cn } from '../../lib/utils';

export const NotificationBell = () => {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications on mount and periodic refresh
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // Increased frequency to 20s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications(15, 0, false);
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
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev =>
          prev.map(n =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      addToast('error', 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
        addToast('success', 'All caught up!');
      }
    } catch (error) {
      addToast('error', 'Failed to mark all as read');
    }
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        // Recalculate unread if deleted one was unread
        const wasUnread = notifications.find(n => n._id === notificationId && !n.isRead);
        if (wasUnread) {
          setUnreadCount(Math.max(0, unreadCount - 1));
        }
      }
    } catch (error) {
      addToast('error', 'Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'report_status_updated': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'story_approved': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'story_rejected': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'message_received': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'report_escalated': return <ShieldAlert className="w-4 h-4 text-orange-500" />;
      case 'new_comment': return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'verification_required': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'system_alert': return <Bell className="w-4 h-4 text-gray-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2.5 rounded-full transition-all duration-300 group",
          isOpen ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
        )}
      >
        <Bell size={20} className={cn("transition-transform duration-300", isOpen && "scale-110")} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-red-500 ring-2 ring-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel - Premium Glassmorphism */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[min(90vw,400px)] glass-card border border-white/20 shadow-2xl z-[100] max-h-[500px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                Notifications 
                {unreadCount > 0 && <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">{unreadCount} new</span>}
              </h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Stay updated on your platform activity</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                  <Inbox className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900">All caught up!</p>
                <p className="text-xs text-gray-500 mt-1">No new notifications for you right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <div
                    key={notification._id}
                    onClick={() => handleMarkAsRead(notification._id)}
                    className={cn(
                      "p-4 transition-all duration-200 cursor-pointer group relative",
                      notification.isRead ? "bg-white opacity-80" : "bg-blue-50/40 hover:bg-blue-50"
                    )}
                  >
                    {!notification.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>
                    )}
                    
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-9 h-9 min-w-[36px] rounded-xl flex items-center justify-center shadow-sm",
                        notification.isRead ? "bg-gray-100 text-gray-500" : "bg-white text-primary"
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className={cn(
                            "text-sm font-semibold",
                            notification.isRead ? "text-gray-700" : "text-gray-900"
                          )}>
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => handleDelete(e, notification._id)}
                            className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                          {!notification.isRead && (
                            <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                              <Check size={10} /> Mark read
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/10 bg-gray-50/50 backdrop-blur-md flex gap-2">
              <button
                onClick={handleMarkAllAsRead}
                className="flex-1 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg border border-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={14} />
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
