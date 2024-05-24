import axios, { AxiosRequestConfig } from 'axios';

interface BaseResponse<T> {
  code: number;
  data: T;
  msg: string;
}

interface RequestConfig extends AxiosRequestConfig {
  quiet?: boolean;
}

// const isDev = process.env.NODE_ENV === 'development';

const axiosInstance = axios.create({
  baseURL: '',
});


// axiosInstance.interceptors.request.use(
//   (config) => {
//     // 清除空字段
//     if (config.params) {
//       const params = config.params;
//       Object.keys(params).forEach((k) => {
//         if (!params[k]) {
//           delete params[k];
//         }
//       });
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

const request = async <T = any>(config: RequestConfig): Promise<T> => {
  try {
    const { data } = await axiosInstance.request<BaseResponse<T>>(config);
    const code = data.code;
    if (code) {
      return Promise.reject(data);
    } else return data.data;
  } catch (err) {
    // 500 / 网络异常
    // createMessage.error('ಥ_ಥ');
    return Promise.reject(err);
  }
};

export { axiosInstance };
export default request;
