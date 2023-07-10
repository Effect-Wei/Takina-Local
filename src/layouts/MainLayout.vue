<template>
  <q-layout view="hhh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title
          class="cursor-pointer text-white"
          shrink
          @click="router.push({ name: 'index' })"
        >
          <q-avatar>
            <img
              src="https://jsd.assets.moe/gh/Effect-Wei/for-jsDelivr@1.8/avatar-128.jpg"
            />
          </q-avatar>
          Takina
        </q-toolbar-title>

        <q-space />

        <user-profile />
        <dark-mode-switcher />
        <locale-switcher />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view class="q-py-md" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from "vue-router"
import DarkModeSwitcher from "components/DarkModeSwitcher.vue"
import LocaleSwitcher from "components/LocaleSwitcher.vue"
import UserProfile from "components/UserProfile.vue"

const router = useRouter()
</script>

<style lang="scss">
.text-bilipink {
  color: $bilipink !important;
}

.bg-bilipink {
  background: $bilipink !important;
}

.text-bg1 {
  color: $bg1 !important;
}

.bg-bg1 {
  background: $bg1 !important;
}

.text-bg1-dark {
  color: $bg1-dark !important;
}

.bg-bg1-dark {
  background: $bg1-dark !important;
}

.text-text2 {
  color: $text2 !important;
}

.bg-text2 {
  background: $text2 !important;
}
</style>
