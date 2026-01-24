const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' }, 
      
      { path: 'login', component: () => import('pages/IndexPage.vue') },
  
      { path: 'unospitanja', component: () => import('pages/UnosPitanjaPage.vue') },
      { path: 'dogadaji', component: () => import('pages/PrikazDogadajaPage.vue') },
      { path: '/dogadajislikeuser', component: () => import('pages/DogadajiPageUser.vue') },
      { path: 'unoskomentara', component: () => import('pages/UnosKomentaraPage.vue') }

    ],
  },


  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [

      { path: 'login', component: () => import('pages/IndexPage.vue') }, 
      { path: 'odgovori', component: () => import('pages/OdgovoriPage.vue') },
      { path: 'novidogadaj', component: () => import('pages/UnosDogadajaPage.vue') },
      { path: 'dogadajislike', component: () => import('pages/DogadajiPage.vue') },
    ],
  },

 
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes