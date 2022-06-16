<template>
<div class="button">
  <v-btn type="Submit" fixed rounded>{{msg}}</v-btn>
</div>
</template>

<script>
export default {
    name: 'MathTestButton',
    props: {
        msg: String,
    },
}
</script>

<style scoped>
.button {
    text-align: center;
    margin-top: 10px;
}
</style>
