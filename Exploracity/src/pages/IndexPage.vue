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

        <q-option-group
          v-model="signupType"
          :options="[
            { label: 'Posjetitelj', value: 'posjetitelj' },
            { label: 'Organizator', value: 'organizator' }
          ]"
          color="black"
          inline
          class="q-mb-md"
        />

        <q-input
          standout
          v-model="signupIme"
          placeholder="Ime"
        />

        <q-input
          standout
          v-model="signupPrezime"
          placeholder="Prezime"
          class="q-mt-md"
        />

        <q-input
          standout
          v-model="signupEmail"
          placeholder="Email"
          type="email"
          class="q-mt-md"
        />

        <q-input
          standout
          v-model="signupPassword"
          placeholder="Password"
          :type="isPwdSignup ? 'password' : 'text'"
          class="q-mt-md"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwdSignup ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdSignup = !isPwdSignup"
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
const signupType = ref('posjetitelj')
const signupIme = ref('')
const signupPrezime = ref('')
const signupEmail = ref('')
const signupPassword = ref('')

const isPwd = ref(true)
const isPwdSignup = ref(true)

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
        router.push('/dogadajislikeuser')
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
  // Validacija
  if (!signupIme.value || !signupPrezime.value || !signupEmail.value || !signupPassword.value) {
    Notify.create({ type: 'warning', message: 'Svi podaci su obavezni' })
    return
  }

  try {
    let url = ''
    let payload = {}

    if (signupType.value === 'organizator') {
      url = `${API_URL}/signuporganizatora`
      payload = {
        Ime_organizatora: signupIme.value,
        Prezime_organizatora: signupPrezime.value,
        Email_organizatora: signupEmail.value,
        Lozinka_organizatora: signupPassword.value
      }
    } else {
      url = `${API_URL}/signupposjetitelja`
      payload = {
        Ime_posjetitelja: signupIme.value,
        Prezime_posjetitelja: signupPrezime.value,
        Email_posjetitelja: signupEmail.value,
        Lozinka_posjetitelja: signupPassword.value
      }
    }

    const res = await axios.post(url, payload)

    if (res.status === 200) {
      // 1. Spremanje podataka
      localStorage.setItem('token', JSON.stringify(res.data))
      
      // 2. Prikaz notifikacije
      Notify.create({ 
        type: 'positive', 
        message: `Dobrodošli, ${res.data.ime}!`,
        position: 'top',
        timeout: 1000
      })
      
      // 3. Odgoda preusmjeravanja
      setTimeout(() => {
        if (signupType.value === 'organizator') {
          router.push('/admin/odgovori')
        } else {
          router.push('/dogadajislikeuser')
        }
      }, 1000)

      // Očisti forme
      signupIme.value = ''
      signupPrezime.value = ''
      signupEmail.value = ''
      signupPassword.value = ''
    }
  } catch (err) {
    console.error("Greška pri registraciji:", err)
    
    let errorMessage = 'Greška pri registraciji'
    if (err.response?.status === 409) {
      errorMessage = 'Email već postoji'
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error
    }
    
    Notify.create({
      type: 'negative',
      message: errorMessage,
      position: 'top'
    })
  }
}
</script>