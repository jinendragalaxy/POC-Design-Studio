<template>
  <div class="toolbar">
    <h3>🎨 Toolbar</h3>

    <!-- Basic Tools Section -->
    <div class="group">
      <div class="group-header" @click="toggleSection('basic')">
        <h4>Basic Tools</h4>
        <span>{{ openSections.basic ? '▲' : '▼' }}</span>
      </div>
      <div v-show="openSections.basic" class="group-body">
        <button @click="deleteObject">Delete</button>
        <button @click="handleUndo">Undo</button>
        <button @click="handleRedo">Redo</button>
      </div>
    </div>

    <!-- Shapes Section -->
    <div class="group">
      <div class="group-header" @click="toggleSection('shapes')">
        <h4>Shapes</h4>
        <span>{{ openSections.shapes ? '▲' : '▼' }}</span>
      </div>
      <div v-show="openSections.shapes" class="group-body">
        <button @click="addShape('rect')">Rectangle</button>
        <button @click="addShape('circle')">Circle</button>
        <button @click="addShape('triangle')">Triangle</button>
        <button @click="addShape('ellipse')">Ellipse</button>
      </div>
    </div>

    <!-- Text Section -->
    <div class="group">
      <div class="group-header" @click="toggleSection('text')">
        <h4>Text</h4>
        <span>{{ openSections.text ? '▲' : '▼' }}</span>
      </div>
      <div v-show="openSections.text" class="group-body">
        <button @click="addText">Add Text</button>
      </div>
    </div>

    <!-- Stickers & Images Section -->
    <div class="group">
      <div class="group-header" @click="toggleSection('images')">
        <h4>Stickers & Images</h4>
        <span>{{ openSections.images ? '▲' : '▼' }}</span>
      </div>
      <div v-show="openSections.images" class="group-body">
        <button @click="$emit('show-sticker-popup')">Add Sticker</button>
        <button @click="$emit('show-random-popup')">Add Random Image</button>
        <input type="file" @change="uploadImage" />
      </div>
    </div>

    <!-- Object Controls -->
    <div class="group">
      <div class="group-header" @click="toggleSection('controls')">
        <h4>Object Controls</h4>
        <span>{{ openSections.controls ? '▲' : '▼' }}</span>
      </div>
      <div v-show="openSections.controls" class="group-body">
        <button @click="duplicateSelectedObject">Duplicate</button>
        <button @click="bringForward">Bring Forward</button>
        <button @click="sendBackward">Send Backward</button>
      </div>
    </div>

    <!-- Export Section -->
    <div class="group">
      <div class="group-header" @click="toggleSection('export')">
        <h4>Export</h4>
        <span>{{ openSections.export ? '▲' : '▼' }}</span>
      </div>
      <div v-show="openSections.export" class="group-body">
        <button @click="downloadPNG">Export PNG</button>
        <button @click="downloadPDF">Export PDF</button>
      </div>
    </div>
  
    <!-- Popup component for sticker -->
    <!-- <Popup :visible="showStickerPopup" title="Choose a Sticker" @close="showStickerPopup = false">
      <div class="sticker-list">
        <img v-for="sticker in stickers" :key="sticker.id" :src="sticker.url" @click="addSticker(sticker.url)"
          style="width: 80px; margin: 10px; cursor: pointer;" />
      </div>
    </Popup> -->
    <!-- Popup component for random images -->
    <!-- <Popup :visible="showRandomPopup" title="Choose a Random IMages" @close="showRandomPopup = false">
      <div class="sticker-list">
        <img v-for="random in randoms" :key="random.id" :src="random.url" @click="addRandom(random.url)"
          style="width: 80px; margin: 10px; cursor: pointer;" />
      </div>
    </Popup> -->


  </div>
</template>

