import { defineStore } from 'pinia'
import { ref } from 'vue';


export const useStudentStore = defineStore('student', () => {
    const student_id = ref(0);
    const test_id = ref(0);
    const name = ref('');
    const time_limit = ref(0);
    const question_count = ref(0);
  
    return {student_id, test_id, name, time_limit, question_count};
});