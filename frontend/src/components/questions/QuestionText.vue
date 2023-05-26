<template>
  <span>
    <vue-mathjax class="question-text" :formula="questionLatex"></vue-mathjax>
    <!-- <div class="question-text">{{questionLatex}}</div> -->
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
  }
};
</script>

<style scoped>
    .question-text {
        padding: 20px;
        border: 1px solid black;
        max-width: 50%;
        margin: 10px 0px 10px 0px;
        display:block;
    }
</style>