<script>
import jsPDF from "jspdf";
import Popup from "./Common/Popup.vue"
export default {
  data() {
    return {
      openSections: {
        basic: false,
        shapes: false,
        text: false,
        images: false,
        controls: false,
        export: false,
      }
    };
  },
  props: {
    canvas: Object,
    clipRect: Object,
    canUndo: {
      type: Boolean,
      default: false,
    },
    canRedo: {
      type: Boolean,
      default: false,
    },
    
  },
  components: {
    Popup
  },
  // data() {
  //   return {
  //     showStickerPopup: false,
  //     stickers: [
  //       { id: 1, url: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
  //       { id: 2, url: "https://cdn-icons-png.flaticon.com/512/616/616430.png" },
  //       { id: 3, url: "https://cdn-icons-png.flaticon.com/512/616/616468.png" },
  //     ],

  //     showRandomPopup: false,
  //     randoms: [
  //       { id: 1, url: "https://picsum.photos/200" },
  //       { id: 2, url: "https://loremflickr.com/g/200/240/paris" },
  //       { id: 3, url: "https://cdn-icons-png.flaticon.com/512/616/616468.png" },
  //     ],
  //   };
  // },
  methods: {
    handleUndo() {
      this.$emit('undo');
    },
    handleRedo() {
      this.$emit('redo');
    },
    toggleSection(section) {
      this.openSections[section] = !this.openSections[section];
    },
    addShape(type) {
      if (!this.clipRect) {
        console.warn("Clip area not ready yet");
        return;
      }

      const { left, top } = this.clipRect;
      const shapeProps = { left: left + 10, top: top + 10, stroke: '#000', strokeWidth: 1};

      let shape;
      switch (type) {
        case "rect":
          shape = new fabric.Rect({
            width: 100,
            height: 60,
            fill: "lightblue",
            ...shapeProps,
          });
          break;
        case "circle":
          shape = new fabric.Circle({
            radius: 50,
            fill: "lightgreen",
            ...shapeProps,
          });
          break;
        case "triangle":
          shape = new fabric.Triangle({
            width: 100,
            height: 100,
            fill: "pink",
            ...shapeProps,
          });
          break;
        case "ellipse":
          shape = new fabric.Ellipse({
            rx: 75,
            ry: 45,
            fill: "orange",
            ...shapeProps,
          });
          break;
      }

      this.canvas.add(shape);
    },

    addText() {
      if (!this.clipRect) {
        console.warn("Clip area not ready yet");
        return;
      }

      const { left, top } = this.clipRect;

      const text = new fabric.IText("Edit me", {
        left: left + 10,
        top: top + 10,
        fill: "#000",
        fontSize: 24,
      });

      this.canvas.add(text);
    },

    uploadImage(e) {
      if (!this.clipRect) {
        console.warn("Clip area not ready yet");
        return;
      }

      const file = e.target.files[0];
      if (!file) return;

      const { left, top } = this.clipRect;

      const reader = new FileReader();
      reader.onload = (evt) => {
        fabric.Image.fromURL(evt.target.result, (img) => {
          img.scaleToWidth(150);
          img.set({ left: left + 10, top: top + 10 });
          this.canvas.add(img);
        });
      };
      reader.readAsDataURL(file);
    },

    //  Duplicate the object
    duplicateSelectedObject() {
      const activeObject = this.canvas.getActiveObject();

      if (!activeObject) {
        console.warn("No active object to duplicate");
        return;
      }

      activeObject.clone((cloned) => {
        // Offset the position slightly
        cloned.set({
          left: activeObject.left + 20,
          top: activeObject.top + 20,
          evented: true
        });

        // Add to canvas
        this.canvas.add(cloned);
        this.canvas.setActiveObject(cloned);
        this.canvas.renderAll();
      });
    },

    deleteObject() {
      const obj = this.canvas.getActiveObject();
      if (obj) this.canvas.remove(obj);
    },

    bringForward() {
      const obj = this.canvas.getActiveObject();
      if (!obj) return;
      this.canvas.bringForward(obj);
      this.canvas.renderAll();
    },

    sendBackward() {
      const obj = this.canvas.getActiveObject();
      if (!obj) return;
      this.canvas.sendBackwards(obj);
      this.canvas.renderAll();
    },

    downloadPNG() {
      if (!this.canvas || !this.clipRect) return;
      // Hide the clip area temporary
      this.clipRect.visible = false;
      this.canvas.renderAll();
      // Get the data URL of the canvas without clip area
      const dataURL = this.canvas.toDataURL({ format: "png" });
      // Restore clip area visibility
      this.clipRect.visible = true;
      this.canvas.renderAll();
      // download
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = "design.png";
      a.click();
    },

    // downloadPDF() {
    //   // Hide the clip area temporary
    //   this.clipRect.visible = false;
    //   this.canvas.renderAll()

    //   //capture the canvas as image
    //   const imgData = this.canvas.toDataURL('image/png');
    //   const pdf = new jsPDF();
    //   pdf.addImage(imgData, 'PNG', 10, 10);
    //   pdf.save('canvas.pdf');

    //   // Restore clip area visibility
    // this.clipRect.visible = true;
    // this.canvas.renderAll();

    // }
    downloadPDF() {
      // Hide the clip area temporarily
      this.clipRect.visible = false;
      this.canvas.renderAll();
      // Capture the canvas as image
      const imgData = this.canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      // Get the canvas size in pixels
      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();
      // Convert canvas dimensions to mm (1 px = 0.264583 mm)
      const imgProps = {
        width: canvasWidth * 0.264583,

        height: canvasHeight * 0.264583,
      };
      // Center the image
      const x = (pdfWidth - imgProps.width) / 2;
      const y = (pdfHeight - imgProps.height) / 2;
      pdf.addImage(imgData, "PNG", x, y, imgProps.width, imgProps.height);
      pdf.save("canvas.pdf");
      // Restore clip area visibility
      this.clipRect.visible = true;
      this.canvas.renderAll();
    },

    //add Sticker
    // addSticker(url) {
    //   if (!this.clipRect) {
    //     console.warn("Clip area not ready yet");
    //     return;
    //   }

    //   const { left, top } = this.clipRect;
    //   fabric.Image.fromURL(url, (img) => {
    //     img.set({ left: left + 20, top: top + 20, scaleX: 0.3, scaleY: 0.3 });
    //     this.canvas.add(img);
    //     this.canvas.setActiveObject(img);
    //     this.canvas.renderAll();
    //     this.showStickerPopup = false;
    //   },{crossOrigin: 'anonymous'});
    // },

    //  //add Random
    //  addRandom(url) {
    //   if (!this.clipRect) {
    //     console.warn("Clip area not ready yet");
    //     return;
    //   }

    //   const { left, top } = this.clipRect;
    //   fabric.Image.fromURL(url, (img) => {
    //     img.set({ left: left + 20, top: top + 20, scaleX: 0.3, scaleY: 0.3 });
    //     this.canvas.add(img);
    //     this.canvas.setActiveObject(img);
    //     this.canvas.renderAll();
    //     this.showRandomPopup = false;
    //   },{crossOrigin: 'anonymous'});
    // },


  },
};
</script>
<style scoped>
/* Toolbar container */
.toolbar {
  width: 280px;
  padding: 15px 20px;
  background: #f9fafb;
  border-right: 2px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  user-select: none;
}

/* Main toolbar heading */
h3 {
  margin-bottom: 10px;
  color: #333;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 5px;
  font-weight: 700;
}

/* Group container */
.group {
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

/* Collapsible section header */
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 5px;
}

.group-header h4 {
  margin: 0;
  font-weight: 600;
  color: #1976d2;
}

/* Section content */
.group-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 5px 0 10px;
}

/* Buttons */
button {
  padding: 8px 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #155a9c;
}

/* File input */
input[type="file"] {
  margin-top: 6px;
}
</style>
