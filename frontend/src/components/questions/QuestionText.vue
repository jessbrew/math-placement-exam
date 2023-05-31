<template>
  <span>
    <vue-mathjax v-if="useMathJax" class="question-text" :formula="questionLatex"></vue-mathjax>
    <div v-if="useSVG" class="question-text">
      <div>{{labelText}}</div>
      <div v-html="svgText"></div>
      <vue-mathjax :formula="latexText"></vue-mathjax>
    </div>
  </span>
</template>

<script>
import {VueMathjax} from 'vue-mathjax'
export default {
  name: "QuestionText",
  data() {
    return {
      useMathJax: true,
      useSVG: false,
      labelText: "",
      svgText: "",
      latexText: "",
    }
  },
  props: {
    questionLatex: null,
  },
  components: {
    'vue-mathjax': VueMathjax
  }, 
  mounted() {
    if (this.questionLatex.indexOf("<svg") >= 0) {
      this.useMathJax = false;
      this.useSVG = true;

      // parse out the different pieces
      this.labelText = this.questionLatex.substring(0, this.questionLatex.indexOf("<svg"));
      this.svgText = this.questionLatex.substring(this.questionLatex.indexOf("<svg"), this.questionLatex.indexOf("</svg>") + 6);
      this.latexText = this.questionLatex.substring(this.questionLatex.indexOf("</svg>") + 6);
    }
  }

};
</script>

<style scoped>
    .question-text {
        padding: 20px;
        border: 1px solid black;
        max-width: 90%;
        margin: 10px 0px 10px 0px;
        display:block;
    }
</style>
