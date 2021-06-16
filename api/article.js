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

/**
 * 获取文章详情
 * @param slug
 */
export const getArticleInfo = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}`
    })
}

// /api/articles/:slug/comments
/**
 * 给文章添加评论
 * @param slug
 */
export const addComments = (slug, comment) => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/comments`,
        data: {
            comment: {
                body: comment
            }
        }
    })
}

/**
 * 获取文章的评论
 * @param slug
 */
export const getComments = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}/comments`
    })
}

/**
 * 删除文章评论
 * @param slug
 * @param id
 */
export const deleteComment = (slug, id) => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/comments/${id}`
    })
}

/**
 * 创建文章
 * @param data
 */
export const createArticle = data => {
    return request({
        method: 'POST',
        url: '/api/articles',
        data
    })
}

/**
 * 修改文章
 * @param slug
 * @param data
 */
export const updateArticle = (slug, data) => {
    return request({
        method: 'PUT',
        url: `/api/articles/${slug}`,
        data
    })
}

/**
 * 删除文章
 * @param slug
 */
export const deleteArticle = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}`
    })
}
