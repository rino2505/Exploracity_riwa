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
          v-model="Username_organizatora" 
          placeholder="Korisničko ime" 
          class="q-mt-md"
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
const Username_organizatora = ref('')
const Lozinka_organizatora = ref('')

// Varijable za Sign Up
const signupUsername = ref('')
const signupPassword = ref('')
const email = ref('')

const isPwd = ref(true)

// Tvoj Backend Port (Provjeri radi li app.js na 3000)
const API_URL = 'http://localhost:3000'

/**
 * LOGIKA ZA LOGIN
 */
const login = async () => {
  if (!Username_organizatora.value || !Lozinka_organizatora.value) {
    Notify.create({ type: 'warning', message: 'Unesite sve podatke' })
    return
  }

  try {
    const res = await axios.post(`${API_URL}/login`, {
      Username_organizatora: Username_organizatora.value,
      Lozinka_organizatora: Lozinka_organizatora.value
    })

    if (res.status === 200) {
      // Spremanje tokena/podataka
      localStorage.setItem('token', JSON.stringify(res.data))
      
      console.log("Prijava uspješna, preusmjeravam...")
      
      // Navigacija na admin sučelje
      router.push('/admin/odgovori')
      
      Notify.create({ 
        type: 'positive', 
        message: `Dobrodošli, ${res.data.ime}!` 
      })
    }
  } catch (err) {
    // Ako koristiš console.log(err), ESLint se neće žaliti
    console.error("Greška pri loginu:", err)
    Notify.create({
      type: 'negative',
      message: err.response?.data || 'Pogrešno korisničko ime ili lozinka'
    })
  }
}

/**
 * LOGIKA ZA SIGNUP
 */
const signup = async () => {
  try {
    Notify.create({ type: 'info', message: 'Registracija trenutno nije dostupna' })
  } catch {
    // Ovdje sam maknuo (err) jer se ne koristi - rješava ESLint error
    Notify.create({ type: 'negative', message: 'Greška pri registraciji' })
  }
}
</script>