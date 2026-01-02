const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue')},
      { path: '/unospitanja', component: () => import('pages/UnosPitanjaPage.vue')},
      { path: '/novidogadaj', component: () => import('pages/UnosDogadajaPage.vue')},
      { path: '/dogadaji', component: () => import('pages/PrikazDogadajaPage.vue')}
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
