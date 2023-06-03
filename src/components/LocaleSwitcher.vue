<script setup>
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"

const $q = useQuasar()
const i18n = useI18n({ useScope: "global" })

function switchLocale(targetLocale) {
  i18n.locale.value = targetLocale
  $q.localStorage.set("language", targetLocale)
}

onMounted(() => {
  let targetLocale = $q.localStorage.getItem("language")
  if (targetLocale === null) {
    targetLocale = $q.lang.getLocale()
  }
  switchLocale(targetLocale)
})
</script>

<template>
  <q-fab
    direction="down"
    icon="translate"
    padding="10px"
    vertical-actions-align="right"
    flat
  >
    <q-list
      :class="{
        'locale-list': true,
        'rounded-borders': true,
        'text-dark': true,
        'locale-list-dark': $q.dark.isActive
      }"
      bordered
      padding
      dense
    >
      <q-item
        v-for="(targetLocale, index) in i18n.availableLocales"
        :key="index"
        clickable
        @click="switchLocale(targetLocale)"
      >
        <q-item-section>
          <span v-t="{ path: 'metadata.lang', locale: targetLocale }"></span>
        </q-item-section>
      </q-item>
    </q-list>
  </q-fab>
</template>

<style scoped lang="scss">
.locale-list {
  min-width: 128px;
  background: #ffffff;
}

.locale-list-dark {
  background: $dark-page;
}
</style>
