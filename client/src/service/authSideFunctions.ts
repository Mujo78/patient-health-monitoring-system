import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1/user";

export default async (email: string) => {
  const response = await axios.patch(`${BASE_URL}/forgot-password`, { email });

  return response.data;
};

export function errorMessageConvert(message: string, key: string) {
  const index = message.indexOf(key);
  return message.slice(index + key.length + 1, message.length);
}

export function colorPick(type: string) {
  return type === "MESSAGE"
    ? "text-blue-700"
    : type === "INFO"
    ? "text-green-600"
    : "text-red-600";
}
