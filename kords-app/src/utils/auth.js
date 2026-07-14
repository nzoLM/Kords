import { jwtDecode as jwt_decode } from "jwt-decode";

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const logOut = (router) => {
  localStorage.removeItem("token");
  router.replace("/");
}

export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
}

export const getCurrentUserId = () => {
    const token = getAuthToken();
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1])).userId;
    } catch {
        return null;
    }
}