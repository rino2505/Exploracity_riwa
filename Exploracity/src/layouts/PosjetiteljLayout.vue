<template>
  <q-layout view="Lhh Lpr fFf">

    <q-header elevated class="bg-black text-white">
      <q-toolbar>

        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Exploracity (Posjetiteljsko sučelje)
        </q-toolbar-title>

        <q-space />

        <div class="q-mr-md">
          Korisnik: <strong>{{ ime_korisnika }}</strong>
        </div>

        <q-btn
          flat
          round
          dense
          icon="logout"
          @click="logout"
        >
          <q-tooltip>Odjava</q-tooltip>
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="bg-grey-2"
    >
      <q-list>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'

const router = useRouter()

const ime_korisnika = ref('')
const leftDrawerOpen = ref(false)
const linksList = [
   {
    title: 'Prikaz događaja',
    caption: 'Prikaz događaja',
    icon: 'favorite',
    link: '/pos/dogadaji'
  },
    {
    title: 'Unos pitanja za događaj',
    caption: 'Unos pitanja za događaj',
    icon: 'forum',
    link: '/pos/unospitanja'
  },
  {
    title: 'Unos slika za događaj korisnika',
    caption: 'Unos slika za događaj korisnika',
    icon: 'image',
    link: '/pos/dogadajislikeuser'
  },
  {
    title: 'Unos komentara',
    caption: 'Unos komentara',
    icon: 'comment',
    link: '/pos/unoskomentara'
  }

]


onMounted(() => {
  const stored = localStorage.getItem('token')
  const token = stored ? JSON.parse(stored) : null

  if (!token) {
    router.replace('/')
    return
  }

  if (token.uloga !== 'posjetitelj') {
    router.replace('/')
    return
  }

  ime_korisnika.value = token.ime || token.korime || 'Korisnik'
})

const logout = () => {
  localStorage.removeItem('token')
  router.replace('/')
}

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
