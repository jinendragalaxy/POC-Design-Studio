<template>
  <div></div>
</template>

<script>
// Importing fabric.js
import { fabric } from 'fabric';

export default {
  name: 'ClipArea',
  props: ['canvas'],
  data() {
    return {
      clipArea: null,
    };
  },
  watch: {
    // When canvas is passed from parent, initialize clip area
    canvas(newCanvas) {
      if (newCanvas) {
        console.log('Canvas received in ClipArea');
        this.addClipArea(newCanvas);
      }
    }
  },
  methods: {
    addClipArea(canvas) {
      const clipWidth = 300;
      const clipHeight = 420;
      const clipLeft = canvas.width / 2 - clipWidth / 2;
      const clipTop = canvas.height / 2 - clipHeight / 2;

      // Creating a transparent rectangular clip area
      this.clipArea = new fabric.Rect({
        id: 'clip-rect',
        left: clipLeft,
        top: clipTop,
        width: clipWidth,
        height: clipHeight,
        fill: 'rgba(0, 0, 0, 0.1)',
        stroke: 'blue',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        hasControls: false,
        hasBorders: false,
        hoverCursor: 'default',
        excludeFromHistory: true,
        
      });
      canvas.add(this.clipArea);
      canvas.renderAll();

      this.$emit('clip-ready', this.clipArea);
      console.log('Clip area added');

      // Restrict movement inside the clip area
      canvas.on('object:moving', (e) => {
        const obj = e.target;
        const clipLeft = this.clipArea.left;
        const clipTop = this.clipArea.top;
        const clipRight = clipLeft + this.clipArea.width;
        const clipBottom = clipTop + this.clipArea.height;

        const objWidth = obj.getScaledWidth();
        const objHeight = obj.getScaledHeight();

        if (obj.left < clipLeft) obj.left = clipLeft;
        if (obj.top < clipTop) obj.top = clipTop;
        if (obj.left + objWidth > clipRight) obj.left = clipRight - objWidth;
        if (obj.top + objHeight > clipBottom) obj.top = clipBottom - objHeight;
      });

      // Restrict scaling inside the clip area
      canvas.on('object:scaling', (e) => {
        const obj = e.target;
        const clipLeft = this.clipArea.left;
        const clipTop = this.clipArea.top;
        const clipRight = clipLeft + this.clipArea.width;
        const clipBottom = clipTop + this.clipArea.height;

        const objWidth = obj.getScaledWidth();
        const objHeight = obj.getScaledHeight();

        const newLeft = obj.left;
        const newTop = obj.top;
        const newRight = newLeft + objWidth;
        const newBottom = newTop + objHeight;

        if (
          newLeft < clipLeft ||
          newTop < clipTop ||
          newRight > clipRight ||
          newBottom > clipBottom
        ) {
          obj.scaleX = obj._lastScaleX || 1;
          obj.scaleY = obj._lastScaleY || 1;
          console.log('Scaling restricted');
        } else {
          obj._lastScaleX = obj.scaleX;
          obj._lastScaleY = obj.scaleY;
        }
      });

      // Restrict rotation to stay inside clip area
      canvas.on('object:rotating', (e) => {
        const obj = e.target;
        const clipLeft = this.clipArea.left;
        const clipTop = this.clipArea.top;
        const clipRight = clipLeft + this.clipArea.width;
        const clipBottom = clipTop + this.clipArea.height;

        // Get all four corners of the rotating object
        const coords = obj.getCoords();
        let isOutside = false;

        for (let point of coords) {
          if (
            point.x < clipLeft ||
            point.x > clipRight ||
            point.y < clipTop ||
            point.y > clipBottom
          ) {
            isOutside = true;
            break;
          }
        }

        if (isOutside) {
          // Revert to previous angle and position
          obj.angle = obj._lastAngle || 0;
          obj.left = obj._lastLeft || obj.left;
          obj.top = obj._lastTop || obj.top;
          obj.setCoords(); // recalculate bounding box
          canvas.renderAll();
          console.log('Rotation blocked — object moved out of clip area');
        } else {
          // Save current state
          obj._lastAngle = obj.angle;
          obj._lastLeft = obj.left;
          obj._lastTop = obj.top;
        }
      });

    }
  }
};
</script>
