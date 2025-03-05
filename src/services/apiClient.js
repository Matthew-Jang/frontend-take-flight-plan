import axios from "axios";
import Utils from "../config/utils.js";
import AuthServices from "./authServices.js";
import Router from "../router.js";

const baseurl = import.meta.env.VITE_APP_API_URL; // Backend base URL
const openAIBaseURL = "https://api.openai.com/v1"; // OpenAI API base URL

// Create an axios instance for your backend API
const apiClient = axios.create({
  baseURL: baseurl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    crossDomain: true,
  },
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  const user = Utils.getStore("user");
  if (user) {
    const token = user.token;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor
apiClient.interceptors.response.use((response) => {
  return response.data;
}, async (error) => {
  const response = error.response;
  if (response && response.data.message?.includes("Unauthorized")) {
    try {
      await AuthServices.logoutUser(Utils.getStore("user"));
      Utils.removeItem("user");
      Router.push({ name: "login" });
    } catch (err) {
      console.error("Logout error:", err);
    }
  }
  return Promise.reject(error);
});

// Create an axios instance for OpenAI API
const chatClient = axios.create({
  baseURL: openAIBaseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // OpenAI API key
  },
});

export default apiClient; // Ensuring default export for your services
export { chatClient };
