<template>
    <div class="profile-page">
        <div class="user-info">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-10 offset-md-1">
                        <img :src="profile.image" class="user-img"/>
                        <h4>{{profile.username}}</h4>
                        <p>
                            {{profile.bio}}
                        </p>
                        <nuxt-link
                                class="btn btn-sm btn-outline-secondary action-btn"
                                v-if="profile.username === user.username"
                                to="/settings"
                        >
                            <i class="ion-gear-a"></i> Edit Profile Settings
                        </nuxt-link>
                        <button
                                class="btn btn-sm btn-outline-secondary action-btn"
                                v-else
                                :disabled="profile.disabled"
                                @click="toggleFollow()"
                        >
                            <i class="ion-plus-round"></i>
                            &nbsp;
                            {{profile.following ? 'Unfollow' : 'Follow'}} {{profile.username}}
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">

                <div class="col-xs-12 col-md-10 offset-md-1">
                    <div class="articles-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li class="nav-item">
                                <nuxt-link
                                        class="nav-link"
                                        :class="{active: tab === 'my_articles'}"
                                        exact
                                        :to="{
                                            name: 'profile',
                                            query: {
                                                tab: 'my_articles'
                                            }
                                        }"
                                >
                                    My Articles
                                </nuxt-link>
                            </li>
                            <li class="nav-item">
                                <nuxt-link
                                        class="nav-link"
                                        :class="{active: tab === 'favorited_articles'}"
                                        exact
                                        :to="{
                                            name: 'profile',
                                            query: {
                                                tab: 'favorited_articles'
                                            }
                                        }"
                                >
                                    Favorited Articles
                                </nuxt-link>
                            </li>
                        </ul>
                    </div>

                    <!--                    文章列表-->
                    <div class="article-preview" v-for="article in articles" :key="article.slug">
                        <div class="article-meta">
                            <nuxt-link :to="{
                                name: 'profile',
                                params: {
                                    username: article.author.username
                                }
                            }">
                                <img :src="article.author.image"/>
                            </nuxt-link>
                            <div class="info">
                                <nuxt-link
                                        class="author"
                                        :to="{
                                            name: 'profile',
                                            params: {
                                                username: article.author.username
                                            }
                                        }"
                                >
                                    {{article.author.username}}
                                </nuxt-link>
                                <span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
                            </div>
                            <button
                                    class="btn btn-outline-primary btn-sm pull-xs-right"
                                    :class="{active: article.favorited}"
                                    @click="onFavoriteClick(article)"
                                    :disabled="article.disabled"
                            >
                                <i class="ion-heart"></i> {{article.favoritesCount}}
                            </button>
                        </div>
                        <nuxt-link
                                class="preview-link"
                                :to="{
                                    name: 'article',
                                    params: {
                                        slug: article.slug
                                    }
                                }"
                        >
                            <h1>{{article.title}}</h1>
                            <p>{{article.description}}</p>
                            <span>Read more...</span>
                            <ul class="tag-list">
                                <li class="tag-default tag-pill tag-outline" v-for="tag in article.tagList" :key="tag">
                                    {{tag}}
                                </li>
                            </ul>
                        </nuxt-link>
                    </div>

                    <!--                    分页-->
                    <nav>
                        <ul class="pagination">
                            <li class="page-item" v-for="item in totalPages" :class="{active: item === page}"
                                :key="item">
                                <nuxt-link class="page-link" :to="{
                                    name: 'profile',
                                    query: {
                                        page: item,
                                        tab
                                    }
                                }">{{item}}
                                </nuxt-link>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
        </div>

    </div>

</template>

<script>
    import {mapState} from 'vuex'
    import {followUser, getUserInfo, unFollowUser} from "@/api/user"
    import {addFavorite, getArticles, removeFavorite} from "@/api/article"

    export default {
        // 在路由匹配组件渲染之前会先执行中间件处理
        middleware: 'authenticated',
        name: "UserProfile",
        async asyncData({params, query}) {
            console.log(params, query)
            const {username} = params
            const limit = 5
            const page = Number.parseInt(query.page || 1)
            let {tab} = query
            console.log(tab)
            tab = tab || 'my_articles'
            const {data} = await getUserInfo(username)
            const {profile} = data
            console.log(data)

            let _params = tab === 'my_articles' ? {
                author: username,
                limit,
                offset: (page - 1) * limit
            } : {
                favorited: username,
                limit,
                offset: (page - 1) * limit
            }
            const articleRes = await getArticles(_params)
            const {articles, articlesCount} = articleRes.data
            profile.disabled = false
            articles.forEach(item => item.disabled = false)
            return {
                profile,
                articles,
                tab,
                page,
                limit,
                articlesCount
            }
        },
        watchQuery: ['page', 'tab'],
        methods: {
            async onFavoriteClick(article) {
                article.disabled = true
                if (article.favorited) {
                    // 取消点赞
                    await removeFavorite(article.slug)
                    article.favorited = false
                    --article.favoritesCount
                } else {
                    // 添加点赞
                    await addFavorite(article.slug)
                    article.favorited = true
                    ++article.favoritesCount
                }
                article.disabled = false
            },
            async toggleFollow() {
                this.profile.disabled = true
                if (this.profile.following) {
                    // 取消关注
                    await unFollowUser(this.profile.username)
                    this.profile.following = false
                } else {
                    // 添加关注
                    await followUser(this.profile.username)
                    this.profile.following = true
                }
                this.profile.disabled = false
            }
        },
        computed: {
            ...mapState(['user']),
            totalPages() {
                return Math.ceil(this.articlesCount / this.limit)
            }
        }
    }
</script>

<style scoped>
    .article-preview .preview-link h1,.article-preview .preview-link p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
