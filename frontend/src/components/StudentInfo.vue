<script setup>
import {onMounted, ref} from 'vue';

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

const submit = async(event) => {
  const isValid = await form.value.validate();
  if (!isValid.valid) {
    return;
  }
  console.log("submitting");
}
</script>

<template>
  <v-form ref="form" validate-on="submit lazy" @submit.prevent="submit">
    <v-container>
      <h1>Student Information</h1>
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
          <h3>Past courses: (select all that apply)</h3>
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
      
      
      <v-row>
        <v-col class="text-right" cols="12">
          <v-btn class="ma-5" color="#BCBEC0" activeColor="#848586" type="submit">Submit</v-btn>
        </v-col>
      </v-row>

    </v-container>
  </v-form>
</template>