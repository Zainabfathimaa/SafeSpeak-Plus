import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useToast } from '../../hooks/useToast';

export const NotificationBell = () => {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications on mount and periodic refresh
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications(10, 0, false);
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
        addToast('success', 'All notifications marked as read');
      }
    } catch (error) {
      addToast('error', 'Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      addToast('error', 'Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'report_status_updated': '📋',
      'story_approved': '✅',
      'story_rejected': '❌',
      'message_received': '💬',
      'report_escalated': '🚨',
      'new_comment': '💭',
      'admin_assignment': '👤',
      'verification_required': '⚠️',
      'system_alert': 'ℹ️'
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      'report_status_updated': 'bg-blue-50 border-blue-200',
      'story_approved': 'bg-green-50 border-green-200',
      'story_rejected': 'bg-red-50 border-red-200',
      'message_received': 'bg-purple-50 border-purple-200',
      'report_escalated': 'bg-orange-50 border-orange-200',
      'new_comment': 'bg-indigo-50 border-indigo-200',
      'admin_assignment': 'bg-cyan-50 border-cyan-200',
      'verification_required': 'bg-yellow-50 border-yellow-200',
      'system_alert': 'bg-gray-50 border-gray-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            fetchNotifications();
          }
        }}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition"
        title="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map(notification => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition border-l-4 ${
                      notification.isRead ? 'border-gray-200' : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <p className="font-semibold text-sm text-gray-900">
                            {notification.title}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 flex gap-2">
              <button
                onClick={handleMarkAllAsRead}
                className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition"
              >
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
