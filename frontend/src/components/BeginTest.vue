<script setup>
import { useStudentStore } from '@/stores/student';
import { onMounted } from 'vue';

const store = useStudentStore();

function verifyConnection() {
  // Placeholder function
  console.log('Start button clicked');
}
</script>

<template>
  <v-container class="mt-container" fluid>
    <v-row justify="center">
    <v-col cols="12">
    <v-card width="800" class="pa-6 elevation-3 mx-auto" style="border-left: 6px solid #006643;">
      <v-card-title class="text-h5 font-weight-bold" style="color: #006643;">
        Welcome, {{ store.name }}!
      </v-card-title>
      <v-card-subtitle class="mb-4" style="color: #1E1E1E;">
        You're about to begin your Mathematics Placement Exam
      </v-card-subtitle>

      <v-divider class="my-3"></v-divider>

      <v-row class="mb-2" no-gutters align="center">
        <v-col cols="auto">
          <v-icon class="mr-2" color="#006643">mdi-clock-outline</v-icon>
        </v-col>
        <v-col>
          You will have <b>{{ store.time_limit / 60 }} minutes</b> to complete your exam.
        </v-col>
      </v-row>

      <v-row class="mb-4" no-gutters align="center">
        <v-col cols="auto">
          <v-icon class="mr-2" color="#006643">mdi-pin-outline</v-icon>
        </v-col>
        <v-col>
          Once you press <b>Start</b>, the timer will begin and you must complete the test in one sitting. If you lose your internet connection, you will need to take the whole test again.  Calculators, books, notes, and/or internet searching are <b>NOT ALLOWED</b> while taking the test. Good luck!
        </v-col>
      </v-row>

      <div class="text-subtitle-1 font-italic mb-4" style="color: #1E1E1E;">
        Are you ready?
      </div>

      <v-btn color="#006643" class="mt-2" size="large" @click="verifyConnection" dark>
        Start the Test
      </v-btn>
    </v-card>
    </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.mt-container {
  margin-top: 120px;
}
</style>
