<template>
  <q-page class="row items-center justify-center">
  <div class="imessage q-ma-md">
    <p class="from-me">It was loud. We just laid there and said &ldquo;is this an earthquake? I think this is an earthquake.&rdquo;</p>
    <p class="from-them">Like is this an earthquake just go back to sleep</p>
  </div>
    <div class="diagonal-split q-pa-md q-mt-s" style="width: 90%;">
      <!-- Right side (image) -->
      <div class="side right">
        <div class="image-wrapper">
          <img :src="imageSrc" alt="picture" class="moving-image"/>
        </div>
      </div>

        

      <!-- Left side (title + description) -->
      <div class="side left">
        <div class="left-content q-pa-lg">
          <h3 class="title">LOKACIJE</h3>
          <p class="description">{{ description }}</p>
        </div>
      </div>
    </div>
    <div class="diagonal-split q-pa-md q-mt-xl" style="width: 90%;">

  <!-- Left side (image) -->
  <div class="side left">
    <div class="image-wrapper">
      <img src="https://i.pinimg.com/1200x/ac/b6/38/acb638526d9de2adbd3af3fed3191045.jpg" style="position: relative; bottom: 30%;" alt="picture" class="moving-image"/>
    </div>
  </div>

  <!-- Right side (title + description) -->
  <div class="side rightMirrored">
    <div class="right-content leftMirrored q-pa-lg">
      <h3 class="title">DOGAĐANJA</h3>
      <p class="description">{{ description }}</p>
    </div>
  </div>

</div>
    <div class="diagonal-split q-pa-md q-mt-xl" style="width: 90%;">
      <!-- Right side (image) -->
      <div class="side right">
        <div class="image-wrapper">
          <img :src="imageSrc" alt="picture" class="moving-image"/>
        </div>
      </div>


      <!-- Left side (title + description) -->
      <div class="side left">
        <div class="left-content q-pa-lg ">
          <h3 class="title">KALENDAR DOGAĐANJA</h3>
          <p class="description">{{ description }}</p>
        </div>
      </div>
    </div>
    <div class="diagonal-split q-pa-md q-mt-xl" style="width: 90%;">

  <!-- Left side (image) -->
  <div class="side left">
    <div class="image-wrapper">
      <img :src="imageSrc" alt="picture" class="moving-image"/>
    </div>
  </div>

  <!-- Right side (title + description) -->
  <div class="side rightMirrored">
    <div class="right-content leftMirrored q-pa-lg">
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ description }}</p>
    </div>
  </div>

