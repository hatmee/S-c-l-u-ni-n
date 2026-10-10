import { WEEKLY_STYLING_TIPS } from '../data/garments';
import { WeeklyStylingTip } from '../types';

export async function requestPushNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Trình duyệt không hỗ trợ Web Notification API.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendLocalNotification(
        '🌸 Sắc Lưu Niên · Đã Bật Thông Báo Tuần',
        'Bạn sẽ nhận được gợi ý phối đồ di sản mới nhất vào mỗi sáng thứ Hai!'
      );
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

export function sendLocalNotification(title: string, body: string, icon = '/icon.svg') {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon,
      });
    } catch (e) {
      console.warn('Native notification failed, falling back to in-app toast:', e);
    }
  }
}

export function getLatestWeeklyTip(): WeeklyStylingTip {
  return WEEKLY_STYLING_TIPS[0];
}
