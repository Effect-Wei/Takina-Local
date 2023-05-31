<script setup>
import { onMounted, reactive } from "vue"
import { useRoute } from "vue-router"
import { useQuasar } from "quasar"
import VideoInfo from "components/VideoInfo.vue"

const TAKINA_API = "https://api.takina.one"

const $q = useQuasar()
const route = useRoute()
const state = reactive({
  loaded: false,
  videoId: null,
  taskId: route.params.taskId
})

onMounted(async () => {
  let resp = await fetch(`${TAKINA_API}/task/${state.taskId}/info`, {
    method: "GET"
  })
  let taskInfo = await resp.json()

  state.videoInfo = taskInfo.video_info
  $q.sessionStorage.set("videoInfo", state.videoInfo)
  state.videoId = taskInfo.video_info.bvid

  state.loaded = true
})
</script>

<template>
  <video-info
    v-if="state.loaded"
    :video-id="state.videoId"
    :task-id="state.taskId"
    :addons="['CheckTask']"
  />
</template>
