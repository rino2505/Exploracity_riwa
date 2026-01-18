<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Događaji u blizini</div>

    <div v-if="events.length === 0" class="text-center text-grey q-mt-xl">
      Nema događaja u blizini
    </div>

    <q-card
      v-for="event in events"
      :key="event.id"
      class="q-mb-md"
      clickable
      @click="$router.push(`/dogadaji/${event.id}`)"
    >
      <q-img :src="event.slika" height="160px" />

      <q-card-section>
        <div class="text-h6">{{ event.naziv }}</div>
        <div class="text-caption">{{ event.lokacija }} · {{ event.datum }}</div>
        <div class="text-caption text-grey">{{ event.udaljenost }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const events = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/prikazidogadaje')
    events.value = response.data.map(event => ({
      id: event.ID_dogadaja,
      naziv: event.Naziv_dogadaja,
      lokacija: event.Lokacija_dogadaja,
      datum: event.Datum_dogadaja,
      udaljenost: 'nepoznato', // backend jos ne vraca udaljenost
      slika: event.Slika_dogadaja
        ? `data:image/jpeg;base64,${Buffer.from(event.Slika_dogadaja).toString('base64')}`
        : ''
    }))
  } catch (err) {
    console.error(err)
  }
})
</script>
