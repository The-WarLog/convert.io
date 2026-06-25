<template>
    <v-app>
        <Toppart></Toppart>

        <router-view></router-view>
    </v-app>
</template>

<script setup lang="ts">
import Toppart from "./components/Toppart.vue";
</script>
