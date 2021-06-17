<template>
    <div class="settings-page">
        <div class="container page">
            <div class="row">

                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>

                    <ul class="error-messages" v-if="Object.keys(errors).length > 0">
                        <template v-for="(msgs, msgName) in errors">
                            <li v-for="(msg, idx) in msgs" :key="msgName + idx">
                                {{ msgName + ' ' + msg}}
                            </li>
                        </template>
                    </ul>

                    <form>
                        <fieldset>
                            <fieldset class="form-group">
                                <input
                                        class="form-control"
                                        type="text"
                                        placeholder="URL of profile picture"
                                        v-model="user.image"
                                >
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                        class="form-control form-control-lg"
                                        type="text"
                                        placeholder="Your Name"
                                        v-model="user.username"
                                >
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea
                                        class="form-control form-control-lg"
                                        rows="8"
                                        placeholder="Short bio about you"
                                        v-model="user.bio"
                                >
                                </textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                        class="form-control form-control-lg"
                                        type="text"
                                        placeholder="Email"
                                        v-model="user.email"
                                >
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                        class="form-control form-control-lg"
                                        type="password"
                                        placeholder="New Password"
                                        v-model="user.password"
                                >
                            </fieldset>
                            <button
                                    class="btn btn-lg btn-primary pull-xs-right"
                                    @click.prevent="updateUser()"
                            >
                                Update Settings
                            </button>
                        </fieldset>
                    </form>
                    <hr>
                    <button class="btn btn-outline-danger" @click="logout()">
                        Or click here to logout.
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {updateUserInfo} from "@/api/user"
    import Cookie from 'js-cookie'
    export default {
        // 在路由匹配组件渲染之前会先执行中间件处理
        middleware: 'authenticated',
        name: "SettingsIndex",
        async asyncData({store}) {
            const user = Object.assign(Object.create(null), store.state.user)
            console.log(user)
            return {
                user,
                errors: {}
            }
        },
        methods: {
            async updateUser() {
                try {
                    await updateUserInfo({user: this.user})
                } catch (e) {
                    this.errors = e.response.data.errors
                }
            },
            logout() {
                debugger
                Cookie.remove('user')
                this.$store.commit('setUser', null)
                this.$router.push('/')
            }
        }
    }
</script>

<style scoped>

</style>
