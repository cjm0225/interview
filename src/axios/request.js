import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    timeout: 15000,
    headers: {
        post: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    }
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        return config;
    },
    (error) => {
        // 处理请求错误
        return Promise.reject(error);
    },
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        return response.data;
    },
    (error) => {
        // 处理响应错误
        return Promise.reject(error);
    },
);

const get = (url, params) => {
    return axiosInstance({
        method: "get",
        url,
        params,
    });
};

const post = (url, data) => {
    return axiosInstance({
        method: "post",
        url,
        data,
    });
};


export default { get, post }


