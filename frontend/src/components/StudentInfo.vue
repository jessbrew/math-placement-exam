<script setup>
import {ref} from 'vue';

let tests = ref(null);
fetch('http://35.174.227.248:3000/submit_answer', {
    method: 'POST',  
    headers: {
        'Content-Type': 'application/json'
    },
})
.then(response => response.json())
.then(data => {console.log(data)})
</script>

<template>
    <div>
        STUDENT INFO
    </div>
</template>