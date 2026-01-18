<template>
  <q-page class="q-pa-md">
    <q-btn flat round icon="arrow_back" @click="$router.back()" class="q-mb-md">
      Povratak
    </q-btn>

    <q-card v-if="event">
      <q-img :src="event.slika" height="200px" />

      <q-card-section>
        <div class="text-h5">{{ event.naziv }}</div>
        <div class="text-subtitle2 text-grey">{{ event.lokacija }}</div>
        <div class="text-caption">{{ event.datum }}</div>
        <div class="text-caption text-grey">{{ event.udaljenost }}</div>
      </q-card-section>

      <q-card-section>
        <div class="text-body1">
          Opis događaja: {{ event.opis || 'Nema opisa' }}
        </div>
      </q-card-section>
    </q-card>

    <div v-else class="text-center q-mt-xl text-grey">
      Događaj nije pronađen
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const event = ref(null)

onMounted(async () => {
  const id = route.params.id
  try {
    const response = await axios.get('http://localhost:3000/api/prikazidogadaje')
    const ev = response.data.find(e => e.ID_dogadaja == id)
    if (ev) {
      event.value = {
        id: ev.ID_dogadaja,
        naziv: ev.Naziv_dogadaja,
        lokacija: ev.Lokacija_dogadaja,
        datum: ev.Datum_dogadaja,
        udaljenost: 'nepoznato',
        opis: ev.Opis_dogadaja,
        slika: ev.Slika_dogadaja
          ? `data:image/jpeg;base64,${Buffer.from(ev.Slika_dogadaja).toString('base64')}`
          : ''
      }
    }
  } catch (err) {
    console.error(err)
  }
})
</script>
