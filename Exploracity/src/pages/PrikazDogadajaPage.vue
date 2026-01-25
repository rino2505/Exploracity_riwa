<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      :rows="dogadaji"
      :columns="columns"
      row-key="id"
      :wrap-cells="true"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const dogadaji = ref([])  // ovo mora biti isto kao :rows u Q-Table

    const columns = [
      { name: 'naziv', align: 'center', label: 'Naziv događaja', field: 'Naziv_dogadaja', sortable: true },
      { name: 'lokacija', label: 'Lokacija događaja', field: 'Lokacija_dogadaja', sortable: true },
      { name: 'datum', label: 'Datum događaja', field: 'Datum_dogadaja', align: 'left' },
      { name: 'vrijeme', label: 'Vrijeme događaja', field: 'Vrijeme_dogadaja' },
      { name: 'opis', label: 'Opis događaja', field: 'Opis_dogadaja' },
    ]

    async function ucitajDogadaje() {
      try {
        const response = await fetch('http://localhost:3000/api/prikazidogadaje')
        const data = await response.json()
        dogadaji.value = data
        console.log('Događaji učitani:', data)
      } catch (error) {
        console.error('Greška prilikom učitavanja događaja:', error)
      }
    }

    onMounted(() => {
      ucitajDogadaje()
    })

    return {
      dogadaji,
      columns
    }
  }
}
</script>
