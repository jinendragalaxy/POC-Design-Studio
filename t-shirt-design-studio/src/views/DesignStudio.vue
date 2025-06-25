<template>
  <div class="studio-layout">
    <Toolbar 
      :canvas="canvas" 
      :clipRect="clipRect" 
      :can-undo="canUndo"
      :can-redo="canRedo"
      @show-random-popup="showRandomPopup = true"
      @show-sticker-popup="showStickerPopup = true" 
      @undo="undo" 
      @redo="redo" 
    />

    <Popup :visible="showStickerPopup" title="Choose a Sticker" @close="showStickerPopup = false">
      <div class="sticker-list">
        <img 
          v-for="sticker in stickers" 
          :key="sticker.id" 
          :src="sticker.url" 
          @click="addSticker(sticker.url)"
          style="width: 80px; margin: 10px; cursor: pointer;" 
        />
      </div>
    </Popup>

    <Popup :visible="showRandomPopup" title="Choose a Random Image" @close="showRandomPopup = false">
      <div class="sticker-list">
        <img 
          v-for="random in randoms" 
          :key="random.id" 
          :src="random.url" 
          @click="addRandom(random.url)"
          style="width: 80px; margin: 10px; cursor: pointer;" 
        />
      </div>
    </Popup>

    <div class="canvas-area">
      <FabricCanvas ref="fabricCanvas" @canvas-ready="setCanvas" />
      <ProductCanvas :canvas="canvas" :image-url="selectedImage" @clip-ready="setClipRect"  @image-dimensions="setImageBounds"/>
      <ClipArea :canvas="canvas" @clip-ready="setClipRect" :imageBounds="imageBounds" />
    </div>
    
    <PropertiesPanel 
      :canvas="canvas" 
      @property-change="handlePropertyChange"
    />
  </div>
</template>

<script>
import Toolbar from '../components/Toolbar.vue';
import FabricCanvas from '../components/FabricCanvas.vue';
import PropertiesPanel from '../components/PropertiesPanel.vue';
import ProductCanvas from '../components/ProductCanvas.vue';
import ClipArea from '../components/ClipArea.vue';
import Popup from '@/components/Common/Popup.vue';

