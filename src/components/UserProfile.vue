<script setup>
import { useQuasar } from "quasar"
import { onMounted, reactive } from "vue"
import BiliUserLevelIcon from "./BiliUserLevelIcon.vue"

const $q = useQuasar()
const state = reactive({
  isHovered: false,
  isLoaded: false,
  isLogin: false,
  hoverTimeout: -1,
  userInfo: {},
  userStat: {},
  sessdata: ""
})
const DEFAULT_AVATAR = "https://i0.hdslb.com/bfs/face/member/noface.jpg"

function onMouseEnterAvatar() {
  state.hoverTimeout = setTimeout(() => {
    state.isHovered = true
  }, 200)
}

function onMouseLeaveAvatar() {
  clearTimeout(state.hoverTimeout)
}

function onMouseLeave() {
  state.isHovered = false
}

async function onLogout() {
  $q.cookies.remove("DedeUserID", { domain: "takina.one", path: "/" })
  $q.cookies.remove("SESSDATA", { domain: "takina.one", path: "/" })
  $q.cookies.remove("bili_jct", { domain: "takina.one", path: "/" })
  await initLoadUserInfo()
}

async function onSetCookie() {
  if (state.sessdata != "") {
    $q.cookies.remove("SESSDATA", { domain: "takina.one", path: "/" })
    document.cookie = `SESSDATA=${state.sessdata}; Expires=30; domain=takina.one; path=/`
    await initLoadUserInfo()
  }
}

async function initLoadUserInfo() {
  await fetch("https://api.takina.one/nav", {
    credentials: "include"
  }).then(async (resp) => {
    let userInfo = await resp.json()
    state.userInfo = userInfo.data
    state.isLogin = userInfo.data.isLogin
  })
  await fetch("https://api.takina.one/nav/stat", {
    credentials: "include"
  }).then(async (resp) => {
    let userStat = await resp.json()
    state.userStat = userStat.data
  })

  state.isLoaded = true
}

onMounted(async () => {
  await initLoadUserInfo()
})
</script>

