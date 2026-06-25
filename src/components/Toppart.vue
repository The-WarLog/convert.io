<template>
    <v-app-bar class="header" height="80" elevation="2">
        <v-container class="d-flex align-center">
            <!-- Logo -->
            <router-link
                to="/"
                class="text-decoration-none d-flex align-center"
            >
                <v-icon
                    icon="mdi-image-multiple"
                    size="40"
                    color="primary"
                    class="mr-2"
                ></v-icon>
                <span class="text-h5 font-weight-bold">
                    Image<span class="text-primary">Convert</span>
                </span>
            </router-link>

            <v-spacer></v-spacer>

            <!-- Desktop Navigation -->
            <div class="d-none d-md-flex align-center">
                <v-btn variant="text" to="/" class="mx-2">Home</v-btn>

                <v-btn variant="text" to="/all-conversions" class="mx-2"
                    >All Conversions</v-btn
                >

                <!-- Dark Mode Toggle -->
            </div>

            <!-- Mobile Menu -->
            <v-app-bar-nav-icon
                class="d-md-none"
                @click="drawer = true"
            ></v-app-bar-nav-icon>
        </v-container>
    </v-app-bar>
    <!-- Mobile Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
        <v-list>
            <v-list-item to="/" title="Home"></v-list-item>
            <v-list-item
                to="/all-conversions"
                title="All Conversions"
            ></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTheme } from "vuetify";

const drawer = ref(false);
const theme = useTheme();

const isDark = computed(() => theme.global.current.value.dark);

const toggleTheme = () => {
    theme.global.name.value = isDark.value ? "light" : "dark";
};
</script>

<style scoped>
.header {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
</style>
