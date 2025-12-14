<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 600px; margin: auto;">

      <h4>Unos novog događaja</h4>

      <q-input v-model="noviDogadaj.naziv" label="Naziv" outlined />
      <q-input v-model="noviDogadaj.lokacija" label="Lokacija" outlined />
      <q-input v-model="noviDogadaj.datum" label="Datum događaja" outlined />
      <q-input v-model="noviDogadaj.vrijeme" label="Vrijeme događaja" outlined />
      <q-input v-model="noviDogadaj.opis" label="Opis" type="textarea" outlined />

      <q-file
        v-model="noviDogadaj.slika"
        label="Odaberi sliku"
        accept="image/*"
        filled
        clearable
      />

      

      <div class="row q-gutter-sm justify-center">
        <q-btn label="Spremi" color="primary" @click="spremiDogadaj" />
        <q-btn label="Odustani" color="negative" flat @click="odustani" />
      </div>

      <q-separator spaced />

    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const dogadaji = ref([])


const noviDogadaj = ref({
  id: 0,
  naziv: '',
  lokacija: '',
  datum: '',
  vrijeme:'',
  opis:'',
  slika: null,
})

function spremiDogadaj() {
  const noviId = dogadaji.value.length + 1
  const kopija = { ...noviDogadaj.value, id: noviId }

  dogadaji.value.push(kopija)
  odustani()
}

function odustani() {
  noviDogadaj.value = {
    id: 0,
    naslov: '',
    autor: '',
    opis: '',
    slika: null,
  }
}
</script>

<style scoped>
h4 {
  text-align: center;
}
</style>