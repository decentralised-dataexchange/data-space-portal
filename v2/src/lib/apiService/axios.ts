import axios from "axios";
import { baseURL } from "../../constants/url";

export const getAuthenticatedHeaders = () => {
  const token = window?.localStorage?.getItem("Token");
  if (!token) {
    return "";
  }
  return "Bearer " + token;
};

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers:{
    Authorization: getAuthenticatedHeaders()
  }
});

export const axiosInstanceWithArrayBufferResType = axios.create({
  baseURL,
  withCredentials: true,
  headers:{
    Authorization: getAuthenticatedHeaders()
  },
  responseType: "arraybuffer"
});