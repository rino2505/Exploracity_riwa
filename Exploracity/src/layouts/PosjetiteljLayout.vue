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

    <!-- HELP BUTTON - DONJI LIJEVI KUT -->
    <q-btn
      fab
      color="black"
      text-color="white"
      icon="help_outline"
      label="H"
      @click="downloadHelp"
      class="help-button"
      :loading="isDownloading"
    >
      <q-tooltip>Preuzmi pomoć (PDF)</q-tooltip>
    </q-btn>

  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'
import { Notify } from 'quasar'

const isDownloading = ref(false)

const downloadHelp = async () => {
  try {
    isDownloading.value = true
    
    // Pokušaj učitati PDF iz /public/upos.pdf
    const response = await fetch('/upos.pdf')
    
    if (!response.ok) {
      throw new Error('PDF nije pronađen')
    }
    
    const blob = await response.blob()
    
    // Kreiraj download link
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'upos.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
    
    Notify.create({ 
      type: 'positive', 
      message: 'PDF se preuzima...' 
    })
    
  } catch (err) {
    console.error('Greška pri preuzimanju PDF-a:', err)
    Notify.create({ 
      type: 'negative', 
      message: 'Nije moguće preuzeti PDF datoteku' 
    })
  } finally {
    isDownloading.value = false
  }
}

const router = useRouter()

const ime_korisnika = ref('')
const leftDrawerOpen = ref(false)

const linksList = [
  {
    title: 'Prikaz događaja',
    caption: 'Prikaz događaja',
    icon: 'location',
    link: '/pos/dogadaji'
  },
  {
    title: 'Unos pitanja za događaj',
    caption: 'Unos pitanja za događaj',
    icon: 'forum',
    link: '/pos/unospitanja'
  },
  {
    title: 'Stvaranje plana',
    caption: 'Stvaranje plana',
    icon: 'favorite',
    link: '/pos/unosplana'
  }
]

onMounted(() => {
  const stored = localStorage.getItem('token')
  const token = stored ? JSON.parse(stored) : null

  if (!token || token.uloga !== 'posjetitelj') {
    router.replace('/')
    return
  }

  ime_korisnika.value = token.ime || 'Korisnik'
})

const logout = () => {
  localStorage.removeItem('token')
  router.replace('/')
}

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.help-button {
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.help-button:hover {
  transform: scale(1.1);
}
</style>