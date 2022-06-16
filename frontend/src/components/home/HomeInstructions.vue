<template>
  <div class="instructions">
    <h1>General Instructions</h1>
    <ul>
      <li><span class='important'>IMPORTANT: Please read all instructions before starting the test!</span></li>
      <li><span class='important'>You may use one piece of scrap paper to work out answers.</span></li>
      <li><span class='important'>NO calculators, NO books, NO notes are allowed while taking the test.</span></li>
      <li>Once you start the test, you must finish it in one sitting.</li>
      <li>You will be presented one question at a time. Once you've answered it, you cannot change your answer or go back.</li>
      <li>When you have 10 minutes left for the test you will receive a reminder.</li>
      <li>If you run out of time, the test will end.</li>
      <li>You can only log in once. If you lose your connection, you will need to call the WLC Technology Help Desk to reset your record.</li>
      <li>If you have any computer problems or questions, please call the WLC Technology Help Desk at (414) 443-8911 for assistance.</li>
      <li>When you are ready, click "Begin Test" to go to the log-in screen.</li>
      <li>You will need your WLC ID number to login. Contact the registrar's office (email: <a href="mailto:registrarsoffice@wlc.edu">registrarsoffice@wlc.edu</a> or phone: <a href="tel:+14144438785"> (414) 443-8785)</a> if you need your number.</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "HomeInstructions"
  }
</script>

<style scoped>
.instructions {
    color: rgb(30,30,30);
}
.important {
    color: rgb(119,36,50);
    font-weight: bold;
}
.instructions a {
    color: rgb(0,139,149);
}
</style>
