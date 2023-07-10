<script setup>
import BiliLv from "assets/BiliLv.svg"

defineProps({
  level: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <span class="user-level-container">
    <span :style="`position: absolute; top: -${$props.level}em`">
      <img
        :alt="`LV${$props.level}`"
        style="height: 11em"
        :src="BiliLv"
      />
    </span>
  </span>
</template>

<style scoped>
.user-level-container {
  display: inline-block;
  height: 1em;
  width: 2.1em;
  line-height: 1;
  vertical-align: -0.16em;
  overflow: hidden;
  position: relative;
  pointer-events: none;
}
</style>
