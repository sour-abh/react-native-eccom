import axios from "axios";
import config from "@/config";
import { useAuthStore } from "@/store/auth.store";
import { store } from "expo-router/build/global-state/router-store";
const errorCodes = [400, 401, 404, 422, 500];

const HOST_URL = config.api_url;

const headers = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
};

const instance = axios.create({
  baseURL: HOST_URL,
  headers: headers,
});

instance.interceptors.request.use(
  async function (conf) {
    // const userToken = state.auth.token;
    const userToken = useAuthStore.getState().accessToken;

    var params = conf.params || {};

    if (conf.params) {
      params = conf.params;
    }
    if (userToken) {
      conf.headers.Authorization = `Bearer ${userToken}`;
    }

    conf.params = params;
    //console.log('conf', conf);

    return conf;
  },
  function (error) {
    console.log("error in request", error);
    return Promise.reject(error);
  },
);
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    if (error.response?.status === 401 && refreshToken) {
      try {
        const { data } = await axios.post(
          "https://localhost:3001/api/v1/auth/refresh",
          { refreshToken },
        );

        setTokens(data.accessToken, data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return instance(originalRequest);
      } catch {
        logout();
      }
    }

    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => response,

  (error) => {
    console.log("error in response", error);
    const { status } = error.response;

    if (errorCodes.includes(status)) {
      const { logout } = useAuthStore.getState();
      switch (status) {
        case 400:
          console.log("400 error:", error);
          break;
        case 401:
          logout();
          break;
        case 404:
          console.log("404 error:", error);
          break;
        case 422:
          console.log("422 error:", error);
          console.log(error.response.data.message);
          break;
        case 500:
          console.log("500 error:", error);
          break;
        default:
          console.log("Unknown error:", error);
          break;
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