<template>
  <div
    v-if="state.isLoaded"
    class="user-profile-container"
    @mouseleave="onMouseLeave()"
  >
    <q-avatar
      :class="{
        'user-avatar': true,
        'user-avatar--small': !state.isHovered,
        'user-avatar--large': state.isHovered
      }"
      size="85px"
      @mouseenter="onMouseEnterAvatar()"
      @mouseleave="onMouseLeaveAvatar()"
    >
      <q-img
        class="user-avatar__img"
        :src="
          (state.isLogin ? state.userInfo.face : DEFAULT_AVATAR) +
          '@128w_128h.webp'
        "
        loading="eager"
        referrerpolicy="no-referrer"
      />
    </q-avatar>

    <div
      v-if="state.isLogin"
      class="user-info-container"
    >
      <div
        :class="{
          'q-py-sm': true,
          'user-info': true,
          'user-info--dark': $q.dark.isActive,
          'user-info--show': state.isHovered,
          'user-info--hide': !state.isHovered
        }"
      >
        <span class="user-name column items-center justify-center">
          {{ state.userInfo.uname }}
        </span>

        <div class="user-info-content q-px-lg">
          <div class="user-level-area">
            <div class="row items-center justify-between">
              <div>
                <bili-user-level-icon
                  class="q-mr-sm"
                  :level="state.userInfo.level_info.current_level"
                />

                <span class="user-level__text">
                  {{
                    state.userInfo.level_info.current_level != 6
                      ? `${state.userInfo.level_info.current_exp} / ${state.userInfo.level_info.next_exp}`
                      : "28800 / 28800"
                  }}
                </span>
              </div>

              <div class="coins-item">
                <span class="coin-item__text q-mr-xs">硬币:</span>
                <span class="coin-item__num q-mr-sm">
                  {{ state.userInfo.money }}
                </span>
                <span class="coin-item__text q-mr-xs">B币:</span>
                <span class="coin-item__num">
                  {{ state.userInfo.wallet.bcoin_balance }}
                </span>
              </div>
            </div>

            <q-linear-progress
              class="user-level__exp-progress"
              :value="
                state.userInfo.level_info.current_level != 6
                  ? state.userInfo.level_info.current_exp /
                    state.userInfo.level_info.next_exp
                  : 1
              "
            />
          </div>

          <div class="counts-item q-px-lg q-mt-md flex justify-between">
            <div class="single-count-item column items-center">
              <div class="count-num">{{ state.userStat.following }}</div>
              <div class="count-text">关注</div>
            </div>
            <div class="single-count-item column items-center">
              <div class="count-num">{{ state.userStat.follower }}</div>
              <div class="count-text">粉丝</div>
            </div>
            <div class="single-count-item column items-center">
              <div class="count-num">{{ state.userStat.dynamic_count }}</div>
              <div class="count-text">动态</div>
            </div>
          </div>

          <q-separator spaced="sm" />

          <q-btn
            class="full-width"
            text-color="text2"
            unelevated
            @click.prevent="onLogout()"
          >
            <q-icon
              class="q-mr-sm"
              name="logout"
            />
            <span>退出登录</span>
          </q-btn>
        </div>
      </div>
    </div>

    <!----------------------------------------------------------------->

    <div
      v-if="!state.isLogin"
      class="user-info-container"
    >
      <div
        :class="{
          'q-py-sm': true,
          'user-info': true,
          'user-info--dark': $q.dark.isActive,
          'user-info--show': state.isHovered,
          'user-info--hide': !state.isHovered
        }"
      >
        <span
          class="user-name user-name--no-login column items-center justify-center"
        >
          还没有登录哦
        </span>

        <div class="user-info-content q-px-lg">
          <q-separator spaced />
          <q-input
            v-model="state.sessdata"
            label="SESSDATA"
            filled
            dense
          >
            <template #after>
              <q-btn
                icon="check"
                color="primary"
                @click="onSetCookie()"
              />
            </template>
          </q-input>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-profile-container {
  position: absolute;
  right: 74px;
}

.user-info {
  position: absolute;
  top: 74px;
  right: 0px;
  width: 300px;
  height: 170px;
  border: 1px solid;
  border-radius: 8px;
  border-color: rgba(0, 0, 0, 0.12);
  background: #ffffff;
  color: $grey-9;
}

.user-info--dark {
  border-color: rgba(255, 255, 255, 0.28);
  background: $dark-page;
  color: #ffffff;
}

.user-info-container {
  animation: infoInitFadeIn 0.4s both;
}

.user-name {
  height: 36px;
  max-width: 184px;
  margin-right: 114px;
  font-size: 24px;
}

.user-name--no-login {
  font-size: 20px;
}

.coins-item {
  font-size: 12px;
}

.coin-item__text {
  color: $text2;
}

.user-level__text {
  font-size: 12px;
}

.count-num {
  font-size: 18px;
  line-height: 14px;
}

.count-text {
  font-size: 12px;
  color: $text2;
}

.user-avatar {
  z-index: 2;
}

.user-avatar__img {
  animation: avatarInitFadeIn 0.35s both;
}

.user-avatar--small {
  animation: avatarFadeSmall 0.35s both;
}

.user-avatar--large {
  animation: avatarFadeLarge 0.35s both;
}

.user-info--show {
  animation: infoFadeIn 0.35s both;
}

.user-info--hide {
  animation: infoFadeOut 0.35s both;
}

@keyframes avatarInitFadeIn {
  0% {
    opacity: 0;
  }

  40% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes avatarFadeSmall {
  0% {
    transform: scale(1) translate(-30px, 30px);
  }

  100% {
    transform: scale(0.4);
  }
}

@keyframes avatarFadeLarge {
  0% {
    transform: scale(0.4);
  }

  100% {
    transform: scale(1) translate(-30px, 30px);
  }
}

@keyframes infoInitFadeIn {
  0% {
    opacity: 0;
  }

  99% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes infoFadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  100% {
    opacity: 1;
  }
}

@keyframes infoFadeOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
