<template>
  <q-page class="q-pa-md">

    <div class="text-h5 q-mb-md">Događaji</div>

    <!-- GRID DOGADJAJA -->
    <div class="row q-col-gutter-md">
      <div
        v-for="ev in events"
        :key="ev.ID_dogadaja"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="my-card" clickable @click="openUploadModal(ev)">
          <q-img
            v-if="eventImages[ev.ID_dogadaja]"
            :src="eventImages[ev.ID_dogadaja]"
            style="height: 180px"
            fit="cover"
          />
          <div v-else class="bg-grey-3 flex flex-center" style="height:180px">
            <q-icon name="image_not_supported" size="48px" color="grey-7" />
          </div>

          <q-card-section>
            <div class="text-subtitle1 text-center">
              {{ ev.Naziv_dogadaja }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- POPUP MODAL ZA UPLOAD -->
<q-dialog v-model="modal" persistent transition-show="scale" transition-hide="scale">
  <q-card style="width: 650px; max-width: 95vw;">

    <!-- HEADER -->
    <q-card-section class="row items-center justify-between">
      <div class="text-h5 text-center full-width">
        {{ selectedEvent?.Naziv_dogadaja }}
      </div>
      <q-btn icon="close" flat round dense class="absolute-top-right q-mt-sm q-mr-sm" @click="closeModal" />
    </q-card-section>

    <q-separator />

    <q-card-section>

      <!-- POSTOJEĆA SLIKA DOGAĐAJA -->
      <div class="q-mb-md flex flex-center">
        <q-img
          v-if="eventImages[selectedEvent?.ID_dogadaja]"
          :src="eventImages[selectedEvent.ID_dogadaja]"
          style="max-width: 100%; max-height: 280px; border-radius: 12px;"
          fit="contain"
        />
        <div
          v-else
          class="bg-grey-3 flex flex-center"
          style="width:100%; height:280px; border-radius:12px;"
        >
          <q-icon name="image_not_supported" size="64px" color="grey-7" />
        </div>
      </div>

      <!-- OPIS DOGAĐAJA -->
      <div class="q-mb-md">
        <div class="text-subtitle2 text-grey-7 q-mb-xs">Opis događaja:</div>
        <div>{{ selectedEvent?.Opis_dogadaja || "Nema opisa." }}</div>
      </div>


      <q-separator class="q-my-md" />

      <!-- UPLOAD DIO -->
      <div class="column items-center">

        <!-- Drag & drop zona -->
        <div
          class="q-mb-md flex flex-center column bg-grey-2 q-pa-md"
          style="border: 2px dashed grey; border-radius: 12px; height: 180px; width: 100%;"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <q-icon name="cloud_upload" size="48px" color="grey-7" />
          <div class="text-grey-9 text-subtitle2">Prevuci sliku ovdje</div>

          <q-btn flat label="Odaberi sliku" class="q-mt-sm" @click="pickFile" />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handlePickedFile"
          />
        </div>

        <!-- Preview -->
        <div v-if="previewUrl" class="q-mb-md">
          <img :src="previewUrl" style="max-width:100%; max-height:250px; object-fit:contain; border:1px solid #aaa;" />
        </div>

        <!-- Upload button -->
        <q-btn
          color="primary"
          label="Upload"
          :disable="!file"
          @click="uploadImage"
        />

      </div>

    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Zatvori" color="negative" @click="closeModal" />
    </q-card-actions>

  </q-card>
</q-dialog>


  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      events: [],
      eventImages: {},

      modal: false,
      selectedEvent: null,

      file: null,
      previewUrl: null,
    };
  },

  async mounted() { // učitaj događaje iz baze
    const res = await axios.get("http://localhost:3000/dogadaji");
    this.events = res.data;

    // učitaj slike za sve evente
    for (let ev of this.events) {
      this.eventImages[ev.ID_dogadaja] = await this.loadImage(ev.ID_dogadaja);
    }
  },

  methods: {
    async loadImage(id) { // učitaj sliku događaja
      try {
        const res = await fetch(`http://localhost:3000/dogadaj/${id}/slika`);
        if (!res.ok) return null;
        const blob = await res.blob();
        return URL.createObjectURL(blob);
      } catch {
        return null;
      }
    },

    openUploadModal(ev) { // otvori modal za upload slike
      this.selectedEvent = ev;
      this.file = null;
      this.previewUrl = null;
      this.modal = true;
    },

    closeModal() { // zatvori modal i očisti podatke
      this.modal = false;
      this.file = null;
      this.previewUrl = null;
    },

    pickFile() {
      this.$refs.fileInput.click();
    },

    handlePickedFile(e) {
      const f = e.target.files[0];
      if (!f) return;
      this.setFile(f);
    },

    handleDrop(e) {
      const f = e.dataTransfer.files[0];
      if (!f) return;
      this.setFile(f);
    },

    setFile(f) {
      this.file = f;
      this.previewUrl = URL.createObjectURL(f);
    },

    async uploadImage() {
      if (!this.file || !this.selectedEvent) return;

      try {
        const form = new FormData();
        form.append("slika", this.file);

        await axios.post(
          `http://localhost:3000/dogadaj/${this.selectedEvent.ID_dogadaja}/upload`, // upload endpoint
          form,
          { headers: { "Content-Type": "multipart/form-data" } } // postavljanje headera
        );

        // refresh thumbnail slike
        this.eventImages[this.selectedEvent.ID_dogadaja] =
          await this.loadImage(this.selectedEvent.ID_dogadaja);

        this.$q.notify({ type: "positive", message: "Slika uploadana!" });

        this.closeModal();
      } catch {
        this.$q.notify({ type: "negative", message: "Greška pri uploadu!" });
      }
    },
  },
};
</script>

<style>
.my-card {
  transition: 0.2s;
}
.my-card:hover {
  transform: scale(1.03);
}
</style>

