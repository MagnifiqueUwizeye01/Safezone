import { useNotification as useNotificationContext } from '../context/NotificationContext';

export const useNotification = () => {
  return useNotificationContext();
};

export default useNotification;

