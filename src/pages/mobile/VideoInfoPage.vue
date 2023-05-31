<script setup>
import { reactive } from "vue"
import { useRoute } from "vue-router"
import VideoInfoMobile from "components/VideoInfoMobile.vue"

const route = useRoute()
const state = reactive({
  videoId: route.params.videoId
})
</script>

<template>
  <video-info-mobile
    :video-id="state.videoId"
    :addons="['CreateTask']"
  />
</template>
