<template>
  <div class="studio-layout">
    <Toolbar :canvas="canvas" :clipRect="clipRect" @show-random-popup="showRandomPopup = true"
      @show-sticker-popup="showStickerPopup = true" @undo="undo" @redo="redo" />

    <!-- Popup component for sticker -->
    <Popup :visible="showStickerPopup" title="Choose a Sticker" @close="showStickerPopup = false">
      <div class="sticker-list">
        <img v-for="sticker in stickers" :key="sticker.id" :src="sticker.url" @click="addSticker(sticker.url)"
          style="width: 80px; margin: 10px; cursor: pointer;" />
      </div>
    </Popup>

    <!-- Popup component for random images -->
    <Popup :visible="showRandomPopup" title="Choose a Random Image" @close="showRandomPopup = false">
      <div class="sticker-list">
        <img v-for="random in randoms" :key="random.id" :src="random.url" @click="addRandom(random.url)"
          style="width: 80px; margin: 10px; cursor: pointer;" />
      </div>
    </Popup>

    <div class="canvas-area">
      <FabricCanvas ref="fabricCanvas" @canvas-ready="setCanvas" />
      <TShirtArea :canvas="canvas" @clip-ready="setClipRect" />
      <ClipArea :canvas="canvas" @clip-ready="setClipRect" />

    </div>
    <PropertiesPanel :canvas="canvas" />
  </div>
</template>

<script>
import Toolbar from '../components/Toolbar.vue';
import FabricCanvas from '../components/FabricCanvas.vue';
import PropertiesPanel from '../components/PropertiesPanel.vue';
import TShirtArea from '../components/TShirtArea.vue';
import ClipArea from '../components/ClipArea.vue'
import Popup from '@/components/Common/Popup.vue';
export default {
  components: { Toolbar, FabricCanvas, PropertiesPanel, TShirtArea, ClipArea, Popup, },
  data() {
    return {
      canvas: null,
      clipRect: null,
      showRandomPopup: false,
      showStickerPopup: false,
      isRestoring: false,
      undoStack: [],
      redoStack: [],
      canUndo: false,
      canRedo: false,
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

      // Setup event listeners
      this.canvas.on('object:added', () => this.saveState());
      this.canvas.on('object:modified', () => this.saveState());
      this.canvas.on('object:removed', () => this.saveState());


      // Wait for default items (rectangle, t-shirt) to be added

      setTimeout(() => {
        this.saveState(true); // Save only after default objects are added
      }, 300); // adjust time as needed
    },

    restoreClipRectLock() {
      const objects = this.canvas.getObjects();
      const clip = objects.find(obj => obj.id === 'clip-rect');
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




    saveState(isInitial = false) {
      if (!this.canvas || this.isRestoring) return;

      const json = this.canvas.toJSON();

      if (isInitial) {
        console.log("Initial state objects:", json.objects);
        this.undoStack = [json];
        this.redoStack = [];
      } else {
        this.undoStack.push(json);
        this.redoStack = [];
      }

      this.updateUndoRedoState();

    },


    updateUndoRedoState() {
      this.canUndo = this.undoStack.length > 1;
      this.canRedo = this.redoStack.length > 0;

      console.log("UndoStack:", this.undoStack.length, "canUndo:", this.canUndo);
      console.log("RedoStack:", this.redoStack.length, "canRedo:", this.canRedo);

      // Emit these to Toolbar
      this.$emit('update:canUndo', this.canUndo);
      this.$emit('update:canRedo', this.canRedo);

    },


    undo() {
      if (this.undoStack.length < 2) return;

      const currentState = this.undoStack.pop();
      this.redoStack.push(currentState);

      const prevState = this.undoStack[this.undoStack.length - 1];

      this.isRestoring = true;
      this.canvas.loadFromJSON(prevState, () => {
        this.canvas.renderAll();
        this.isRestoring = false;
        this.updateUndoRedoState();
        this.restoreClipRectLock(this.canvas);

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
        this.restoreClipRectLock(this.canvas);

      });
    },


    setClipRect(r) {
      this.clipRect = r;
    },

    addSticker(url) {
      if (!this.clipRect) {
        console.warn("Clip area not ready yet");
        return;
      }

      const { left, top } = this.clipRect;
      fabric.Image.fromURL(url, (img) => {
        img.set({ left: left + 20, top: top + 20, scaleX: 0.3, scaleY: 0.3 });
        this.canvas.add(img);
        this.canvas.setActiveObject(img);
        this.canvas.renderAll();
        this.showStickerPopup = false;
      }, { crossOrigin: 'anonymous' });
    },

    //add Random
    addRandom(url) {
      if (!this.clipRect) {
        console.warn("Clip area not ready yet");
        return;
      }

      const { left, top } = this.clipRect;
      fabric.Image.fromURL(url, (img) => {
        img.set({ left: left + 20, top: top + 20, scaleX: 0.3, scaleY: 0.3 });
        this.canvas.add(img);
        this.canvas.setActiveObject(img);
        this.canvas.renderAll();
        this.showRandomPopup = false;
      }, { crossOrigin: 'anonymous' });
    },
    //method to event handle od delete
    handleKeyPress(e) {
      if (!this.canvas) return;

      // DUPLICATE with Ctrl+D or Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault(); // prevent browser bookmark shortcut
        const activeObjects = this.canvas.getActiveObjects();

        if (activeObjects.length) {
          activeObjects.forEach(original => {
            original.clone(clone => {
              clone.set({
                left: original.left + 20,
                top: original.top + 20,
                evented: true
              });
              this.canvas.add(clone);
            });
          });
          this.canvas.discardActiveObject();
          this.canvas.requestRenderAll();
          console.log("Object(s) Duplicated");
        }
      }

      // DELETE with Delete key
      if (e.key === 'Delete') {
        const activeObjects = this.canvas.getActiveObjects();

        if (activeObjects.length) {
          activeObjects.forEach(obj => {
            this.canvas.remove(obj);
          });
          this.canvas.discardActiveObject();
          this.canvas.requestRenderAll();
          console.log("Object(s) Removed");
        }
      }
    },


    handleKeyDown(e) {
      // Undo: Ctrl + Z or Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        this.undo();
      }
      // Redo: Ctrl + Y or Cmd + Shift + Z
      else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        this.redo();
      }
    },
  },


  mounted() {
    window.addEventListener('keydown', this.handleKeyPress);
    window.addEventListener('keydown', this.handleKeyDown);
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress)
    window.removeEventListener('keydown', this.handleKeyDown)
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
</style>
