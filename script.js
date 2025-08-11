// ===== Configuración del juego =====
const START_WIDTH = 160;
const ASPECT = 0.8125; // alto/ancho
const MIN_WIDTH = 36;
const SHRINK_BY = 0.85;

const PLACES = [
  { name: "El Chato",     url: "https://maps.google.com/?q=El+Chato" },
  { name: "Prudencia",    url: "https://maps.google.com/?q=Prudencia" },
  { name: "Andrés D.C.",  url: "https://maps.google.com/?q=Andres+DC" },
  { name: "DeRaíz",       url: "https://maps.google.com/?q=DeRaiz" }
];

const views = {
  intro: document.getElementById("intro"),
  game:  document.getElementById("game"),
  final: document.getElementById("final"),
};
const startBtn   = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const butterfly  = document.getElementById("circle");
const playground = document.getElementById("playground");
const progressEl = document.getElementById("progressText");
const placesEl   = document.getElementById("places");

let widthPx = START_WIDTH;
let heightPx = Math.round(START_WIDTH * ASPECT);
let clicks = 0;

// ===== Utilidades =====
function showView(id){
  Object.values(views).forEach(v => v.classList.remove("active"));
  views[id].classList.add("active");
}
const clamp = (v,min,max) => Math.max(min, Math.min(max, v));

function setEntitySize(w){
  widthPx = w;
  heightPx = Math.round(w * ASPECT);
  butterfly.style.width  = `${widthPx}px`;
  butterfly.style.height = `${heightPx}px`;
}

function randomizeEntityPosition(){
  const rect = playground.getBoundingClientRect();
  const maxLeft = rect.width  - widthPx;
  const maxTop  = rect.height - heightPx;
  const left = Math.random() * maxLeft;
  const top  = Math.random() * maxTop;
  butterfly.style.left = `${left}px`;
  butterfly.style.top  = `${top}px`;
}

function updateProgress(){
  const pct = Math.round(((widthPx - MIN_WIDTH) / (START_WIDTH - MIN_WIDTH)) * 100);
  progressEl.textContent = `Progreso: ${100 - clamp(pct,0,100)}%  |  Clics: ${clicks}`;
}

function fillPlaces(){
  placesEl.innerHTML = "";
  PLACES.forEach(p => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = p.url; a.target = "_blank"; a.rel = "noopener";
    a.textContent = p.name;
    li.appendChild(a);
    placesEl.appendChild(li);
  });
}

// ===== Juego =====
function startGame(){
  clicks = 0;
  setEntitySize(START_WIDTH);
  showView("game");
  requestAnimationFrame(() => randomizeEntityPosition());
  updateProgress();
}

function handleClick(){
  clicks += 1;
  const nextW = Math.max(MIN_WIDTH, Math.round(widthPx * SHRINK_BY));
  setEntitySize(nextW);
  randomizeEntityPosition();
  updateProgress();
  if(nextW <= MIN_WIDTH){
    setTimeout(win, 180);
  }
}

function win(){
  fillPlaces();
  showView("final");
}

function handleResize(){
  const rect = playground.getBoundingClientRect();
  const left = parseFloat(butterfly.style.left || "0");
  const top  = parseFloat(butterfly.style.top  || "0");
  butterfly.style.left = `${clamp(left, 0, rect.width - widthPx)}px`;
  butterfly.style.top  = `${clamp(top, 0, rect.height - heightPx)}px`;
}

// ===== Eventos =====
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => showView("intro"));
butterfly.addEventListener("click", handleClick);
window.addEventListener("resize", handleResize);
