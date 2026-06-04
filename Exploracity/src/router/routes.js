const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { path: 'login', component: () => import('pages/IndexPage.vue') }
    ]
  },

  {
    path: '/pos',
    component: () => import('layouts/PosjetiteljLayout.vue'), 
    children: [
      { path: 'dogadaji', component: () => import('pages/PrikazDogadajaPage.vue') },
      { path: 'unospitanja', component: () => import('pages/UnosPitanjaPage.vue') },
      { path: 'dogadajislikeuser', component: () => import('pages/DogadajiPageUser.vue') },
      { path: 'unoskomentara', component: () => import('pages/UnosKomentaraPage.vue') },
      { path: 'unosplana', component: () => import('pages/UnosPlanaPage.vue') },
      { path: 'pregledplana', component: () => import('pages/PregledPlanovaPage.vue') }
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: 'odgovori-komentari', component: () => import('pages/OdgovoriNaKomentarePage.vue') },
      { path: 'odgovori', component: () => import('pages/OdgovoriPage.vue') },
      { path: 'novidogadaj', component: () => import('pages/UnosDogadajaPage.vue') },
      { path: 'dogadajislike', component: () => import('pages/DogadajiPage.vue') }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes