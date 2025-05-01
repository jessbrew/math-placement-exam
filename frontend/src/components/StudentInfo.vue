<script setup>
import {onMounted, ref} from 'vue';
import { useStudentStore } from '@/stores/student';

// Setup the page
const store = useStudentStore();
const form = ref(null); 
const first_name = ref('');
const last_name = ref('');
const user_code = ref('');
const email = ref('');
const desired_class = ref('');
const past_courses = ref([]);

const nameRules = [
  n => !!n || 'Name is required'
]

const codeRules = [
  c => !!c || 'WLC ID is required', 
  c => !isNaN(c) || 'WLC ID must be a number'
]

const emailRules = [
  e => !!e || 'Email is required',
  e => /^[a-zA-Z0-9._%+-]+@mail\.wlc\.edu$/.test(e) || 'You must use a valid WLC email'
]

const classRules = [
  c => !!c || 'You must enter the course you wish to enroll in.'
]

const pastCourseRules = [
  p => p.length > 0 || 'Select at least one past course'
]

const pastCourseList = ref();

const getPastCourses = async() => {
  try {
    const result = await fetch(`${import.meta.env.VITE_API_URL}pastCourses`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!result.ok) {
          throw new Error ('Internal API error.');
    }
    pastCourseList.value = await result.json();
    pastCourseList.value.sort((a,b) => a.display_order - b.display_order);

  } catch (error) {
      alert('An error has occurred. Please contact us if this error persists.');
  }
}

onMounted( () => {
  getPastCourses();
});


// Submission 
const submit = async(event) => {
  const isValid = await form.value.validate();
  if (!isValid.valid) {
    return;
  }
  let startTest = await submitStudentSurvey();
  if(startTest) {
    window.location.hash = '#/begintest';
  }
}

const submitStudentSurvey = async() => {
  try{
    const reqBody = {
      first_name: first_name.value,
      last_name: last_name.value,
      user_code: user_code.value,
      email: email.value,
      desired_class: desired_class.value,
      past_courses: past_courses.value.map(courseId => ({past_course_id: courseId}))
    };
    const result = await fetch(`${import.meta.env.VITE_API_URL}surveySubmit`,
      {
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
        // Save student id and test, then move on
        store.student_id = data.student_id;
        store.test_id = data.test_id;
        store.name = `${first_name.value} ${last_name.value}`;
        store.time_limit = data.time_limit;

        return true;
      }
      else if (data.status === "Complete") {
        alert("It appears you have already completed this exam. If you feel this is in error, please contact us.")
        return false;
      }
      else {
        alert('An error has occurred. Please contact us if this error persists.');
        console.log(data);
      }
      return false;
  } catch(error) {
    alert('An error has occurred. Please contact us if this error persists.');
    console.log(error);
  }
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

            <!-- Main Content -->
            <div class="form-body px-6 py-6 flex-grow-1">
              <h2 class="text-h5 font-weight-bold mb-6">Student Information</h2>

              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="first_name"
                    :rules="nameRules"
                    label="First name"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="last_name"
                    :rules="nameRules"
                    label="Last name"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="user_code"
                    :rules="codeRules"
                    label="WLC ID"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="email"
                    :rules="emailRules"
                    label="WLC email"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="desired_class"
                    :rules="classRules"
                    label="Desired course to enroll in"
                    required 
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">Past courses (select all that apply):</h3>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" class="pa-0">
                  <v-input
                    v-model="past_courses"
                    :rules="pastCourseRules"
                    hide-details="auto"
                    class="pa-0 ma-0"
                    density="compact"
                  >
                    <template #default>
                      <v-row dense style="padding-left: 20px;">
                        <v-col
                          cols="12"
                          md="12"
                          v-for="course in pastCourseList"
                          :key="course.past_course_id"
                          class="pa-0"
                        >
                          <v-checkbox
                            v-model="past_courses"
                            :label="course.description"
                            :value="course.past_course_id"
                            density="compact"
                            hide-details
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </template>
                  </v-input>
                </v-col>
              </v-row>

              <div class="d-flex justify-center mt-6">
                <v-btn color="#006643" class="text-white" type="submit" elevation="2">
                  Submit
                </v-btn>
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
