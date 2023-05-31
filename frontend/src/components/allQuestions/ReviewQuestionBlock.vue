<template>
  <div class="review-question-block">
    <h3>Approval:</h3>
    <v-radio-group v-model="approval" v-on:change="updateStatus">
        <v-radio label="Approved" value="1" ></v-radio>
        <v-radio label="Needs updates" value="0"></v-radio>
    </v-radio-group>
    <v-textarea v-model="comments" label="Comments" bg-color="grey-lighten-2"></v-textarea>
    <v-btn v-on:click="submitComments" class="comment-check">Submit Comments</v-btn>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: "ReviewQuestionBlock",
  props: {
    questionId: null,
    isApproved: null,
    existingComments: null,
  },
  mounted() {
    if (this.isApproved === true) {
      this.approval = "1";
    } else if (this.isApproved === false) {
      this.approval = "0";
    }
    if (this.existingComments && this.existingComments != "null") {
          this.comments = this.existingComments;
    }
  },
  components: {
  },
  data() {
    return {
      approval: null,
      comments: null,
    }
  }, 
  methods: {
    updateStatus() {
      if (!this.approval) {
        alert(`Must have an approval status when submitting. (Error on question ${this.questionId})`);
        return;
      }
      let request = {"question_id": this.questionId,
        "status": this.approval,
        "description" : this.comments};
      
      console.log(request);

      let url = process.env.VUE_APP_API + "datacheck/update";
      axios.post(url, request)
            .then(response => {(console.log(response))})
    },
    submitComments() {
      if (!this.comments || this.comments.trim().length === 0) {
        alert("Cannot submit blank comments!");
      }
      else {
        this.updateStatus();
      }
    }
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
  .comment-check {
    margin-top: 0px;
    padding-top: 0px;
  }

</style>
