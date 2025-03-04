<script setup>
import {ref, computed} from 'vue';
import Home from './components/Home.vue';
import Admin from './components/Admin.vue';

const routes = {
  '/': Home,
  '/admin': Admin
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash;
})

const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || '/'] || NotFound;
})
</script>


<template>
<v-app>
    <v-app-bar color="rgb(188,190,192)" prominent app dark max-height="90">
        <img src="./assets/MathematicsPlacementExam.png" class="wlcLogo">
    </v-app-bar>
    <v-main class="mainContent">
        <component :is="currentView"></component>
    </v-main>
</v-app>
</template>

<style>
.wlcLogo {
    max-height: 60px;
    padding-left: 20px;
}
.mainContent {
    padding-left: 20px;
}
</style>