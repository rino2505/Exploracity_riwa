<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white">        
      </q-toolbar>
    </q-header>

   
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
import { ref } from 'vue'
import { Notify } from 'quasar'

const isDownloading = ref(false)

const downloadHelp = async () => {
  try {
    isDownloading.value = true
    
    // Pokušaj učitati PDF iz /public/helpplaceholder.pdf
    const response = await fetch('/helpplaceholder.pdf')
    
    if (!response.ok) {
      throw new Error('PDF nije pronađen')
    }
    
    const blob = await response.blob()
    
    // Kreiraj download link
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'helpplaceholder.pdf'
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