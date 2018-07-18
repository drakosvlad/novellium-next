<template>
    <div>
        <canvas id="plotCanvas"></canvas>
    </div>
</template>

<script>
import PlotNode from '../classes/PlotNode.js'
import Vector2 from '../classes/Vector2.js'

export default {
    name: 'PlotCanvas',
    props: {
        root: PlotNode
    },
    data: function () {
        return {
            state: "idle",
            scale: 100,
            scroll: new Vector2(0, 0),
            ctx: undefined,
            localRoot: undefined,
            themes: [
                {
                    background: "#ffffff",
                    arrow: "#000000",
                    nodeBackground: "#dddddd",
                    nodeTitle: "#000000",
                    nodeText: "#333333"
                }
            ],
            selectedTheme: 0
        };
    },
    mounted: function() {
        let canvas = document.getElementById("plotCanvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = canvas.getContext("2d");
        this.localRoot = new PlotNode(100, 100, "Kek", "Mdems", "#ff0000");

        this.renderCanvas();
    },
    methods: {
        renderCanvas: function() {
            this.ctx.fillStyle = this.themes[this.selectedTheme].background;
            this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            this.renderNode(this.localRoot);
        },
        renderNode: function(node) {
            let canvasCoords = node.location.multiplyScalar(this.scale / 100).substract(this.scroll);
            
            this.ctx.fillStyle = this.themes[this.selectedTheme].nodeBackground;
            this.ctx.fillRect(canvasCoords.x, canvasCoords.y, 200 * this.scale / 100, 85 * this.scale / 100);

            this.ctx.fillStyle = node.color;
            this.ctx.fillRect(canvasCoords.x, canvasCoords.y, 200 * this.scale / 100, 15 * this.scale / 100);

            let headerCoords = canvasCoords.add((new Vector2(5, 37)).multiplyScalar(this.scale / 100));
            this.ctx.fillStyle = this.themes[this.selectedTheme].nodeTitle;
            this.ctx.font = 'italic bold 17px sans-serif';
            this.ctx.fillText(node.title, headerCoords.x, headerCoords.y);

            let textCoords = canvasCoords.add((new Vector2(5, 58)).multiplyScalar(this.scale / 100));
            this.ctx.fillStyle = this.themes[this.selectedTheme].nodeText;
            this.ctx.font = '17px sans-serif';
            this.ctx.fillText(node.text, textCoords.x, textCoords.y);
        },
        renderArrow: function(nodeFrom, nodeTo, outputIndex) {

        }
    }
}
</script>

<style>
canvas {
    width: 100%;
    height: 100%;
}
</style>
