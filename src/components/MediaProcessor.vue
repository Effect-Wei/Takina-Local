<script setup>
import { createFFmpeg } from "@ffmpeg/ffmpeg"
import { onMounted, reactive } from "vue"
import { useQuasar } from "quasar"
const $q = useQuasar()
const state = reactive({
  downloadType: 3,
  audioQuality: 0,
  videoQuality: 0,
  audioQualityOptions: [],
  videoQualityOptions: [],
  msg: "",
  loaded: false,
  indeterminate: false,
  progress: 0,
  previousDownloadConfig: {
    downloadType: null,
    audioQuality: null,
    videoQuality: null
  },
  mediaExportLink: document.createElement("a")
})
const props = defineProps({
  videoInfo: {
    type: Object,
    default() {
      return {}
    }
  }
})
const ffmpeg = createFFmpeg({
  log: true,
  progress: ({ ratio }) => {
    state.progress = 100 * ratio
  },
  corePath:
    "https://cdnjs.assets.moe/ajax/libs/ffmpeg-core/0.11.0/ffmpeg-core.js"
})
const quality = {
  video: {
    6: "240P 极速",
    16: "360P 流畅",
    32: "480P 清晰",
    64: "720P 高清",
    74: "720P60 高帧率",
    80: "1080P 高清",
    112: "1080P+ 高码率",
    116: "1080P60 高帧率",
    120: "4K 超清",
    125: "HDR 真彩色",
    126: "杜比视界",
    127: "8K 超高清"
  },
  audio: {
    30216: "64K",
    30232: "132K",
    30280: "192K",
    30250: "杜比全景声",
    30251: "Hi-Res无损"
  },
  codec: {
    7: "AVC",
    12: "HEVC",
    13: "AV1"
  }
}

async function run() {
  if (
    state.downloadType === state.previousDownloadConfig.downloadType &&
    state.audioQuality === state.previousDownloadConfig.audioQuality &&
    state.videoQuality === state.previousDownloadConfig.videoQuality
  ) {
    state.mediaExportLink.click()
    return
  }

  state.previousDownloadConfig = {
    downloadType: state.downloadType,
    audioQuality: state.audioQuality,
    videoQuality: state.videoQuality
  }

  await fetchMedia()
  await transcode()
  await exportMedia()
}

async function fetchMedia() {
  state.msg = "Fetching media..."
  state.indeterminate = true
  let promises = [null, null]

  if ((state.downloadType & 1) === 1) {
    promises[0] = fetch("https://api.takina.one/fetch", {
      method: "POST",
      body: JSON.stringify({
        url: props.videoInfo.dash.video[state.videoQuality].baseUrl
      })
    })
  }

  if ((state.downloadType & 2) === 2) {
    promises[1] = fetch("https://api.takina.one/fetch", {
      method: "POST",
      body: JSON.stringify({
        url: props.videoInfo.dash.audio[state.audioQuality].baseUrl
      })
    })
  }

  await Promise.all(promises).then(async (result) => {
    if ((state.downloadType & 1) === 1) {
      ffmpeg.FS(
        "writeFile",
        "video.m4v",
        await result[0].blob().then(async (blob) => {
          return new Uint8Array(await blob.arrayBuffer())
        })
      )
    }

    if ((state.downloadType & 2) === 2) {
      ffmpeg.FS(
        "writeFile",
        "audio.m4a",
        await result[1].blob().then(async (blob) => {
          return new Uint8Array(await blob.arrayBuffer())
        })
      )
    }
  })

  promises = null
}

async function transcode() {
  state.msg = "Transcoding..."
  state.indeterminate = false

  if (state.downloadType == 1) {
    await ffmpeg.run(
      "-i",
      "video.m4v",
      "-vcodec",
      "copy",
      "-strict",
      "unofficial",
      "video.mp4"
    )
  } else if (state.downloadType == 2) {
    await ffmpeg.run(
      "-i",
      "audio.m4a",
      "-acodec",
      "libmp3lame",
      "-strict",
      "unofficial",
      "audio.mp3"
    )
  } else {
    await ffmpeg.run(
      "-i",
      "video.m4v",
      "-i",
      "audio.m4a",
      "-vcodec",
      "copy",
      "-acodec",
      "copy",
      "-strict",
      "unofficial",
      "video.mp4"
    )
  }

  state.msg = "Completed!"
}

