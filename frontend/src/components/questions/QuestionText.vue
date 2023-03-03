<template>
  <span>
    <div class="question-text">{{questionLatex}}</div>
  </span>
</template>

<script>
import MathJax from "@/assets/tex-svg.js"; // eslint-disable-line

export default {
  name: "QuestionText",
  props: {
    questionLatex: null,
  },
  methods: {
    formatQuestion() {
      console.log("HERE");
      MathJax.typeset();
    },
  },
  mounted() {
    this.formatQuestion();
  }
};
</script>

<style scoped>
    .question-text {
        padding: 10px;
        border: 1px solid black;
        max-width: 50%;
    }
</style>
