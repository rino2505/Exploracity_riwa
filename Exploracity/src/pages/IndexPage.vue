<template>
  <q-page class="column flex items-center">
    <img
      alt="Quasar logo"
      src="~assets/exploracity-logo.svg"
      style="width: 300px; height: 200px"
    />
    <div class="row flex items-start justify-evenly full-width q-mt-xl">
      <!-- Login Section -->
      <div class="flex column items-center q-gutter-sm">
        <div class="text-h6">Login</div> <!-- Poravnanje naslova -->
        <q-input standout v-model="loginUsername" placeholder="Username" class="q-mt-md"/>
        <q-input standout placeholder="Password" v-model="loginPassword"  :type="isPwd ? 'password' : 'text'" class="q-mt-md">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn push color="black" label="Login" class="q-mt-md"/>
      </div>

      <div class="bg-black" style="width: 2px; height: 300px;"></div>

      <!-- Sign Up Section -->
      <div class="flex column items-center q-gutter-sm">
        <div class="text-h6">Sign Up</div> <!-- Poravnanje naslova -->
        <q-input standout v-model="signupUsername" placeholder="Username" class="q-mt-md"/>
        <q-input v-model="email" placeholder="Email" standout type="email" class="q-mt-md"/>
        <q-input standout placeholder="Password" v-model="signupPassword"  :type="isPwd ? 'password' : 'text'" class="q-mt-md">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn push color="black" label="Sign Up" class="q-mt-md"/>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const loginUsername = ref('')
const loginPassword = ref('')
const signupUsername = ref('')
const signupPassword = ref('')
const email = ref('')
const isPwd = ref(true)
</script>
