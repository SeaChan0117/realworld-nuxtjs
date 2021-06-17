<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-10 offset-md-1 col-xs-12">
                    <ul class="error-messages">
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
                                        type="text"
                                        class="form-control form-control-lg"
                                        placeholder="Article Title"
                                        v-model="article.title"
                                >
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                        type="text"
                                        class="form-control"
                                        placeholder="What's this article about?"
                                        v-model="article.description"
                                >
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea
                                        class="form-control"
                                        rows="8"
                                        placeholder="Write your article (in markdown)"
                                        v-model="article.body"
                                >
                                </textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Enter tags"
                                        v-model="newTag"
                                        @keyup="addTag($event)"
                                >
                                <div class="tag-list">
                                    <span class="tag-default tag-pill" v-for="(tag, idx) in article.tagList" :key="idx">
                                      <i class="ion-close-round" @click="removeTag(tag)"></i>
                                      {{tag}}
                                    </span>
                                </div>
                            </fieldset>
                            <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="createArticle()">
                                Publish Article
                            </button>
                        </fieldset>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {createArticle, getArticleInfo, updateArticle} from "@/api/article";

    export default {
        // 在路由匹配组件渲染之前会先执行中间件处理
        middleware: 'authenticated',
        name: "EditorIndex",
        data() {
            return {
                newTag: '',
                errors: {}
            }
        },
        async asyncData({query}) {
            const {slug} = query
            let article = {
                    title: '',
                    description: '',
                    body: '',
                    tagList: []
                }
            if (slug) {
                const {data} = await getArticleInfo(slug)
                article = data.article
            }

            console.log(article)
            return {
                slug,
                article
            }
        },
        methods: {
            async createArticle() {
                try {
                    const {data} = this.slug ? await updateArticle(this.slug, this.article) : await createArticle({article: this.article})

                    // 创建成功后跳转到新创建文章的详情页
                    this.$router.push({
                        name: 'article',
                        params: {
                            slug: data.article.slug
                        }
                    })
                } catch (e) {
                    this.errors = e.response.data.errors
                }
            },
            addTag(e) {
                if (!(e && e.keyCode === 13)) return
                if (this.article.tagList.every(item => item !== this.newTag.trim())) {
                    this.article.tagList.push(this.newTag.trim())
                }
                this.newTag = ''
            },
            removeTag(tag) {
                this.article.tagList = this.article.tagList.filter(item => item !== tag)
            }
        }
    }
</script>

<style scoped>

</style>
