import { apiClient } from "../helpers/ApiClient";

export default async (email: string) => {
  const response = await apiClient.patch("/user/forgot-password", { email });
  return response.data;
};

export function errorMessageConvert(message: string, key: string) {
  if (message.includes(key)) {
    const index = message.indexOf(key);
    return message.slice(index + key.length + 1, message.length);
  }
}

export function colorPick(type: string) {
  return type === "MESSAGE"
    ? "text-blue-700"
    : type === "INFO"
      ? "text-green-600"
      : "text-red-600";
}

export function getEighteenYearsAgoDate() {
  const today = new Date();
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
}
