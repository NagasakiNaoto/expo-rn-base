import Axios from 'axios';

import { API_URL } from '@/constants';
import { useNotificationStore } from '@/stores/notifications';
import storage from '@/utils/storage';

import type { InternalAxiosRequestConfig } from 'axios';
// AxiosRequestConfig → InternalAxiosRequestConfig

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  // TODO: RNってこういうトークンでいいの？

  const token = storage.getToken();
  if (token) {
    config.headers.authorization = `${token}`;
  }
  config.headers.Accept = 'application/json';
  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotificationStore.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    return Promise.reject(error);
  },
);
