export enum NotificationEnum {
  REGISTER = '/api/notification/register',
  MARK_AS_READ = '/api/notification/markAsRead',
  GET = '/api/notification',
}

export enum NotificationActionEnum {
  PUSH_NOTI = 'Push notification',
  RESET_NOTI = 'Reset notification',
  SET_NOTI = 'Set notification',
  PUSH_MSG = 'Push message',
  SET_LOADING = 'Set loading',
  MARK_AS_READ = 'Mark as read',
}

export enum NotificationType {
  EVENT = 'event',
  COMMENT = 'comment',
  TOPIC = 'topic',
}
