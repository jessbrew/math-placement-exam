import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue';
import { useStudentStore } from './student';

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
            testComplete();
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

    async function testComplete() {
        const studentStore = useStudentStore();
        try {
            const reqBody = {
                student_id: studentStore.student_id,
                status: "complete"
            };
    
            const result = await fetch(`${import.meta.env.VITE_API_URL}testComplete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody)
            });
    
            if (!result.ok) {
                throw new Error ('Internal API error.');
            }
            let data = await result.json();
    
            if (data.status === "ok") {
                window.location.hash = '#/testcomplete';
            }
        } catch(error) {
            alert('An error has occurred.');
            console.log(error);
        }
    }

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
        testComplete,
        questions,
        getCurrentQuestion,
        nextQuestion,
        isLastQuestion,
        getQuestionNumber
    };
});
