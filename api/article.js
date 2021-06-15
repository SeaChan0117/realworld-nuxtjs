import {request} from "@/plugins/request"

/**
 * 获取公共文章列表
 * @param params
 */
export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/api/articles',
        params
    })
}

/**
 * 获取关注的文章列表
 * @param params
 */
export const getFeedArticles = params => {
    return request({
        method: 'GET',
        url: '/api/articles/feed',
        params
    })
}

/**
 * 添加点赞
 * @param slug
 */
export const addFavorite = slug => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/favorite`
    })
}

/**
 * 取消点赞
 * @param slug
 */
export const removeFavorite = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/favorite`
    })
}
