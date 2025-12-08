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
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Neispravan unos']"
      />

      <q-input
        filled
        v-model="datum"
        label="Datum događaja"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Neispravan unos']"
      />

      <q-input
        filled
        v-model="vrijeme"
        label="Vrijeme događaja"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Neispravan unos']"
      />

      <q-input
        filled
        v-model="lokacija"
        label="Lokacija događaja"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Neispravan unos']"
      />

      <q-input
        filled
        v-model="opis"
        label="Opis događaja"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Neispravan unos']"
      />

      <div>
        <q-btn label="Unos događaja" type="potvrdi" color="primary"/>
        <q-btn label="Odbaci promjene" type="odbaci" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
//
</script>
