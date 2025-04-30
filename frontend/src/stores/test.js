import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue';

export const useTestStore = defineStore('test', () => {
    // Timer logic
    const timeRemaining = ref(0);
    let interval = null;

    function startTimer(seconds) {
        timeRemaining.value = seconds;

        if (interval) clearInterval(interval);
        interval = setInterval(() => {
        timeRemaining.value--;
        if (timeRemaining.value <= 0) {
            clearInterval(interval);
            // TODO: add timeout logic here
        }
        }, 1000);
    }

    function stopTimer() {
        if (interval) clearInterval(interval);
        interval = null;
        timeRemaining.value = 0;
    }

    const minutes = computed(() => Math.ceil(timeRemaining.value / 60));

    onUnmounted(() => stopTimer());

    // Test questions
    const questions = ref([]);
    const currentQuestionIndex = ref(0);

    function getCurrentQuestion() {
        let question = null;
        if (currentQuestionIndex.value < questions.value.length) {
            question = questions.value[currentQuestionIndex.value];
        }
        return question;
    }

    function nextQuestion() {
        if (currentQuestionIndex.value < questions.value.length - 1) {
            currentQuestionIndex.value++;
        }
      }
    
    function isLastQuestion() {
        return currentQuestionIndex.value === questions.value.length - 1;
    }

    function getQuestionNumber() {
        return currentQuestionIndex.value + 1;
    }

    return {
        timeRemaining,
        startTimer,
        stopTimer,
        minutes,
        questions,
        getCurrentQuestion,
        nextQuestion,
        isLastQuestion,
        getQuestionNumber
    };
});
