<template>
    <v-container class="all-conversions-page">
        <!-- Header -->
        <div class="text-center mb-10">
            <h1 class="page-title">All Conversions</h1>

            <p class="page-subtitle">
                View and download all your converted images.
            </p>
        </div>

        <!-- Table Card -->
        <v-card class="conversion-card" elevation="0" v-if="conversions.length">
            <div class="table-scroll">
                <v-table>
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Size</th>
                            <th>Date</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="conversion in conversions"
                            :key="conversion.id"
                        >
                            <td>
                                <div class="file-cell">
                                    <span>{{
                                        conversion.originalFilename
                                    }}</span>
                                </div>
                            </td>
                            <td>{{ conversion.originalFormat }}</td>
                            <td>{{ formatMap[conversion.targetFormat] }}</td>
                            <td>
                                {{ (conversion.outputSize / 1024).toFixed(1) }}
                                KB
                            </td>
                            <td>
                                {{
                                    new Date(
                                        conversion.conversionDate,
                                    ).toLocaleDateString()
                                }}
                            </td>
                            <td class="text-center">
                                <v-btn
                                    variant="outlined"
                                    color="primary"
                                    prepend-icon="mdi-download"
                                    @click="downloadConversion(conversion)"
                                >
                                    Download
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
        </v-card>
        <div v-else class="empty-state">
            <v-icon size="80" color="#A5B4FC"> mdi-image-off </v-icon>

            <h2>No conversions yet</h2>

            <p>Convert an image to see it here.</p>

            <v-btn color="primary" to="/"> Convert Image </v-btn>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import type { ConversionJob, Conversion } from "@/types";
import { getAllConversions } from "@/storage/storage";

const conversions = ref<ConversionJob[]>([]);
const formatMap: Record<Conversion, string> = {
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "image/webp": "WEBP",
    "image/bmp": "BMP",
    "image/svg+xml": "SVG",
    "image/x-icon": "ICO",
};
onMounted(async () => {
    const all = await getAllConversions();
    // Sort by conversion date descending
    all.sort((a, b) => b.conversionDate - a.conversionDate);
    conversions.value = all;
});

const downloadConversion = (record: ConversionJob) => {
    if (!record.output) return;
    const blob = record.output.blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = record.output.metadata.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
</script>

<style scoped>
.all-conversions-page {
    max-width: 1450px;
    margin: 0 auto;
    padding-top: 60px 24px;
}

.page-title {
    font-size: 3rem;

    font-weight: 700;
    color: #0f172a;
    margin-top: 4.5rem;
    margin-bottom: 1rem;
}

.page-subtitle {
    color: #64748b;
    font-size: 1.1rem;
}

.conversion-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid #eceef3;
    box-shadow: 0 8px 30px rgba(15, 23, 42, 0.05);
}

.table-scroll {
    max-height: calc(100vh - 220px);
    overflow-y: auto;
}

.file-cell {
    display: flex;
    align-items: center;
    gap: 14px;
}

.file-cell img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

:deep(thead th) {
    position: sticky;
    top: 0;
    z-index: 10;
    font-weight: 600;
    color: #64748b !important;
    font-weight: 600 !important;
    background: #fafafa;
    height: 64px;
}

:deep(tbody tr:hover) {
    background: #f8f8fb;
}
:deep(tbody tr) {
    height: 88px;
}

:deep(tbody td) {
    vertical-align: middle;
}
.download-btn {
    border-radius: 12px !important;

    border: 1.5px solid #635bff !important;

    color: #635bff !important;

    text-transform: none;

    font-weight: 600;

    height: 42px;

    padding: 0 20px;
}
.page-title {
    font-size: 3.25rem;

    font-weight: 700;

    color: #0f172a;

    margin-bottom: 12px;
}

.page-subtitle {
    color: #64748b;

    font-size: 1.1rem;

    margin-bottom: 40px;
}
.empty-state {
    height: 60vh;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 18px;
}
</style>
