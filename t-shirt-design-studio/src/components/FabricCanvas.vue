<template>
  <div class="container">
    <header class="header">
      <h1>Design Studio</h1>
      <p>Create and export your custom designs here.</p>
    </header>

    <div class="canvas-wrapper">
      <canvas ref="canvas" width="1000" height="700"></canvas>
    </div>
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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 32px;
  color: #333;
  margin: 0;
}

.header p {
  font-size: 16px;
  color: #666;
  margin: 5px 0 0;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f3f3;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

canvas {
  border: 2px solid #ccc;
  background: white;
}
</style>
