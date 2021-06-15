/**
 * 在服务端渲染期间运行的都是同一个实例
 * 为了防止数据冲突，务必要把 state 定义为一个函数，返回数据对象，和 Vue 子组件类似
 */
export const state = () => {
    return {
        user: null // 当前登录用户的登录状态
    }
}

export const mutations = {
    setUser (state, user) {
        state.user = user
    }
}

const cookieParser = process.server ? require('cookieparser') : undefined
export const actions = {
    // nuxt 中特殊的 action，在服务端渲染期间自动调用，用来初始化容器数据，传递数据给客户端使用
    nuxtServerInit ({ commit }, { req }) {
        let user = null
        if (req.headers.cookie) {
            const parsed = cookieParser.parse(req.headers.cookie)
            try {
                user = JSON.parse(parsed.user)
            } catch (e) {
                // console.log(e)
            }
        }

        commit('setUser', user)
    }
}
