<template>
  <q-page class="column flex items-center">
    <img
      alt="Exploracity logo"
      src="~assets/exploracity-logo.svg"
      style="width: 300px; height: 200px"
      class="q-mt-lg"
    />
    
    <div class="row flex items-start justify-evenly full-width q-mt-xl">
      <div class="flex column items-center q-gutter-sm">
        <div class="text-h6">Login</div>
        
        <q-input 
          standout 
          v-model="Email_organizatora" 
          placeholder="Email" 
        />
        
        <q-input 
          standout 
          placeholder="Lozinka" 
          v-model="Lozinka_organizatora"  
          :type="isPwd ? 'password' : 'text'" 
          class="q-mt-md"
          @keyup.enter="login"
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
          push 
          color="black" 
          label="Login" 
          class="q-mt-md" 
          @click="login" 
        />
      </div>

      <div class="bg-black" style="width: 2px; height: 300px;"></div>

      <div class="flex column items-center q-gutter-sm">
        <div class="text-h6">Sign Up</div>
        
        <q-input standout v-model="signupUsername" placeholder="Username" class="q-mt-md"/>
        <q-input v-model="email" placeholder="Email" standout type="email" class="q-mt-md"/>
        
        <q-input 
          standout 
          placeholder="Password" 
          v-model="signupPassword"  
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
        
        <q-btn push color="black" label="Sign Up" class="q-mt-md" @click="signup" />
      </div>
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

// Varijable za Sign Up
const signupUsername = ref('')
const signupPassword = ref('')
const email = ref('')

const isPwd = ref(true)

const API_URL = 'http://localhost:3000'

/**
 * LOGIKA ZA LOGIN
 */
const login = async () => {
  if (!Email_organizatora.value || !Lozinka_organizatora.value) {
    Notify.create({ type: 'warning', message: 'Unesite email i lozinku' })
    return
  }

  try {
    const res = await axios.post(`${API_URL}/login`, {
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

const signup = async () => {
  Notify.create({ type: 'info', message: 'Registracija trenutno nije dostupna' })
}
</script>