</div>
    <div class="imessage q-ma-md">
   <p class="from-them">Like is this an earthquake just go back to sleep</p>
  </div>
    <div class="diagonal-split q-pa-md " style="width: 90%;">
      <!-- Right side (image) -->
      <div class="side right">
        <div class="image-wrapper">
          <img :src="imageSrc" alt="picture" class="moving-image"/>
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

    <div class="diagonal-split q-pa-md q-mt-xl" style="width: 90%;">

  <!-- Left side (image) -->
  <div class="side left">
    <div class="image-wrapper">
      <img src="" alt="picture" class="moving-image"/>
    </div>
  </div>

  <!-- Right side (title + description) -->
  <div class="side rightMirrored">
    <div class="right-content leftMirrored q-pa-lg">
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
    title: { type: String, default: 'DOGADANJA' },
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
  overflow: hidden;
  border-radius: 30px;
}
.side {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
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
.left {
  left: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: white;
  background: linear-gradient(135deg, #000000 0%, #303030 100%);
  clip-path: polygon(0 0, 60.1% 0, 43.9% 100%, 0 100%);
  box-sizing: border-box;
}

.leftMirrored{
  left: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: white;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: center;
}

.left-content {
  position: relative;
  z-index: 4;
  max-width: 52%;
}

.right-content {
  position: relative;
  z-index: 4;
  max-width: 52%;
}
.right {
  clip-path: polygon(57.9% 0, 100% 0, 100% 100%, 42.1% 100%);
}

.rightMirrored{
  left: 0;
  z-index: 3;
  display: flex;
  align-items: right;
  text-align: right;
  justify-content: flex-end;
  color: white;
  background: linear-gradient(135deg, #303030 0%, #000 100%);
  clip-path: polygon(57.9% 0, 100% 0, 100% 100%, 42.1% 100%);
  box-sizing: border-box;
}

.moving-image {
  width: 100%;
  height: 100%;
  object-fit:fill;
  position: relative;
  bottom: 350px;
  scale:1;
  transition: 0.5s;
}

.moving-image:hover{
  scale:1.1;
  transition: 0.5s;
}

.imessage {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  font-family: "SanFrancisco";
  font-size: 1.25rem;
  width: 90%;
}

.imessage p {
  border-radius: 1.15rem;
  line-height: 1.25;
  max-width: 75%;
  padding: 0.5rem .875rem;
  position: relative;
  word-wrap: break-word;
}

.imessage p::before,
.imessage p::after {
  bottom: -0.1rem;
  content: "";
  height: 1rem;
  position: absolute;
}

p.from-me {
  align-self: flex-end;
  background-color: black;
  color: #fff; 
}

p.from-me::before {
  border-bottom-left-radius: 0.8rem 0.7rem;
  border-right: 1rem solid black;
  right: -0.35rem;
  transform: translate(0, -0.1rem);
}

p.from-me::after {
  background-color: #fff;
  border-bottom-left-radius: 0.5rem;
  right: -40px;
  transform:translate(-30px, -2px);
  width: 10px;
}

p[class^="from-"] {
  margin: 0.5rem 0;
  width: fit-content;
}

p.from-me ~ p.from-me {
  margin: 0.25rem 0 0;
}

p.from-me ~ p.from-me:not(:last-child) {
  margin: 0.25rem 0 0;
}

p.from-me ~ p.from-me:last-child {
  margin-bottom: 0.5rem;
}

p.from-them {
  align-items: flex-start;
  background-color: #e5e5ea;
  color: #000;
}

p.from-them:before {
  border-bottom-right-radius: 0.8rem 0.7rem;
  border-left: 1rem solid #e5e5ea;
  left: -0.35rem;
  transform: translate(0, -0.1rem);
}

p.from-them::after {
  background-color: #fff;
  border-bottom-right-radius: 0.5rem;
  left: 20px;
  transform: translate(-30px, -2px);
  width: 10px;
}

p[class^="from-"].emoji {
  background: none;
  font-size: 2.5rem;
}

p[class^="from-"].emoji::before {
  content: none;
}

.no-tail::before {
  display: none;
}

.margin-b_none {
  margin-bottom: 0 !important;
}

.margin-b_one {
  margin-bottom: 1rem !important;
}

.margin-t_one {
  margin-top: 1rem !important;
}

/* general styling */
@font-face {
  font-family: "SanFrancisco";
  src:
    url("https://cdn.rawgit.com/AllThingsSmitty/fonts/25983b71/SanFrancisco/sanfranciscodisplay-regular-webfont.woff2") format("woff2"),
    url("https://cdn.rawgit.com/AllThingsSmitty/fonts/25983b71/SanFrancisco/sanfranciscodisplay-regular-webfont.woff") format("woff");
}

body {  
  font-family: -apple-system, 
    BlinkMacSystemFont, 
    "Segoe UI", 
    Roboto, 
    Oxygen-Sans, 
    Ubuntu, 
    Cantarell, 
    "Helvetica Neue", 
    sans-serif;
  font-weight: normal;
  margin: 0;
}

.container {
  margin: 0 auto;
  max-width: 600px;
  padding: 1rem;
}

h1 {
  font-weight: normal;
  margin-bottom: 0.5rem;
}

h2 {
  border-bottom: 1px solid #e5e5ea;
  color: #666;
  font-weight: normal;
  margin-top: 0;
  padding-bottom: 1.5rem;
}

.comment {
  color: #222;
  font-size: 1.25rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
  max-width: 100%;
  padding: 0;
}

@media screen and (max-width: 800px) {
   .imessage {
    font-size: 1.05rem;
    margin: 0 auto 1rem;
    max-width: 600px;
    padding: 0.25rem 0.875rem;
  }

  .imessage p {
    margin: 0.5rem 0;
  }
}
</style>