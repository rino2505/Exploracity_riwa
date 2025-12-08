<template>
  <q-page padding>
    <h4> Unos događaja</h4>
    <p></p>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="naziv"
        label="Naziv događaja"
        
      />

      <q-input
        filled
        v-model="datum"
        label="Datum događaja"
        
      />

      <q-input
        filled
        v-model="vrijeme"
        label="Vrijeme događaja"

      />

      <q-input
        filled
        v-model="lokacija"
        label="Lokacija događaja"

      />

      <q-input
        filled
        v-model="opis"
        label="Opis događaja"

      />

      <div>
        <q-btn label="Unos događaja" type="potvrdi" color="primary"/>
        <q-btn label="Odbaci promjene" type="odbaci" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const naziv = ref('')
const datum = ref('')
const vrijeme = ref('')
const lokacija = ref('')
const opis = ref('')

function onSubmit() {
  // logika spremanja
}

function onReset() {
  naziv.value = ''
  datum.value = ''
  vrijeme.value = ''
  lokacija.value = ''
  opis.value = ''
}
</script>
