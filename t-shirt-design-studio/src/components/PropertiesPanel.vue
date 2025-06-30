<template>
  <div v-if="active" class="panel">
    <div class="panel-content">
      <h3>Properties</h3>

      <!-- Text Properties -->
      <div v-if="textSelected" class="properties-section">
        <div class="section-group">
          <h4>Text Content</h4>
          <label>Text:
            <textarea v-model="textContent" @input="updateTextContent" rows="3"></textarea>
          </label>
        </div>

        <div class="section-group">
          <h4>Font</h4>
          <label>Font Family:
            <select v-model="fontFamily" @change="updateFontFamily">
              <option v-for="font in fontOptions" :value="font.value" :key="font.value">
                {{ font.name }}
              </option>
            </select>
          </label>

          <label>Font Size:
            <input type="range" min="8" max="120" step="1" v-model.number="fontSize" @input="updateFontSize" />
            <span>{{ fontSize }}px</span>
          </label>

          <label>Font Color:
            <input type="color" v-model="color" @input="updateColor" />
          </label>

          <div class="font-style-buttons">
            <button @click="toggleBold" :class="{ active: isBold }">B</button>
            <button @click="toggleItalic" :class="{ active: isItalic }">I</button>
            <button @click="toggleUnderline" :class="{ active: isUnderlined }">U</button>
            <button @click="toggleStrikethrough" :class="{ active: isStrikethrough }">S</button>
            <button @click="toggleOverline" :class="{ active: isOverline }">O</button>
          </div>

          <label>Font Weight:
            <select v-model="fontWeight" @change="updateFontWeight">
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="100">100 (Thin)</option>
              <option value="200">200 (Extra Light)</option>
              <option value="300">300 (Light)</option>
              <option value="400">400 (Regular)</option>
              <option value="500">500 (Medium)</option>
              <option value="600">600 (Semi Bold)</option>
              <option value="700">700 (Bold)</option>
              <option value="800">800 (Extra Bold)</option>
              <option value="900">900 (Black)</option>
            </select>
          </label>

          <label>Line Height:
            <input type="range" min="0.5" max="3" step="0.1" v-model.number="lineHeight" @input="updateLineHeight" />
            <span>{{ lineHeight.toFixed(1) }}</span>
          </label>

          <label>Letter Spacing:
            <input type="range" min="-5" max="20" step="0.5" v-model.number="charSpacing" @input="updateCharSpacing" />
            <span>{{ charSpacing }}px</span>
          </label>

          <label>Text Align:
            <select v-model="textAlign" @change="updateTextAlign">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </label>
        </div>

        <div class="section-group">
          <h4>Background & Border</h4>
          <label>Background Color:
            <input type="color" v-model="textBackgroundColor" @input="updateTextBgColor" />
          </label>

          <label>Background Opacity:
            <input type="range" min="0" max="1" step="0.1" v-model.number="textBackgroundOpacity"
              @input="updateTextBgOpacity" />
            <span>{{ textBackgroundOpacity.toFixed(1) }}</span>
          </label>

          <label>Stroke Color:
            <input type="color" v-model="stroke" @input="updateStroke" />
          </label>

          <label>Stroke Width:
            <input type="range" min="0" max="10" step="0.5" v-model.number="strokeWidth" @input="updateStrokeWidth" />
            <span>{{ strokeWidth }}px</span>
          </label>

          <label>Shadow Color:
            <input type="color" v-model="shadowColor" @input="updateShadow" />
          </label>

          <label>Shadow Blur:
            <input type="range" min="0" max="20" step="1" v-model.number="shadowBlur" @input="updateShadow" />
            <span>{{ shadowBlur }}px</span>
          </label>

          <label>Shadow Offset X:
            <input type="range" min="-20" max="20" step="1" v-model.number="shadowOffsetX" @input="updateShadow" />
            <span>{{ shadowOffsetX }}px</span>
          </label>

          <label>Shadow Offset Y:
            <input type="range" min="-20" max="20" step="1" v-model.number="shadowOffsetY" @input="updateShadow" />
            <span>{{ shadowOffsetY }}px</span>
          </label>
        </div>

        <div class="section-group">
          <h4>Transform</h4>
          <label>Opacity:
            <input type="range" min="0" max="1" step="0.1" v-model.number="opacity" @input="updateOpacity" />
            <span>{{ opacity.toFixed(1) }}</span>
          </label>

          <label>Rotate:
            <input type="range" min="0" max="360" step="1" v-model.number="angle" @input="updateAngle" />
            <span>{{ angle }}°</span>
          </label>

          <label>Scale X:
            <input type="range" min="0.1" max="3" step="0.1" v-model.number="scaleX" @input="updateScale" />
            <span>{{ scaleX.toFixed(1) }}</span>
          </label>

          <label>Scale Y:
            <input type="range" min="0.1" max="3" step="0.1" v-model.number="scaleY" @input="updateScale" />
            <span>{{ scaleY.toFixed(1) }}</span>
          </label>
        </div>
      </div>

      <!-- Image Properties -->
      <div v-else-if="imageSelected" class="properties-section">
        <div class="section-group">
          <h4>Basic Adjustments</h4>
          <label>Opacity:
            <input type="range" min="0" max="1" step="0.1" v-model.number="opacity" @input="updateOpacity" />
            <span>{{ opacity.toFixed(1) }}</span>
          </label>

          <label>Rotate:
            <input type="range" min="0" max="360" step="1" v-model.number="angle" @input="updateAngle" />
            <span>{{ angle }}°</span>
          </label>

          <label>Scale X:
            <input type="range" min="0.1" max="3" step="0.1" v-model.number="scaleX" @input="updateScale" />
            <span>{{ scaleX.toFixed(1) }}</span>
          </label>

          <label>Scale Y:
            <input type="range" min="0.1" max="3" step="0.1" v-model.number="scaleY" @input="updateScale" />
            <span>{{ scaleY.toFixed(1) }}</span>
          </label>

          <label>Crop:
            <button @click="toggleCropMode">{{ cropMode ? 'Apply Crop' : 'Enable Crop' }}</button>
          </label>
        </div>

        <div class="section-group">
          <h4>Light & Color</h4>
          <label>Brightness:
            <input type="range" min="-1" max="1" step="0.1" v-model.number="brightness" @input="applyFilters" />
            <span>{{ Number(brightness).toFixed(1) }}</span>
          </label>

          <label>Contrast:
            <input type="range" min="-1" max="1" step="0.1" v-model.number="contrast" @input="applyFilters" />
            <span>{{ Number(contrast).toFixed(1) }}</span>
          </label>

          <label>Exposure:
            <input type="range" min="-1" max="1" step="0.1" v-model.number="exposure" @input="applyFilters" />
            <span>{{ Number(exposure).toFixed(1) }}</span>
          </label>

          <label>Saturation:
            <input type="range" min="-1" max="1" step="0.1" v-model.number="saturation" @input="applyFilters" />
            <span>{{ Number(saturation).toFixed(1) }}</span>
          </label>

          <label>Vibrance:
            <input type="range" min="-1" max="1" step="0.1" v-model.number="vibrance" @input="applyFilters" />
            <span>{{ Number(vibrance).toFixed(1) }}</span>
          </label>

          <label>Hue Rotation:
            <input type="range" min="0" max="360" step="1" v-model.number="hueRotation" @input="applyFilters" />
            <span>{{ hueRotation }}°</span>
          </label>

          <label>Tint Color:
            <input type="color" v-model="tintColor" @input="applyFilters" />
          </label>

          <label>Tint Opacity:
            <input type="range" min="0" max="1" step="0.1" v-model.number="tintOpacity" @input="applyFilters" />
            <span>{{ Number(tintOpacity).toFixed(1) }}</span>
          </label>
        </div>

        <div class="section-group">
          <h4>Effects</h4>
          <label>Blur:
            <input type="range" min="0" max="1" step="0.01" v-model.number="blur" @input="applyFilters" />
            <span>{{ Number(blur).toFixed(2) }}</span>
          </label>

          <label>Noise:
            <input type="range" min="0" max="1000" step="10" v-model.number="noise" @input="applyFilters" />
            <span>{{ noise }}</span>
          </label>

          <label>Pixelate:
            <input type="range" min="0" max="20" step="1" v-model.number="pixelate" @input="applyFilters" />
            <span>{{ pixelate }}</span>
          </label>

          <label>Sepia:
            <input type="range" min="0" max="1" step="0.1" v-model.number="sepia" @input="applyFilters" />
            <span>{{ Number(sepia).toFixed(1) }}</span>
          </label>

          <div class="checkbox-filters">
            <label><input type="checkbox" v-model="grayscale" @change="applyFilters" /> Grayscale</label>
            <label><input type="checkbox" v-model="invert" @change="applyFilters" /> Invert</label>
            <label><input type="checkbox" v-model="polaroid" @change="applyFilters" /> Polaroid</label>
            <label><input type="checkbox" v-model="vintage" @change="applyFilters" /> Vintage</label>
            <label><input type="checkbox" v-model="kodachrome" @change="applyFilters" /> Kodachrome</label>
            <label><input type="checkbox" v-model="technicolor" @change="applyFilters" /> Technicolor</label>
          </div>
        </div>

        <div class="section-group">
          <h4>Borders & Shadows</h4>
          <label>Border Color:
            <input type="color" v-model="borderColor" @input="updateBorder" />
          </label>

          <label>Border Width:
            <input type="range" min="0" max="20" step="1" v-model.number="borderWidth" @input="updateBorder" />
            <span>{{ borderWidth }}px</span>
          </label>

          <label>Corner Radius:
            <input type="range" min="0" max="50" step="1" v-model.number="cornerRadius" @input="updateCornerRadius" />
            <span>{{ cornerRadius }}px</span>
          </label>

          <label>Shadow Color:
            <input type="color" v-model="shadowColor" @input="updateShadow" />
          </label>

          <label>Shadow Blur:
            <input type="range" min="0" max="20" step="1" v-model.number="shadowBlur" @input="updateShadow" />
            <span>{{ shadowBlur }}px</span>
          </label>

          <label>Shadow Offset X:
            <input type="range" min="-20" max="20" step="1" v-model.number="shadowOffsetX" @input="updateShadow" />
            <span>{{ shadowOffsetX }}px</span>
          </label>

          <label>Shadow Offset Y:
            <input type="range" min="-20" max="20" step="1" v-model.number="shadowOffsetY" @input="updateShadow" />
            <span>{{ shadowOffsetY }}px</span>
          </label>
        </div>

        <button @click="resetFilters" class="reset-btn">Reset All Filters</button>
      </div>

      <!-- Shape Properties -->
      <div v-else-if="shapeSelected" class="properties-section">
        <div class="section-group">
          <h4>Fill & Stroke</h4>
          <label>Fill Color:
            <input type="color" v-model="fill" @input="updateFill" />
          </label>

          <label>Stroke Color:
            <input type="color" v-model="stroke" @input="updateStroke" />
          </label>

          <label>Stroke Width:
            <input type="range" min="0" max="20" step="1" v-model.number="strokeWidth" @input="updateStrokeWidth" />
            <span>{{ strokeWidth }}px</span>
          </label>

          <label>Stroke Style:
            <select v-model="strokeDashArray" @change="updateStrokeStyle">
              <option value="">Solid</option>
              <option value="5,5">Dashed</option>
              <option value="2,2">Dotted</option>
              <option value="10,5,2,5">Custom</option>
            </select>
          </label>
        </div>

        <div class="section-group">
          <h4>Transform</h4>
          <label>Opacity:
            <input type="range" min="0" max="1" step="0.1" v-model.number="opacity" @input="updateOpacity" />
            <span>{{ opacity.toFixed(1) }}</span>
          </label>

          <label>Rotate:
            <input type="range" min="0" max="360" step="1" v-model.number="angle" @input="updateAngle" />
            <span>{{ angle }}°</span>
          </label>

          <label>Scale X:
            <input type="range" min="0.1" max="3" step="0.1" v-model.number="scaleX" @input="updateScale" />
            <span>{{ scaleX.toFixed(1) }}</span>
          </label>

          <label>Scale Y:
            <input type="range" min="0.1" max="3" step="0.1" v-model.number="scaleY" @input="updateScale" />
            <span>{{ scaleY.toFixed(1) }}</span>
          </label>
        </div>

        <div class="section-group">
          <h4>Shadow</h4>
          <label>Shadow Color:
            <input type="color" v-model="shadowColor" @input="updateShadow" />
          </label>

          <label>Shadow Blur:
            <input type="range" min="0" max="20" step="1" v-model.number="shadowBlur" @input="updateShadow" />
            <span>{{ shadowBlur }}px</span>
          </label>

          <label>Shadow Offset X:
            <input type="range" min="-20" max="20" step="1" v-model.number="shadowOffsetX" @input="updateShadow" />
            <span>{{ shadowOffsetX }}px</span>
          </label>

          <label>Shadow Offset Y:
            <input type="range" min="-20" max="20" step="1" v-model.number="shadowOffsetY" @input="updateShadow" />
            <span>{{ shadowOffsetY }}px</span>
          </label>
        </div>

        <div v-if="active.type === 'rect' || active.type === 'ellipse'" class="section-group">
          <h4>Corners</h4>
          <label>Corner Radius:
            <input type="range" min="0" max="50" step="1" v-model.number="cornerRadius" @input="updateCornerRadius" />
            <span>{{ cornerRadius }}px</span>
          </label>
        </div>
      </div>

      <!-- When nothing selected -->
      <div v-else class="empty-state">
        <p>Select an element to edit its properties</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['canvas'],
  data() {
    return {
      active: null,
      cropMode: false,

      // Text properties
      textContent: '',
      fontSize: 24,
      color: '#000000',
      textBackgroundColor: '#ffffff',
      textBackgroundOpacity: 1,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      lineHeight: 1.2,
      charSpacing: 0,
      textAlign: 'left',
      isBold: false,
      isItalic: false,
      isUnderlined: false,
      isStrikethrough: false,
      isOverline: false,
      stroke: '#000000',
      strokeWidth: 0,
      shadowColor: '#000000',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,

      // Shape properties
      fill: '#ffffff',
      fillOpacity: 1,
      strokeDashArray: '',
      cornerRadius: 0,

      // Image properties
      opacity: 1,
      angle: 0,
      scaleX: 1,
      scaleY: 1,
      borderColor: '#000000',
      borderWidth: 0,

      // Image filters - initialized as numbers
      brightness: 0,
      contrast: 0,
      exposure: 0,
      saturation: 0,
      vibrance: 0,
      hueRotation: 0,
      blur: 0,
      noise: 0,
      pixelate: 0,
      sepia: 0,
      tintColor: '#000000',
      tintOpacity: 0,
      grayscale: false,
      invert: false,
      polaroid: false,
      vintage: false,
      kodachrome: false,
      technicolor: false,

      // Font options
      fontOptions: [
        { name: 'Arial', value: 'Arial' },
        { name: 'Helvetica', value: 'Helvetica' },
        { name: 'Times New Roman', value: 'Times New Roman' },
        { name: 'Courier New', value: 'Courier New' },
        { name: 'Georgia', value: 'Georgia' },
        { name: 'Verdana', value: 'Verdana' },
        { name: 'Impact', value: 'Impact' },
        { name: 'Comic Sans MS', value: 'Comic Sans MS' },
        { name: 'Trebuchet MS', value: 'Trebuchet MS' },
        { name: 'Palatino', value: 'Palatino' },
        { name: 'Garamond', value: 'Garamond' },
        { name: 'Bookman', value: 'Bookman' },
        { name: 'Courier', value: 'Courier' },
        { name: 'Lucida Sans', value: 'Lucida Sans' },
        { name: 'Tahoma', value: 'Tahoma' },
      ]
    };
  },
  computed: {
    textSelected() {
      return this.active && (this.active.type === 'i-text' || this.active.type === 'textbox');
    },
    imageSelected() {
      return this.active && this.active.type === 'image';
    },
    shapeSelected() {
      return (
        this.active &&
        ['rect', 'circle', 'triangle', 'ellipse', 'polygon', 'line', 'path'].includes(this.active.type)
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
          canvas.on('selection:cleared', this.clearSelection);
        }
      }
    }
  },
  methods: {
    normalizeColor(color) {
      if (!color) return '#000000';
      if (color.startsWith('#')) {
        // Convert #RGB to #RRGGBB
        if (color.length === 4) {
          return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
        }
        return color.length === 7 ? color : '#000000';
      }
      return '#000000';
    },

    setActive(e) {
      this.active = e.target;
      this.loadProperties();
    },

    clearSelection() {
      this.active = null;
    },

    loadProperties() {
      if (!this.active) return;

      // Common properties
      this.opacity = this.active.opacity || 1;
      this.angle = this.active.angle || 0;
      this.scaleX = this.active.scaleX || 1;
      this.scaleY = this.active.scaleY || 1;

      if (this.textSelected) {
        this.loadTextProperties();
      } else if (this.imageSelected) {
        this.loadImageProperties();
      } else if (this.shapeSelected) {
        this.loadShapeProperties();
      }
    },

    loadTextProperties() {
      this.textContent = this.active.text || '';
      this.fontSize = this.active.fontSize || 24;
      this.color = this.normalizeColor(this.active.fill) || '#000000';
      this.fontFamily = this.active.fontFamily || 'Arial';
      this.fontWeight = this.active.fontWeight || 'normal';
      this.fontStyle = this.active.fontStyle || 'normal';
      this.lineHeight = this.active.lineHeight || 1.2;
      this.charSpacing = this.active.charSpacing || 0;
      this.textAlign = this.active.textAlign || 'left';
      this.isBold = this.active.fontWeight === 'bold';
      this.isItalic = this.active.fontStyle === 'italic';
      this.isUnderlined = this.active.underline || false;
      this.isStrikethrough = this.active.linethrough || false;
      this.isOverline = this.active.overline || false;
      this.textBackgroundColor = this.normalizeColor(this.active.backgroundColor) || '#ffffff';
      this.textBackgroundOpacity = this.active.backgroundOpacity || 1;
      this.stroke = this.normalizeColor(this.active.stroke) || '#000000';
      this.strokeWidth = this.active.strokeWidth || 0;

      if (this.active.shadow) {
        this.shadowColor = this.normalizeColor(this.active.shadow.color) || '#000000';
        this.shadowBlur = this.active.shadow.blur || 0;
        this.shadowOffsetX = this.active.shadow.offsetX || 0;
        this.shadowOffsetY = this.active.shadow.offsetY || 0;
      }
    },

    loadImageProperties() {
      this.resetFilterValues();

      if (this.active.filters && this.active.filters.length > 0) {
        this.loadExistingFilters();
      }

      if (this.active.stroke) {
        this.borderColor = this.normalizeColor(this.active.stroke);
        this.borderWidth = this.active.strokeWidth || 0;
      }

      if (this.active.shadow) {
        this.shadowColor = this.normalizeColor(this.active.shadow.color) || '#000000';
        this.shadowBlur = this.active.shadow.blur || 0;
        this.shadowOffsetX = this.active.shadow.offsetX || 0;
        this.shadowOffsetY = this.active.shadow.offsetY || 0;
      }

      if (this.active.rx) {
        this.cornerRadius = this.active.rx;
      }
    },

    loadShapeProperties() {
      this.fill = this.normalizeColor(this.active.fill) || '#ffffff';
      this.stroke = this.normalizeColor(this.active.stroke) || '#000000';
      this.strokeWidth = this.active.strokeWidth || 0;
      this.strokeDashArray = this.active.strokeDashArray || '';

      if (this.active.shadow) {
        this.shadowColor = this.normalizeColor(this.active.shadow.color) || '#000000';
        this.shadowBlur = this.active.shadow.blur || 0;
        this.shadowOffsetX = this.active.shadow.offsetX || 0;
        this.shadowOffsetY = this.active.shadow.offsetY || 0;
      }

      if (this.active.rx) {
        this.cornerRadius = this.active.rx;
      }
    },

    loadExistingFilters() {
      this.active.filters.forEach(filter => {
        switch (filter.type) {
          case 'Brightness':
            this.brightness = Number(filter.brightness) || 0;
            break;
          case 'Contrast':
            this.contrast = Number(filter.contrast) || 0;
            break;
          case 'Saturation':
            this.saturation = Number(filter.saturation) || 0;
            break;
          case 'Blur':
            this.blur = Number(filter.blur) || 0;
            break;
          case 'Grayscale':
            this.grayscale = true;
            break;
          case 'Invert':
            this.invert = true;
            break;
          case 'Sepia':
            this.sepia = Number(filter.amount) || 0;
            break;
          case 'HueRotation':
            this.hueRotation = Number(filter.rotation) || 0;
            break;
          case 'Noise':
            this.noise = Number(filter.noise) || 0;
            break;
          case 'Pixelate':
            this.pixelate = Number(filter.blocksize) || 0;
            break;
          case 'Polaroid':
            this.polaroid = true;
            break;
          case 'Vibrance':
            this.vibrance = Number(filter.vibrance) || 0;
            break;
          case 'Exposure':
            this.exposure = Number(filter.exposure) || 0;
            break;
          case 'Tint':
            this.tintColor = this.normalizeColor(filter.color) || '#000000';
            this.tintOpacity = Number(filter.opacity) || 0;
            break;
          case 'Vintage':
            this.vintage = true;
            break;
          case 'Kodachrome':
            this.kodachrome = true;
            break;
          case 'Technicolor':
            this.technicolor = true;
            break;
        }
      });
    },

    resetFilterValues() {
      this.brightness = 0;
      this.contrast = 0;
      this.exposure = 0;
      this.saturation = 0;
      this.vibrance = 0;
      this.hueRotation = 0;
      this.blur = 0;
      this.noise = 0;
      this.pixelate = 0;
      this.sepia = 0;
      this.tintColor = '#000000';
      this.tintOpacity = 0;
      this.grayscale = false;
      this.invert = false;
      this.polaroid = false;
      this.vintage = false;
      this.kodachrome = false;
      this.technicolor = false;
    },

    // Common methods
    updateOpacity() {
      if (this.active) {
        this.active.set('opacity', this.opacity);
        this.canvas.requestRenderAll();
      }
    },

    updateAngle() {
      if (this.active) {
        this.active.set('angle', this.angle);
        this.canvas.requestRenderAll();
      }
    },

    updateScale() {
      if (this.active) {
        this.active.set('scaleX', this.scaleX);
        this.active.set('scaleY', this.scaleY);
        this.canvas.requestRenderAll();
      }
    },

    updateShadow() {
      if (this.active) {
        this.active.set('shadow', new fabric.Shadow({
          color: this.normalizeColor(this.shadowColor),
          blur: this.shadowBlur,
          offsetX: this.shadowOffsetX,
          offsetY: this.shadowOffsetY
        }));
        this.canvas.requestRenderAll();
      }
    },

    // Text methods
    updateTextContent() {
      if (this.textSelected) {
        this.active.set('text', this.textContent);
        this.canvas.requestRenderAll();
      }
    },

    updateFontSize() {
      if (this.textSelected) {
        this.active.set('fontSize', this.fontSize);
        this.canvas.requestRenderAll();
        this.triggerCanvasUpdate();
      }
    },

    updateColor() {
      if (this.textSelected) {
        this.active.set('fill', this.normalizeColor(this.color));
        this.canvas.requestRenderAll();
        this.triggerCanvasUpdate();
      }
    },

    triggerCanvasUpdate() {
      if (this.canvas && this.active) {
        this.canvas.fire('object:modified', { target: this.active });
        this.canvas.fire('object:propertychanged', {
          target: this.active,
          property: 'fill'
        });
        this.canvas.requestRenderAll();
        this.$emit('property-change');
      }
    },

    updateFontFamily() {
      if (this.textSelected) {
        this.active.set('fontFamily', this.fontFamily);
        this.canvas.requestRenderAll();
        this.triggerCanvasUpdate();
      }
    },

    updateFontWeight() {
      if (this.textSelected) {
        this.active.set('fontWeight', this.fontWeight);
        this.canvas.requestRenderAll();
      }
    },

    toggleBold() {
      if (this.textSelected) {
        this.isBold = !this.isBold;
        this.active.set('fontWeight', this.isBold ? 'bold' : 'normal');
        this.canvas.requestRenderAll();
      }
    },

    toggleItalic() {
      if (this.textSelected) {
        this.isItalic = !this.isItalic;
        this.active.set('fontStyle', this.isItalic ? 'italic' : 'normal');
        this.canvas.requestRenderAll();
      }
    },

    toggleUnderline() {
      if (this.textSelected) {
        this.isUnderlined = !this.isUnderlined;
        this.active.set('underline', this.isUnderlined);
        this.canvas.requestRenderAll();
      }
    },

    toggleStrikethrough() {
      if (this.textSelected) {
        this.isStrikethrough = !this.isStrikethrough;
        this.active.set('linethrough', this.isStrikethrough);
        this.canvas.requestRenderAll();
      }
    },

    toggleOverline() {
      if (this.textSelected) {
        this.isOverline = !this.isOverline;
        this.active.set('overline', this.isOverline);
        this.canvas.requestRenderAll();
      }
    },

    updateLineHeight() {
      if (this.textSelected) {
        this.active.set('lineHeight', this.lineHeight);
        this.canvas.requestRenderAll();
      }
    },

    updateCharSpacing() {
      if (this.textSelected) {
        this.active.set('charSpacing', this.charSpacing);
        this.canvas.requestRenderAll();
      }
    },

    updateTextAlign() {
      if (this.textSelected) {
        this.active.set('textAlign', this.textAlign);
        this.canvas.requestRenderAll();
      }
    },

    updateTextBgColor() {
      if (this.textSelected) {
        this.active.set('backgroundColor', this.normalizeColor(this.textBackgroundColor));
        this.canvas.requestRenderAll();
      }
    },

    updateTextBgOpacity() {
      if (this.textSelected) {
        this.active.set('backgroundOpacity', this.textBackgroundOpacity);
        this.canvas.requestRenderAll();
      }
    },

    updateStroke() {
      if (this.active) {
        this.active.set('stroke', this.normalizeColor(this.stroke));
        this.canvas.requestRenderAll();
      }
    },

    updateStrokeWidth() {
      if (this.active) {
        this.active.set('strokeWidth', this.strokeWidth);
        this.canvas.requestRenderAll();
      }
    },

    // Image methods
    toggleCropMode() {
      if (!this.imageSelected) return;

      this.cropMode = !this.cropMode;

      if (this.cropMode) {
        // Enable crop mode
        this.active.set({
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          selectable: true
        });

        // Initialize crop rectangle
        this.cropRect = new fabric.Rect({
          width: this.active.width * this.active.scaleX,
          height: this.active.height * this.active.scaleY,
          fill: 'rgba(0,0,0,0.3)',
          originX: 'left',
          originY: 'top',
          hasRotatingPoint: false,
          transparentCorners: false,
          cornerColor: 'white',
          cornerStrokeColor: 'black',
          borderColor: 'white',
          cornerSize: 12,
          padding: 0,
          strokeWidth: 1,
          stroke: 'white'
        });

        this.active.set('clipPath', this.cropRect);
        this.canvas.add(this.cropRect);
        this.cropRect.center();
        this.canvas.setActiveObject(this.cropRect);
      } else {
        // Apply crop
        if (this.cropRect) {
          const scaleX = this.active.scaleX;
          const scaleY = this.active.scaleY;

          // Calculate crop dimensions
          const cropLeft = (this.cropRect.left - this.active.left + this.cropRect.width / 2) / scaleX;
          const cropTop = (this.cropRect.top - this.active.top + this.cropRect.height / 2) / scaleY;
          const cropWidth = this.cropRect.width / scaleX;
          const cropHeight = this.cropRect.height / scaleY;

          // Remove crop rectangle
          this.canvas.remove(this.cropRect);
          this.cropRect = null;

          // Apply crop to image
          this.active.set({
            cropX: cropLeft,
            cropY: cropTop,
            width: cropWidth,
            height: cropHeight,
            hasControls: true,
            hasBorders: true,
            lockMovementX: false,
            lockMovementY: false
          });
        }
      }

      this.canvas.requestRenderAll();
    },

    applyFilters() {
      if (!this.imageSelected || !this.active) return;

      const filters = [];

      // Light & Color filters
      if (this.brightness !== 0) filters.push(new fabric.Image.filters.Brightness({ brightness: Number(this.brightness) }));
      if (this.contrast !== 0) filters.push(new fabric.Image.filters.Contrast({ contrast: Number(this.contrast) }));
      if (this.exposure !== 0) filters.push(new fabric.Image.filters.Exposure({ exposure: Number(this.exposure) }));
      if (this.saturation !== 0) filters.push(new fabric.Image.filters.Saturation({ saturation: Number(this.saturation) }));
      if (this.vibrance !== 0) filters.push(new fabric.Image.filters.Vibrance({ vibrance: Number(this.vibrance) }));
      if (this.hueRotation !== 0) filters.push(new fabric.Image.filters.HueRotation({ rotation: Number(this.hueRotation) }));
      if (this.tintOpacity > 0) filters.push(new fabric.Image.filters.Tint({
        color: this.normalizeColor(this.tintColor),
        opacity: Number(this.tintOpacity)
      }));

      // Effect filters
      if (this.blur > 0) filters.push(new fabric.Image.filters.Blur({ blur: Number(this.blur) }));
      if (this.noise > 0) filters.push(new fabric.Image.filters.Noise({ noise: Number(this.noise) }));
      if (this.pixelate > 0) filters.push(new fabric.Image.filters.Pixelate({ blocksize: Number(this.pixelate) }));
      if (this.sepia > 0) filters.push(new fabric.Image.filters.Sepia({ amount: Number(this.sepia) }));
      if (this.grayscale) filters.push(new fabric.Image.filters.Grayscale());
      if (this.invert) filters.push(new fabric.Image.filters.Invert());
      if (this.polaroid) filters.push(new fabric.Image.filters.Polaroid());
      if (this.vintage) filters.push(new fabric.Image.filters.Vintage());
      if (this.kodachrome) filters.push(new fabric.Image.filters.Kodachrome());
      if (this.technicolor) filters.push(new fabric.Image.filters.Technicolor());

      this.active.filters = filters;
      this.active.applyFilters();
      this.canvas.requestRenderAll();
    },

    resetFilters() {
      this.resetFilterValues();
      if (this.imageSelected) {
        this.active.filters = [];
        this.active.applyFilters();
        this.canvas.requestRenderAll();
      }
    },

    updateBorder() {
      if (this.imageSelected) {
        this.active.set({
          stroke: this.normalizeColor(this.borderColor),
          strokeWidth: this.borderWidth
        });
        this.canvas.requestRenderAll();
      }
    },

    updateCornerRadius() {
      if (this.imageSelected || this.shapeSelected) {
        if (this.active.setRx) {
          this.active.setRx(this.cornerRadius);
          this.active.setRy(this.cornerRadius);
        } else if (this.active.rx !== undefined) {
          this.active.set('rx', this.cornerRadius);
          this.active.set('ry', this.cornerRadius);
        }
        this.canvas.requestRenderAll();
      }
    },

    // Shape methods
    updateFill() {
      if (this.shapeSelected) {
        this.active.set('fill', this.normalizeColor(this.fill));
        this.canvas.requestRenderAll();
      }
    },

    updateFillOpacity() {
      if (this.shapeSelected) {
        this.active.set('fill', fabric.util.setOpacity(this.normalizeColor(this.fill), this.fillOpacity));
        this.canvas.requestRenderAll();
      }
    },

    updateStrokeStyle() {
      if (this.shapeSelected) {
        this.active.set('strokeDashArray', this.strokeDashArray ? this.strokeDashArray.split(',').map(Number) : []);
        this.canvas.requestRenderAll();
      }
    }
  }
};
</script>

