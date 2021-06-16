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
    </div>
</template>

<script>
    import {addFavorite, removeFavorite} from "@/api/article"
    import {followUser, unFollowUser} from "@/api/user"

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
            }
        }
    }
</script>

<style scoped>

</style>
