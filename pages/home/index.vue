<template>
    <div class="home-page">

        <div class="banner">
            <div class="container">
                <h1 class="logo-font">conduit</h1>
                <p>A place to share your knowledge.</p>
            </div>
        </div>

        <div class="container page">
            <div class="row">

                <div class="col-md-9">
                    <div class="feed-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li class="nav-item" v-if="user">
                                <nuxt-link class="nav-link"
                                           exact
                                           :class="{active: tab === 'your_feed'}"
                                           :to="{name: 'home', query: {tab: 'your_feed'}}"
                                >
                                    Your Feed
                                </nuxt-link>
                            </li>
                            <li class="nav-item">
                                <nuxt-link class="nav-link"
                                           exact
                                           :class="{active: tab === 'global_feed'}"
                                           :to="{name: 'home', query: {tab: 'global_feed'}}"
                                >
                                    Global Feed
                                </nuxt-link>
                            </li>
                            <li class="nav-item" v-if="tag">
                                <nuxt-link class="nav-link"
                                           exact
                                           :class="{active: tab === 'tag'}"
                                           :to="{name: 'home', query: {tag, tab: 'tag'}}"
                                >
                                    #{{tag}}
                                </nuxt-link>
                            </li>
                        </ul>
                    </div>

                    <!--                    文章列表-->
                    <div class="article-preview" v-for="article in articles" :key="article.slug">
                        <div class="article-meta">
                            <!--                            <a href="profile.html"><img src="" /></a>-->
                            <nuxt-link :to="{
                                name: 'profile',
                                params: {
                                    username: article.author.username
                                }
                            }">
                                <img :src="article.author.image"/>
                            </nuxt-link>
                            <div class="info">
                                <nuxt-link :to="{
                                    name: 'profile',
                                    params: {
                                        username: article.author.username
                                    }
                                }">
                                    {{article.author.username}}
                                </nuxt-link>
                                <span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
                            </div>
                            <button class="btn btn-outline-primary btn-sm pull-xs-right"
                                    @click="onFavoriteClick(article)"
                                    :disabled="article.disabled"
                                    :class="{active: article.favorited}">
                                <i class="ion-heart"></i> {{article.favoritesCount}}
                            </button>
                        </div>
                        <nuxt-link :to="{
                            name: 'article',
                            params: {
                                slug: article.slug
                            }
                        }" class="preview-link">
                            <h1>{{article.title}}</h1>
                            <p>{{article.description}}</p>
                            <span>Read more...</span>
                        </nuxt-link>
                    </div>

                    <!--                    分页列表-->
                    <nav>
                        <ul class="pagination">
                            <li class="page-item" v-for="item in totalPages" :class="{active: item === page}"
                                :key="item">
                                <!--                                <a class="page-link" :href="'/?page=' + item">{{item}}</a>-->
                                <nuxt-link class="page-link" :to="{
                                    name: 'home',
                                    query: {
                                        page: item,
                                        tag: $route.query.tag,
                                        tab
                                    }
                                }">{{item}}
                                </nuxt-link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div class="col-md-3">
                    <div class="sidebar">
                        <p>Popular Tags</p>

                        <div class="tag-list">
                            <nuxt-link :to="{
                                name: 'home',
                                query: {tag: item, tab: 'tag'}
                            }" class="tag-pill tag-default" v-for="item in tags" :key="item">
                                {{item}}
                            </nuxt-link>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
    import {getArticles, getFeedArticles, addFavorite, removeFavorite} from '@/api/article'
    import {getTags} from '@/api/tag'
    import {mapState} from 'vuex'

    export default {
        name: "HomeIndex",
        async asyncData({query, store}) {
            const page = Number.parseInt(query.page || 1)
            let {tag, tab} = query
            const limit = 20
            tab = tab || 'global_feed'
            const getArticlesFn = store.state.user && tab === 'your_feed' ?
                getFeedArticles
                : getArticles

            // 同步任务无依赖，改为并行执行
            const [articleRes, tagsRes] = await Promise.all([
                getArticlesFn({
                    limit,
                    offset: (page - 1) * limit,
                    tag
                }),
                getTags()
            ])

            const {articles, articlesCount} = articleRes.data
            const {tags} = tagsRes.data

            articles.forEach(item => item.disabled = false)

            return {
                articles,
                articlesCount,
                limit,
                page,
                tags,
                tag,
                tab
            }
        },
        watchQuery: ['page', 'tag', 'tab'],
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

</style>
