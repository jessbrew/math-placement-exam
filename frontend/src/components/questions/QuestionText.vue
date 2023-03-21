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
  },
  mounted() {
    this.test = '$ \\frac{6-2(-3^{2})}{-3} $'
    //this.test = 'test this $ 10 - (3-7)+(-2) = $'
    // this.test = '$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$';
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
