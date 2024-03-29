import { User } from "../interfaces/User";
import { AccessToken } from "../interfaces/AccessToken";

export const LocalStorageService = {
  updateToken: (token: AccessToken) => {
    localStorage.setItem("Token", JSON.stringify(token));
  },
  updateUser: (user: User) => {
    localStorage.setItem("User", JSON.stringify(user));
  },
  getUser: (): User => {
    return JSON.parse(localStorage.getItem("User")!);
  },
  getAccessToken: () => {
    return JSON.parse(localStorage.getItem("Token")!)?.accessToken;
  },
  getRefreshToken: () => {
    return JSON.parse(localStorage.getItem("Token")!)?.refreshToken;
  },
  clear: () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("User");
    localStorage.removeItem("Avatar");
    localStorage.removeItem("cachedCoverImage");
    localStorage.removeItem("cachedLogoImage");
  },
  updateProfilePic: (avatar: any) => {
    localStorage.setItem("Avatar", avatar);
  },
  getUserProfilePic: (): any => {
    return localStorage.getItem("Avatar")!;
  },
};
