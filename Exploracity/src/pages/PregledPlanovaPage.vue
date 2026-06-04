<template>
  <div class="q-pa-md">

    <q-table
      flat
      bordered
      :rows="planovi"
      :columns="columns"
      row-key="ID_plan"
      :wrap-cells="true"
    />

  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {

    const planovi = ref([])

    const columns = [
      {
        name: 'dogadaj',
        align: 'center',
        label: 'Događaj',
        field: 'Naziv_dogadaja',
        sortable: true
      },
      {
        name: 'biljeska',
        label: 'Bilješka',
        field: 'Biljeska',
        sortable: true
      }
    ]

    async function ucitajPlanove() {
      try {
        const token = JSON.parse(localStorage.getItem('token'))

        const response = await fetch(
          `http://localhost:3000/pos/pregledplanova?idPosjetitelja=${token.ID_posjetitelja}`
        )

        const data = await response.json()
        planovi.value = data

        console.log('Planovi učitani:', data)

      } catch (error) {
        console.error('Greška pri učitavanju planova:', error)
      }
    }

    onMounted(() => {
      ucitajPlanove()
    })

    return {
      planovi,
      columns
    }
  }
}
</script>