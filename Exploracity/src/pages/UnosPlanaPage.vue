<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 600px; margin: auto;">

      <h4>Unos plana izlaska</h4>

      <!-- ODABIR DOGAĐAJA -->
      <q-select
        v-model="noviPlan.idDogadaja"
        :options="dogadaji"
        option-label="Naziv_dogadaja"
        option-value="ID_dogadaja"
        emit-value
        map-options
        label="Odaberi događaj"
        outlined
      />

      <!-- BILJEŠKA -->
      <q-input
        v-model="noviPlan.biljeska"
        label="Bilješka"
        type="textarea"
        outlined
      />

      <!-- BUTTONI -->
      <div class="row q-gutter-sm justify-center">
        <q-btn label="Spremi" color="primary" @click="spremiPlan" />
        <q-btn label="Odustani" color="negative" flat @click="odustani" />
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const dogadaji = ref([])

const noviPlan = ref({
  idDogadaja: null,
  biljeska: ''
})

// UCITAJ DOGAĐAJE
async function ucitajDogadaje() {
  try {
    const response = await fetch('http://localhost:3000/api/prikazidogadaje')
    const data = await response.json()
    dogadaji.value = data
  } catch (err) {
    console.error("Greška pri dohvaćanju događaja:", err)
  }
}

// SPREMI PLAN
async function spremiPlan() {
  try {
    const token = JSON.parse(localStorage.getItem('token'))

    if (!noviPlan.value.idDogadaja) {
      alert("Odaberi događaj!")
      return
    }

    const response = await fetch('http://localhost:3000/pos/unosplana', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idDogadaja: noviPlan.value.idDogadaja,
        idPosjetitelja: token.ID_posjetitelja,
        biljeska: noviPlan.value.biljeska
      })
    })

    const data = await response.json()
    console.log("Odgovor backend-a:", data)

    alert("Plan uspješno spremljen!")

    odustani()

  } catch (err) {
    console.error("Greška pri slanju:", err)
    alert("Greška pri spremanju plana!")
  }
}

// RESET
function odustani() {
  noviPlan.value = {
    idDogadaja: null,
    biljeska: ''
  }
}

onMounted(() => {
  ucitajDogadaje()
})
</script>

<style scoped>
h4 {
  text-align: center;
}
</style>