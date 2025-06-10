async function getModelPrediction(imageData) {
    const jsonData = JSON.stringify(Array.from(imageData));

    return await fetch(`${CONFIG.BASE_URL}/predict`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonData
    }).then(res => res.json())
    .then(json => Object.values(json));
}


function getMockPrediction() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const randomDigit = digits[Math.floor(Math.random() * digits.length)];
    const proba = (Math.random() * 0.5 + 0.5).toFixed(2); // 50-100%
    return [randomDigit, proba];
}