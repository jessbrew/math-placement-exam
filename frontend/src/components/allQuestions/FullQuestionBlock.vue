<template>
  <div class="full-question-block">
    <h3>Question {{question.question_id}}:</h3>
    <question-text :questionLatex="question.question_text"></question-text>
    <div v-for="(answer, index) in question.answer" :key="answer.answer_id">
      <answer-text :answerLatex="answer.answer_text" :isCorrect="answer.is_correct" :label="index"></answer-text>
    </div>
  </div>
</template>

<script>
import QuestionText from '@/components/questions/QuestionText.vue';
import AnswerText from '@/components/questions/AnswerText.vue';

export default {
  name: "FullQuestionBlock",
  props: {
    question: {},
  },
  components: {
    QuestionText,
    AnswerText
  }
};
</script>

<style scoped>
  .full-question-block {
    margin: 20px;
    min-width: 30%;
    display: inline-block;
  }
</style>
