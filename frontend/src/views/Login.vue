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
        :rules="idruels"
        required
        validate-on-blur
      ></v-text-field>
      <math-test-button msg="Submit"></math-test-button>
    </v-form>
  </span>
</template>

<script>
import MathTestButton from "@/components/general/MathTestButton.vue";

export default {
  name: "Login",
  components: {
    MathTestButton,
  },
};
</script>

<style scoped>
form {
  width: 70vw;
  margin-left: auto;
  margin-right: auto;
}
</style>
