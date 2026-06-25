<template>
    <div class="converter-page">
        <!-- Heading -->
        <div class="heading-section text-center">
            <h1 class="main-title">Convert Images Instantly</h1>

            <p class="text-subtitle">
                Convert JPG, PNG, WEBP,and more in seconds.
            </p>
        </div>

        <!-- Upload Area -->
        <div class="file-upload-container">
            <v-file-upload
                browse-text="Choose File"
                divider-text="or"
                icon="mdi-folder-upload"
                title="Drop your image here"
                class="custom-file-upload"
                v-model="uploadedImage"
                multiple
                showsize
                clearable
                inset-file-list
            ></v-file-upload>
        </div>

        <!-- Conversion Controls -->
        <div class="conversion-controls">
            <div class="conversion-row">
                <v-select
                    v-model="fromFormat"
                    :items="formats"
                    variant="outlined"
                    hide-details
                    density="comfortable"
                    class="format-select"
                />

                <v-icon icon="mdi-arrow-right" size="24" color="#64748B" />

                <v-select
                    v-model="toFormat"
                    :items="formats"
                    variant="outlined"
                    hide-details
                    density="comfortable"
                    class="format-select"
                />
            </div>

            <v-btn class="convert-btn" @click="convertImage()">
                <v-icon start icon="mdi-cached" />
                Convert Now
            </v-btn>

            <div class="security-text">
                <v-icon icon="mdi-lock-outline" size="18" />
                Your files are secure and deleted automatically.
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { MetadataService } from "@/utility/metadata";
import { convertAndStore } from "@/utility/convert";
import { useRouter } from "vue-router";
import type { Conversion } from "@/types";
const uploadedImage = ref<File[]>([]);

const fromFormat = ref("JPG");
const toFormat = ref("PNG");
const router = useRouter();
const formats = ["JPG", "PNG", "WEBP", "BMP", "SVG", "ICO"];

// const handelFileUpload = async (files: File[]) => {
//     let file = files[0];

//     const sanitized = await MetadataService.sanitizeImage(file);

//     console.log(sanitized);
// };

const convertImage = async () => {
    if (!uploadedImage.value.length) {
        console.log("Upload an image first");
        return;
    }

    const file = uploadedImage.value[0];
    const formatMap: Record<string, Conversion> = {
        JPG: "image/jpeg",
        PNG: "image/png",
        WEBP: "image/webp",
        BMP: "image/bmp",
        SVG: "image/svg+xml",
        ICO: "image/x-icon",
    };
    const targetMime = formatMap[toFormat.value];
    if (!targetMime) {
        alert("Unsupported Target Format");
        return;
    }
    try {
        await convertAndStore(file, targetMime);
        router.push("/all-conversions");
    } catch (err) {
        console.error("Conversion Failure" + err);

        alert("Conversion Failed");
    }
};
</script>
<style scoped>
.converter-page {
    min-height: 100vh;
    background: #f8f8fb;
    padding: 40px 20px;
}

/* ===========================
   COLORS
=========================== */

:root {
    --primary: #4f46ff;
    --primary-hover: #635bff;

    --text-primary: #0f172a;
    --text-secondary: #64748b;

    --border: #e5e7eb;
    --border-accent: #a5b4fc;

    --white: #ffffff;
}

/* ===========================
   HEADING
=========================== */

.heading-section {
    margin-top: 40px;
    margin-bottom: 50px;
}

.main-title {
    color: var(--text-primary);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 12px;
}

.text-subtitle {
    color: var(--text-secondary);
    font-size: 1.15rem;
}

/* ===========================
   UPLOAD
=========================== */

.file-upload-container {
    width: 100%;
    max-width: 850px;
    overscroll-behavior-y: auto;

    margin: 0 auto;
}

.custom-file-upload :deep(.v-file-upload) {
    background: white;

    border: 2px dashed var(--border-accent) !important;

    border-radius: 20px;

    padding: 80px 30px !important;

    transition: all 0.25s ease;
}

.custom-file-upload :deep(.v-file-upload:hover) {
    border-color: var(--primary) !important;

    transform: translateY(-2px);

    box-shadow: 0 10px 25px rgba(79, 70, 255, 0.08);
}

.custom-file-upload :deep(.v-file-upload__title) {
    color: var(--text-primary);
    font-size: 1.3rem;
    font-weight: 600;
}

.custom-file-upload :deep(.v-file-upload__icon) {
    color: var(--primary);
    margin-bottom: 16px;
}

.custom-file-upload :deep(.v-btn) {
    background: var(--primary);
    color: var(--text-secondary);
}

/* ===========================
   CONVERSION CONTROLS
=========================== */

.conversion-controls {
    width: 100%;
    max-width: 850px;
    margin: 0 auto;
}

.conversion-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;

    margin-top: 35px;
}

.format-select {
    width: 180px;
}

.format-select :deep(.v-field) {
    background: white;
    border-radius: 12px;
}

/* ===========================
   BUTTON
=========================== */

.convert-btn {
    display: flex;

    margin: 35px auto 0;

    width: 500px;
    height: 60px;

    border-radius: 14px !important;

    background: linear-gradient(90deg, #4f46ff 0%, #635bff 100%) !important;

    color: white !important;

    font-size: 1.05rem;
    font-weight: 600;

    text-transform: none;

    box-shadow: 0 8px 20px rgba(79, 70, 255, 0.25);
}

.convert-btn:hover {
    transform: translateY(-2px);
}

/* ===========================
   SECURITY
=========================== */

.security-text {
    margin-top: 18px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    color: var(--text-secondary);

    font-size: 0.9rem;
}

/* ===========================
   MOBILE
=========================== */

@media (max-width: 768px) {
    .conversion-row {
        flex-direction: column;
    }

    .format-select {
        width: 100%;
        max-width: 300px;
    }

    .convert-btn {
        width: 100%;
        max-width: 350px;
    }
}
</style>
