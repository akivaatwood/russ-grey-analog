const BG = "#CEDEE7";
const FG = "#585673";
const CENTER = "#2F4351";

function polar(centerX, centerY, radius, angle) {
  return {
    x: centerX + Math.sin(angle) * radius,
    y: centerY - Math.cos(angle) * radius
  };
}

function drawHand(ctx, centerX, centerY, angle, length, width, color) {
  const end = polar(centerX, centerY, length, angle);
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

rocky.on("draw", function(event) {
  const ctx = event.context;
  const w = ctx.canvas.clientWidth;
  const h = ctx.canvas.clientHeight;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(cx, cy) - 8;
  const now = new Date();
  const minute = now.getMinutes();
  const hour = (now.getHours() % 12) + (minute / 60);

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = FG;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 60; i += 1) {
    const angle = (i / 60) * Math.PI * 2;
    const inner = polar(cx, cy, radius - (i % 5 === 0 ? 14 : 7), angle);
    const outer = polar(cx, cy, radius - 2, angle);
    ctx.beginPath();
    ctx.lineWidth = i % 5 === 0 ? 4 : 2;
    ctx.moveTo(inner.x, inner.y);
    ctx.lineTo(outer.x, outer.y);
    ctx.stroke();
  }

  drawHand(ctx, cx, cy, (hour / 12) * Math.PI * 2, radius - 28, 6, FG);
  drawHand(ctx, cx, cy, (minute / 60) * Math.PI * 2, radius - 16, 4, FG);

  ctx.fillStyle = CENTER;
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
});

rocky.on("minutechange", function() {
  rocky.requestDraw();
});
