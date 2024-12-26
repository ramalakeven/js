let sound; // Переменная для звукового файла
let isInitialised = false; // Состояние инициализации
let isLoaded = false; // Состояние загрузки звука
let fft; // Объект FFT для анализа частот
let cols = 50; // Увеличиваем количество столбцов до 10
let barColors = []; // Массив цветов столбцов

let images = []; // Массив для хранения изображений
let currentImages = [0, 0, 0]; // Индексы текущих изображений для треугольников

function preload() {
    soundFormats('mp3', 'wav'); // Поддерживаемые форматы звука
    sound = loadSound('assets/Ворожея отражений - Инквизиция.mp3', () => {
        console.log("Sound is loaded!"); // Успешная загрузка звука
        isLoaded = true; // Устанавливаем флаг загрузки
    });
    sound.setVolume(0.2); // Установка громкости

    // Загрузка изображений
    for (let i = 1; i <= 2; i++) {
        images.push(loadImage(`assets/image${i}.png`));
    }
}

function setup() {
    createCanvas(1024, 1024); // Создание канваса
    fft = new p5.FFT(); // Инициализация FFT

    // Инициализируем цвета столбцов
    for (let i = 0; i < cols; i++) {
        barColors[i] = color(50, 0, 200);
    }
}

function draw() {
    if (sound.isPlaying()) {
        let bassEnergy = fft.getEnergy("bass");
        let bgColor = map(bassEnergy, 0, 255, 0, 0);
        background(bgColor, 100, 100);

        fill(255);
        textSize(32);
        textAlign(CENTER);
        text("Нажмите на изображение", width / 2, 40);

        let freqs = fft.analyze();
        let barWidth = width / cols;

        for (let i = 0; i < cols; i++) {
            let avg = 0;
            let count = 0;

            for (let j = i * Math.floor(freqs.length / cols); j < (i + 1) * Math.floor(freqs.length / cols); j++) {
                if (j < freqs.length) {
                    avg += freqs[j];
                    count++;
                }
            }

            if (count > 0) {
                avg /= count;
                let h = map(avg, 0, 255, 0, height);
                let currentColor = barColors[i];

                fill(currentColor);
                rect(i * barWidth, height - h, barWidth - 2, h);
            }
        }

        let triangleHeightBig = map(bassEnergy, 0, 255, 0, 200);
        let triangleHeightSmall = map(bassEnergy, 0, 255, 0, 100);

        // Рисуем изображения
        let imgSize = 100;

        image(images[currentImages[0]], width / 3 - imgSize / 2, height / 2 - triangleHeightBig / 2, imgSize, imgSize);
        image(images[currentImages[1]], 2 * width / 3 - imgSize / 2, height / 2 - triangleHeightBig / 2, imgSize, imgSize);
        image(images[currentImages[2]], width / 2 - imgSize / 2, height / 2 - triangleHeightSmall / 2, imgSize, imgSize);
    } else {
        background(0);
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text("Нажмите пробел", width / 2, height / 2);
    }
}

function keyPressed() {
    if (!isInitialised) {
        isInitialised = true;
        if (isLoaded) {
            sound.loop();
        }
    } else {
        if (key === ' ') {
            if (sound.isPaused()) {
                sound.play();
            } else {
                sound.pause();
            }
        }
    }
}

function mousePressed() {
    let imgSize = 100;

    // Проверяем попадание в левую картинку
    if (mouseX > width / 3 - imgSize / 2 && mouseX < width / 3 + imgSize / 2 &&
        mouseY > height / 2 - imgSize / 2 && mouseY < height / 2 + imgSize / 2) {
        currentImages[0] = (currentImages[0] + 1) % images.length;
    }

    // Проверяем попадание в правую картинку
    if (mouseX > 2 * width / 3 - imgSize / 2 && mouseX < 2 * width / 3 + imgSize / 2 &&
        mouseY > height / 2 - imgSize / 2 && mouseY < height / 2 + imgSize / 2) {
        currentImages[1] = (currentImages[1] + 1) % images.length;
    }

    // Проверяем попадание в центральную картинку
    if (mouseX > width / 2 - imgSize / 2 && mouseX < width / 2 + imgSize / 2 &&
        mouseY > height / 2 - imgSize / 2 && mouseY < height / 2 + imgSize / 2) {
        currentImages[2] = (currentImages[2] + 1) % images.length;
    }
}
