import * as Notifications from 'expo-notifications';

export const scheduleNotification = async (
  title: string,
  body: string,
  date: number
): Promise<string> => {
  console.log('scheduleNotification');
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: '../../assets/sounds/meow.wav',
      vibrate: [0,0,0,0],
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: date,
    },
    
  });
  console.log('returning: ', notificationId);
  return notificationId;
};

export const revomeNotification = async (notificationId: string) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

export const updateNotification = async (
  notificationId: string,
  title: string,
  body: string,
  date: number
): Promise<string> => {
  await revomeNotification(notificationId);
  return scheduleNotification(title, body, date);
};

const notificationMessages = [
  (todoName: string) => `Don't forget: ${todoName} ✅`,
  (todoName: string) => `Quick reminder: ${todoName} is waiting for you. 🐾`,
  (todoName: string) => `You planned: ${todoName} 🚀`,
  (todoName: string) => `Reminder: ${todoName} is waiting for you. 💪`,
  (todoName: string) => `⏰ It's time to complete: ${todoName}`,
  (todoName: string) => `Tiny steps matter. Work on: ${todoName} 🌱`,
  (todoName: string) => `Stay on track! ${todoName} needs your attention. 🎯`,
];

export const randomNotificationBody = (todoName: string): string => {
  const randomNum = Math.floor(Math.random() * notificationMessages.length);
  return notificationMessages[randomNum](todoName);
};
