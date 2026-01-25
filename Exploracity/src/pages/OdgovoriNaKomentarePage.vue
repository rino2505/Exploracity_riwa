<template>
  <q-page class="q-pa-md">

    <div class="text-h6 q-mb-md">
      Odgovori na komentare
    </div>

    <q-card
      v-for="c in comments"
      :key="c.ID_komentara"
      class="q-mb-md"
      flat bordered
    >
      <q-card-section>
        <div class="text-subtitle2 text-grey-7">
          Događaj: {{ c.Naziv_dogadaja }} (ID: {{ c.ID_dogadaja }})
        </div>

        <div class="q-mt-sm">
          <span class="text-weight-bold">Komentar:</span>
          {{ c.Sadrzaj_komentara }}
        </div>

        <div class="text-caption text-grey q-mt-xs">
          ID komentara: {{ c.ID_komentara }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          v-model="replyText[c.ID_komentara]"
          type="textarea"
          autogrow
          outlined
          label="Odgovor"
        />

        <q-btn
          color="black"
          class="q-mt-sm"
          label="Pošalji odgovor"
          :disable="!replyText[c.ID_komentara]"
          @click="sendReply(c.ID_komentara)"
        />
      </q-card-section>
    </q-card>

    <div v-if="!comments.length" class="text-grey q-mt-lg">
      Nema komentara za odgovoriti.
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const API = 'http://localhost:3000'

const comments = ref([])
const replyText = ref({})

const loadComments = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('token'))

    if (!user?.ID_organizatora) {
      Notify.create({ type: 'negative', message: 'Niste ulogirani kao admin/organizator.' })
      return
    }

    const res = await axios.get(`${API}/api/admin/komentari-bez-odgovora`, {
      params: { idOrganizatora: user.ID_organizatora }
    })

    comments.value = res.data
  } catch (e) {
    console.error(e)
    Notify.create({ type: 'negative', message: 'Greška pri učitavanju komentara.' })
  }
}

const sendReply = async (idKomentara) => {
  try {
    const user = JSON.parse(localStorage.getItem('token'))
    const sadrzaj = replyText.value[idKomentara]

    await axios.post(`${API}/api/admin/odgovori-na-komentar`, {
      sadrzaj,
      idKomentara,
      idOrganizatora: user.ID_organizatora
    })

    Notify.create({ type: 'positive', message: 'Odgovor spremljen!' })
    delete replyText.value[idKomentara]
    await loadComments()
  } catch (e) {
    console.error(e)
    Notify.create({ type: 'negative', message: 'Greška pri slanju odgovora.' })
  }
}

onMounted(loadComments)
</script>
