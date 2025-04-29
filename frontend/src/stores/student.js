import { defineStore } from 'pinia'
import { ref } from 'vue';


export const useStudentStore = defineStore('student', () => {
    const student_id = ref(0);
    const test_id = ref(0);
    const name = ref('');
  
    return {student_id, test_id, name};
});