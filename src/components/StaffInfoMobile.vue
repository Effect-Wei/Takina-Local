<script setup>
import { computed } from "vue"
import { useQuasar } from "quasar"

const $q = useQuasar()
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
</script>

<template>
  <div class="staff-info-container">
    <div
      :class="{
        'q-px-md': true,
        'full-width': true,
        'staff-info-header': true,
        'staff-info-header-dark-bg': $q.dark.isActive
      }"
    >
      <span v-if="onlyOneStaff">{{ $t("text.creator") }}</span>
      <span v-if="!onlyOneStaff">{{ $t("text.creators") }}</span>
      <span class="total-staff">
        {{ props.videoInfo.total_staffs }} {{ $t("text.people") }}
      </span>
      <q-icon
        v-if="!onlyOneStaff"
        class="expand-icon"
        name="expand_more"
        size="xs"
      />
    </div>

    <div class="staff-container full-width row">
      <div
        v-for="(staff, index) in props.videoInfo.staff"
        :key="index"
        class="staff-card column items-center"
      >
        <a
          :href="`https://space.bilibili.com/${staff.mid}`"
          target="_blank"
        >
          <q-avatar
            class="q-mx-sm q-my-sm"
            size="10vmin"
          >
            <q-img
              :src="staff.face + '@96w_96h.webp'"
              loading="eager"
              referrerpolicy="no-referrer"
            />
          </q-avatar>
        </a>

        <a
          :class="{
            'staff-name': true,
            'text-white': $q.dark.isActive
          }"
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
</template>

<style scoped lang="scss">
a {
  text-decoration: none;
  color: #18191c;
}

.staff-info-header {
  margin-bottom: 4px;
  height: 10vmin;
  font-size: 3.5vmin;
  line-height: 10vmin;
  border-radius: 4px;
  background: $bg1;
}

.staff-info-header-dark-bg {
  background: $bg1-dark;
}

.expand-icon {
  margin: calc(5vmin - 9px) 0;
  float: right;
  transform: rotate(270deg);
}

.total-staff {
  margin-left: 5px;
  color: #9499a0;
}

.staff-container {
  flex-wrap: nowrap;
  overflow: auto;
  scrollbar-width: none;
}

.staff-container::-webkit-scrollbar {
  display: none;
}

.staff-card {
  flex: 0 0 20vmin;
  margin: 0 1vmin;
  overflow: hidden;
}

.staff-name {
  max-width: 100%;
  font-size: 3vmin;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.info-tag {
  font-size: 3vmin;
  color: #9499a0;
}
</style>
