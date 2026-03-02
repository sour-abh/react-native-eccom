import instance from "./base";

type UserResouceType = {
  getUserById: (id: string) => any;
  getUser: () => any;
  UpdateUser: (data: any) => any;
  updateUserPassword: (data: any) => any;
  deleteUser: () => any;
  DeleteUserById: (id: string) => any;
};
const UserResouce: UserResouceType = {
  getUser: () => {
    return instance.get("/users/me");
  },
  getUserById: (id: string) => {
    return instance.get(`/users/${id}`);
  },

  UpdateUser: (data: any) => {
    return instance.patch(`/users/me`, data);
  },
  updateUserPassword: (data: any) => {
    return instance.patch(`/users/me/password`, data);
  },
  deleteUser: () => {
    return instance.delete(`/users/me`);
  },
  DeleteUserById: (id: string) => {
    return instance.delete(`/users/${id}`);
  },
};
export default UserResouce;
