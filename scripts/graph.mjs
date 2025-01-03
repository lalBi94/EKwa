import { composeFunction } from "./utils.mjs";

const label_slider = document.getElementById("label-slider");
const fn = document.getElementById("fn");
const infoBox = document.getElementById("info-box");
const graph = document.getElementById("graph");

const DOT_SIZE = 3;
const DOT_NEGATIVE = "red";
const DOT_POSITIVE = "green";
const DOT_UNDEF = "blue";
const DOT_BLACK = "black";

let G_SCALE = 30.0;
let G_DX = 0.05;
let G_LIMITX = 200.0;
let OFFSET_X = 0;
let OFFSET_Y = 0;
let fun = composeFunction(fn.value);

export class GraphState {
    constructor() {}

    setFunction(fnn) {
        fun = fnn;
    }

    getFunction() {
        return fun;
    }

    setDx(dx) {
        G_DX = dx;
    }

    setOffsetX(off) {
        OFFSET_X = off;
    }

    setOffsetY(off) {
        OFFSET_Y = off;
    }

    setScale(scale) {
        G_SCALE = scale;
    }

    setLimit(limit) {
        G_LIMITX = limit;
    }

    getDx() {
        return G_DX;
    }

    getOffsetX() {
        return OFFSET_X;
    }

    getOffsetY() {
        return OFFSET_Y;
    }

    getScale() {
        return G_SCALE;
    }

    getLimit() {
        return G_LIMITX;
    }
}

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

graph.width = window.innerWidth;
graph.height = window.innerHeight;
const ctx = graph.getContext("2d");

export const onWheel = (e) => {
    try {
        e.preventDefault();

        const zoomIntensity = 0.1;
        const direction = e.deltaY > 0 ? -1 : 1;
        const scaleFactor = 1 + direction * zoomIntensity;

        G_SCALE *= G_SCALE * scaleFactor >= 100 ? 1 : scaleFactor;
        slider.value = G_SCALE;

        label_slider.innerText = label_slider.innerText.slice(0, "ZOOM".length);
        label_slider.innerText += ` (x${parseInt(G_SCALE, 10)})`;
    } catch (err) {
        console.error(err);
    }
};

export const onMouseDown = (e) => {
    try {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    } catch (err) {
        console.error(err);
    }
};

export const onMouseMove = (e) => {
    try {
        if (isDragging) {
            const dx = e.clientX - lastMouseX;
            const dy = e.clientY - lastMouseY;

            OFFSET_X += dx;
            OFFSET_Y += dy;

            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }

        const rect = graph.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - graph.width / 2 - OFFSET_X;
        const mouseY = e.clientY - rect.top - graph.height / 2 - OFFSET_Y;

        const graphX = mouseX / G_SCALE;
        const graphY = -mouseY / G_SCALE;

        const computedY = fun(graphX);

        const threshold = G_LIMITX;
        if (Math.abs(graphY - computedY) < threshold) {
            infoBox.style.left = `${e.clientX + 20}px`;
            infoBox.style.top = `${e.clientY + 20}px`;
            infoBox.style.display = "block";
            infoBox.innerText = `x = ${graphX}\nf(x) = ${computedY}`;
        } else {
            infoBox.style.display = "none";
            draw();
        }
    } catch (err) {
        console.error(err);
    }
};

export const onMouseUp = (e) => {
    try {
        isDragging = false;
        draw();
    } catch (err) {
        console.error(err);
    }
};

export const onMouseLeave = () => {
    try {
        isDragging = false;
        infoBox.style.display = "none";
    } catch (err) {
        console.error(err);
    }
};

export const clearGraph = () => {
    try {
        ctx.clearRect(0, 0, graph.width, graph.height);
    } catch (err) {
        console.error(err);
    }
};

export const drawMesure = async () => {
    try {
        ctx.fillStyle = DOT_BLACK;
        ctx.strokeStyle = DOT_BLACK;

        ctx.strokeRect(
            -G_LIMITX * G_SCALE,
            G_LIMITX * -G_SCALE,
            G_LIMITX * G_SCALE * 2,
            G_LIMITX * G_SCALE * 2
        );

        ctx.fillRect(0, 0, 1, G_LIMITX * 1.2 * G_SCALE);
        ctx.fillRect(0, 0, G_LIMITX * 1.2 * G_SCALE, 1);

        ctx.fillRect(0, 0, 1, -(G_LIMITX * 1.2 * G_SCALE));
        ctx.fillRect(0, 0, -(G_LIMITX * 1.2 * G_SCALE), 1);

        for (let i = -G_LIMITX; i <= G_LIMITX; ++i) {
            if (G_SCALE > 10) {
                ctx.font = `${10 - G_SCALE}px serif`;
                ctx.fillRect(i * G_SCALE, 0, 1, 5);
                ctx.fillRect(0, i * G_SCALE, 5, 1);

                ctx.fillText(i, i * G_SCALE, 15);
                ctx.fillText(-i, 8, i * G_SCALE, 15);
            } else if (G_SCALE > 5) {
                if (i % 20 === 0) {
                    ctx.font = `${10 + G_SCALE}px serif`;
                    ctx.fillRect(i * G_SCALE, 0, 1, 5);
                    ctx.fillRect(0, i * G_SCALE, 5, 1);
                    ctx.fillText(i, i * G_SCALE - 4, 15);
                    ctx.fillText(i, 10, i * G_SCALE, 15);
                }
            } else if (G_SCALE > 2) {
                if (i % 50 === 0) {
                    ctx.font = `${15 + G_SCALE}px serif`;
                    ctx.fillRect(i * G_SCALE, 0, 1, 5);
                    ctx.fillRect(0, i * G_SCALE, 5, 1);
                    ctx.fillText(i, i * G_SCALE - 4, 10, 15);
                    ctx.fillText(i, 10, i * G_SCALE, 15);
                }
            } else if (G_SCALE > 0) {
                if (i % G_LIMITX === 0) {
                    ctx.font = `${20 + G_SCALE}px serif`;
                    ctx.fillRect(i * G_SCALE, 0, 1, 5);
                    ctx.fillRect(0, i * G_SCALE, 5, 1);
                    ctx.fillText(i, i * G_SCALE - 4, 10, 15);
                    ctx.fillText(i, 10, i * G_SCALE, 15);
                }
            }
        }

        ctx.restore();
    } catch (err) {
        console.error(err);
    }
};

export const draw = async () => {
    try {
        clearGraph(ctx);

        ctx.save();
        ctx.translate(graph.width / 2 + OFFSET_X, graph.height / 2 + OFFSET_Y);

        ctx.fillStyle = DOT_BLACK;
        ctx.strokeStyle = DOT_BLACK;

        for (let i = -G_LIMITX; i < G_LIMITX; i += G_DX) {
            const y = -fun(i) * G_SCALE;
            const x = i * G_SCALE;

            if (!y) {
                ctx.fillStyle = DOT_UNDEF;
                ctx.strokeStyle = DOT_UNDEF;
                ctx.fillRect(x, 0, DOT_SIZE, DOT_SIZE);
                continue;
            }

            if (i < 0.0) {
                ctx.fillStyle = DOT_NEGATIVE;
                ctx.strokeStyle = DOT_NEGATIVE;
            } else {
                ctx.fillStyle = DOT_POSITIVE;
                ctx.strokeStyle = DOT_POSITIVE;
            }

            ctx.fillRect(x, y, DOT_SIZE, DOT_SIZE);
        }

        drawMesure();

        ctx.restore();
    } catch (err) {
        console.error(err);
    }
};
