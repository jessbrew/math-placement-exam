<template>
  <span>
    <span class="labels">{{answerLabels[label]}}</span>
    <vue-mathjax :style="{backgroundColor: backgroundColor}" class="answer-text" :formula="answerLatex"></vue-mathjax>
  </span>
</template>

<script>
import {VueMathjax} from 'vue-mathjax'
export default {
  name: "AnswerText",
  props: {
    answerLatex: null,
    isCorrect: null,
    label: null,
  },
  components: {
    'vue-mathjax': VueMathjax
  },
  mounted() {
    this.colorAnswer();
  },
  data(){
    return {
        answerLabels: ['A.', 'B.', 'C.', 'D.'],
        backgroundColor: '#ffffff'
    }
  }, 
  methods: {
    colorAnswer() {
        if (!!this.isCorrect && this.isCorrect === true) {
            this.backgroundColor = '#35d639';
        }
    }
  }

};
</script>

<style scoped>
    .answer-text {
        padding: 5px;
        border: 1px solid black;
        display:inline-block;
        margin: 0px 0px 5px 10px;
        min-width: 30%;
    }
    .labels {
        margin-left: 10px;
    }
</style>
