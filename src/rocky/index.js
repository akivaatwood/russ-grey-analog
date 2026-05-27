var rocky = require('rocky');

var COLORS = {
  background: '#547588',
  primary: 'white',
  accent: '#c9d7df',
  shadow: '#2f4351'
};

function isRound() {
  return rocky.watchInfo.platform === 'chalk';
}

var WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function pad2(value) {
  return value < 10 ? '0' + value : String(value);
}

function getDateText(date) {
  return WEEKDAYS[date.getDay()] + ' ' + MONTHS[date.getMonth()] + ' ' + pad2(date.getDate());
}

function clear(ctx) {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
}

function drawRing(ctx, cx, cy, radius, round) {
  ctx.strokeStyle = COLORS.primary;
  ctx.lineWidth = round ? 3 : 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = COLORS.shadow;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - (round ? 8 : 6), 0, Math.PI * 2);
  ctx.stroke();
}

function drawTicks(ctx, cx, cy, radius, round) {
  var i;
  var angle;
  var inner;
  var outer;
  var x1;
  var y1;
  var x2;
  var y2;

  for (i = 0; i < 60; i += 1) {
    angle = Math.PI * 2 * i / 60;
    inner = radius - (i % 5 === 0 ? (round ? 16 : 13) : (round ? 9 : 7));
    outer = radius - (round ? 4 : 3);
    x1 = cx + Math.sin(angle) * inner;
    y1 = cy - Math.cos(angle) * inner;
    x2 = cx + Math.sin(angle) * outer;
    y2 = cy - Math.cos(angle) * outer;

    ctx.strokeStyle = i % 5 === 0 ? COLORS.primary : COLORS.accent;
    ctx.lineWidth = i % 5 === 0 ? 3 : 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function drawNumbers(ctx, cx, cy, radius, round) {
  var labels = ['12', '3', '6', '9'];
  var angles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
  var i;
  var angle;
  var x;
  var y;

  ctx.fillStyle = COLORS.accent;
  ctx.font = round ? '18px Gothic' : '16px Gothic';
  ctx.textAlign = 'center';

  for (i = 0; i < labels.length; i += 1) {
    angle = angles[i];
    x = cx + Math.sin(angle) * (radius - (round ? 28 : 23));
    y = cy - Math.cos(angle) * (radius - (round ? 28 : 23)) + 6;
    ctx.fillText(labels[i], x, y, 22);
  }
}

function drawHand(ctx, cx, cy, angle, length, width, color) {
  var x = cx + Math.sin(angle) * length;
  var y = cy - Math.cos(angle) * length;

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function drawCenter(ctx, cx, cy) {
  ctx.fillStyle = COLORS.primary;
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.background;
  ctx.beginPath();
  ctx.arc(cx, cy, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawFace(ctx, date) {
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;
  var round = isRound();
  var cx = w / 2;
  var cy = h / 2;
  var radius = Math.min(w, h) / 2 - (round ? 8 : 10);
  var minutes = date.getMinutes();
  var hours = date.getHours() % 12 + (minutes / 60);
  var minuteAngle = Math.PI * 2 * (minutes / 60);
  var hourAngle = Math.PI * 2 * (hours / 12);

  clear(ctx);
  drawRing(ctx, cx, cy, radius, round);
  drawTicks(ctx, cx, cy, radius, round);
  drawNumbers(ctx, cx, cy, radius, round);
  drawHand(ctx, cx, cy, hourAngle, radius - (round ? 52 : 43), round ? 6 : 5, COLORS.primary);
  drawHand(ctx, cx, cy, minuteAngle, radius - (round ? 30 : 24), round ? 4 : 3, COLORS.accent);
  drawCenter(ctx, cx, cy);

  ctx.fillStyle = COLORS.accent;
  ctx.font = round ? '16px Gothic' : '14px Gothic';
  ctx.textAlign = 'center';
  ctx.fillText(getDateText(date), cx, round ? h - 18 : h - 12, w - 28);
}

rocky.on('draw', function(event) {
  drawFace(event.context, new Date());
});

rocky.on('minutechange', function() {
  rocky.requestDraw();
});

rocky.on('hourchange', function() {
  rocky.requestDraw();
});

rocky.on('daychange', function() {
  rocky.requestDraw();
});
