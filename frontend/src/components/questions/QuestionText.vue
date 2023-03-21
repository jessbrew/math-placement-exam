<template>
  <span>
    <vue-mathjax :formula="test"></vue-mathjax>
    <div class="question-text">{{questionLatex}}</div>
  </span>
</template>

<script>
import {VueMathjax} from 'vue-mathjax'
export default {
  name: "QuestionText",
  props: {
    questionLatex: null,
    test: null
  },
  components: {
    'vue-mathjax': VueMathjax
  },
  mounted() {
    this.test = '$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$';
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
