const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let isEraser = false;
let isFill = false;
let selectedShape = "line";
let prevX = null;
let prevY = null;

// Получаем индикатор инструмента
const currentToolIndicator = document.getElementById("currentTool");

// Преобразование координат мыши к холсту
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

canvas.addEventListener("mousedown", (event) => {
  isDrawing = true;

  const { x, y } = getMousePos(event);

  if (selectedShape !== "line") {
    drawShape(x, y);
  } else {
    prevX = x;
    prevY = y;
  }
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  prevX = null;
  prevY = null;
});

canvas.addEventListener("mousemove", (event) => {
  if (isFill || !isDrawing || selectedShape !== "line") return;

  const { x, y } = getMousePos(event);

  ctx.strokeStyle = isEraser ? "#FFFFFF" : document.getElementById("colorPicker").value;
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(x, y);
  ctx.stroke();

  const midX = (prevX + x) / 2;
  const midY = (prevY + y) / 2;
  ctx.quadraticCurveTo(prevX, prevY, midX, midY);

  ctx.stroke();

  prevX = x;
  prevY = y;

});

const shapeSizeInput = document.getElementById("shapeSize");

let shapeSize = shapeSizeInput.value;

// Обновляем размер фигуры
shapeSizeInput.addEventListener("input", () => {
  shapeSize = shapeSizeInput.value;
});

function drawShape(x, y) {
  if (isFill) return;
  ctx.fillStyle = isEraser ? "#FFFFFF" : document.getElementById("colorPicker").value;

  switch (selectedShape) {
    case "triangle":
      ctx.beginPath();

      ctx.moveTo(x, y - shapeSize);

      ctx.lineTo(x + shapeSize / 2, y + shapeSize / 2);

      ctx.lineTo(x - shapeSize / 2, y + shapeSize / 2);

      ctx.closePath();
      ctx.fill();
      break;

    case "circle": // Круг
      ctx.beginPath();
      ctx.arc(x, y, shapeSize / 2, 0, 2 * Math.PI);
      ctx.fill();
      break;

    case "rectangle": // Прямоугольник
      ctx.beginPath();
      ctx.rect(x - shapeSize / 2, y - shapeSize / 4, shapeSize, shapeSize / 2);
      ctx.fill();
      break;
  }
}
// Очистка холста
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// Переключение ластика
function toggleEraser() {
  isEraser = !isEraser;
  isFill = false;
  updateToolIndicator();

}
// Переключение линии
function Line() {
  isEraser = false;
  isFill = false;
  updateToolIndicator();

}
// Переключение заливки
function toggleFill() {
  isFill = !isFill;
  updateToolIndicator();
}
// Заливка 
function floodFill(x, y, fillColor) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Получаем данные пикселей
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const data = imageData.data;
  
// Конвертируем координаты в индекс массива
  function getIndex(x, y) {
    return (y * canvasWidth + x) * 4;
  }
// Получаем цвет пикселя
  function getPixelColor(x, y) {
    const index = getIndex(x, y);
    return {
      r: data[index],
      g: data[index + 1],
      b: data[index + 2],
      a: data[index + 3],
    };
  }
// Устанавливаем цвет пикселя
  function setPixelColor(x, y, color) {
    const index = getIndex(x, y);
    data[index] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
    data[index + 3] = color.a;
  }
  // Проверяем, равны ли два цвета
  function colorsMatch(c1, c2) {
    return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b && c1.a === c2.a;
  }

  const targetColor = getPixelColor(x, y); // Цвет начальной точки
  const fillRGB = {
    r: parseInt(fillColor.slice(1, 3), 16),
    g: parseInt(fillColor.slice(3, 5), 16),
    b: parseInt(fillColor.slice(5, 7), 16),
    a: 255,
  };
 // Если цвет начальной точки уже совпадает с цветом заливки, ничего не делаем
  if (colorsMatch(targetColor, fillRGB)) return;

  const stack = [[x, y]];

  while (stack.length > 0) {
    const [currentX, currentY] = stack.pop();

    if (
      currentX >= 0 &&
      currentX < canvasWidth &&
      currentY >= 0 &&
      currentY < canvasHeight &&
      colorsMatch(getPixelColor(currentX, currentY), targetColor)
    ) {
      setPixelColor(currentX, currentY, fillRGB);


      stack.push([currentX + 1, currentY]);
      stack.push([currentX - 1, currentY]);
      stack.push([currentX, currentY + 1]);
      stack.push([currentX, currentY - 1]);
    }
  }
 // Применяем изменения к холсту
  ctx.putImageData(imageData, 0, 0);
}
// Заливка по клику
canvas.addEventListener("click", (e) => {
  if (!isFill) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);
  const fillColor = document.getElementById("colorPicker").value;

  floodFill(x, y, fillColor);
});

// Выбор фигуры
function setShape(value) {
  selectedShape = value;
}
const lineWidthInput = document.getElementById("lineWidth");

// Обновляем толщину линии при изменении ползунка
ctx.lineWidth = lineWidthInput.value;
lineWidthInput.addEventListener("input", () => {
  ctx.lineWidth = lineWidthInput.value;
});

// При рисовании линии учитываем текущую толщину
canvas.addEventListener("mousemove", (event) => {
  if (!isDrawing || selectedShape !== "line") return;
  if (isFill) return;
  const { x, y } = getMousePos(event);

  ctx.strokeStyle = isEraser ? "#FFFFFF" : document.getElementById("colorPicker").value;
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(x, y);
  ctx.stroke();

  prevX = x;
  prevY = y;
});

// Функция выбора фигуры
function setShape(value) {
  selectedShape = value;
  updateToolIndicator();
}

// Функция обновления текста индикатора
function updateToolIndicator() {
  const toolName = isEraser ? "Ластик" : "Рисование";
  const shapeName = {
    line: "Линия",
    triangle: "Треугольник",
    circle: "Круг",
    rectangle: "Прямоугольник",
  }[selectedShape];

  currentToolIndicator.textContent = isFill ? "Заливка" : `${toolName} (${shapeName})`;
}
updateToolIndicator();
