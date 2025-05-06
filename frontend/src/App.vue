<script setup>
import { ref, computed } from 'vue';
import { useTestStore } from './stores/test';
import Home from './components/Home.vue';
import Admin from './components/Admin.vue';
import StudentInfo from './components/StudentInfo.vue';
import BeginTest from './components/BeginTest.vue';
import Test from './components/Test.vue';
import TestComplete from './components/TestComplete.vue';

const testStore = useTestStore();

const timerClass = computed(() => {
  return testStore.minutes < 5 ? 'text-error font-weight-bold' : 'text-h6 font-weight-bold';
});

const routes = {
  '/': Home,
  '/admin': Admin,
  '/studentinfo': StudentInfo,
  '/begintest': BeginTest,
  '/test': Test,
  '/testcomplete': TestComplete
};

const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound;
});
</script>

<template>
  <v-app>
    <v-app-bar color="#BCBEC0" app flat class="border-bottom" height="100">
      <v-container class="d-flex align-center" fluid>
        <v-toolbar-title class="pl-2">
          <img
            src="./assets/MathematicsPlacementExam.png"
            class="wlc-logo"
            alt="WLC Mathematics Placement Logo"
          />
        </v-toolbar-title>
        <div v-if="testStore.timeRemaining > 0" class="d-flex justify-end">
          <div :class="timerClass" class="text-h6 font-weight-bold mr-4">
            Time Remaining: {{ testStore.minutes }} min
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-main class="main-content">
      <component :is="currentView" />
    </v-main>
  </v-app>
</template>

<style scoped>

.wlc-logo {
  max-height: 80px;
  padding-top: 8px;
  object-fit: contain;
}

.border-bottom {
  border-bottom: 2px solid #A9A9A9;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.main-content {
  background-color: #F1F1F1;
  padding: 48px 24px;
  min-height: calc(100vh - 100px);
}

.v-toolbar-title {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  color: #1E1E1E;
}
</style>
