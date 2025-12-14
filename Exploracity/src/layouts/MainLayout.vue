<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-btn icon="menu" color="black" flat aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="row items-center">
          <img class="q-ma-md"
            alt="Quasar logo"
            src="~assets/exploracity-horizontal-logo.svg"
            style="width: 200px; height: 40px"
          />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Knjižnica početno',
    caption: 'Knjižnica početno',
    icon: 'home',
    link: '#/',
  },
  {
    title: 'Knjižnica - popis knjiga',
    caption: 'KnjiPopis knjiga u knjižnici',
    icon: 'library_books',
    link: '#/PopisKnjiga',
  },
  {
    title: 'Knjižnica - nove knjige',
    caption: 'Nove knjige u knjižnici ',
    icon: 'book',
    link: '#/noveKnjige',
  },
  {
    title: 'Pretraživanje',
    caption: 'Pretraživanje',
    icon: 'pageview',
    link: '#/pretrazivanje',
  },
  {
    title: 'Lokacija',
    caption: 'Lokacija',
    icon: 'location_on',
    link: '#/lokacija',
  },
  {
    title: 'Login',
    caption: 'Login',
    icon: 'login',
    link: '#/login',
  },
  {
    title: 'Registracija',
    caption: 'Registracija',
    icon: 'person_add',
    link: '#/registracija',
  },
  {
    title: 'GitHub Knjiznica',
    caption: 'GitHub Knjiznica projekt',
    icon: 'folder_shared',
    link: 'https://github.com/akozul/Knjiznica.git',
  },
  {
    title: 'Veleučilište u Rijeci',
    caption: 'Stranica Veleučilišta u Rijeci',
    icon: 'import_contacts',
    link: 'https://veleri.hr'
  },
  {
    title: 'Unos novih knjiga',
    caption: 'Unos novih knjiga',
    icon: 'favorite',
    link: '#/unosnovihknjiga'
  },
    {
    title: 'Unos pitanja za događaj',
    caption: 'Unos pitanja za događaj',
    icon: 'favorite',
    link: '#/unospitanja'
  },

]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
