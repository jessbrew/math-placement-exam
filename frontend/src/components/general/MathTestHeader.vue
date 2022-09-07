<template>
  <span id="header">
    <v-app-bar color="rgb(188,190,192)" prominent app dark max-height="90">
      <img
        alt="Mathematics Placement Exam"
        src="@/assets/MathematicsPlacementExam.png"
      />
    </v-app-bar>
  </span>
</template>

<script>
export default {
  name: "MathTestHeader",
};
</script>

<style scoped>
a {
  color: white;
  text-decoration: none;
}
#header img {
  object-fit: contain;
  height: 65%;
}
</style>
