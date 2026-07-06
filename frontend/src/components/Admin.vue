<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const errorMsg = ref('');

const usernameRules = [(u) => !!u || 'Username is required'];
const passwordRules = [(p) => !!p || 'Password is required'];

const handleLogin = async () => {
    errorMsg.value = '';

    try {
        const result = await fetch(`${import.meta.env.VITE_API_URL}admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
            }),
        });
        if (!result.ok) {
            throw new Error('Internal API error.');
        }
        let data = await result.json();
        if (data.token) {
            localStorage.setItem('admin_token', data.token);
            window.location.hash = '/admin';
        }
    } catch (error) {
        errorMsg.value = error.result?.data?.error || 'Authentication Failed.';
    }
};
</script>

<template>
    <v-form @submit.prevent="handleLogin">
        <v-container width="900" class="mt-container" fluid>
            <v-row justify="center">
                <v-col cols="12" md="10" lg="8">
                    <v-card class="login-card d-flex" elevation="2" rounded="xl">
                        <div class="accent-bar"></div>
                        <div class="form-body px-6 py-6 flex-grow-1">
                            <h2 class="text-h5 font-weight-bold mb-6">Admin Sign-in</h2>
                            <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-4">
                                {{ errorMsg }}
                            </v-alert>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="username"
                                        :rules="usernameRules"
                                        label="Username"
                                        required></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="password"
                                        :rules="passwordRules"
                                        label="Password"
                                        required></v-text-field>
                                </v-col>
                            </v-row>
                            <div class="d-flex justify-center mt-6">
                                <v-btn
                                    color="#006643"
                                    class="text-white"
                                    type="submit"
                                    elevation="2">
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

.login-card {
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
    color: #008b95;
    text-decoration: none;
}

.create-account-link {
    font-size: 14px;
    color: #006643;
    text-decoration: none;
}

.create-account-link:hover {
    font-weight: bold;
}
</style>
