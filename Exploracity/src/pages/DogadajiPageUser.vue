<template>
  <q-page class="q-pa-md">

    <div class="text-h5 q-mb-md">Događaji</div>

    <!-- GRID DOGADJAJA -->
    <div class="row q-col-gutter-md">
      <div
        v-for="ev in events"
        :key="ev.ID_dogadaja"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="my-card" clickable @click="openModal(ev)">
          <q-img
            v-if="eventImages[ev.ID_dogadaja]"
            :src="eventImages[ev.ID_dogadaja]"
            style="height: 180px"
            fit="cover"
          />
          <div v-else class="bg-grey-3 flex flex-center" style="height:180px">
            <q-icon name="image_not_supported" size="48px" color="grey-7" />
          </div>

          <q-card-section>
            <div class="text-subtitle1 text-center">
              {{ ev.Naziv_dogadaja }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- POPUP MODAL -->
    <q-dialog v-model="modal" persistent transition-show="scale" transition-hide="scale" maximized>
      <q-card class="full-height">

        <!-- HEADER -->
        <q-card-section class="row items-center justify-between bg-grey-1">
          <div class="text-h5">
            {{ selectedEvent?.Naziv_dogadaja }}
          </div>
          <q-btn icon="close" flat round dense @click="closeModal" />
        </q-card-section>

        <q-separator />

        <!-- TABS -->
        <q-tabs
          v-model="activeTab"
          class="text-black bg-grey-2"
          dense
        >
          <q-tab name="info" label="Informacije" />
          <q-tab name="questions" label="Pitanja" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated class="bg-white">
          
          <!-- TAB: INFORMACIJE -->
          <q-tab-panel name="info" class="q-pa-md">
            <div class="row">
              <div class="col-12 col-md-6">
                <q-img
                  v-if="eventImages[selectedEvent?.ID_dogadaja]"
                  :src="eventImages[selectedEvent.ID_dogadaja]"
                  style="max-width: 100%; max-height: 400px; border-radius: 12px;"
                  fit="contain"
                />
                <div
                  v-else
                  class="bg-grey-3 flex flex-center"
                  style="width:100%; height:400px; border-radius:12px;"
                >
                  <q-icon name="image_not_supported" size="64px" color="grey-7" />
                </div>
              </div>
              
              <div class="col-12 col-md-6 q-pl-md">
                <div class="q-mb-md">
                  <div class="text-subtitle2 text-grey-7 q-mb-xs">Lokacija:</div>
                  <div class="text-body1">{{ selectedEvent?.Lokacija_dogadaja || "Nema podataka" }}</div>
                </div>

                <div class="q-mb-md">
                  <div class="text-subtitle2 text-grey-7 q-mb-xs">Datum i vrijeme:</div>
                  <div class="text-body1">{{ selectedEvent?.Datum_i_vrijeme_dogadaja || "Nema podataka" }}</div>
                </div>

                <div>
                  <div class="text-subtitle2 text-grey-7 q-mb-xs">Opis:</div>
                  <div class="text-body1">{{ selectedEvent?.Opis_dogadaja || "Nema opisa" }}</div>
                </div>
              </div>
            </div>
          </q-tab-panel>


          <!-- TAB: PITANJA -->
          <q-tab-panel name="questions" class="q-pa-md">
            <div class="row justify-center">
              <div class="col-12 col-md-8">
                
                <!-- UNOS PITANJA -->
                <q-card flat bordered class="q-mb-md">
                  <q-card-section>
                    <div class="text-subtitle1 q-mb-md">Postavite pitanje:</div>
                    
                    <q-input
                      v-model="newQuestion.sadrzaj"
                      type="textarea"
                      outlined
                      autogrow
                      placeholder="Vaše pitanje..."
                      rows="3"
                      class="q-mb-md"
                    />

                    <q-btn
                      color="black"
                      label="Pošalji pitanje"
                      class="full-width"
                      :loading="isSendingQuestion"
                      :disable="isSendingQuestion || !newQuestion.sadrzaj.trim()"
                      @click="submitQuestion"
                    />
                  </q-card-section>
                </q-card>

                <!-- LISTA PITANJA -->
                <div class="text-subtitle1 q-mb-md">Pitanja ({{ questions.length }}):</div>

                <q-list v-if="questions.length > 0" separator>
                  <q-item v-for="q in questions" :key="q.ID_pitanja" class="q-px-none q-py-md">
                    <q-item-section top>
                      <div class="text-weight-bold">Korisnik</div>
                      <div class="text-caption text-grey">{{ formatTime(q.Datum_unosa_p) }}</div>
                      <div class="q-mt-sm">{{ q.Sadrzaj_pitanja }}</div>
                      
                      <!-- ODGOVOR NA PITANJE -->
                      <div v-if="q.Sadrzaj_odgovora" class="q-mt-sm q-pl-md bg-grey-2 q-pa-sm rounded-borders">
                        <div class="text-caption text-grey-7 q-mb-xs">
                          Odgovor od: {{ q.Ime_organizatora || 'Organizator' }}
                        </div>
                        <div class="text-body2">{{ q.Sadrzaj_odgovora }}</div>
                      </div>
                      <div v-else class="q-mt-sm q-pl-md bg-amber-1 q-pa-sm rounded-borders">
                        <div class="text-caption text-amber-8">Čeka se odgovor...</div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div v-else class="text-center text-grey q-mt-lg">
                  Nema pitanja za ovaj događaj.
                </div>

              </div>
            </div>
          </q-tab-panel>

        </q-tab-panels>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const API_URL = 'http://localhost:3000'

const events = ref([])
const eventImages = ref({})
const modal = ref(false)
const selectedEvent = ref(null)
const activeTab = ref('info')



// Pitanja
const questions = ref([])
const newQuestion = ref({ sadrzaj: '' })
const isSendingQuestion = ref(false)

// Formatiraj vrijeme
const formatTime = (timestamp) => {
  if (!timestamp) return '---'
  const date = new Date(timestamp)
  return date.toLocaleDateString('hr-HR') + ' ' + date.toLocaleTimeString('hr-HR')
}

// Učitaj sve događaje
const loadEvents = async () => {
  try {
    const res = await axios.get(`${API_URL}/dogadaji`)
    events.value = res.data

    for (let ev of events.value) {
      eventImages.value[ev.ID_dogadaja] = await loadImage(ev.ID_dogadaja)
    }
  } catch (err) {
    console.error('Greška pri učitavanju događaja:', err)
    Notify.create({ type: 'negative', message: 'Greška pri učitavanju događaja' })
  }
}

// Učitaj sliku događaja
const loadImage = async (id) => {
  try {
    const res = await fetch(`${API_URL}/dogadaj/${id}/slika`)
    if (!res.ok) return null
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

// Otvori modal
const openModal = async (event) => {
  selectedEvent.value = event
  activeTab.value = 'info'
  modal.value = true
  
  // Učitaj komentare i pitanja

  await loadQuestions()
}

// Zatvori modal
const closeModal = () => {
  modal.value = false
  selectedEvent.value = null

  questions.value = []

  newQuestion.value = { sadrzaj: '' }
}



// Učitaj pitanja
const loadQuestions = async () => {
  if (!selectedEvent.value) return
  try {
    const res = await axios.get(`${API_URL}/api/questions`, {
      params: { eventId: selectedEvent.value.ID_dogadaja }
    })
    questions.value = res.data
  } catch (err) {
    console.error('Greška pri učitavanju pitanja:', err)
  }
}



// Pošalji pitanje
const submitQuestion = async () => {
  if (!newQuestion.value.sadrzaj.trim()) {
    Notify.create({ type: 'warning', message: 'Molimo unesite pitanje' })
    return
  }

  try {
    isSendingQuestion.value = true
    const userData = JSON.parse(localStorage.getItem('token'))
    
    if (!userData || !userData.ID_posjetitelja) {
      Notify.create({ type: 'warning', message: 'Trebate biti ulogirani' })
      return
    }

    await axios.post(`${API_URL}/api/pitanja`, {
      sadrzaj: newQuestion.value.sadrzaj,
      idPosjetitelja: userData.ID_posjetitelja,
      idDogadaja: selectedEvent.value.ID_dogadaja
    })

    Notify.create({ type: 'positive', message: 'Pitanje poslano!' })
    newQuestion.value = { sadrzaj: '' }
    await loadQuestions()
  } catch (err) {
    console.error('Greška:', err)
    Notify.create({ type: 'negative', message: 'Greška pri slanju pitanja' })
  } finally {
    isSendingQuestion.value = false
  }
}

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.my-card {
  transition: 0.2s;
}
.my-card:hover {
  transform: scale(1.03);
}
.rounded-borders {
  border-radius: 4px;
}
</style>
