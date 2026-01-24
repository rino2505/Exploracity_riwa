<template>
  <q-page class="column flex items-center q-pa-md">

    <!-- Unos komentara -->
    <q-card class="card-example rounded-borders flex flex-center column" flat bordered>
      <q-input v-model="komentar" type="textarea" outlined autogrow label="Vaš komentar:" style="width:90%;" class="q-mt-md" />

      <div class="flex items-center justify-center q-mt-md" style="width:90%;">
        <div class="text-subtitle1 q-mr-sm">Za događaj:</div>

        <q-btn-dropdown color="black" :label="selectedDogadaj ? selectedDogadaj.Naziv_dogadaja : 'Odaberite događaj'" >
          <q-list>
            <q-item v-for="event in events" :key="event.ID_dogadaja" clickable v-close-popup @click="selectEvent(event)" >
              <q-item-section>
                <q-item-label>{{ event.Naziv_dogadaja }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <q-btn color="black" label="Objavi komentar" class="q-mt-md q-mb-md" @click="submitComment" />
    </q-card>

    <!-- Lista komentara -->
    <q-card class="card-example rounded-borders flex flex-center column q-mt-md q-mb-md" flat bordered>
      <h2 style="font-size: medium;">
        Komentari za:
        <span style="color: gray;">
          {{ selectedDogadaj ? selectedDogadaj.Naziv_dogadaja : 'odaberite događaj' }}
        </span>
      </h2>

      <q-list v-if="comments.length" style="width: 90%;">
        <q-item v-for="(c, index) in comments" :key="c.ID_komentara" :class="index % 2 === 0 ? 'bg-grey-2' : ''" class="q-py-sm rounded-borders" >
          <q-item-section>
            <q-item-label>{{ c.Sadrzaj_komentara }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div v-else class="text-grey q-mt-sm">Nema komentara za ovaj događaj.</div>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const komentar = ref('')
const events = ref([])
const selectedDogadaj = ref(null)
const comments = ref([])

// Dohvati sve događaje s backend-a
const fetchEvents = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/comments') // endpoint koji vraća događaje
    events.value = res.data
  } catch (err) {
    console.error('Greška pri dohvaćanju događaja:', err)
  }
}

// Dohvati komentare za odabrani događaj
const selectEvent = async (event) => {
  selectedDogadaj.value = event
  try {
    const res = await axios.get('http://localhost:3000/comments', {
      params: { eventId: event.ID_dogadaja }
    })
    comments.value = res.data
  } catch (err) {
    console.error('Greška pri dohvaćanju komentara:', err)
  }
}

const submitComment = async () => {
  if (!komentar.value || !selectedDogadaj.value) {
    alert('Molimo unesite komentar i odaberite događaj.')
    return
  }

  try {
    await axios.post('http://localhost:3000/comments', {
      comment: komentar.value,
      eventId: selectedDogadaj.value.ID_dogadaja,
      userId: null
    })
    komentar.value = ''
    await selectEvent(selectedDogadaj.value)
  } catch (err) {
    console.error('Greška pri slanju komentara:', err)
    alert('Došlo je do greške pri slanju komentara.')
  }
}

onMounted(() => {
  fetchEvents()
})


</script>

<style lang="sass" scoped>
.card-example
  width: 800px
  padding: 15px 0
</style>