async function exportMedia() {
  const video = props.videoInfo.dash.video[state.videoQuality]
  const audio = props.videoInfo.dash.audio[state.audioQuality]
  const videoQuality = quality.video[video.id]
  const audioQuality = quality.audio[audio.id]
  const codec = quality.codec[video.codecid]
  const data = ffmpeg.FS(
    "readFile",
    state.downloadType == 2 ? "audio.mp3" : "video.mp4"
  )

  state.mediaExportLink.download =
    state.downloadType == 2
      ? `${props.videoInfo.title} - ${audioQuality}`
      : `${props.videoInfo.title} - ${videoQuality} [${codec}] ${audioQuality}`
  state.mediaExportLink.href = URL.createObjectURL(
    new Blob([data.buffer], {
      type: state.downloadType == 2 ? "audio/mpeg" : "video/mp4"
    })
  )

  state.mediaExportLink.click()
}

onMounted(async () => {
  state.msg = "Loading Takina components..."
  state.indeterminate = true

  for (let i = 0; i < props.videoInfo.dash.video.length; i++) {
    const video = props.videoInfo.dash.video[i]
    let option = {
      label: `${quality.video[video.id]} [${quality.codec[video.codecid]}]`,
      value: i
    }
    state.videoQualityOptions.push(option)
  }
  for (let i = 0; i < props.videoInfo.dash.audio.length; i++) {
    const audio = props.videoInfo.dash.audio[i]
    let option = {
      label: `${quality.audio[audio.id]}`,
      value: i
    }
    state.audioQualityOptions.push(option)
  }
  state.mediaExportLink.style.display = "none"
  document.body.appendChild(state.mediaExportLink)

  // eslint-disable-next-line prettier/prettier
  await ffmpeg
    .load()
    .then(() => {
      state.msg = "Waiting for your command~"
    })
    .catch((error) => {
      state.msg = "Loading failed, please refresh this page."
      console.error(error)
    })

  state.progress = 100
  state.indeterminate = false
  state.loaded = true
})
</script>

<template>
  <form class="full-width">
    <q-select
      v-model="state.videoQuality"
      class="video-quality-selector q-my-xs"
      :options="state.videoQualityOptions"
      :bg-color="$q.dark.isActive ? 'bg1-dark' : 'bg1'"
      :label="$t('text.videoQuality')"
      emit-value
      map-options
      filled
      dense
      options-dense
    />

    <q-select
      v-model="state.audioQuality"
      class="audio-quality-selector q-my-xs"
      :options="state.audioQualityOptions"
      :bg-color="$q.dark.isActive ? 'bg1-dark' : 'bg1'"
      :label="$t('text.audioQuality')"
      square
      emit-value
      map-options
      filled
      dense
      options-dense
    />

    <div
      :class="{
        'dl-type-wrapper': true,
        'dl-type-wrapper-dark-bg': $q.dark.isActive,
        'q-mt-xs': true,
        'q-mb-sm': true
      }"
    >
      <span
        :class="{
          'dl-type': true,
          'dl-type-dark-bg': $q.dark.isActive
        }"
      >
        {{ $t("text.dlType") }}
      </span>
      <q-option-group
        v-model="state.downloadType"
        class="dl-type-selector"
        inline
        :options="[
          {
            label: $t('text.bothAandV'),
            value: 3
          },
          {
            label: $t('text.audioOnly'),
            value: 2
          },
          {
            label: $t('text.videoOnly'),
            value: 1
          }
        ]"
      />
    </div>

    <q-btn
      class="submit-button q-mb-sm"
      :label="$t('text.download')"
      :disable="!state.loaded"
      color="primary"
      @click.prevent="run()"
    />
    <q-btn
      class="bili-button q-mb-sm"
      no-caps
      color="bilipink"
      :label="$t('text.watchOnBili')"
      :href="`https://www.bilibili.com/video/${props.videoInfo.bvid}`"
      target="_blank"
    />
  </form>

  <div
    :class="{
      flex: true,
      'items-center': true,
      'q-px-md': true,
      'full-width': true,
      'progress-bar': true,
      'progress-bar-dark-bg': $q.dark.isActive
    }"
  >
    <q-circular-progress
      :indeterminate="state.indeterminate"
      :value="state.progress"
      class="q-mr-sm"
      color="primary"
      size="48px"
      rounded
    />
    <span class="status-msg">{{ state.msg }}</span>
  </div>
</template>

<style lang="scss">
.dl-type-wrapper {
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  background: $bg1;
}

.dl-type-wrapper-dark-bg {
  background: $bg1-dark;
}

.dl-type {
  margin-left: 12px;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.6);
}

.dl-type-dark-bg {
  color: rgba(255, 255, 255, 0.7);
}

.dl-type-selector {
  margin-top: -10px;
}

.progress-bar {
  height: 80px;
  border-radius: 4px;
  background: $bg1;
}

.progress-bar-dark-bg {
  background: $bg1-dark;
}

.submit-button {
  width: 45%;
  border-radius: 4px;
}

.status-msg {
  width: calc(100% - 56px);
}

.bili-button {
  margin-left: 5%;
  width: 50%;
  border-radius: 4px;
}
</style>
