<template>
    <div class="article-meta">
        <nuxt-link :to="{
            name: 'profile',
            params: {
                username: article.author.username
            }
        }"><img :src="article.author.image"/></nuxt-link>
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
<!--        文章不是当前用户时可点赞和关注-->
        <template v-if="user.username !== article.author.username">
            <button class="btn btn-sm btn-outline-secondary"
                    :class="{active: article.author.following}"
                    :disabled="article.fo_disabled"
                    @click="toggleFollow(article)"
            >
                <i class="ion-plus-round"></i>
                &nbsp;
                Follow {{article.author.username}}
                <!--            <span class="counter">(10)</span>-->
            </button>
            &nbsp;&nbsp;
            <button class="btn btn-sm btn-outline-primary"
                    :class="{active: article.favorited}"
                    :disabled="article.disabled"
                    @click="onFavoriteClick(article)"
            >
                <i class="ion-heart"></i>
                &nbsp;
                Favorite Post <span class="counter">({{article.favoritesCount}})</span>
            </button>
        </template>
<!--        文章作者是当前用户时可修改和删除-->
        <template v-else>
            <nuxt-link
                    class="btn btn-outline-secondary btn-sm"
                    :to="{
                        name: 'editor',
                        query: {
                            slug: article.slug
                        }
                    }"
            >
                <i class="ion-edit"></i> Edit Article
            </nuxt-link>
            <button class="btn btn-outline-danger btn-sm" @click="deleteArticle()">
                <i class="ion-trash-a"></i> Delete Article
            </button>
        </template>

    </div>
</template>

<script>
    import {addFavorite, deleteArticle, removeFavorite} from "@/api/article"
    import {followUser, unFollowUser} from "@/api/user"
    import {mapState} from 'vuex'

    export default {
        name: "ArticleMeta",
        props: {
            article: {
                type: Object,
                required: true
            }
        },
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
            async toggleFollow(article) {
                article.fo_disabled = true
                if (article.author.following) {
                    // 取消关注
                    await unFollowUser(article.author.username)
                    article.author.following = false
                } else {
                    // 添加关注
                    await followUser(article.author.username)
                    article.author.following = true
                }
                article.fo_disabled = false
            },
            async deleteArticle() {
               await deleteArticle(this.article.slug)
                // 删除后跳转到首页
                this.$router.push('/')
            }
        },
        computed: {
            ...mapState(['user'])
        }
    }
</script>

<style scoped>

</style>
