<script setup>
import { computed, onMounted, reactive } from "vue"
import { useRoute } from "vue-router"
import MediaProcessor from "components/MediaProcessor.vue"
import StaffInfoMobile from "components/StaffInfoMobile.vue"

const TAKINA_API = "https://api.takina.one"

const route = useRoute()
const state = reactive({
  loaded: false,
  videoId: route.params.videoId,
  videoNotFound: false,
  videoInfo: {},
  folded: true,
  rotate: 0,
  descHeight: computed(() => {
    return document.getElementsByClassName("description")[0].offsetHeight
  })
})

function switchFold() {
  state.folded = !state.folded
  state.rotate += 180
}

onMounted(async () => {
  await fetch(`${TAKINA_API}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: state.videoId })
  })
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
    })
})
</script>

<template>
  <div v-if="state.loaded">
    <q-img
      class="cover q-mx-auto"
      :src="state.videoInfo.pic"
      :initial-ratio="1146 / 717"
      :width="state.videoNotFound ? '160px' : undefined"
      fit="contain"
      alt="Video cover"
      referrerpolicy="no-referrer"
    />

    <div class="video-info-wrapper full-width row">
      <staff-info-mobile
        v-if="state.videoNotFound === false"
        class="full-width"
        :video-info="state.videoInfo"
      />

      <div
        class="title-area full-width q-mt-sm"
        @click.prevent="switchFold"
      >
        <q-btn
          class="fold-switcher"
          icon="expand_more"
          size="2.25vmin"
          round
          unelevated
          :style="`transform: rotate(${state.rotate}deg);`"
        />
        <div class="title">
          {{ state.videoInfo.title }}
        </div>
        <div class="tname flex items-center">
          {{ state.videoInfo.tname }}
        </div>
      </div>

      <div
        class="desc-container"
        :style="
          state.folded
            ? 'max-height: 0px;'
            : `max-height: ${state.descHeight}px;`
        "
      >
        <div class="description">
          {{ state.videoInfo.desc }}
        </div>
      </div>

      <media-processor
        v-if="state.videoNotFound === false"
        class="task-creator full-width q-mt-sm"
        :video-info="state.videoInfo"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
a {
  text-decoration: none;
  color: #18191c;
}

.cover {
  display: block;
}

.video-info-wrapper {
  margin-top: 3vmin;
  padding: 0 3.5vmin 0 3.5vmin;
  max-width: 1280px;
}

.title {
  font-size: 4.5vmin;
  font-weight: 400;
  white-space: pre-wrap;
}

.tname {
  color: #9499a0;
  height: 5.5vmin;
  font-size: 2.5vmin;
  line-height: 5vmin;
}

.fold-switcher {
  margin: 0px 0;
  float: right;
  transition: transform 0.3s;
}

.desc-container {
  padding-top: 1vmin;
  transition: max-height 0.3s ease;
  overflow: hidden;
}

.description {
  color: #9499a0;
  white-space: pre-wrap;
  font-size: 3vmin;
  letter-spacing: 0;
  line-height: 5vmin;
}
</style>
