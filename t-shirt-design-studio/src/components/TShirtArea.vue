<template>
    <div>
        <!-- This component doesn’t render anything visually itself -->
    </div>
</template>

<script>
import { fabric } from 'fabric';

export default {
    props: ['canvas'],
    watch: {
        canvas(newCanvas) {
            if (newCanvas) {
                this.loadTShirtImage(newCanvas);
            }
        }
    },
    methods: {
        loadTShirtImage(canvas) {
            fabric.Image.fromURL(require('@/assets/t-shirt.png'), (img) => {
                img.scaleToWidth(500);
                img.set({
                    selectable: false,
                    evented: false,
                    left: canvas.width / 2 - img.getScaledWidth() / 2,
                    top: canvas.height / 2 - img.getScaledHeight() / 2,
                });
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        }

    }
};
</script>