<template>
  <div class="product-page">
    <h1 class="title">Choose Your Product</h1>

    <!-- 🟢 Product Grid (Untouched) -->
    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img
          :src="getImageUrl(product.image)"
          alt="Product Image"
          class="product-image"
        />
        <button class="customize-btn" @click="customizeProduct(product.id)">
          Customize
        </button>
      </div>
    </div>

    <!-- 🟡 New Section: 360° Shoe Viewer -->
    <div class="shoe360-section">
      <h2 class="title">360° Shoe View</h2>

      <div
        class="viewer"
        @mousedown="startDrag('shoe', $event)"
        @mousemove="onDrag('shoe', $event)"
        @mouseup="endDrag"
        @mouseleave="endDrag"
      >
        <img
          :src="get360ShoeImage()"
          class="product-image"
          draggable="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import productsData from '@/data/products.json';
import images360 from '@/data/360.json'; // 360 shoe image list under key "shoe"

export default {
  data() {
    return {
      products: productsData,
      images360,
      dragging: false,
      startX: 0,
      shoeFrameIndex: 0 // index for the shoe 360 frame
    };
  },
  methods: {
    getImageUrl(filename) {
      return require(`@/assets/${filename}`);
    },
    customizeProduct(productId) {
      this.$router.push({ name: 'DesignStudio', query: { id: productId } });
    },
    get360ShoeImage() {
      const frames = this.images360["shoe"];
      if (!frames || frames.length === 0) return '';
      const imageName = frames[this.shoeFrameIndex];
      return require(`@/assets/360 Images/Shoe/${imageName}`);
    },
    startDrag(type, e) {
      this.dragging = true;
      this.startX = e.clientX;
    },
    onDrag(type, e) {
      if (!this.dragging) return;
      const dx = e.clientX - this.startX;
      if (Math.abs(dx) > 5) {
        if (type === 'shoe') {
          const frames = this.images360["shoe"];
          const direction = dx > 0 ? 1 : -1;
          this.shoeFrameIndex =
            (this.shoeFrameIndex + direction + frames.length) % frames.length;
        }
        this.startX = e.clientX;
      }
    },
    endDrag() {
      this.dragging = false;
    }
  }
};
</script>

<style scoped>
.product-page {
  padding: 30px;
  background-color: #f5f5f5;
  min-height: 100vh;
  font-family: sans-serif;
}

.title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.product-card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 250px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.product-image {
  width: 180px;
  height: 180px;
  object-fit: contain;
  user-select: none;
  margin-bottom: 15px;
}

.customize-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
}

.customize-btn:hover {
  background-color: #0056b3;
}

.shoe360-section {
  margin-top: 60px;
  text-align: center;
}

.viewer {
  width: 700px;       /* Increase width */
  height: 400px;      /* Increase height */
  margin: 0 auto;
  overflow: hidden;
  cursor: grab;
}

.viewer .product-image {
  width: 100%;        /* Fill viewer */
  height: 100%;
  object-fit: contain;
  user-select: none;
}
</style>
