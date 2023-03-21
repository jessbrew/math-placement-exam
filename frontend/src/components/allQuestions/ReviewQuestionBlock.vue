<template>
  <div class="review-question-block">
    <h3>Approval:</h3>
    <v-radio-group v-model="inline" inline>
        <v-radio label="Approved" value="1"></v-radio>
        <v-radio label="Needs updates" value="0"></v-radio>
    </v-radio-group>
    <v-textarea label="Comments" bg-color="grey-lighten-2"></v-textarea>
  </div>
</template>

<script>

export default {
  name: "ReviewQuestionBlock",
  props: {
    questionId: null,
  },
  components: {
  }
};
</script>

<style scoped>
  .review-question-block {
    margin: 20px;
    min-width: 50%;
    display: inline-block;
    vertical-align: top;
  }
</style>
