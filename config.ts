import { Platform } from "react-native";

const config = {
  // api_url: process.env.EXPO_PUBLIC_API_URL,
  api_url: Platform.select({
    android: "http://192.168.1.50:3001/api/v1",
    ios: "http://192.168.1.50:3001/api/v1",
    default: "http://localhost:3001/api/v1",
  }),
};
export default config;
