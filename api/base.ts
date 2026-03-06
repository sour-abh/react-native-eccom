import axios from "axios";
import config from "@/config";
import { useAuthStore } from "@/store/auth.store";
const errorCodes = [400, 401, 404, 422, 500];

const HOST_URL = config.api_url;

const headers = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
};

const instance = axios.create({
  baseURL: HOST_URL,
  timeout: 10000,
  headers: headers,
});

// Add request interceptor to include authorization header
instance.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    const accessToken = state.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const state = useAuthStore.getState();
    const refreshToken = state.refreshToken;
    const accessToken = state.accessToken;
    const setTokens = state.setTokens;
    const logout = state.logout;

    const status = error.response?.status;
    let refreshPromise:Promise<{accessToken:string,refreshToken:string}>|null=null

    if (status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // const { data } = await axios.post(`${HOST_URL}/auth/refresh`, {
        //   refreshToken,
        // });
        if(!refreshPromise){
          refreshPromise=axios.post(`${HOST_URL}/auth/refresh`,{refreshToken})
          .then((r)=>r.data)
          .finally(()=>{
            refreshPromise=null
          })
        }
        const data=await refreshPromise

        setTokens(data.accessToken, data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return instance(originalRequest);
      } catch (err) {
        logout();
        return Promise.reject(err);
      }
    }

    if (errorCodes.includes(status)) {
      switch (status) {
        case 400:
          console.log("400 error:", error.response?.message??'Bad Request');
          break;
        case 401:
          // Only logout if we actually have a token (meaning it was invalid)
          if (accessToken) {
            logout();
          }
          break;
        case 404:
          console.log("404 error:", error.response?.data?.message ?? "Not Found");
          break;
        case 422:
          console.log("422 error:", error.response?.data?.message );
          break;
        case 500:
          console.log("500 error:", error.response?.data?.message ?? 'Server Error');
          break;
        default:
          console.log("Unknown error:", error.response?.data?.message ?? 'Unknown error');
      }
    }

    return Promise.reject(error);
  },
);

export default instance;

