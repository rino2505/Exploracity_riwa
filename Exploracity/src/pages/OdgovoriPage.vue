<template>
  <q-page padding class="bg-white">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        
        <div class="row items-center justify-between q-mb-xl q-gutter-md">
          <q-btn-dropdown
            color="black"
            unevated
            :label="selectedDogadaj ? selectedDogadaj.Naziv_dogadaja : 'Svi događaji'"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="selectEvent(null)"
              >
                <q-item-section>
                  <q-item-label class="text-weight-bold">Svi događaji</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

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

          <div class="row items-center q-gutter-sm">
            <q-btn 
              dense 
              flat 
              padding="xs md"
              :class="filterStatus === 'unanswered' ? 'text-black text-weight-bold' : 'text-grey-6'" 
              label="Neodgovorena" 
              @click="setFilterStatus('unanswered')" 
            />
            <q-separator vertical inset style="height: 15px;" />
            <q-btn 
              dense 
              flat 
              padding="xs md"
              :class="filterStatus === 'answered' ? 'text-black text-weight-bold' : 'text-grey-6'" 
              label="Odgovorena" 
              @click="setFilterStatus('answered')" 
            />
          </div>
        </div>
        
        <q-list class="custom-list" v-if="questions.length > 0">
          <q-item v-for="q in questions" :key="q.ID_pitanja" class="question-item items-start q-py-md">
            
            <div class="left-meta text-grey-6 row items-center no-wrap q-mr-md q-mt-xs">
              <span class="text-body2 text-weight-medium">
                {{ formatRelativeTime(q.Datum_unosa_p) }}
              </span>
            </div>

            <div class="col column">
              <div class="text-body1 text-weight-medium text-black q-mb-xs">
                {{ q.Sadrzaj_pitanja }}
              </div>

              <div v-if="activeInputId === q.ID_pitanja && filterStatus === 'unanswered'" class="row items-center no-wrap q-mt-sm answer-container">
                <q-icon name="subdirectory_arrow_right" size="sm" class="text-grey-6 q-mr-sm" />
                
                <q-input
                  v-model="answers[q.ID_pitanja]"
                  dense
                  borderless
                  placeholder="Upišite odgovor..."
                  class="col text-body1 text-grey-8 custom-input"
                  autofocus
                  :disable="isSending"
                  @keyup.enter="sendAnswer(q.ID_pitanja)"
                />

                <q-btn
                  flat
                  round
                  dense
                  icon="send"
                  color="black"
                  size="sm"
                  :loading="isSending"
                  :disable="isSending"
                  @click="sendAnswer(q.ID_pitanja)"
                >
                  <q-tooltip>Pošalji</q-tooltip>
                </q-btn>
              </div>

              <div v-if="filterStatus === 'answered' && q.Sadrzaj_odgovora" class="row items-center no-wrap q-mt-xs text-grey-7">
                <q-icon name="subdirectory_arrow_right" size="sm" class="q-mr-sm" />
                <span class="text-body2 italic">{{ q.Sadrzaj_odgovora }}</span>
              </div>
            </div>

            <div class="row items-center no-wrap q-gutter-sm text-black q-ml-md">
              <q-btn
                v-if="filterStatus === 'unanswered'"
                flat
                round
                dense
                @click="toggleAnswerInput(q.ID_pitanja)"
              >
                <q-img
                  src="../assets/icons/reply_icon.svg"
                  width="24px"
                  height="24px"
                />
                <q-tooltip>Odgovori na pitanje</q-tooltip>
              </q-btn>
            </div>

          </q-item>
        </q-list>

        <div v-else class="text-center q-mt-xl text-grey-7">
          Nema pitanja za prikaz u ovoj kategoriji.
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const questions = ref([])
const events = ref([]) 
const selectedDogadaj = ref(null) 
const filterStatus = ref('unanswered')

const answers = ref({})
const activeInputId = ref(null) 
const API_URL = 'http://localhost:3000'

const isSending = ref(false)

// --- TIMESTAMP KONVERTER ---
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '---'
  const now = new Date()
  const questionTime = new Date(timestamp)
  
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

// ISPRAVLJENO: Dohvaća samo događaje prijavljenog organizatora
const fetchEvents = async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('token'));
    if (!adminData || !adminData.ID_organizatora) return;

    const response = await axios.get(`${API_URL}/api/admin/moji-dogadaji`, {
      params: { idOrganizatora: adminData.ID_organizatora }
    });
    
    events.value = response.data;
  } catch (error) {
    console.error('Failed to load events:', error);
    Notify.create({ type: 'negative', message: 'Greška pri učitavanju vaših događaja.' });
  }
}

const setFilterStatus = (status) => {
  filterStatus.value = status
  activeInputId.value = null
  loadQuestions()
}

const selectEvent = (event) => {
  selectedDogadaj.value = event
  activeInputId.value = null
  loadQuestions()
}

const loadQuestions = async () => {
  try {
    const podaci = JSON.parse(localStorage.getItem('token'));
    if (!podaci || !podaci.ID_organizatora) return;

    const params = {
      idOrganizatora: podaci.ID_organizatora,
      status: filterStatus.value
    };

    if (selectedDogadaj.value && selectedDogadaj.value.ID_dogadaja) {
      params.eventId = selectedDogadaj.value.ID_dogadaja;
    }

    const res = await axios.get(`${API_URL}/api/admin/pitanja-filtrirano`, { params });
    questions.value = res.data;

  } catch (error) {
    console.error('Greška pri dohvaćanju pitanja:', error);
    questions.value = [];
  }
};

const toggleAnswerInput = (idPitanja) => {
  activeInputId.value = (activeInputId.value === idPitanja) ? null : idPitanja
  if (activeInputId.value && !answers.value[idPitanja]) {
    answers.value[idPitanja] = ''
  }
}

const sendAnswer = async (idPitanja) => {
  const sadrzaj = answers.value[idPitanja]
  if (!sadrzaj?.trim()) {
    Notify.create({ type: 'warning', message: 'Odgovor ne može biti prazan.' })
    return
  }

  const user = JSON.parse(localStorage.getItem('token'))
  try {
    isSending.value = true 
    await axios.post(`${API_URL}/api/admin/odgovori`, {
      sadrzaj: sadrzaj,
      idPitanja: idPitanja,
      idOrganizatora: user.ID_organizatora
    })
    
    Notify.create({ type: 'positive', message: 'Odgovor uspješno spremljen!' })
    delete answers.value[idPitanja]
    activeInputId.value = null 
    loadQuestions()
  } catch {
    Notify.create({ type: 'negative', message: 'Greška pri slanju odgovora.' })
  } finally {
    isSending.value = false 
  }
}

onMounted(() => {
  fetchEvents()
  loadQuestions()
})
</script>

<style scoped>
.question-item {
  border-bottom: 1px solid #e0e0e0;
}
.answer-container {
  width: 100%;
  max-width: 400px; 
}
.custom-input :deep(.q-field__control) {
  height: auto;
  padding: 0;
}
.custom-list {
  background: transparent;
}
.left-meta {
  min-width: 50px;
}
</style>