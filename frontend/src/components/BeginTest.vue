<script setup>
import { useStudentStore } from '@/stores/student';
import { useTestStore } from '@/stores/test';

const studentStore = useStudentStore();
const testStore = useTestStore();

const startTest = async() => {
    try {
        const reqBody = {
            student_id: studentStore.student_id,
            test_id: studentStore.test_id
        };
        const result = await fetch(`${import.meta.env.VITE_API_URL}startTest`,
            {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(reqBody)
            });
        
        if (!result.ok) {
            throw new Error ('Internal API error.');
        }

        let data = await result.json();
        testStore.questions = data.questions;
        testStore.startTimer(studentStore.time_limit);
        window.location.hash = '#/test';

    } catch (error) {
      alert('An error has occurred. Please contact us if this error persists.');
      console.log(error);
    }
}
</script>

<template>
  <v-container class="mt-container" fluid>
    <v-row justify="center">
    <v-col cols="12">
    <v-card width="800" class="pa-6 elevation-3 mx-auto" style="border-left: 6px solid #006643;">
      <v-card-title class="text-h5 font-weight-bold" style="color: #006643;">
        Welcome, {{ studentStore.name }}!
      </v-card-title>
      <v-card-subtitle class="mb-4" style="color: #1E1E1E;">
        You're about to begin your Mathematics Placement Exam
      </v-card-subtitle>

      <v-divider class="my-3"></v-divider>

      <v-row class="mb-2" no-gutters align="center">
        <v-col cols="auto">
          <v-icon class="mr-2" color="#006643">mdi-help</v-icon>
        </v-col>
        <v-col>
          This test contains <b>10 questions</b>.
        </v-col>
      </v-row>

      <v-row class="mb-2" no-gutters align="center">
        <v-col cols="auto">
          <v-icon class="mr-2" color="#006643">mdi-clock-outline</v-icon>
        </v-col>
        <v-col>
          You will have <b>{{ studentStore.time_limit / 60 }} minutes</b> to complete your exam.
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

      <v-btn color="#006643" class="mt-2" size="large" @click="startTest" dark>
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
