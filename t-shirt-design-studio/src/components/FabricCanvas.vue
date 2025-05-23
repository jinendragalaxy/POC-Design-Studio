<template>
    <div class="canvas-wrapper">
      <canvas ref="canvas" width="1000" height="700"></canvas>
    </div>
  </template>
  
  <script>
  import { fabric } from 'fabric';
  
  export default {
    mounted() {
      const canvas = new fabric.Canvas(this.$refs.canvas, {
        backgroundColor: '#fff'
      });
      this.$emit('canvas-ready', canvas);
    }
  };
  </script>
  
  <style scoped>
  .canvas-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f3f3f3;
  }
  canvas {
    border: 2px solid #ccc;
    background: white;
  }
  </style>
  