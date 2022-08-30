<template>
  <span>
    <v-form
      ref="login"
      v-model="valid"
      lazy-validation
      method="post"
      @submit.prevent="submitForm"
    >
      <v-text-field
        v-model="fname"
        :rules="nameRules"
        label="First Name"
        required
        validate-on-blur
      ></v-text-field>
      <v-text-field
        v-model="lname"
        :rules="nameRules"
        label="Last Name"
        required
        validate-on-blur
      ></v-text-field>
      <v-text-field
        v-model="id"
        label="Warrior Id"
        :rules="idRules"
        required
        validate-on-blur
      ></v-text-field>
      <math-test-button msg="Submit"></math-test-button>
    </v-form>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title>Exam Completed</v-card-title>
        <v-card-text>You have already completed the Mathematics Placement Exam. If you believe this is in error, please contact PLACEHOLDER.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
           
            text
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import MathTestButton from "@/components/general/MathTestButton.vue";

export default {
  name: "Login",
  components: {
    MathTestButton
  },
  data: function () {
    return {
      fname: "",
      lname: "",
      id: "",
      valid: true,
      dialog: false,
      nameRules: [
        (name) => !!name || "Name is required",
        // Name cannot be whitespace
        (name) => !/^\s*$/g.test(name) || "Name is required",
        // No numbers in name
        (name) => /^\D*$/g.test(name) || "Name is required",
      ],
      idRules: [
        (id) => !!id || "Id is required",
        (id) =>
          (parseInt(id) > 999999 && parseInt(id) < 10000000) ||
          "Invalid ID number",
      ],
    };
  },
  methods: {
    validate() {
      this.$refs.login.validate();
    },
    submitForm() {
      if (this.$refs.login.validate()) {
        // TODO: send data to API and only continue to questionnaire if new student
        // Do this if test is already completed
        //this.dialog = true;
        // Send student to their spot in the test if unfinished
        this.$router.replace("questionnaire");
      }
    },
  },
};
</script>

<style scoped>
form {
  width: 50vw;
  margin-left: auto;
  margin-right: auto;
}
</style>
