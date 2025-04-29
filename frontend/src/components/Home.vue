<script setup>
import {ref} from 'vue';

const isLoading = ref(false);

const verifyConnection = async () => {
  try {
    isLoading.value = true;
    const result = await fetch(`${import.meta.env.VITE_API_URL}testConnection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!result.ok) throw new Error('Internal API error.');

    result.value = await result.json();

    if (result.value.status === 'ok') {
      window.location.hash = '#/studentinfo';
    } else {
      alert('An error has occurred. Please contact us if this error persists.');
    }
  } catch (error) {
    alert('An error has occurred. Please contact us if this error persists.');
    console.error(error);
  }
};
</script>

<template>
    <v-container class="mt-container" fluid>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card class="instruction-card d-flex" elevation="2" rounded="xl">
            <div class="accent-bar"></div>
  
            <div class="card-body px-6 py-4 flex-grow-1">
              <h2 class="text-h5 font-weight-bold mb-4">General Instructions</h2>
  
              <ul class="instruction-list text-body-1">
                <li>
                  <span class="important">
                    IMPORTANT: Please read all these instructions before starting the test!
                  </span>
                </li>
                <li>
                  <span class="important">
                    NO calculators, NO books, NO notes, and NO internet searching are allowed while taking the test.
                  </span>
                </li>
                <li>Once you start the test, you must finish it in one sitting.</li>
                <li>You’ll be given one question at a time. You cannot go back to a question or change your answer.</li>
                <li>You will receive a reminder when you have 10 minutes remaining.</li>
                <li>The test will automatically end when your time is up.</li>
                <li>You can only log in once. If you lose your connection, you will have to take the entire exam again.</li>
                <li>
                  You will need your WLC ID number to log in. Contact the registrar's office (email:
                  <a href="mailto:registrarsoffice@wlc.edu">registrarsoffice@wlc.edu</a> or phone:
                  <a href="tel:+14144438785">(414) 443-8785</a>) if you need your number.
                </li>
                <li>When you are ready, click <strong>"Begin Test"</strong> to go to the log-in screen.</li>
              </ul>
  
              <div class="text-center mt-4">
                <v-btn color="#006643" class="text-white" elevation="2" @click="verifyConnection" :loading="isLoading" :disabled="isLoading">
                    Begin Test
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <style scoped>
  .mt-container {
    margin-top: 120px;
  }
  
  .instruction-card {
    display: flex;
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .accent-bar {
    width: 8px;
    background-color: #006643;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
  
  .card-body {
    flex: 1;
  }
  
  .important {
    color: #772432;
    font-weight: bold;
  }
  
  a {
    color: #008B95;
    text-decoration: none;
  }
  
  .instruction-list {
    padding-left: 1.2rem;
    line-height: 1.8rem;
  }
</style>
  