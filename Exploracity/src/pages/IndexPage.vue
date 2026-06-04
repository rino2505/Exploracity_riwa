<template>
  <q-page class="flex flex-center column">

    <!-- LOGO -->
    <div class="q-mb-xl">
      <img
        alt="Exploracity logo"
        src="~assets/exploracity-logo.svg"
        style="width: 300px; height: 200px"
      />
    </div>

    <div class="row full-width justify-evenly q-gutter-xl">

      <!-- ORGANIZATOR -->
      <q-card class="col-12 col-md-3 q-pa-md">
        <div class="text-h6 text-center q-mb-md">Login organizatora</div>

        <q-input standout v-model="Email_organizatora" placeholder="Email" />
        
        <q-input
          standout
          v-model="Lozinka_organizatora"
          placeholder="Lozinka"
          :type="isPwd ? 'password' : 'text'"
          class="q-mt-md"
          @keyup.enter="loginorganizatora"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-btn
          class="full-width q-mt-md"
          color="black"
          label="Login"
          @click="loginorganizatora"
        />
      </q-card>

      <!-- POSJETITELJ -->
      <q-card class="col-12 col-md-3 q-pa-md">
        <div class="text-h6 text-center q-mb-md">Login posjetitelja</div>

        <q-input standout v-model="Email_posjetitelja" placeholder="Email" />

        <q-input
          standout
          v-model="Lozinka_posjetitelja"
          placeholder="Lozinka"
          :type="isPwd ? 'password' : 'text'"
          class="q-mt-md"
          @keyup.enter="loginposjetitelja"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-btn
          class="full-width q-mt-md"
          color="black"
          label="Login"
          @click="loginposjetitelja"
        />
      </q-card>

      <!-- SIGN UP -->
      <q-card class="col-12 col-md-3 q-pa-md">

        <div class="text-h6 text-center q-mb-md">Sign Up</div>

        <q-input
          standout
          v-model="signupUsername"
          placeholder="Username"
        />

        <q-input
          standout
          v-model="email"
          placeholder="Email"
          type="email"
          class="q-mt-md"
        />

        <q-input
          standout
          v-model="signupPassword"
          placeholder="Password"
          :type="isPwd ? 'password' : 'text'"
          class="q-mt-md"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-btn
          class="full-width q-mt-md"
          color="black"
          label="Sign Up"
          @click="signup"
        />
      </q-card>

    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()

// Varijable za Login
const Email_organizatora = ref('')
const Lozinka_organizatora = ref('')
const Email_posjetitelja = ref('')
const Lozinka_posjetitelja = ref('')

// Varijable za Sign Up
const signupUsername = ref('')
const signupPassword = ref('')
const email = ref('')

const isPwd = ref(true)

const API_URL = 'http://localhost:3000'

/**
 * LOGIKA ZA LOGIN ORGANIZATORA
 */
const loginorganizatora = async () => {
  if (!Email_organizatora.value || !Lozinka_organizatora.value) {
    Notify.create({ type: 'warning', message: 'Unesite email i lozinku' })
    return
  }

  try {
    const res = await axios.post(`${API_URL}/loginorganizatora`, {
      Email_organizatora: Email_organizatora.value,
      Lozinka_organizatora: Lozinka_organizatora.value
    })

    if (res.status === 200) {
      // 1. Spremanje podataka
      localStorage.setItem('token', JSON.stringify(res.data))
      
      // 2. Prikaz notifikacije
      Notify.create({ 
        type: 'positive', 
        message: `Dobrodošli, ${res.data.ime}!`,
        position: 'top',
        timeout: 1000 // Traje 1 sekundu
      })
      
      // 3. Odgoda preusmjeravanja da se notifikacija stigne prikazati
      setTimeout(() => {
        router.push('/admin/odgovori')
      }, 1000)
    }
  } catch (err) {
    console.error("Greška pri loginu:", err)
    Notify.create({
      type: 'negative',
      message: 'Pogrešni podaci za prijavu',
      position: 'top'
    })
  }
}

/**
 * LOGIKA ZA LOGIN POSJETITELJA
 */
const loginposjetitelja = async () => {
  if (!Email_posjetitelja.value || !Lozinka_posjetitelja.value) {
    Notify.create({ type: 'warning', message: 'Unesite email i lozinku' })
    return
  }

  try {
    const res = await axios.post(`${API_URL}/loginposjetitelja`, {
      Email_posjetitelja: Email_posjetitelja.value,
      Lozinka_posjetitelja: Lozinka_posjetitelja.value
    })

    if (res.status === 200) {
      // 1. Spremanje podataka
      localStorage.setItem('token', JSON.stringify(res.data))
      
      // 2. Prikaz notifikacije
      Notify.create({ 
        type: 'positive', 
        message: `Dobrodošli, ${res.data.ime}!`,
        position: 'top',
        timeout: 1000 // Traje 1 sekundu
      })
      
      // 3. Odgoda preusmjeravanja da se notifikacija stigne prikazati
      setTimeout(() => {
        router.push('/pos/dogadaji/')
      }, 1000)
    }
  } catch (err) {
    console.error("Greška pri loginu:", err)
    Notify.create({
      type: 'negative',
      message: 'Pogrešni podaci za prijavu',
      position: 'top'
    })
  }
}

const signup = async () => {
  Notify.create({ type: 'info', message: 'Registracija trenutno nije dostupna' })
}
</script>