<template>
  <q-page class="column flex items-center q-pa-md bg-white">

    <q-card class="input-card q-mt-xl q-pt-xl q-mb-xl" flat>
      <q-input
        v-model="upit"
        type="textarea"
        borderless
        autogrow
        placeholder="Unesi svoje pitanje...."
        class="question-textarea"
        :disable="isSending"
      />

      <q-separator />

      <div class="row items-center justify-between q-pt-sm">
        <q-btn-dropdown
          flat
          no-caps
          dense
          color="black"
          class="event-dropdown"
          :disable="isSending"
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

        <q-btn 
          flat 
          round
          color="black" 
          icon="send"
          :loading="isSending"
          :disable="isSending"
          @click="submitQuestion"
        />
      </div>
    </q-card>

    <div class="output-container">
      <h2 style="font-size: 1.2rem;" class="q-mb-md text-weight-bold text-black">
        Prijašnje postavljena pitanja vezana za:
        <span class="text-grey-6 text-weight-medium">
          {{ selectedDogadaj ? selectedDogadaj.Naziv_dogadaja : 'odaberite događaj' }}
        </span>
      </h2>

      <q-list class="custom-list" v-if="questions.length > 0">
        <q-item v-for="q in questions" :key="q.ID_pitanja" class="question-item items-start q-py-md q-px-none">
          
          <div class="left-meta text-grey-6 row items-center no-wrap q-mr-md q-mt-xs">
            <span class="text-body2 text-weight-medium">
              {{ formatRelativeTime(q.Vrijeme_postavljana) }}
            </span>
          </div>

          <div class="col column">
            <div class="text-body1 text-weight-medium text-black q-mb-xs">
              {{ q.Sadrzaj_pitanja }}
            </div>

            <div v-if="q.Sadrzaj_odgovora" class="row items-center no-wrap q-mt-xs text-grey-7">
              <q-icon name="subdirectory_arrow_right" size="sm" class="q-mr-sm text-grey-5" />
              <span class="text-body2 italic text-grey-8">{{ q.Sadrzaj_odgovora }}</span>
            </div>
          </div>

        </q-item>
      </q-list>

      <div v-else class="text-center q-mt-xl text-grey-6 text-body1">
        Nema postavljenih pitanja za ovaj događaj.
      </div>
    </div>
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
    const isSending = ref(false)
    const API_URL = 'http://localhost:3000'

    // --- TIMESTAMP KONVERTER (Otporan na 2h bug i zimsko/ljetno vrijeme) ---
    const formatRelativeTime = (timestamp) => {
      if (!timestamp) return '---'

      const now = new Date()
      let questionTime

      if (typeof timestamp === 'string') {
        const cleanStr = timestamp.replace('T', ' ').replace('.000Z', '')
        const parts = cleanStr.split(' ')
        
        if (parts.length === 2) {
          const dateParts = parts[0].split('-')
          const timeParts = parts[1].split(':')
          
          questionTime = new Date(Date.UTC(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1, 
            parseInt(dateParts[2]),
            parseInt(timeParts[0]),
            parseInt(timeParts[1]),
            parseInt(timeParts[2] || 0)
          ))
        } else {
          questionTime = new Date(timestamp)
        }
      } else {
        questionTime = new Date(timestamp)
      }

      if (isNaN(questionTime.getTime())) return '---'

      const diffInMs = now.getTime() - questionTime.getTime()
      const diffInSeconds = Math.floor(diffInMs / 1000)

      if (diffInSeconds < 60) return 'sada'

      const diffInMinutes = Math.floor(diffInSeconds / 60)
      const diffInHours = Math.floor(diffInMinutes / 60)
      const diffInDays = Math.floor(diffInHours / 24)

      if (diffInMinutes < 60) return `${diffInMinutes}m`
      if (diffInHours < 24) return `${diffInHours}h`
      if (diffInDays === 1) return 'jučer'
      if (diffInDays < 7) return `${diffInDays}d`
      
      return questionTime.toLocaleDateString('hr-HR')
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/popis-dogadaja`)
        events.value = response.data
        
        if (events.value.length > 0) {
          selectEvent(events.value[0])
        }
      } catch (error) {
        console.error('Failed to load events:', error)
      }
    }

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

    const submitQuestion = async () => {
  if (isSending.value) return;

  if (!upit.value.trim() || !selectedDogadaj.value) {
    Notify.create({ type: 'warning', message: 'Molimo unesite pitanje i odaberite događaj.' });
    return;
  }

  try {
    isSending.value = true;

    // Šaljemo ključeve koje backend očekuje (sadrzaj, idPosjetitelja, idDogadaja)
    await axios.post(`${API_URL}/api/pitanja`, {
      sadrzaj: upit.value,
      idPosjetitelja: 1, // Zamijeni s pravim ID-om iz prijave kad je implementiraš
      idDogadaja: selectedDogadaj.value.ID_dogadaja
    });

    Notify.create({ type: 'positive', message: 'Pitanje uspješno poslano!' });
    
    upit.value = ''; 
    // Osvježi listu pitanja za isti događaj
    await selectEvent(selectedDogadaj.value);
    
  } catch (error) {
    console.error('Greška:', error);
    Notify.create({ type: 'negative', message: 'Greška prilikom slanja.' });
  } finally {
    isSending.value = false;
  }
};

    onMounted(() => {
      fetchEvents()
    })

    return {
      upit,
      events,
      selectedDogadaj,
      selectEvent,
      submitQuestion,
      questions,
      isSending,
      formatRelativeTime
    }
  }
}
</script>

<style lang="sass" scoped>
.input-card
  width: 800px
  max-width: 90%
  border-radius: 6px

.question-textarea
  font-size: 1.1rem
  padding: 8px

.event-dropdown
  font-weight: bold
  font-size: 1rem

/* Novi stilovi za layout liste pitanja i odgovora */
.output-container
  width: 800px
  max-width: 90%
  margin-bottom: 40px

.question-item
  border-bottom: 1px solid #e0e0e0

.custom-list
  background: transparent

.left-meta
  min-width: 50px
  text-align: left

.italic
  font-style: italic
</style>