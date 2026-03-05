import instance from "@/api/base";

type AuthResourceType = {
  register: (data: any) => any;
  login: (data: any) => any;
  logout: () => any;
  refreshToken: (data: any) => any;
};

const AuthResource: AuthResourceType = {
  register: (data: any) => {
    return instance.post("/auth/register", data);
  },
  login: (data: any) => {
    return instance.post("/auth/login", data);
  },
  refreshToken: (data: any) => {
    return instance.post("/auth/refresh", data);
  },
  logout: () => {
    return instance.post("/auth/logout");
  },
};
export default AuthResource;
