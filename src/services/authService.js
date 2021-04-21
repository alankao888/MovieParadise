import http from "./httpService";
import { apiUrl } from "../config.json";
import jwtDecode from "jwt-decode";

const apiEndPoint = apiUrl + "/auth";
const tokenKey = "token";
http.setJwt(getJwt()); //設定預設的headers, 注意因為登入或登出時整個App會reload所以這一行也會被重新執行，default headers會被重設

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndPoint, { email, password }); //login成功的話jwt會在response.data裏面傳回來
  localStorage.setItem(tokenKey, jwt);
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function getCurrentUser() {
  //如果token存在localStorage（有登入）則return user否則null
  try {
    const jwt = localStorage.getItem(tokenKey); //從localStorage裏面取出jwt然後decode取得user信息
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  loginWithJwt,
  getJwt,
  logout,
  getCurrentUser,
};
