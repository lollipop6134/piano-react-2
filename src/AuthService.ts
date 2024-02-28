import axios from 'axios';

export type UserInfo = {
  user_id: number;
  username: string;
  email: string;
  completedlessons: number[];
  status: string;
  image: string;
}

const API_BASE_URL = 'http://localhost:3001';

export const register = async (email: string, password: string, username: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, { email, password, username });
    const token = response.data.token;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error('Registration failed', error);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post<{ token: string }>(`${API_BASE_URL}/login`, { email, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      logout();
      console.error('Login failed - Token expired');
    } else {
      console.error('Login failed', error);
    }
  }
};

export const changeUsername = async (user_id: number, new_username: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/changeUsername`, {user_id, new_username});
    return response.data;
  } catch (error) {
    console.error('Failed: ', error);
    return null;
  }
};

export const changeAvatar = async (user_id: number, new_image: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/changeAvatar`, {user_id, new_image});
    return response.data;
  } catch (error) {
    console.error('Failed: ', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      const decodedToken = JSON.parse(jsonPayload);
      return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Error decoding token', error);
      return false;
    }
  }
  return false;
};

export async function fetchUserData(userId: number) {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data', error);
    throw error;
  }
};

export const parseJwt = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  try {
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JSON payload', error);
    return null;
  }
};