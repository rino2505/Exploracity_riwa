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
    title: 'Unos novih događaja',
    caption: 'Unos novih događaja',
    icon: 'favorite',
    link: '#/novidogadaj'
  },
   {
    title: 'Prikaz događaja',
    caption: 'Prikaz događaja',
    icon: 'favorite',
    link: '#/dogadaji'
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
