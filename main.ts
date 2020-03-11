const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;

let w = canvas.width;
let h = canvas.height;

c.fillStyle = "#253340";
c.fillRect(0, 0, w, h);
