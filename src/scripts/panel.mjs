import { composeFunction } from "./utils.mjs";
import { draw, GraphState } from "./graph.mjs";

const label_slider = document.getElementById("label-slider");
const export_tmp_img = document.getElementById("export-tmp-img");
const export_zone = document.getElementById("export-tmp");
const fn = document.getElementById("fn");
const graph = document.getElementById("graph");
/**
 * @type {GraphState}
 */
const graph_state = new GraphState();

export const onChangeSlider = (e) => {
    try {
        const scaler = e.target.value;

        label_slider.innerText = label_slider.innerText.slice(
            0,
            "SCALE".length
        );
        label_slider.innerText += ` (x${scaler})`;

        graph_state.setScale(scaler);

        draw();
    } catch (err) {
        console.error(err);
    }
};

export const onChangeDx = (e) => {
    try {
        graph_state.setDx(parseFloat(e.target.value, 10));
        draw();
    } catch (err) {
        console.error(err);
    }
};

export const onChangeLimit = (e) => {
    try {
        graph_state.setLimit(parseFloat(e.target.value, 10));
        draw();
    } catch (err) {
        console.error(err);
    }
};

export const onClickCompute = () => {
    try {
        const tmp = composeFunction(fn.value);
        if (tmp) {
            graph_state.setFunction(tmp);

            try {
                graph_state.getFunction()(0);
            } catch (err) {
                console.error(err);
                alert(`Syntax ERROR! Revoyez votre fonction.\n${err}`);

                graph_state.setFunction(composeFunction("0"));
            }

            draw();
        } else {
            throw new Error("La fonction est incorrect.");
        }
    } catch (err) {
        console.error(err);
        graph_state.setFunction(composeFunction("0"));
    }
};

export const onClickClear = () => {
    fn.value = "";
    graph_state.setFunction(composeFunction("0"));
    draw();
};

export const onClickExport = () => {
    const img = graph.toDataURL("image/png");
    export_tmp_img.src = img;
    export_zone.style.display = "flex";
};

export const onClickCloseExport = () => {
    export_tmp_img.src = "";
    export_zone.style.display = "none";
};
