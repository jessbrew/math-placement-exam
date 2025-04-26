<script setup>
const verifyConnection = async() => {
    try {
        const result = await fetch(`${import.meta.env.VITE_API_URL}testConnection`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!result.ok) {
            throw new Error ('Internal API error.');
        }
        result.value = await result.json();
        if (result.value.status === 'ok') {
            // able to connect to the database so continue
            window.location.hash = '#/studentinfo'
        }
        else {
            alert('An error has occurred. Please contact us if this error persists.');
        }
    } catch (error) {
        alert('An error has occurred. Please contact us if this error persists.');
        console.log(error);
    }
}
</script>

<template>
    <br>
    <v-card width="1000" class="mx-auto">
        <v-card-title>General Instructions</v-card-title>
        <v-text>
            <ul>
                <li>
                    <span class="important">
                        IMPORTANT: Please read all these instructions before starting the test!
                    </span>
                </li>
                <li>
                    <span class="important">
                        NO calculators, NO books, NO notes, and NO internet searching are allowed while taking the test.
                    </span>
                </li>
                <li>Once you start the test, you must finish it in one sitting.</li>
                <li>You’ll be given one question at a time. You cannot go back to a question or change your answer.</li>
                <li>You will receive a reminder when you have 10 minutes remaining.</li>
                <li>The test will automatically end when your time is up.</li>
                <li>You can only log in once. If you lose your connection, you will have to take the entire exam again.</li>
                <li>
                    You will need your WLC ID number to login. Contact the registrar's
                    office (email:
                    <a href="mailto:registrarsoffice@wlc.edu">registrarsoffice@wlc.edu</a>
                    or phone: <a href="tel:+14144438785"> (414) 443-8785)</a> if you need
                    your number.
                </li>
                <li>When you are ready, click "Begin Test" to go to the log-in screen.</li>
            </ul> 
        </v-text>
        <v-btn class="ma-5" color="#BCBEC0" activeColor="#848586" @click="verifyConnection">Begin Test</v-btn>
    </v-card>
    
</template>

<style scoped>
.important {
  color: #772432;
  font-weight: bold;
}
a {
  color: #008B95;
}
ul {
    padding-left: 30px;
}
</style>