import Picker from "vanilla-picker";
import "../styles/vanilla-picker.csp.scss";

import "../styles/index.scss";

const item = document.querySelector(".colorItem") as HTMLElement;
const list = document.querySelector(".colorItemsList") as HTMLElement;
const main = document.querySelector("main") as HTMLElement;
const addColorBtn = document.querySelector(".addColorBtn") as HTMLElement;
const horizont = document.querySelector(".horizont") as HTMLElement;
const vert = document.querySelector(".vert") as HTMLElement;
const widthInput = document.querySelector(".widthInput") as HTMLElement;
const heightInput = document.querySelector(".heightInput") as HTMLElement;
const downloadBtn = document.querySelector(".downloadBtn") as HTMLElement;

const gradientCanvas = document.querySelector(
  "#gradient-canvas"
) as HTMLCanvasElement;

let degree = 90;
let width = 600;
let height = 600;
horizont.style.backgroundColor = "#16ab39";

horizont.addEventListener("click", () => {
  degree = 90;
  horizont.style.backgroundColor = "#16ab39";
  vert.style.backgroundColor = "#767676";
  renderColors();
});

vert.addEventListener("click", () => {
  vert.style.backgroundColor = "#16ab39";
  horizont.style.backgroundColor = "#767676";
  degree = 180;
  renderColors();
});

widthInput.addEventListener("input", ({ target }) => {
  console.log("qqqq");
  width = (target as unknown as { value: number })?.value;
  drawCanvas();
});

heightInput.addEventListener("input", ({ target }) => {
  height = (target as unknown as { value: number })?.value;
  drawCanvas();
});

downloadBtn.addEventListener("click", downloadJpg);

const picker = new Picker({
  parent: addColorBtn,
  popup: "left",
  color: getRandomColor(),
});
picker.onDone = onColorPick;

const color1 = getRandomColor();
const color2 = getRandomColor();

const colors: { color: string; picker: Picker | null }[] = [
  {
    color: color1,
    picker: null,
  },
  {
    color: color2,
    picker: null,
  },
];

function renderColors() {
  list.innerHTML = "";

  colors.forEach((data, index) => {
    const uniqueClass = (Math.random() * 100000).toFixed(0);
    const newItem = item?.cloneNode(true) as HTMLElement;
    newItem.classList.remove("hidden");
    newItem.classList.add(uniqueClass);
    const color = newItem.querySelector(".color") as HTMLElement;
    color.style.backgroundColor = data.color;
    const text = newItem.querySelector(".header") as HTMLElement;
    text.innerHTML = data.color;
    const delBtn = newItem.querySelector(".deleteButton") as HTMLElement;

    delBtn.addEventListener("click", () => onDelBtnClick(index));

    if (colors.length > 2) {
      delBtn.classList.remove("deleteButtonHidden");
    }

    data.picker = new Picker({
      parent: newItem,
      popup: "left",
      color: data.color,
    });

    data.picker.onDone = onColorEdit(index);

    list?.append(newItem);
  });

  drawCanvas();
  drawBG();
}

renderColors();

function drawBG() {
  main.style.background = `linear-gradient(${degree}deg, ${colors
    .map((data) => data.color)
    .join(",")})`;
}

function onColorPick(e: { hex: string }) {
  colors.push({
    color: e.hex,
    picker: null,
  });
  renderColors();
}

function onColorEdit(index: number) {
  return function (e: { hex: string }) {
    colors[index] = {
      color: e.hex,
      picker: null,
    };

    renderColors();
  };
}

function onDelBtnClick(index: number) {
  colors.splice(index, 1);
  renderColors();
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawCanvas() {
  gradientCanvas.width = width;
  gradientCanvas.height = height;
  const ctx = gradientCanvas.getContext("2d") as CanvasRenderingContext2D;

  const rad = (degree / 180) * Math.PI - Math.PI / 2;

  const gradient = ctx.createLinearGradient(
    0,
    0,
    Math.cos(rad) * width,
    Math.sin(rad) * width
  );

  colors.forEach((data, ind) => {
    gradient.addColorStop(ind / (colors.length - 1), data.color);
  });

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function downloadJpg() {
  const downloadLink = document.createElement("a");
  downloadLink.setAttribute("download", "gradient.png");
  const dataURL = gradientCanvas.toDataURL("image/png");
  const url = dataURL.replace(
    /^data:image\/png/,
    "data:application/octet-stream"
  );
  downloadLink.setAttribute("href", url);
  downloadLink.click();
}
