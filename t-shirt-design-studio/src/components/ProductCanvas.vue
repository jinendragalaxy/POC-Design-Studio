<template>
    <div>
        <!-- Product image is rendered as canvas background -->
    </div>
</template>

<script>
import { fabric } from 'fabric';

export default {
    props: {
        canvas: Object,
        imageUrl: String // ← make it dynamic
    },
    watch: {
        canvas(newCanvas) {
            if (newCanvas && this.imageUrl) {
                this.loadProductImage(newCanvas, this.imageUrl);
            }
        },
        imageUrl(newUrl) {
            if (this.canvas && newUrl) {
                this.loadProductImage(this.canvas, newUrl);
            }
        }
    },
    methods: {
        loadProductImage(canvas, url) {
            fabric.Image.fromURL(url, (img) => {
                img.scaleToWidth(500);
                const left = canvas.width / 2 - img.getScaledWidth() / 2;
                const top = canvas.height / 2 - img.getScaledHeight() / 2;
                img.set({
                    selectable: false,
                    evented: false,
                    left,
                    top
                });
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
                this.$emit('image-dimensions', {
                    left,
                    top,
                    width: img.getScaledWidth(),
                    height: img.getScaledHeight()
                });
                console.log("hello : ", left, top, img.getScaledWidth(), img.getScaledHeight())
                this.alignRectanglesWithImage(left, top, img.getScaledWidth(), img.getScaledHeight());

            }, { crossOrigin: 'anonymous' });
        },

        alignRectanglesWithImage(imageLeft, imageTop, imageWidth, imageHeight) {
            const canvasObjects = this.canvas.getObjects();
            canvasObjects.forEach((obj) => {
                if (obj.type === 'rect') {
                    obj.left = imageLeft + imageWidth / 4;
                    obj.top = imageTop + imageHeight / 4;
                    obj.scaleX = 1;
                    obj.scaleY = 1;

                    obj.setCoords();
                }
            });

            this.canvas.renderAll();
        }
    }
};
</script>