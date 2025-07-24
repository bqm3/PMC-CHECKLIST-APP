import axios from "axios";
import { BASE_URL } from "../../constants/config";

export const fetchNotifications = async (authToken) => {
  const res = await axios.get(`${BASE_URL}/ent_noti`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return res.data;
};

export const markNotificationAsRead = async (authToken, notificationId) => {
  return axios.put(
    `${BASE_URL}/ent_noti/read`,
    { arrID: [notificationId] },
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
};

export const markAllNotificationsAsRead = async (authToken, arrID) => {
  return axios.put(
    `${BASE_URL}/ent_noti/read`,
    { arrID },
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
};

export const deleteNotification = async (authToken, notificationId) => {
  return axios.put(
    `${BASE_URL}/ent_noti/remove/${notificationId}`,
    {},
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
};
