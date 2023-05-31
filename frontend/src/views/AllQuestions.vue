<template>
    <span>
        <h1 class="question-title">All Questions</h1>
        <div v-for="question in questions" :key="question.question_id">
            <full-question-block :question="question"></full-question-block>
            <review-question-block :questionId="question.question_id" :isApproved="question.status" :existingComments="question.description"></review-question-block>
        </div>
    </span>
</template>

<script>
    import axios from 'axios';
    import FullQuestionBlock from '@/components/allQuestions/FullQuestionBlock.vue';
    import ReviewQuestionBlock from '@/components/allQuestions/ReviewQuestionBlock.vue';
    export default {
        data() {
            return {
                questions: null
            }
        }, 
        mounted() {
            let url = process.env.VUE_APP_API + "datacheck/all";
            axios.post(url)
            .then(response => {(this.questions = response.data)})
        },
        name: "AllQuestions",
        components: {
            FullQuestionBlock,
            ReviewQuestionBlock
        }
    };
</script>

<style scoped>
.question-title {
    margin-left: 20px;
}
</style>