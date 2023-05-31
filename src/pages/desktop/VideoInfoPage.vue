<script setup>
import { reactive } from "vue"
import { useRoute } from "vue-router"
import VideoInfo from "components/VideoInfo.vue"

const route = useRoute()
const state = reactive({
  videoId: route.params.videoId
})
</script>

<template>
  <video-info
    :video-id="state.videoId"
    :addons="['CreateTask']"
  />
</template>
