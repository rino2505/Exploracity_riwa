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
  vrijeme: '',
  opis: '',
  slika: null,
})

async function spremiDogadaj() {
  try {
    const response = await fetch('http://localhost:3000/unosdogadaja', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        naziv: noviDogadaj.value.naziv,
        lokacija: noviDogadaj.value.lokacija,
        datum: noviDogadaj.value.datum,
        vrijeme: noviDogadaj.value.vrijeme,
        opis: noviDogadaj.value.opis,
        slika: noviDogadaj.value.slika // može biti null ili tekst
      })
    });

    const data = await response.json();
    console.log("Odgovor backend-a:", data);

    // dodaj lokalno u array
    dogadaji.value.push({ ...noviDogadaj.value, id: data.id });

    odustani();
    alert("Događaj uspješno spremljen!");

  } catch (err) {
    console.error("Greška pri slanju:", err);
    alert("Greška pri spremanju događaja! Pogledaj konzolu.");
  }
}

function odustani() {
  noviDogadaj.value = {
    id: 0,
    naziv: '',
    lokacija: '',
    datum: '',
    vrijeme: '',
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