import { composeFunction } from "./utils.mjs";

/** Selectors **/
const graph = document.getElementById("graph");
const slider = document.getElementById("slider");
const limit = document.getElementById("limit");
const label_slider = document.getElementById("label-slider");
const dx = document.getElementById("dx");
const compute = document.getElementById("compute");
const fn = document.getElementById("fn");
let fun = composeFunction(fn.value);

/** Configs **/
let G_SCALE = 30.0;
let G_DX = 0.5;
let G_LIMITX = 200.0;
let OFFSET_X = 0;
let OFFSET_Y = 0;

graph.width = window.innerWidth;
graph.height = window.innerHeight;

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

const clearGraph = (ctx) => {
    try {
        ctx.clearRect(0, 0, graph.width, graph.height);
    } catch (err) {
        console.error(err);
    }
};

const draw = () => {
    try {
        if (graph.getContext) {
            const ctx = graph.getContext("2d");

            clearGraph(ctx);

            ctx.save();
            ctx.translate(
                graph.width / 2 + OFFSET_X,
                graph.height / 2 + OFFSET_Y
            );

            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";

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

            for (let i = -G_LIMITX; i < G_LIMITX; i += G_DX) {
                if (i < 0.0) {
                    ctx.fillStyle = "red";
                    ctx.strokeStyle = "red";
                } else {
                    ctx.fillStyle = "green";
                    ctx.strokeStyle = "green";
                }

                const x = i * G_SCALE;
                const y = -fun(i) * G_SCALE;
                ctx.fillRect(x, y, 5, 5);
            }

            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";

            for (let i = -G_LIMITX; i <= G_LIMITX; ++i) {
                if (G_SCALE > 10) {
                    ctx.font = `${10 - G_SCALE}px serif`;
                    ctx.fillRect(i * G_SCALE, 0, 1, 5);
                    ctx.fillRect(0, i * G_SCALE, 5, 1);
                    ctx.fillText(i, i * G_SCALE, 15);
                    ctx.fillText(i, 10, i * G_SCALE, 15);
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
        }
    } catch (err) {
        console.error(err);
    }
};

graph.addEventListener("wheel", (e) => {
    try {
        e.preventDefault();

        const zoomIntensity = 0.1;
        const direction = e.deltaY > 0 ? -1 : 1;
        const scaleFactor = 1 + direction * zoomIntensity;

        G_SCALE *= G_SCALE * scaleFactor >= 100 ? 1 : scaleFactor;
        slider.value = G_SCALE;

        label_slider.innerText = label_slider.innerText.slice(0, "ZOOM".length);
        label_slider.innerText += ` (x${parseInt(G_SCALE, 10)})`;

        draw();
    } catch (err) {
        console.error(err);
    }
});

graph.addEventListener("mousedown", (e) => {
    try {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    } catch (err) {
        console.error(err);
    }
});

graph.addEventListener("mousemove", (e) => {
    try {
        if (isDragging) {
            const dx = e.clientX - lastMouseX;
            const dy = e.clientY - lastMouseY;

            OFFSET_X += dx;
            OFFSET_Y += dy;

            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            draw();
        }
    } catch (err) {
        console.error(err);
    }
});

graph.addEventListener("mouseup", () => {
    try {
        isDragging = false;
    } catch (err) {
        console.error(err);
    }
});

graph.addEventListener("mouseleave", () => {
    try {
        isDragging = false;
    } catch (err) {
        console.error(err);
    }
});

slider.addEventListener("change", (e) => {
    try {
        const scaler = e.target.value;

        label_slider.innerText = label_slider.innerText.slice(
            0,
            "SCALE".length
        );
        label_slider.innerText += ` (x${scaler})`;
        G_SCALE = scaler;

        draw();
    } catch (err) {
        consolee.error(err);
    }
});

dx.addEventListener("change", (e) => {
    try {
        G_DX = parseFloat(e.target.value, 10);
        draw();
    } catch (err) {
        console.error(err);
    }
});

limit.addEventListener("change", (e) => {
    try {
        G_LIMITX = parseFloat(e.target.value, 10);
        draw();
    } catch (err) {
        console.error(err);
    }
});

document.addEventListener("keyup", (e) => {
    try {
        e.preventDefault();

        if (e.key === "Enter") {
            compute.click();
        }
    } catch (err) {
        console.error(err);
    }
});

compute.addEventListener("click", (e) => {
    try {
        const tmp = composeFunction(fn.value);
        if (tmp) {
            fun = tmp;

            try {
                fun(0);
            } catch (err) {
                console.error(err);
                alert(`Syntax ERROR! Revoyez votre fonction.\n${err}`);
                fun = composeFunction("0");
            }

            draw();
        } else {
            throw new Error("La fonction est incorrect.");
        }
    } catch (err) {
        console.error(err);
        fun = composeFunction("0");
    }
});

graph.addEventListener("mousemove", (e) => {
    try {
        const rect = graph.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - graph.width / 2 - OFFSET_X;
        const mouseY = e.clientY - rect.top - graph.height / 2 - OFFSET_Y;

        const graphX = mouseX / G_SCALE;
        const graphY = -mouseY / G_SCALE;

        const computedY = fun(graphX);

        const threshold = G_LIMITX;
        if (Math.abs(graphY - computedY) < threshold) {
            draw();

            const ctx = graph.getContext("2d");
            ctx.save();
            ctx.translate(
                graph.width / 2 + OFFSET_X,
                graph.height / 2 + OFFSET_Y
            );

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(graphX * G_SCALE, -computedY * G_SCALE, 8, 0, 5 * Math.PI);
            ctx.fill();

            ctx.restore();

            const infoBox = document.getElementById("info-box");
            infoBox.style.left = `${e.clientX + 10}px`;
            infoBox.style.top = `${e.clientY + 10}px`;
            infoBox.style.display = "block";
            infoBox.innerText = `x = ${graphX}\nf(x) = ${computedY}`;
        } else {
            const infoBox = document.getElementById("info-box");
            infoBox.style.display = "none";
            draw();
        }
    } catch (err) {
        console.error(err);
    }
});

(() => {
    try {
        draw();
    } catch (err) {
        console.error(err);
    }
})();
