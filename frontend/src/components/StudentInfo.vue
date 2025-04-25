<script setup>
import {ref} from 'vue';

const valid = ref(false);
const first_name = ref('');
const last_name = ref('');
const user_code = ref('');
const email = ref('');
const desired_class = ref('');
const past_courses = ref();

</script>

<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="first_name"
            :counter="10"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="last_name"
            :counter="10"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="user_code"
            :rules="emailRules"
            label="WLC ID"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>