const desktop = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "index",
        component: () => import("pages/desktop/IndexPage.vue")
      },
      {
        path: "video/:videoId",
        name: "info",
        component: () => import("pages/desktop/VideoInfoPage.vue")
      }
    ]
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/desktop/ErrorNotFound.vue")
  }
]

const mobile = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "index",
        component: () => import("pages/mobile/IndexPage.vue")
      },
      {
        path: "video/:videoId",
        name: "info",
        component: () => import("pages/mobile/VideoInfoPage.vue")
      }
    ]
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/mobile/ErrorNotFound.vue")
  }
]

let routes = []

if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
  routes = mobile
} else {
  routes = desktop
}

export default routes
