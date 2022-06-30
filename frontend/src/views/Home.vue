<template>
  <div class="home">
    <home-instructions />
    <v-form ref="button" @submit.prevent="submitForm">
      <math-test-button msg="Begin Test" />
    </v-form>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeInstructions from "@/components/home/HomeInstructions.vue";
import MathTestButton from "@/components/general/MathTestButton.vue";

export default {
  name: "Home",
  components: {
    HomeInstructions,
    MathTestButton,
  },
  methods: {
    submitForm() {
      this.$router.replace("Login");
    },
  },
};
</script>

<style scoped>
.home {
  margin-left: 10vw;
  margin-right: 10vw;
}
</style>
