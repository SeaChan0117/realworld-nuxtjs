<template>
    <div class="auth-page">
        <div class="container page">
            <div class="row">

                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up' }}</h1>
                    <p class="text-xs-center">
                        <!--                        <a href="">Have an account?</a>-->
                        <nuxt-link v-if="isLogin" to="/register">Need an account?</nuxt-link>
                        <nuxt-link v-else to="/login">Have an account?</nuxt-link>
                    </p>

                    <ul class="error-messages">
                        <template v-for="(msgs, msgName) in errors">
                            <li v-for="(msg, idx) in msgs" :key="idx">
                                {{ msgName + ' ' + msg}}
                            </li>
                        </template>
                    </ul>

                    <form @submit.prevent="onSubmit">
                        <fieldset class="form-group" v-if="!isLogin">
                            <input class="form-control form-control-lg" type="text" placeholder="Your Name"
                                   v-model="user.username" required>
                        </fieldset>
                        <fieldset class="form-group">
                            <input class="form-control form-control-lg" type="email" placeholder="Email"
                                   v-model="user.email" required>
                        </fieldset>
                        <fieldset class="form-group">
                            <input class="form-control form-control-lg" type="password" placeholder="Password"
                                   v-model="user.password" required minlength="8">
                        </fieldset>
                        <button class="btn btn-lg btn-primary pull-xs-right">
                            {{ isLogin ? 'Sign in' : 'Sign up' }}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
    import {login, register} from "@/api/user"

    // 仅在客户端加载 js-cookie
    const Cookie = process.client ? require('js-cookie') : undefined
    export default {
        // 在路由匹配组件渲染之前会先执行中间件处理
        middleware: 'notAuthenticated',
        name: "LoginIndex",
        data() {
            return {
                user: {
                    username: '',
                    email: '',
                    password: ''
                },
                errors: {}
            }
        },
        methods: {
            async onSubmit() {
                try {
                    const {data} = this.isLogin ?
                        await login({user: this.user})
                        : await register({user: this.user})
                    // 保存用户的登录状态
                    this.$store.commit('setUser', data.user)

                    // 为了防止刷新页面数据丢失，此处将数据持久化，设置网页 cookie
                    Cookie.set('user', data.user)

                    // 跳转到首页
                    this.$router.push('/')
                } catch (e) {
                    console.dir(e)
                    this.errors = e.response.data.errors
                }
            }
        },
        computed: {
            isLogin() {
                return this.$route.name === 'login'
            }
        }
    }
</script>

<style scoped>

</style>
