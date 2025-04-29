<script setup>
import { useTestStore } from '@/stores/test';
import { computed } from 'vue';

const testStore = useTestStore();

const currentQuestion = computed(() => testStore.getCurrentQuestion())
</script>

<template>
    <h1>TEST placeholder</h1>
    <div>{{ currentQuestion.question_text }}</div>
</template>