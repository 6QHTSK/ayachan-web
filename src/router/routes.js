const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {path: "", component: () => import("src/pages")},
      {path: "tempo", component: () => import("pages/tempo.vue")},
      // {path: "search", component: () => import("pages/search.vue")},
      {path: "my-chart", component: () => import("pages/myChart.vue")},
      {path: "map-analyze", component: () => import("pages/diffAnalysis.vue")},
      {path: "sonolus-upload", component: () => import("pages/sonolusUpload.vue")}
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/error404.vue"),
  },
];

export default routes;
