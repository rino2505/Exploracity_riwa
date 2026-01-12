<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Pitanja na koja treba odgovoriti</div>

    <q-list bordered separator v-if="questions.length > 0">
      <q-item v-for="q in questions" :key="q.ID_pitanja" class="column q-py-lg">
        <div class="text-subtitle2 text-grey-7">Događaj: {{ q.Naziv_dogadaja }}</div>
        <div class="text-body1 q-mt-sm">{{ q.Sadrzaj_pitanja }}</div>

        <div class="row q-gutter-md q-mt-md">
          <q-input 
            v-model="answers[q.ID_pitanja]" 
            filled 
            placeholder="Vaš odgovor..." 
            class="col"
            dense
          />
          <q-btn 
            color="black" 
            label="Pošalji odgovor" 
            @click="sendAnswer(q.ID_pitanja)"
          />
        </div>
      </q-item>
    </q-list>

    <div v-else class="text-center q-mt-xl text-grey-7">
      Nema novih pitanja za odgovoriti.
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const questions = ref([])
const answers = ref({})
const API_URL = 'http://localhost:3000'

const loadQuestions = async () => {
  try {
    // Dohvaćamo podatke o ulogiranom korisniku
    const podaci = JSON.parse(localStorage.getItem('token'));
    
    // Provjeravamo imamo li ID organizatora
    if (podaci && podaci.ID_organizatora) {
      const res = await axios.get(`${API_URL}/api/admin/pitanja-bez-odgovora`, {
        params: { idOrganizatora: podaci.ID_organizatora } // Slanje ID-a backendu
      });
      questions.value = res.data;
    }
  } catch (error) {
    console.error('Greška:', error);
    Notify.create({ type: 'negative', message: 'Greška pri učitavanju vaših pitanja.' });
  }
};

const sendAnswer = async (idPitanja) => {
  const sadrzaj = answers.value[idPitanja]
  if (!sadrzaj) return

  // Dohvaćamo ID organizatora koji je ulogiran
  const user = JSON.parse(localStorage.getItem('token'))
  const idOrganizatora = user.ID_organizatora

  try {
    await axios.post(`${API_URL}/api/admin/odgovori`, {
      sadrzaj: sadrzaj,
      idPitanja: idPitanja,
      idOrganizatora: idOrganizatora
    })
    
    Notify.create({ type: 'positive', message: 'Odgovor uspješno spremljen!' })
    delete answers.value[idPitanja]
    loadQuestions() // Osvježi listu (pitanje će nestati jer je dobilo odgovor)
  } catch {
    Notify.create({ type: 'negative', message: 'Greška pri slanju odgovora.' })
  }
}

onMounted(loadQuestions)
</script>