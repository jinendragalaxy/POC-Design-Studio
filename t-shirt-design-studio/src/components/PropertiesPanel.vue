<template>
  <div class="panel">
    <h3>Properties</h3>

    <!-- text properties if text selects by user -->
    <div v-if="textSelected">
      <label>Font Size:
        <input type="number" v-model.number="fontSize" @change="updateFontSize" />
      </label>
      <label>Font Color:
        <input type="color" v-model="color" @input="updateColor" />
      </label>
      <label>Font Family:
        <select v-model="fontFamily" @change="updateFontFamily">
          <option value="Arial">Arial</option>
          <option value="Courier">Courier</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
      </label>
      <button @click="toggleBold">Bold</button>
      <button @click="toggleItalic">Italic</button>
      <button @click="toggleUnderline">Underline</button>
    </div>

<!-- image properties if image selects by user -->
    <div v-else-if="imageSelected">
      <label>Opacity:
        <input type="range" min="0" max="1" step="0.1" v-model.number="opacity" @input="updateOpacity" />
      </label>

      <label>Rotate : 
        <input type="range" min="0" max="360" step="1" v-model.number="angle" @input="updateAngle" />
      </label>
      
    </div>

<!-- shape properties if shape selects by user -->
    <div v-else-if="shapeSelected">
      <label>Fill Color:
        <input type="color" v-model="fill" @input="updateFill" />
      </label>
      <label>Stroke Color:
        <input type="color" v-model="stroke" @input="updateStroke" />
      </label>
      <label>Stroke Width:
        <input type="number" v-model.number="strokeWidth" @change="updateStrokeWidth" />
      </label>
    </div>

    <!-- when nothing selected -->
    <div v-else>
      <p>No shape selected.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['canvas'],
  data() {
    return {
      active: null,
      fontSize: 24,
      color: '#000000',
      fontFamily: 'Arial',
      opacity: 1,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
      angle: 0,
      
    };
  },
  computed: {
    // Check if the selected object is text
    textSelected() {
      return this.active && this.active.type === 'i-text';
    },
    // Check if the selected object is an image
    imageSelected() {
      return this.active && this.active.type === 'image';
    },
    // Check if the selected object is a shape
    shapeSelected() {
      return (
        this.active &&
        ['rect', 'circle', 'triangle'].includes(this.active.type)
      );
    }
  },
  watch: {
    canvas: {
      immediate: true,
      handler(canvas) {
        if (canvas) {
          canvas.on('selection:created', this.setActive);
          canvas.on('selection:updated', this.setActive);
          canvas.on('selection:cleared', () => {
            console.log('Selection cleared');
            this.active = null;
          });
        }
      }
    }
  },
  methods: {
    // Sets the active object and updates UI properties based on its type
    setActive(e) {
      this.active = e.target;
      console.log('Active object selected:', this.active);

      if (this.textSelected) {
        this.fontSize = this.active.fontSize;
        this.color = this.active.fill;
        this.fontFamily = this.active.fontFamily || 'Arial';
        console.log('Text properties loaded');
      } else if (this.imageSelected) {
        this.opacity = this.active.opacity || 1;
        console.log('Image properties loaded');
      } else if (this.shapeSelected) {
        this.fill = this.active.fill || '#ffffff';
        this.stroke = this.active.stroke || '#000000';
        this.strokeWidth = this.active.strokeWidth || 1;
        console.log('Shape properties loaded');
      }
    },

    // Updates text font size
    updateFontSize() {
      if (this.textSelected) {
        this.active.set('fontSize', this.fontSize);
        this.canvas.renderAll();
        console.log('Font size updated:', this.fontSize);
      }
    },

    // Updates fill color for text
    updateColor() {
      if (this.textSelected) {
        this.active.set('fill', this.color);
        this.canvas.renderAll();
        console.log('Font color updated:', this.color);
      }
    },

    // Updates font family for text
    updateFontFamily() {
      if (this.textSelected) {
        this.active.set('fontFamily', this.fontFamily);
        this.canvas.renderAll();
        console.log('Font family updated:', this.fontFamily);
      }
    },

    // Toggles bold style
    toggleBold() {
      if (this.textSelected) {
        const isBold = this.active.fontWeight === 'bold';
        this.active.set('fontWeight', isBold ? 'normal' : 'bold');
        this.canvas.renderAll();
        console.log('Bold toggled:', !isBold);
      }
    },

    // Toggles italic style
    toggleItalic() {
      if (this.textSelected) {
        const isItalic = this.active.fontStyle === 'italic';
        this.active.set('fontStyle', isItalic ? 'normal' : 'italic');
        this.canvas.renderAll();
        console.log('Italic toggled:', !isItalic);
      }
    },

    // Toggles underline
    toggleUnderline() {
      if (this.textSelected) {
        const isUnderlined = this.active.underline;
        this.active.set('underline', !isUnderlined);
        this.canvas.renderAll();
        console.log('Underline toggled:', !isUnderlined);
      }
    },

    // Updates opacity for image
    updateOpacity() {
      if (this.imageSelected) {
        this.active.set('opacity', this.opacity);
        this.canvas.renderAll();
        console.log('Opacity updated:', this.opacity);
      }
    },

    updateAngle(){
      if(this.imageSelected){
        this,this.active.set('angle', this.angle);
        this.canvas.renderAll();
      }
    },

    // Updates fill color for shape
    updateFill() {
      if (this.shapeSelected) {
        this.active.set('fill', this.fill);
        this.canvas.renderAll();
        console.log('Shape fill updated:', this.fill);
      }
    },

    // Updates stroke color for shape
    updateStroke() {
      if (this.shapeSelected) {
        this.active.set('stroke', this.stroke);
        this.canvas.renderAll();
        console.log('Stroke color updated:', this.stroke);
      }
    },

    // Updates stroke width for shape
    updateStrokeWidth() {
      if (this.shapeSelected) {
        this.active.set('strokeWidth', this.strokeWidth);
        this.canvas.renderAll();
        console.log('Stroke width updated:', this.strokeWidth);
      }
    }
  }
};
</script>

<style scoped>
.panel {
  width: 220px;
  padding: 15px;
  background: #f9f9f9;
  border-left: 1px solid #ccc;
}
label {
  display: block;
  margin: 10px 0;
}
input[type="color"],
select,
input[type="number"],
input[type="range"] {
  width: 100%;
}
button {
  margin: 5px 5px 0 0;
  padding: 5px 10px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 3px;
}
</style>
