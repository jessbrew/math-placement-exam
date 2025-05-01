<script setup>
import { useTestStore } from '@/stores/test';
import { useStudentStore } from '@/stores/student';
import { computed, ref, watch, nextTick, onMounted } from 'vue';

const testStore = useTestStore();
const studentStore = useStudentStore();

const form = ref(null);
const answer_id = ref(null);

const currentQuestion = computed(() => testStore.getCurrentQuestion());
const currentNumber = computed(() => testStore.getQuestionNumber());

const submit = async() => {
    let result = await submitAnswer();

    if (result === "ok" || result === "time") {
        await testStore.testComplete();
    }
    else {
        alert('An error has occurred.');
    }
}

const next = async() => {
    let result = await submitAnswer();

    if (result === "ok") {
        answer_id.value = null;
        testStore.nextQuestion();
    }
    else if (result === "time") {
        // Time ended (also being watched by the frontend so this should rarely get hit)
        await testStore.testComplete();
    }
    else {
        alert('An error has occurred');
    }
}

watch(currentQuestion, async () => {
    await nextTick(); // Wait for DOM update
    if (window.MathJax) {
        window.MathJax.typesetPromise(); // Re-typeset the page
    }
    if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise();
    }
});

onMounted(async () => {
    await nextTick();
    
    if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise();
    }
});

const submitAnswer = async () => {
    try {
        // submit the answer then get next question
        const reqBody = {
            student_id: studentStore.student_id,
            answer_id: answer_id.value
        }

        const result = await fetch(`${import.meta.env.VITE_API_URL}submitAnswer`, {
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

        return data.status;
    } catch(error) {
        alert('An error has occurred.');
        console.log(error);
    }
}
</script>

<template>
    <v-form ref="form" validate-on="submit lazy" @submit.prevent="submit">
        <v-container width="1000px" class="mt-container" fluid>
            <v-row justify="center">
                <v-col cols="12" md="10" lg="8">
                    <v-card class="student-card d-flex" elevation="2" rounded="xl">
                        <!-- Green Accent Bar -->
                        <div class="accent-bar"></div>
                        <div class="form-body px-6 py-6 flex-grow-1">
                            <h2 class="text-h5 font-weight-bold mb-6">Question {{ currentNumber }}</h2>

                            <v-row>
                                <v-col cols="12">
                                    <div v-if="currentQuestion" v-html="currentQuestion.question_text" class="question-text"></div>
                                    <div v-else>
                                        There was an error loading your next question. Please contact us.
                                    </div>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" class="ml-2">
                                    <v-radio-group v-model="answer_id"
                                    :mandatory="true"
                                    hide-details>
                                        <v-radio
                                            v-for="answer in currentQuestion.answers"
                                            :key="answer.answer_id"
                                            :value="answer.answer_id"
                                            class="mb-2"
                                        >
                                        <template #label>
                                            <span v-html="answer.answer_text"></span>
                                        </template>
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                            </v-row>

                            <div class="d-flex justify-center mt-6">
                                <div v-if="testStore.isLastQuestion()">
                                    <v-btn color="#006643" class="text-white" @click="submit" elevation="2">
                                    Submit
                                    </v-btn>
                                </div>
                                <div v-else>
                                    <v-btn color="#006643" class="text-white" @click="next" :disabled="!answer_id || testStore.isLastQuestion()" elevation="2">
                                    Next Question
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<style scoped>
.v-selection-control__label {
  font-size: 1.2rem;
}

.question-text {
  font-size: 1.25rem; /* or 1.5rem for even bigger */
  line-height: 1.6;
}

.mt-container {
  margin-top: 120px;
}

.student-card {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
}

.accent-bar {
  width: 8px;
  background-color: #006643;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.form-body {
  flex: 1;
}

h2 {
  color: #1e1e1e;
}

a {
  color: #008B95;
  text-decoration: none;
}
</style>