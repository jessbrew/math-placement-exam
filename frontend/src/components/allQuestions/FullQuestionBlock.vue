<template>
  <div class="full-question-block">
    <h3>{{question.question_id}}</h3>
    <question-text :questionLatex="question.question_text"></question-text>
  </div>
</template>

<script>
import QuestionText from '@/components/questions/QuestionText.vue';

export default {
  name: "FullQuestionBlock",
  props: {
    question: {},
  },
  components: {
    QuestionText
  }
};
</script>

<style scoped>
  .full-question-block {
    margin: 10px;
  }
</style>