<style scoped>
.panel {
  width: 300px;
  height: 100vh;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  overflow-y: auto;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.panel-content {
  padding: 15px;
}

h3 {
  margin: 0 0 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  color: #333;
}

h4 {
  margin: 15px 0 10px;
  font-size: 14px;
  color: #555;
}

.properties-section {
  margin-bottom: 20px;
}

.section-group {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

label {
  display: block;
  margin: 12px 0;
  font-size: 13px;
  color: #333;
}

input[type="color"],
select,
textarea {
  width: 100%;
  margin: 5px 0;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: white;
}

textarea {
  min-height: 60px;
  resize: vertical;
}

input[type="range"] {
  width: 100%;
  margin: 8px 0;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #4caf50;
  border-radius: 50%;
  cursor: pointer;
}

.font-style-buttons {
  display: flex;
  gap: 5px;
  margin: 10px 0;
}

.font-style-buttons button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-weight: bold;
  border-radius: 3px;
}

.font-style-buttons button.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.checkbox-filters {
  margin-top: 10px;
}

.checkbox-filters label {
  display: flex;
  align-items: center;
  margin: 8px 0;
  cursor: pointer;
}

.checkbox-filters input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.reset-btn {
  width: 100%;
  padding: 8px;
  margin-top: 15px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.reset-btn:hover {
  background: #d32f2f;
}

span {
  float: right;
  color: #777;
  font-size: 12px;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #777;
}
</style>