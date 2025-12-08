<template>
  <q-page class="column flex items-center">

    <img alt="Quasar logo"
         src="~assets/exploracity-logo.svg"
         style="width: 300px; height: 200px" />

    <q-card class="card-example rounded-borders flex flex-center column"
            flat bordered>

      <q-input
        v-model="upit"
        type="textarea"
        outlined
        autogrow
        label="Vaše pitanje:"
        style="width:90%;"
        class="q-mt-md"
      />

      <div class="flex items-center justify-center q-mt-md"
           style="width:90%;">
        
        <div class="text-subtitle1" style="margin-right: 10px;">
          Za događaj:
        </div>

        <q-btn-dropdown color="black" label="Događaj">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section><q-item-label>Photos</q-item-label></q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section><q-item-label>Videos</q-item-label></q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section><q-item-label>Articles</q-item-label></q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <q-btn color="black" label="Pošalji"
             class="q-mt-md q-mb-md"
             style="height: 10%;"/>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      upit: ref('')
    }
  }
}
</script>

<style lang="sass" scoped>
.card-example
  width: 800px
  padding: 15px 0
</style>