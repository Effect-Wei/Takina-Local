<template>
  <q-page class="column">
    <div class="logo-area q-px-lg column items-center">
      <img
        class="logo q-mt-auto"
        src="https://cdn.jsdelivr.net/gh/quasarframework/quasar-art/Brand/Logo/RGB/Horizontal/Dark%20background/QUASAR_logo_horizontal_dark_background_RGB.png"
        alt="Logo"
        referrerpolicy="no-referrer"
      />
    </div>

    <form class="search-area q-mt-lg column flex-center">
      <q-input
        id="searchBox"
        v-model="state.searchUrl"
        class="search-box full-width"
        autofocus
        clearable
        rounded
        outlined
        :label="$t('text.searchBoxLabel')"
        :loading="state.loading"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <div class="button-area q-mt-lg flex flex-center">
        <q-btn
          class="q-mx-sm q-px-md"
          :label="$t('text.queryVideoInfo')"
          color="primary"
          type="submit"
          no-caps
          @click.prevent="onSubmit"
        />
        <q-btn
          class="q-mx-sm q-px-md"
          :label="$t('text.feelingLucky')"
          color="primary"
          type="submit"
          no-caps
          @click.prevent=""
        />
      </div>
    </form>
  </q-page>
</template>

<script setup>
import { reactive } from "vue"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"

const REGEX_AV_ID = /av\d+/
const REGEX_BV_ID = /BV\w+/

const $q = useQuasar()
const router = useRouter()
const state = reactive({
  searchUrl: null,
  videoId: null,
  loading: false
})

async function onSubmit() {
  let matchObj = REGEX_BV_ID.exec(state.searchUrl)
  if (matchObj == null) {
    matchObj = REGEX_AV_ID.exec(state.searchUrl)
  }
  if (matchObj == null) {
    $q.notify({
      type: "negative",
      message: "Wrong url!",
      progress: true,
      timeout: 1500
    })
    return
  }
  state.loading = true
  state.videoId = matchObj[0]
  router.push({ name: "info", params: { videoId: state.videoId } })
}
</script>

<style>
.search-box {
  max-width: 584px;
}

.logo {
  max-height: 92px;
  max-width: 100%;
}

.logo-area {
  min-height: 192px;
  max-height: 350px;
  height: calc(100% - 500px);
}

body,
html,
#q-app,
.q-layout,
.q-page-container,
.q-page {
  height: 100%;
}
</style>
