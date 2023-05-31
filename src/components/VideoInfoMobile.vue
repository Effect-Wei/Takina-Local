<script setup>
import { computed, onMounted, reactive } from "vue"
import { useQuasar } from "quasar"
import MediaProcessor from "./MediaProcessor.vue"
import StaffInfoMobile from "./StaffInfoMobile.vue"

const TAKINA_API = "https://api.takina.one/search"

const $q = useQuasar()
const state = reactive({
  loaded: false,
  videoInfo: $q.sessionStorage.getItem("videoInfo"),
  folded: true,
  rotate: 0,
  descHeight: computed(() => {
    return document.getElementsByClassName("description")[0].offsetHeight
  })
})
const props = defineProps({
  videoId: {
    type: String,
    default: ""
  },
  taskId: {
    type: String,
    default: ""
  },
  addons: {
    type: Array,
    default() {
      return []
    }
  }
})

function switchFold() {
  state.folded = !state.folded
  state.rotate += 180
}

onMounted(async () => {
  if (state.videoInfo != null && state.videoInfo.bvid === props.videoId) {
    state.loaded = true
    return
  }

  let resp = await fetch(TAKINA_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: props.videoId })
  })
  let respJson = await resp.json()

  state.videoInfo = respJson.video_info
  state.loaded = true
  $q.sessionStorage.set("videoInfo", state.videoInfo)
})
</script>

<template>
  <div v-if="state.loaded">
    <q-img
      class="cover"
      :src="state.videoInfo.pic"
      :initial-ratio="1146 / 717"
      fit="contain"
      alt="Video cover"
      referrerpolicy="no-referrer"
    />

    <div class="video-info-wrapper full-width row">
      <staff-info-mobile
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

      <div class="tools-list full-width q-mt-sm">
        <div class="tools-list">
          <media-processor
            class="task-creator"
            :video-info="state.videoInfo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
a {
  text-decoration: none;
  color: #18191c;
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
