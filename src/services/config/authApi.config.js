import axios from 'axios';
import baseUrl from './baseUrl';
import publicApi from './publicApi.config';
import token from '../../utils/token';

const authApi = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const refreshToken = token.getRefreshToken();
    if (!refreshToken) return Promise.reject(new Error('No refresh token'));

    const response = await publicApi({
      method: 'POST',
      url: '/refreshToken',
      data: {
        refreshToken: refreshToken,
      },
    });

    const { accessToken } = response.data.data;
    token.setAccessToken(accessToken);
  } catch (error) {
    return Promise.reject(error);
  }
};

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.setAuthorization(`${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let retry = 0;

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response.status === 401 &&
      error.response.statusText === 'Unauthorized'
    ) {
      if (retry < 3) {
        // retry 3 times
        retry++;
        return refreshAccessToken()
          .then(() => {
            const accessToken = token.getAccessToken();
            error.config.headers.Authorization = `${accessToken}`;
            return authApi.request(error.config);
          })
          .catch(() => {
            token.removeAccessToken();
            token.removeRefreshToken();
            if (window.location.pathname === '/sign-in')
              return Promise.reject(error);
            window.location.href = '/sign-in';
            return Promise.reject(error);
          });
      } else {
        retry = 0;
        token.removeAccessToken();
        token.removeRefreshToken();
        window.location.href = '/sign-in';
        return Promise.reject(error);
      }
    }

    if (
      error.response.status === 403 &&
      error.response.statusText === 'Forbidden'
    ) {
      alert('Your permissions have been changed, please reload the page');
      if (window.location.pathname === '/') return Promise.reject(error);
      window.location.href = '/';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default authApi;
