<template>
  <q-page class="column flex items-center">
    <img alt="Exploracity logo"
         src="~assets/exploracity-logo.svg"
         style="width: 300px; height: 200px" />

    <q-card class="card-example rounded-borders flex flex-center column" flat bordered>
      <q-input
        v-model="upit"
        type="textarea"
        outlined
        autogrow
        label="Vaše pitanje:"
        style="width:90%;"
        class="q-mt-md"
      />

      <div class="flex items-center justify-center q-mt-md" style="width:90%;">
        <div class="text-subtitle1" style="margin-right: 10px;">
          Za događaj:
        </div>

        <q-btn-dropdown
          color="black"
          :label="selectedDogadaj ? selectedDogadaj.Naziv_dogadaja : 'Odaberite događaj'"
        >
          <q-list>
            <q-item
              v-for="event in events"
              :key="event.ID_dogadaja"
              clickable
              v-close-popup
              @click="selectEvent(event)"
            >
              <q-item-section>
                <q-item-label>{{ event.Naziv_dogadaja }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <q-btn 
        color="black" 
        label="Pošalji"
        class="q-mt-md q-mb-md"
        @click="submitQuestion"
      />
    </q-card>

    <q-card class="card-example rounded-borders flex flex-center column q-mt-md q-mb-md" flat bordered>
      <h2 style="font-size: medium;">
        Prijašnje postavljena pitanja vezana za:
        <span style="color: gray;">
          {{ selectedDogadaj ? selectedDogadaj.Naziv_dogadaja : 'odaberite događaj' }}
        </span>
      </h2>

      <q-list v-if="questions.length" style="width: 90%;">
        <q-item
          v-for="(q, index) in questions"
          :key="q.ID_pitanja"
          :class="index % 2 === 0 ? 'bg-grey-2' : ''"
          class="q-py-sm rounded-borders"
        >
          <q-item-section>
            <q-item-label>
              {{ q.Sadrzaj_pitanja }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div v-else class="text-grey q-mt-sm">
        Nema postavljenih pitanja za ovaj događaj.
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

export default {
  setup () {
    const upit = ref('')
    const events = ref([])
    const selectedDogadaj = ref(null)
    const questions = ref([])

    // URL tvog spojenog backend-a
    const API_URL = 'http://localhost:3000'

    // 1. Dohvat svih događaja za dropdown
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/popis-dogadaja`)
        events.value = response.data
      } catch (error) {
        console.error('Failed to load events:', error)
      }
    }

    // 2. Odabir događaja i učitavanje njegovih pitanja
    const selectEvent = async (event) => {
      selectedDogadaj.value = event
      try {
        const response = await axios.get(`${API_URL}/api/questions`, {
          params: { eventId: event.ID_dogadaja }
        })
        questions.value = response.data
      } catch (error) {
        console.error('Failed to load questions:', error)
      }
    }

    // 3. Slanje novog pitanja
    const submitQuestion = async () => {
      if (!upit.value.trim() || !selectedDogadaj.value) {
        Notify.create({
          type: 'warning',
          message: 'Molimo unesite pitanje i odaberite događaj.'
        })
        return
      }

      try {
        await axios.post(`${API_URL}/api/pitanja`, {
          question: upit.value,
          eventId: selectedDogadaj.value.ID_dogadaja,
          eventName: selectedDogadaj.value.Naziv_dogadaja
        })

        Notify.create({
          type: 'positive',
          message: 'Pitanje uspješno poslano!'
        })

        const currentEvent = selectedDogadaj.value // spremamo referencu
        upit.value = '' 
        
        // Osvježavamo listu pitanja za taj isti događaj
        await selectEvent(currentEvent)
        
      } catch (error) {
        console.error('Failed to send question:', error)
        Notify.create({
          type: 'negative',
          message: 'Greška prilikom slanja pitanja.'
        })
      }
    }

    onMounted(() => {
      fetchEvents()
    })

    return {
      upit,
      events,
      selectedDogadaj,
      selectEvent,
      submitQuestion,
      questions
    }
  }
}
</script>

<style lang="sass" scoped>
.card-example
  width: 800px
  padding: 15px 0
</style>