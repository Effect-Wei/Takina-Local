<script setup>
import { onMounted, reactive, watch } from "vue"
import { useQuasar } from "quasar"

const $q = useQuasar()
const state = reactive({
  isAutoDarkActive: $q.dark.mode === "auto" ? true : false
})

function switchDarkMode() {
  $q.dark.toggle()
  $q.localStorage.set("darkMode", $q.dark.isActive)
}

function switchAutoDarkMode() {
  if (state.isAutoDarkActive === false) {
    $q.dark.set("auto")
    $q.localStorage.set("darkMode", "auto")
  } else if (state.isAutoDarkActive === true) {
    $q.dark.set($q.dark.isActive)
    $q.localStorage.set("darkMode", $q.dark.isActive)
  }
}

watch(
  () => $q.dark.mode,
  (mode) => {
    state.isAutoDarkActive = mode === "auto" ? true : false
  }
)

onMounted(() => {
  let darkMode = $q.localStorage.getItem("darkMode")
  if (darkMode === null) {
    darkMode = "auto"
  }
  $q.dark.set(darkMode)
})
</script>

<template>
  <q-fab
    direction="down"
    :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'"
    padding="8px"
    vertical-actions-align="right"
    flat
  >
    <q-list
      :class="{
        'mode-list': true,
        'rounded-borders': true,
        'text-dark': true,
        'mode-list-dark': $q.dark.isActive
      }"
      bordered
      padding
      dense
    >
      <q-item
        :clickable="!state.isAutoDarkActive"
        @click="switchDarkMode()"
      >
        <q-item-section no-wrap>
          <q-item-label>{{ $t("text.darkMode") }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle
            :model-value="$q.dark.isActive"
            :dark="$q.dark.isActive"
            :disable="state.isAutoDarkActive"
            @update:model-value="switchDarkMode()"
          />
        </q-item-section>
      </q-item>

      <q-item
        clickable
        @click="switchAutoDarkMode()"
      >
        <q-item-section no-wrap>
          <q-item-label>{{ $t("text.autoDarkMode") }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle
            :model-value="state.isAutoDarkActive"
            :dark="$q.dark.isActive"
            @update:model-value="switchAutoDarkMode()"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-fab>
</template>

<style scoped lang="scss">
.mode-list {
  min-width: 200px;
  background: #ffffff;
}

.mode-list-dark {
  background: $dark-page;
}
</style>
