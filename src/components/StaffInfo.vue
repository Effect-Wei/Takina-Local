<script setup>
import { computed, reactive } from "vue"
import { useQuasar } from "quasar"

const $q = useQuasar()
const state = reactive({
  folded: true,
  rotate: 0
})
const props = defineProps({
  videoInfo: {
    type: Object,
    default() {
      return {}
    }
  }
})
const onlyOneStaff = computed(() => {
  return props.videoInfo.total_staffs === 1 ? true : false
})

function switchFold() {
  state.folded = !state.folded
  state.rotate += 180
}
</script>

<template>
  <div class="staff-info-container">
    <div
      :class="{
        'q-px-md': true,
        'staff-info-header': true,
        'cursor-pointer': props.videoInfo.total_staffs > 4,
        'staff-info-header-dark-bg': $q.dark.isActive
      }"
      @click.prevent="switchFold"
    >
      <span v-if="onlyOneStaff">{{ $t("text.creator") }}</span>
      <span v-if="!onlyOneStaff">{{ $t("text.creators") }}</span>
      <span class="total-staff">
        {{ props.videoInfo.total_staffs }} {{ $t("text.people") }}
      </span>
      <q-btn
        v-if="props.videoInfo.total_staffs > 4"
        class="fold-switcher"
        icon="expand_more"
        size="sm"
        round
        unelevated
        :style="`transform: rotate(${state.rotate}deg);`"
      />
    </div>

    <div
      class="staff-container q-mt-xs"
      :style="
        state.folded
          ? 'max-height: 208px;'
          : `max-height: ${props.videoInfo.total_staffs * 52}px;`
      "
    >
      <div
        v-for="(staff, index) in props.videoInfo.staff"
        :key="index"
        class="staff-card row items-center self-start"
      >
        <a
          :href="`https://space.bilibili.com/${staff.mid}`"
          target="_blank"
        >
          <q-avatar
            class="q-mx-sm q-my-xs"
            size="44px"
          >
            <q-img
              :src="staff.face + '@48w_48h.webp'"
              loading="eager"
              referrerpolicy="no-referrer"
            />
          </q-avatar>
        </a>

        <div class="column flex-center">
          <div class="staff-info q-mr-sm">
            <a
              :class="{ 'text-white': $q.dark.isActive }"
              :href="`https://space.bilibili.com/${staff.mid}`"
              target="_blank"
            >
              {{ staff.name }}
            </a>
            <div class="info-tag">
              {{ staff.title }}
            </div>
          </div>
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

.staff-info-header {
  width: 100%;
  height: 44px;
  line-height: 44px;
  border-radius: 4px;
  background: $bg1;
}

.staff-info-header-dark-bg {
  background: $bg1-dark;
}

.fold-switcher {
  margin: 7px 0;
  float: right;
  transition: transform 0.3s;
}

.total-staff {
  margin-left: 5px;
  color: #9499a0;
}

.staff-container {
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.staff-info {
  font-size: 13px;
}

.info-tag {
  font-size: 13px;
  color: #9499a0;
}
</style>
