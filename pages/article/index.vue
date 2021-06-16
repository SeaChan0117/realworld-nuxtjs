<template>
    <div class="article-page">

        <div class="banner">
            <div class="container">

                <h1 :title="article.title">{{article.title}}</h1>
                <article-meta :article="article"/>
            </div>
        </div>

        <div class="container page">

            <div class="row article-content">
                <div class="col-md-12" v-html="article.body" style="overflow: auto"></div>
            </div>

            <hr/>

            <div class="article-actions">
                <article-meta :article="article"/>
            </div>

            <div class="row">

                <div class="col-xs-12 col-md-8 offset-md-2">
                    <article-comments :article="article" />
                </div>

            </div>

        </div>

    </div>

</template>

<script>
    import {getArticleInfo} from '@/api/article'
    import MarkdownIt from 'markdown-it'
    import ArticleMeta from "@/pages/article/components/article-meta";
    import ArticleComments from "@/pages/article/components/article-comments";

    export default {
        name: "ArticleIndex",
        components: {ArticleComments, ArticleMeta},
        async asyncData ({params}) {
            const {data} = await getArticleInfo(params.slug)
            const {article} = data
            article.disabled = false
            article.fo_disabled = false
            const md = new MarkdownIt()
            article.body = md.render(article.body)
            return {
                article
            }
        },
        head() {
            return {
                title: `${this.article.title} - RealWorld`,
                meta: [
                    {
                        hid: 'description',
                        name: 'description',
                        content: this.article.description
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .article-page .banner h1 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