export default {
  components: { 
    Toolbar, 
    FabricCanvas, 
    PropertiesPanel, 
    ProductCanvas, 
    ClipArea, 
    Popup 
  },
  data() {
    return {
      canvas: null,
      clipRect: null,
      showRandomPopup: false,
      showStickerPopup: false,
      isRestoring: false,
      undoStack: [],
      redoStack: [],
      selectedImage: '',
      imageBounds:null,
      canUndo: false,
      canRedo: false,
      saveDebounce: null,
      randoms: [
        { id: 1, url: "https://picsum.photos/200" },
        { id: 2, url: "https://loremflickr.com/g/200/240/paris" },
        { id: 3, url: "https://cdn-icons-png.flaticon.com/512/616/616468.png" },
      ],
      stickers: [
        { id: 1, url: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
        { id: 2, url: "https://cdn-icons-png.flaticon.com/512/616/616430.png" },
        { id: 3, url: "https://cdn-icons-png.flaticon.com/512/616/616468.png" },
      ],
    };
  },
  methods: {
    setCanvas(c) {
      this.canvas = c;

      // Enhance serialization to include all properties
      fabric.Object.prototype.toObject = (function(toObject) {
        return function(propertiesToInclude) {
          propertiesToInclude = (propertiesToInclude || []).concat([
            // Common properties
            'fill', 'stroke', 'strokeWidth', 'strokeDashArray', 'opacity',
            'angle', 'scaleX', 'scaleY', 'flipX', 'flipY', 'shadow',
            'selectable', 'evented', 'hasControls', 'hasBorders',
            
            // Text properties
            'fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 
            'textAlign', 'lineHeight', 'charSpacing', 'underline',
            'linethrough', 'overline', 'textBackgroundColor',
            
            // Image properties
            'filters', 'cropX', 'cropY',
            
            // Custom properties
            'id', 'clipName', '__dirty'
          ]);
          return toObject.call(this, propertiesToInclude);
        };
      })(fabric.Object.prototype.toObject);

      // Setup comprehensive event listeners
      this.setupCanvasEvents();
      
      setTimeout(() => {
        this.saveState(true); // Initial state
      }, 500);
    },

    setupCanvasEvents() {
      this.canvas.on({
        'object:added': () => this.saveState(),
        'object:modified': () => this.saveState(),
        'object:removed': () => this.saveState(),
        'object:propertychanged': (e) => {
          if (e.target.__dirty !== false) {
            this.saveState();
          }
        },
        'selection:created': () => this.saveState(),
        'selection:updated': () => this.saveState(),
        'selection:cleared': () => this.saveState(),
        'path:created': () => this.saveState()
      });
    },

    handlePropertyChange() {
      if (this.canvas.getActiveObject()) {
        this.canvas.getActiveObject().__dirty = true;
        this.saveState();
      }
    },

    saveState(isInitial = false) {
      if (!this.canvas || this.isRestoring) return;

      clearTimeout(this.saveDebounce);
      this.saveDebounce = setTimeout(() => {
        const json = this.canvas.toJSON();
        
        // Mark all objects as clean
        this.canvas.getObjects().forEach(obj => {
          obj.__dirty = false;
        });

        if (isInitial) {
          this.undoStack = [json];
          this.redoStack = [];
        } else {
          // Only save if different from last state
          const lastState = this.undoStack.length > 0 
            ? JSON.stringify(this.undoStack[this.undoStack.length - 1]) 
            : '';
          const newState = JSON.stringify(json);
          
          if (lastState !== newState) {
            this.undoStack.push(json);
            // Limit stack to 50 states
            if (this.undoStack.length > 50) {
              this.undoStack.shift();
            }
            this.redoStack = [];
          }
        }

        this.updateUndoRedoState();
      }, 300);
    },

    restoreClipRectLock() {
      const clip = this.canvas.getObjects().find(obj => obj.id === 'clip-rect');
      if (clip) {
        clip.set({
          selectable: false,
          evented: false,
          hasBorders: false,
          hasControls: false,
          lockMovementX: true,
          lockMovementY: true,
        });
      }
    },
    setImageBounds(bounds) {
    this.imageBounds = bounds;
  },

    undo() {
      if (this.undoStack.length < 2) return;

      const currentState = this.undoStack.pop();
      this.redoStack.push(currentState);

      this.isRestoring = true;
      this.canvas.loadFromJSON(this.undoStack[this.undoStack.length - 1], () => {
        this.canvas.renderAll();
        this.isRestoring = false;
        this.updateUndoRedoState();
        this.restoreClipRectLock();
      });
    },

    redo() {
      if (this.redoStack.length === 0) return;

      const redoState = this.redoStack.pop();
      this.undoStack.push(redoState);

      this.isRestoring = true;
      this.canvas.loadFromJSON(redoState, () => {
        this.canvas.renderAll();
        this.isRestoring = false;
        this.updateUndoRedoState();
        this.restoreClipRectLock();
      });
    },

    updateUndoRedoState() {
      this.canUndo = this.undoStack.length > 1;
      this.canRedo = this.redoStack.length > 0;
    },

    setClipRect(r) {
      this.clipRect = r;
    },

    addSticker(url) {
      if (!this.clipRect) return;

      const { left, top } = this.clipRect;
      fabric.Image.fromURL(url, (img) => {
        img.set({ 
          left: left + 20, 
          top: top + 20, 
          scaleX: 0.3, 
          scaleY: 0.3,
          id: `sticker-${Date.now()}`
        });
        this.canvas.add(img);
        this.canvas.setActiveObject(img);
        this.canvas.renderAll();
        this.showStickerPopup = false;
      }, { crossOrigin: 'anonymous' });
    },

    addRandom(url) {
      if (!this.clipRect) return;

      const { left, top } = this.clipRect;
      fabric.Image.fromURL(url, (img) => {
        img.set({ 
          left: left + 20, 
          top: top + 20, 
          scaleX: 0.3, 
          scaleY: 0.3,
          id: `random-${Date.now()}`
        });
        this.canvas.add(img);
        this.canvas.setActiveObject(img);
        this.canvas.renderAll();
        this.showRandomPopup = false;
      }, { crossOrigin: 'anonymous' });
    },

    handleKeyPress(e) {
      if (!this.canvas) return;

      // Duplicate with Ctrl+D/Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        this.canvas.getActiveObjects().forEach(original => {
          original.clone(clone => {
            clone.set({
              left: original.left + 20,
              top: original.top + 20,
              evented: true,
              id: `${original.id}-copy-${Date.now()}`
            });
            this.canvas.add(clone);
          });
        });
        this.canvas.requestRenderAll();
      }

      // Delete with Delete key
      if (e.key === 'Delete') {
        this.canvas.getActiveObjects().forEach(obj => this.canvas.remove(obj));
        this.canvas.requestRenderAll();
      }
    },

    handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (!e.shiftKey) this.undo();
      } else if ((e.ctrlKey || e.metaKey) && 
                (e.key.toLowerCase() === 'y' || 
                (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        this.redo();
      }
    },
  },

  mounted() {
    window.addEventListener('keydown', this.handleKeyPress);
    window.addEventListener('keydown', this.handleKeyDown);
  },
  created() {
  const filename = this.$route.query.image || 't-shirt.png';
  this.selectedImage = require(`@/assets/${filename}`);
},

  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress);
    window.removeEventListener('keydown', this.handleKeyDown);
    clearTimeout(this.saveDebounce);
  },
};
</script>

<style scoped>
.studio-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.sticker-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>