function resizeImage(canvas, size=28) {
    const offscreen = document.createElement("canvas");
    
    offscreen.width = size;
    offscreen.height = size;
    const ctx = offscreen.getContext("2d");

    ctx.drawImage(canvas, 0, 0, size, size);

    const imageData = ctx.getImageData(0, 0, 28, 28);
    return imageData;
}


function grayscaleImage(imageData) {
    const raw = imageData.data;
    const grayscale = new Array(imageData.width * imageData.height);

    for (let i = 0; i < grayscale.length; i++) {
        const r = raw[i * 4];
        const g = raw[i * 4 + 1];
        const b = raw[i * 4 + 2];

        grayscale[i] = Math.round((r + g + b) / 3);
    }
    return grayscale;
}


function inverseImage(pixelArray) {
    for (let i = 0; i < pixelArray.length; i++) {
        pixelArray[i] = 255 - pixelArray[i];
    }
    return pixelArray;
}