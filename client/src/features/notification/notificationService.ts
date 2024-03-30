import { apiClientAuth } from "../../helpers/ApiClient";

const URL = "http://localhost:3001/api/v1/notification/";

const getOneNotification = async (id: string) => {
  const response = await apiClientAuth.get(`${URL}${id}`);

  return response.data;
};

const deleteOneNotification = async (id: string) => {
  const response = await apiClientAuth.delete(`${URL}${id}`);

  return response.data;
};

const markOneNotificationAsRead = async (id: string) => {
  const response = await apiClientAuth.patch(`${URL}${id}`, { read: true });

  return response.data;
};

const getAllNotificationsForPerson = async () => {
  const response = await apiClientAuth.get(URL);

  return response.data;
};

const markAllAsRead = async () => {
  const response = await apiClientAuth.patch(URL, {});

  return response.data;
};

const deleteAllNotifications = async () => {
  const response = await apiClientAuth.delete(URL);

  return response.data;
};

const notificationServices = {
  getOneNotification,
  deleteOneNotification,
  markOneNotificationAsRead,
  getAllNotificationsForPerson,
  markAllAsRead,
  deleteAllNotifications,
};

export default notificationServices;
