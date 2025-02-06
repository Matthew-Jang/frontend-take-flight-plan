import axios from "axios";
import Utils from "../config/utils.js";
import AuthServices from "./authServices.js";
import Router from "../router.js";

const baseurl = import.meta.env.VITE_APP_API_URL; // Your backend base URL
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
  transformRequest: (data, headers) => {
    const user = Utils.getStore("user");
    if (user) {
      const token = user.token;
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return JSON.stringify(data);
  },
  transformResponse: (data) => {
    data = JSON.parse(data);

    if (data.message?.includes("Unauthorized")) {
      AuthServices.logoutUser(Utils.getStore("user"))
        .then(() => {
          Utils.removeItem("user");
          Router.push({ name: "login" });
        })
        .catch((error) => console.error("Logout error:", error));
    }
    return data;
  },
});

// Create an axios instance for OpenAI's API
const chatClient = axios.create({
  baseURL: openAIBaseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // OpenAI API key from environment variable
  },
});

export { apiClient, chatClient };
