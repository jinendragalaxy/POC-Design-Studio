<template>
  <div class="product-page">
    <h1 class="title">Choose Your Product</h1>

    <!-- Product Grid -->
    <div class="product-grid">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-card"
        @mouseleave="hidePopup"
      >
        <img
          :src="getImageUrl(product.image)"
          alt="Product Image"
          class="product-image"
        />
        <button class="customize-btn" @click="customizeProduct(product.id)">
          Customize
        </button>
        
        <!-- OLD Quick view button (don't remove as per request) -->
        <!-- <button
          v-if="has360View(product)"
          class="quickview-btn"
          @click="openQuickView(product)"
        >
          360 View
        </button> -->

        <!-- NEW: Quick View Button on Hover for ALL products -->
        <div class="quickview-hover-btn" v-if="activePopup !== product.id">
          <button @click="showPopup(product)">
            Quick View
          </button>
        </div>

        <!-- NEW: Popup Shows Either 360 or Normal Image -->
        <!-- Popup Overlay for close on outside click -->
<div v-if="activePopup" class="popup-overlay" @click.self="closePopup">
  <div class="popup-container">
    <div class="popup-content">
      <span class="close-btn" @click="closePopup">&times;</span>
      <div 
        class="popup-viewer"
        @mousedown="startDrag($event)"
        @mousemove="onDrag($event)"
        @mouseup="endDrag"
        @mouseleave="endDrag"
      >
        <!-- 360 or Normal image -->
        <img
          v-if="has360View(currentProduct)"
          :src="get360ImageForProduct(currentProduct, shoeFrameIndex)"
          class="product-image"
          draggable="false"
        />
        <img
          v-else
          :src="getImageUrl(currentProduct.image)"
          class="product-image"
          draggable="false"
        />
      </div>
    </div>
  </div>
</div>

      </div>
    </div>

    <!-- OLD Quick View Modal (don't remove as per request) -->
    <!-- <div v-if="showQuickView" class="modal-overlay" @click.self="closeQuickView">
      <div class="modal-content">
        <span class="close-btn" @click="closeQuickView">&times;</span>
        <div
          v-if="get360ImageForProduct(selectedProduct, shoeFrameIndex)"
          class="viewer"
          @mousedown="startDrag($event)"
          @mousemove="onDrag($event)"
          @mouseup="endDrag"
          @mouseleave="endDrag"
        >
          <img
            :src="get360ImageForProduct(selectedProduct, shoeFrameIndex)"
            class="product-image"
            draggable="false"
          />
        </div>
      </div>
    </div> -->
  </div>
</template>


<script>
import productsData from '@/data/products.json';
import images360 from '@/data/360.json';

const imageModules = {
  shoe: require.context('@/assets/360 Images/Shoe', false, /\.(png|jpe?g)$/)
  // Add more folders if needed
};

export default {
  data() {
    return {
      products: productsData,
      images360,
      dragging: false,
      startX: 0,
      shoeFrameIndex: 0,
      // OLD: Modal state variables (removed)
      // showQuickView: false,
      // selectedProduct: null

      // NEW: Hover state management
      activePopup: null, // Tracks which product has active popup
      currentProduct: null // Current product for 360 view
    };
  },
  methods: {
    getImageUrl(filename) {
      return require(`@/assets/${filename}`);
    },
    customizeProduct(productId) {
      this.$router.push({ name: 'DesignStudio', query: { id: productId } });
    },

    // OLD: Modal control methods (removed)
    // openQuickView(product) {
    //   this.selectedProduct = product;
    //   this.shoeFrameIndex = 0;
    //   this.showQuickView = true;
    // },
    // closeQuickView() {
    //   this.showQuickView = false;
    // },

    // NEW: Hover-based popup control
    showPopup(product) {
      // Only show popup if product has 360 view
      if (this.has360View(product)) {
        this.activePopup = product.id;
        this.currentProduct = product;
        this.shoeFrameIndex = 0;
      }
    },
    showPopup(product) {
  this.activePopup = product.id;
  this.currentProduct = product;
  this.shoeFrameIndex = 0;
},
    hidePopup() {
      this.activePopup = null;
      this.currentProduct = null;
    },
    // NEW: Close popup on X or outside click
closePopup() {
  this.activePopup = null;
  this.currentProduct = null;
},

    get360ImageForProduct(product, frameIndex = 0) {
      const key = product?.["360Key"];
      if (!key || !this.images360[key] || this.images360[key].length === 0) {
        return null;
      }
      const imageName = this.images360[key][frameIndex];
      try {
        const loader = imageModules[key];
        if (!loader) return null;
        return loader(`./${imageName}`);
      } catch (err) {
        console.warn("⚠️ Image not found:", `./${key}/${imageName}`);
        return null;
      }
    },
    has360View(product) {
      const key = product?.["360Key"];
      return key && this.images360[key] && this.images360[key].length > 0;
    },
    startDrag(e) {
      this.dragging = true;
      this.startX = e.clientX;
    },
    onDrag(e) {
      if (!this.dragging || !this.currentProduct) return; // NEW: Added currentProduct check
      const dx = e.clientX - this.startX;
      if (Math.abs(dx) > 5) {
        const direction = dx > 0 ? 1 : -1;
        const key = this.currentProduct?.["360Key"]; // CHANGED: selectedProduct → currentProduct
        const frames = this.images360[key];
        if (frames) {
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

.customize-btn,
.quickview-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.customize-btn:hover {
  background-color: #0056b3;
}

.quickview-btn {
  margin-left: 10px;
}

.quickview-btn:hover {
  background-color: #218838;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 720px;
  max-width: 90%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 28px;
  cursor: pointer;
}

.viewer {
  width: 100%;
  height: 400px;
  overflow: hidden;
  cursor: grab;
}

.viewer .product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Already updated center container */
.popup-container {
  position: relative;
  width: 650px;
  height: 620px;
  background: white;
  pointer-events: auto;
  border-radius: 10px;
}



.popup-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  /* Subtle shadow */
  padding: 10px;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  /* Re-enable pointer events inside popup */
}

.popup-viewer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
}

.popup-viewer .product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
}

/* Position the popup relative to card */
.product-card {
  position: relative;
  /* Needed for absolute positioning of popup */
}

/* OLD: Modal styles (removed) */
/* .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 720px;
  max-width: 90%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 28px;
  cursor: pointer;
}

.viewer {
  width: 100%;
  height: 400px;
  overflow: hidden;
  cursor: grab;
} */

/* Hide the old quick view button */
.quickview-btn {
  display: none;
}

/* NEW: Quick View button styling */
.quickview-hover-btn {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  z-index: 10;
}

.product-card:hover .quickview-hover-btn {
  display: block;
}

.quickview-hover-btn button {
  background-color: #14ee3170;
  color: rgb(0, 0, 0);
  border: none;
  padding: 10px 10px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
}

.quickview-hover-btn button:hover {
  background-color: #134400;
  color: white;
}
/* NEW: Full screen overlay for popup */

/* Close Button X */
.close-btn {
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  z-index: 999;
}

</style>
