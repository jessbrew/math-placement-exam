<script setup>
import { ref, computed } from 'vue';
import { useTestStore } from './stores/test';
import Home from './components/Home.vue';
import Admin from './components/Admin.vue';
import StudentInfo from './components/StudentInfo.vue';
import BeginTest from './components/BeginTest.vue';
import Test from './components/Test.vue';
import TestComplete from './components/TestComplete.vue';
import AdminDashboard from './components/AdminDashboard.vue';

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
    '/testcomplete': TestComplete,
};

const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash;
});

const currentView = computed(() => {
    const path = currentPath.value.slice(1) || '/';

    // check if they are attempting admin access
    if (path.indexOf('admin') > 0) {
        const token = localStorage.getItem('admin_token');
        if (token) {
            return AdminDashboard;
        }
        return Admin;
    }

    return routes[path] || Home;
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
                        alt="WLC Mathematics Placement Logo" />
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

        <v-footer color="#BCBEC0" app padless>
            <v-container class="py-4 d-flex justify-space-between align-center" fluid>
                <p class="mb-0">© 2025 — All rights reserved.</p>
                <a href="#/admin" class="admin-link">Admin</a>
            </v-container>
        </v-footer>
    </v-app>
</template>

<style scoped>
.wlc-logo {
    max-height: 80px;
    padding-top: 8px;
    object-fit: contain;
}

.border-bottom {
    border-bottom: 2px solid #a9a9a9;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.main-content {
    background-color: #f1f1f1;
    padding: 48px 24px;
    min-height: calc(100vh - 100px);
}

.v-toolbar-title {
    font-family: 'Arial', sans-serif;
    font-weight: bold;
    color: #1e1e1e;
}

.admin-link {
    font-size: 14px;
    color: #1e1e1e;
    text-decoration: none;
}

.admin-link:hover {
    font-weight: bold;
}
</style>
