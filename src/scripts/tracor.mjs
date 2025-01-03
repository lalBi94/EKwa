import {
    onMouseDown,
    onMouseLeave,
    onMouseMove,
    onMouseUp,
    onWheel,
    draw,
} from "./graph.mjs";
import {
    onChangeDx,
    onChangeLimit,
    onChangeSlider,
    onClickClear,
    onClickCloseExport,
    onClickCompute,
    onClickExport,
} from "./panel.mjs";

const graph = document.getElementById("graph");
const slider = document.getElementById("slider");
const clear = document.getElementById("clear");
const limit = document.getElementById("limit");
const dx = document.getElementById("dx");
const compute = document.getElementById("compute");
const close_export = document.getElementById("close-export");
const exportt = document.getElementById("export");

graph.addEventListener("wheel", onWheel);
graph.addEventListener("mousedown", onMouseDown);
graph.addEventListener("mousemove", onMouseMove);
graph.addEventListener("mouseup", onMouseUp);
graph.addEventListener("mouseleave", onMouseLeave);

slider.addEventListener("change", onChangeSlider);
dx.addEventListener("change", onChangeDx);
limit.addEventListener("change", onChangeLimit);
compute.addEventListener("click", onClickCompute);
clear.addEventListener("click", onClickClear);
exportt.addEventListener("click", onClickExport);
close_export.addEventListener("click", onClickCloseExport);

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

(() => {
    try {
        draw();
    } catch (err) {
        console.error(err);
    }
})();
