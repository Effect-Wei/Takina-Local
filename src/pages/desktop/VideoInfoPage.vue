<script setup>
import { onMounted, reactive } from "vue"
import { useRoute } from "vue-router"
import { useQuasar } from "quasar"
import MediaProcessor from "components/MediaProcessor.vue"
import StaffInfo from "components/StaffInfo.vue"

const TAKINA_API = "https://api.takina.one"

const $q = useQuasar()
const route = useRoute()
const state = reactive({
  loaded: false,
  videoId: route.params.videoId,
  videoNotFound: false,
  videoInfo: {}
})

onMounted(async () => {
  $q.loading.show({ delay: 500 })

  await fetch(`${TAKINA_API}/video/${state.videoId}`)
    .then(async (resp) => {
      if (resp.ok) {
        return resp.json()
      } else {
        state.videoNotFound = true
        return {
          video_info: {
            title: "啊叻？视频不见了？",
            tname: "那分区自然也不知道了吧",
            pic: "https://s1.hdslb.com/bfs/static/jinkela/video/asserts/no_video.png",
            desc: "所以简介也没有啦!"
          }
        }
      }
    })
    .then(async (json) => {
      state.videoInfo = json.video_info
      let coverUrl = new URL(state.videoInfo.pic)
      coverUrl.protocol = "https:"
      state.videoInfo.pic = coverUrl.toString()

      state.loaded = true
      $q.loading.hide()
    })
})
</script>

<template>
  <q-page
    v-if="state.loaded"
    class="video-info-wrapper row justify-center items-start"
  >
    <div class="cover-area col">
      <q-img
        class="cover"
        :src="state.videoInfo.pic"
        :initial-ratio="1146 / 717"
        fit="contain"
        alt="Video cover"
        referrerpolicy="no-referrer"
      />

      <div class="video-info-container q-mt-md q-px-sm">
        <div class="title text-weight-medium">
          {{ state.videoInfo.title }}
        </div>
        <div class="tname flex items-center">
          {{ state.videoInfo.tname }}
        </div>

        <q-separator
          spaced="lg"
          :dark="$q.dark.isActive"
        />

        <div class="description q-px-sm">
          {{ state.videoInfo.desc }}
        </div>
      </div>
    </div>

    <div
      v-if="state.videoNotFound === false"
      class="right-container column col-auto q-ml-lg"
    >
      <staff-info :video-info="state.videoInfo" />
      <media-processor :video-info="state.videoInfo" />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
a {
  text-decoration: none;
  color: #18191c;
}

.video-info-wrapper {
  margin: 0 auto;
  width: 80%;
  max-width: 1536px;
}

.cover-area {
  max-width: 50%;
}

.title {
  max-width: 100%;
  font-size: 22px;
  line-height: 34px;
  white-space: pre-wrap;
}

.tname {
  color: #9499a0;
  height: 20px;
  font-size: 13px;
  line-height: 18px;
}

.description {
  white-space: pre-wrap;
  font-size: 16px;
  letter-spacing: 0;
  line-height: 26px;
  overflow: hidden;
}

.right-container {
  min-width: 300px;
  max-width: 300px;
}
</style>
