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
          Exploracity (Administracijsko sučelje)
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
const leftDrawerOpen = ref(true)

const linksList = [
  {
    title: 'Odgovori na pitanja',
    caption: 'Odgovaranje na pitanja korisnika',
    icon: 'question_answer',
    link: '/admin/odgovori'
  },
  {
    title: 'Unos novih događaja',
    caption: 'Unos novih događaja',
    icon: 'favorite',
    link: '/admin/novidogadaj'
  },
  {
    title: 'Unos slika za događaj',
    caption: 'Unos slika za događaj',
    icon: 'image',
    link: '/admin/dogadajislike'
  }
]

onMounted(() => {
  // ✅ SIGURNO UČITAVANJE TOKENA
  const stored = localStorage.getItem('token')
  const token = stored ? JSON.parse(stored) : null

  // ❌ ako nema token → login
  if (!token) {
    router.replace('/')
    return
  }

  // ❌ ako nije admin → login
  if (token.uloga !== 'admin') {
    router.replace('/')
    return
  }

  // ✅ sve ok → prikaz imena
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