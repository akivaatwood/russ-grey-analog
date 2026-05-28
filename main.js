import Poco from "commodetto/Poco";
import PNG from "commodetto/ReadPNG";
import Resource from "Resource";

const render = new Poco(screen);
const emblem = PNG.decompress(new Resource("center-emblem.png"), true);
const emblemMask = emblem.mask;

const bg = render.makeColor(206, 222, 231);
const ring = render.makeColor(88, 86, 115);
const hourColor = render.makeColor(88, 86, 115);
const minuteColor = render.makeColor(88, 86, 115);
const centerColor = render.makeColor(47, 67, 81);

function drawDot(x, y, size, color) {
  const half = size >> 1;
  render.fillRectangle(color, x - half, y - half, size, size);
}

function drawLine(x0, y0, x1, y1, thickness, color) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  let i;
  let x;
  let y;

  for (i = 0; i <= steps; i += 1) {
    x = Math.round(x0 + (dx * i / steps));
    y = Math.round(y0 + (dy * i / steps));
    drawDot(x, y, thickness, color);
  }
}

function drawRing(cx, cy, radius) {
  let i;
  let angle;
  let x;
  let y;

  for (i = 0; i < 180; i += 1) {
    angle = (i / 180) * Math.PI * 2;
    x = Math.round(cx + Math.sin(angle) * radius);
    y = Math.round(cy - Math.cos(angle) * radius);
    drawDot(x, y, 2, ring);
  }
}

function drawTicks(cx, cy, radius) {
  let i;
  let angle;
  let outerX;
  let outerY;
  let innerX;
  let innerY;
  let innerRadius;
  let color;
  let thickness;

  for (i = 0; i < 60; i += 1) {
    angle = (i / 60) * Math.PI * 2;
    innerRadius = radius - (i % 5 === 0 ? 16 : 8);
    outerX = Math.round(cx + Math.sin(angle) * (radius - 2));
    outerY = Math.round(cy - Math.cos(angle) * (radius - 2));
    innerX = Math.round(cx + Math.sin(angle) * innerRadius);
    innerY = Math.round(cy - Math.cos(angle) * innerRadius);
    color = i % 5 === 0 ? hourColor : ring;
    thickness = i % 5 === 0 ? 4 : 2;
    drawLine(innerX, innerY, outerX, outerY, thickness, color);
  }
}

function drawHand(cx, cy, angle, length, thickness, color) {
  const x = Math.round(cx + Math.sin(angle) * length);
  const y = Math.round(cy - Math.cos(angle) * length);
  drawLine(cx, cy, x, y, thickness, color);
}

function drawFace(date) {
  const width = render.width;
  const height = render.height;
  const cx = width >> 1;
  const cy = height >> 1;
  const emblemX = cx - (emblem.width >> 1);
  const emblemY = cy - (emblem.height >> 1);
  const radius = Math.min(cx, cy) - 10;
  const minutes = date.getMinutes();
  const hours = (date.getHours() % 12) + (minutes / 60);
  const minuteAngle = (minutes / 60) * Math.PI * 2;
  const hourAngle = (hours / 12) * Math.PI * 2;

  render.begin();
  render.fillRectangle(bg, 0, 0, width, height);
  drawRing(cx, cy, radius);
  drawTicks(cx, cy, radius);
  render.drawMasked(
    emblem,
    emblemX,
    emblemY,
    0,
    0,
    emblem.width,
    emblem.height,
    emblemMask,
    0,
    0
  );
  drawHand(cx, cy, hourAngle, radius - 30, 6, hourColor);
  drawHand(cx, cy, minuteAngle, radius - 18, 4, minuteColor);
  drawDot(cx, cy, 8, centerColor);
  drawDot(cx, cy, 4, hourColor);
  render.end();
}

drawFace(new Date());
watch.addEventListener("minutechange", function(event) {
  drawFace(event.date);
});
