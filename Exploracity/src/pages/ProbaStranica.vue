<template>
  <q-page class="row items-center justify-center bg-grey-2">
    <div class="diagonal-split q-pa-md" style="width: 90%;">
      <!-- Right side (image) -->
      <div class="side right" :style="rightStyle">
        <div class="image-wrapper">
          <div class="image-inner">
            <img :src="imageSrc" alt="picture" />
          </div>
        </div>

      </div>

      <!-- Left side (title + description) -->
      <div class="side left">
        <div class="left-content q-pa-lg">
          <h3 class="title">{{ title }}</h3>
          <p class="description">{{ description }}</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'DiagonalSplitCardPage',
  props: {
    title: { type: String, default: 'LOKACIJE' },
    description: { type: String, default: 'Lokacija u Exploracityju automatski prepoznaje grad i prikazuje ti najbliža događanja na karti. Na temelju tvoje lokacije i preferencija filtrira događaje, daje personalizirane preporuke te omogućava brzu kupovinu ulaznica. Nakon posjeta, lokacija ti šalje podsjetnik za recenziju kako bi preporuke bile još preciznije.' },
    imageSrc: { type: String, default: 'https://i.pinimg.com/1200x/16/50/45/16504512603bf22af80b92b748d6f146.jpg' },
    diagonalPercent: { type: Number, default: 50 }
  },
  computed: {
    rightStyle() {
      return { background: this.imageSrc ? 'transparent' : '#ddd' }
    }
  }
}
</script>

<style scoped>
.diagonal-split {
  /* 1. REMOVED: filter: drop-shadow(...) from here */
  position: relative;
  width: 100%;
  height: 320px;
  display: block;
  overflow: visible;
}
.side {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.left {
  left: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: white;
  background: linear-gradient(135deg, #2b2f77 0%, #6b63c8 100%);
  clip-path: polygon(0 0, 58% 0, 42% 100%, 0 100%);
  box-sizing: border-box;
  
  /* 2 & 3. NEW: Drop shadow applied to the left element (the clipped shape) */
  /* The values (20px 20px 20px) are adjusted to cast a strong shadow 
     down and right, highlighting the diagonal edge. */
  filter: drop-shadow(200px 200px 200px rgba(0, 0, 0, 0.45)); 
}
.left-content {
  position: relative;
  z-index: 4;
  max-width: 52%;
}
.title {
  margin: 0 0 8px 0;
  font-size: 1.6rem;
  line-height: 1.1;
}
.description {
  margin: 0;
  opacity: 0.92;
}
.right {
  clip-path: polygon(58% 0, 100% 0, 100% 100%, 42% 100%);
  overflow: hidden;
}

.image-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;   /* ← REQUIRED */
  overflow: hidden;
}

.image-inner {
  width: 100%;
  height: 100%;   /* ← REQUIRED */
  transform: scale(0.6) translateY(40%);
  transform-origin: center;
}


.image-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}



@media (max-width: 600px) {
  .diagonal-split { height: 260px }
  .left-content { max-width: 70% }
}
</style>