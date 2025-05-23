<!-- components/Popup.vue -->
<template>
    <div class="popup-overlay" v-if="visible">
      <div class="popup-window">
        <h3>{{ title }}</h3>
        <div class="popup-content">
          <slot />
        </div>
        <button @click="$emit('close')">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: Boolean,
      title: {
        type: String,
        default: "Popup",
      },
    },
  };
  </script>
  
  <style scoped>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  .popup-window {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    max-height: 80vh;
    overflow-y: auto;
  }
  .popup-content {
    margin-top: 10px;
  }
  </style>
  