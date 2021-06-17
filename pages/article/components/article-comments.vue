<template>
    <div>
        <form class="card comment-form">
            <div class="card-block">
                            <textarea class="form-control" placeholder="Write a comment..." rows="3"
                                      v-model="newComment"></textarea>
            </div>
            <div class="card-footer">
                <img :src="user.image" class="comment-author-img"/>
                <button class="btn btn-sm btn-primary" @click.prevent="addComment()">
                    Post Comment
                </button>
            </div>
        </form>

        <div class="card" v-for="comment in comments" :key="comment.id">
            <div class="card-block">
                <p class="card-text">{{comment.body}}</p>
            </div>
            <div class="card-footer">
                <a href="" class="comment-author">
                    <img :src="comment.author.image" class="comment-author-img"/>
                </a>
                &nbsp;
                <a href="" class="comment-author">{{comment.author.username}}</a>
                <span class="date-posted">{{comment.createdAt | date('MMM DD, YYYY')}}</span>
                <span class="mod-options" v-if="user.username === comment.author.username">
<!--                              <i class="ion-edit"></i>-->
                              <i class="ion-trash-a" @click="deleteComment(comment)"></i>
                            </span>
            </div>
        </div>
    </div>
</template>

<script>
    import {addComments, deleteComment, getComments} from "@/api/article";
    import {mapState} from 'vuex'
    export default {
        name: "ArticleComments",
        props: {
            article: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                comments: [],
                newComment: ''
            }
        },
        methods:{
            async addComment() {
                const {data} = await addComments(this.article.slug, this.newComment.trim())
                this.newComment = ''
                const {comment} = data
                this.comments.unshift(comment)
            },
            async deleteComment(comment) {
                const {data} = await deleteComment(this.article.slug, comment.id)
                this.comments = this.comments.filter(item => item.id !== comment.id)
            }
        },
        async mounted() {
            const {data} = await getComments(this.article.slug)
            console.log(data)
            this.comments = data.comments || []
        },
        computed: {
            ...mapState(['user'])
        },
    }
</script>

<style scoped>

</style>
