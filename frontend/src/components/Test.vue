<script setup>
import { useTestStore } from '@/stores/test';
import { computed, ref } from 'vue';

const testStore = useTestStore();

const form = ref(null);

const currentQuestion = computed(() => testStore.getCurrentQuestion());
const currentNumber = computed(() => testStore.getQuestionNumber());

const submit = async() => {
    console.log("sub");
}

const next = () => {
    testStore.nextQuestion();
}
</script>

<template>
    <v-form ref="form" validate-on="submit lazy" @submit.prevent="submit">
        <v-container class="mt-container" fluid>
            <v-row justify="center">
                <v-col cols="12" md="10" lg="8">
                    <v-card class="student-card d-flex" elevation="2" rounded="xl">
                        <!-- Green Accent Bar -->
                        <div class="accent-bar"></div>
                        <div class="form-body px-6 py-6 flex-grow-1">
                            <h2 class="text-h5 font-weight-bold mb-6">Question {{ currentNumber }}</h2>

                            <v-row>
                                <v-col cols="12">
                                    <div v-if="currentQuestion">
                                        {{ currentQuestion.question_text }}
                                    </div>
                                    <div v-else>
                                        There was an error loading your next question. Please contact us.
                                    </div>
                                </v-col>
                            </v-row>
                            <div class="d-flex justify-center mt-6">
                                <div v-if="testStore.isLastQuestion()">
                                    <v-btn color="#006643" class="text-white" @click="submit" elevation="2">
                                    Submit
                                    </v-btn>
                                </div>
                                <div v-else>
                                    <v-btn color="#006643" class="text-white" @click="next" :disabled="testStore.isLastQuestion()" elevation="2">
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