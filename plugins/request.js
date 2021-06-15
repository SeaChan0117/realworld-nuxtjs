/**
 * 基于 axios 封装请求模块
 */
import axios from 'axios'

// 创建请求对象
export const request = axios.create({
    baseURL: 'https://conduit.productionready.io',
})

// 通过插件机制获取上下文对象， query、store、params、req、res、app...
// 插件导出函数必须作为 default 成员
export default ({store}) => {
    // 请求拦截器
    request.interceptors.request.use(function (config) {
        // 统一设置 token
        const {user} = store.state
        if (user && user.token) {
            config.headers.Authorization = `Token ${user.token}`
        }

        return config
    }, function (error) {
        // Do something with request error
        return Promise.reject(error)
    })

// 响应拦截器
}
