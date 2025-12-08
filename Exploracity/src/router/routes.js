const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue')},
      { path: '/dashboard', component: () => import('pages/DashBoard.vue')},
      { path: '/klackalica', component: () => import('pages/KlacKalica.vue')},
      { path: '/unospitanja', component: () => import('pages/UnosPitanjaPage.vue')}


    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
