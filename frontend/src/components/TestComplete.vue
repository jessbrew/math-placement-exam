<script setup>
import { useStudentStore } from '@/stores/student';
import { useTestStore } from '@/stores/test';
import { onMounted } from 'vue';

const studentStore = useStudentStore();
const testStore = useTestStore();

onMounted( () => {
    testStore.stopTimer();
});
</script>

<template>
  <v-container class="mt-container" fluid>
    <v-row justify="center">
    <v-col cols="12">
    <v-card width="900" class="pa-6 elevation-3 mx-auto" style="border-left: 6px solid #006643;">
      <v-card-title class="text-h5 font-weight-bold" style="color: #006643;">
        Well done, {{ studentStore.name }} — you've completed the <br> Mathematics Placement Exam.
      </v-card-title>

      <v-divider class="my-3"></v-divider>

      <v-row class="mb-4" no-gutters align="center">
        <v-col cols="auto">
          <v-icon class="mr-2" color="#006643">mdi-check</v-icon>
        </v-col>
        <v-col>
            Your responses have been submitted successfully. The Mathematics Department will review your results and determine the appropriate course placement.  
            If you have any questions or concerns, feel free to contact the registrar's office.
        </v-col>
      </v-row>
      <v-row>
  <v-col>
    <div class="mt-2 text-subtitle-2">
      Registrar’s Office:  
      <a href="mailto:registrarsoffice@wlc.edu">registrarsoffice@wlc.edu</a>  
      ·  
      <a href="tel:+14144438785">(414) 443-8785</a>
    </div>
  </v-col>
</v-row>
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
