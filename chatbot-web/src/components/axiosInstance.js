import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://34.168.31.3',
  timeout: 10000, 
});

const refreshAccessToken = async () => {
  try {
    const response = await axios.post('http://34.168.31.3/users/refresh', {
      refresh_token: localStorage.getItem('refreshToken')
    });
    sessionStorage.setItem('accessToken', response.data.access_token); 
    localStorage.setItem('refreshToken', response.data.refresh_token);
    return response.data.access_token;
  } catch (error) {
    console.error('Refresh token request failed:', error);
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    const originalRequest = error.config;

    if (response && response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
