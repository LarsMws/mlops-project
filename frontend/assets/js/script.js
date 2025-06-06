document.addEventListener("DOMContentLoaded", init);

function init() {
    const drawingBoard = new DrawingBoard(
        "#drawing-board",
        "button#clear-drawing-board"
    );
}

class DrawingBoard {
    constructor(canvasSelector, clearButtonSelector) {
        this.canvas = document.querySelector(canvasSelector);
        this.clearButton = document.querySelector(clearButtonSelector);
        this.canvasOverlay = document.querySelector('.canvas-overlay');
        
        if (!this.canvas || !this.clearButton) {
            console.error("Elements not found");
            return;
        }
        
        this.ctx = this.canvas.getContext("2d");
        
        // Drawing state
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        
        
        // Get initial canvas position
        this.rect = this.canvas.getBoundingClientRect();
        
        this.initEvents();
        this.setupCanvasDefaults();
    }
    
    updateCanvasPosition() {
        this.rect = this.canvas.getBoundingClientRect();
    }
    
    // Default styles
    setupCanvasDefaults() {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 12;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
    }

    initEvents() {
        this.clearButton.addEventListener("click", () => this.clear());

        // Mouse events
        this.canvas.addEventListener("mousedown", (e) => { 
            this.isDrawing = true;
            const pos = this.getMousePos(e);
            [this.lastX, this.lastY] = [pos.x, pos.y];
            this.hideCanvasOverlay();
        });
        
        this.canvas.addEventListener("mouseup", () => { 
            this.isDrawing = false;
            this.updatePrediction();
        });
        
        this.canvas.addEventListener("mousemove", (e) => {
            if (!this.isDrawing) return;
            const pos = this.getMousePos(e);
            this.draw(pos.x, pos.y);
        });
        
        this.canvas.addEventListener("mouseout", () => { 
            this.isDrawing = false;
            this.updatePrediction();
        });

        // Touch events for mobile
        this.canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.isDrawing = true;
            const pos = this.getTouchPos(e);
            [this.lastX, this.lastY] = [pos.x, pos.y];
            this.hideCanvasOverlay();
        });
        
        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            if (!this.isDrawing) return;
            const pos = this.getTouchPos(e);
            this.draw(pos.x, pos.y);
        });
        
        this.canvas.addEventListener("touchend", () => { 
            this.isDrawing = false;
            this.updatePrediction();
        });

        // Update canvas position on resize/scroll
        window.addEventListener('resize', this.updateCanvasPosition.bind(this));
        window.addEventListener('scroll', this.updateCanvasPosition.bind(this));
    }
    
    getMousePos(e) {
        this.updateCanvasPosition();
        return {
            x: (e.clientX - this.rect.left) * (this.canvas.width / this.rect.width),
            y: (e.clientY - this.rect.top) * (this.canvas.height / this.rect.height)
        };
    }
    
    getTouchPos(e) {
        this.updateCanvasPosition();
        const touch = e.touches[0];
        return {
            x: (touch.clientX - this.rect.left) * (this.canvas.width / this.rect.width),
            y: (touch.clientY - this.rect.top) * (this.canvas.height / this.rect.height)
        };
    }
    
    draw(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        
        [this.lastX, this.lastY] = [x, y];
    }

    clear() {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.setupCanvasDefaults();
        this.showCanvasOverlay();
        this.updatePrediction("Draw something to begin");
    }
    
    hideCanvasOverlay() {
        this.canvasOverlay.classList.add('hidden');
    }
    
    showCanvasOverlay() {
        this.canvasOverlay.classList.remove('hidden');
    }
    
    updatePrediction(text = null) {
        const predictionElement = document.querySelector('.digit-display');
        const confidenceElement = document.querySelector('.confidence');
        
        if (!predictionElement || !confidenceElement) return;
        
        if (text) {
            predictionElement.textContent = '?';
            confidenceElement.textContent = text;
            return;
        }
        
        // Simulate a prediction
        const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const randomDigit = digits[Math.floor(Math.random() * digits.length)];
        const confidence = (Math.random() * 0.5 + 0.5).toFixed(2); // 50-100%
        
        predictionElement.textContent = randomDigit;
        confidenceElement.textContent = `Confidence: ${(confidence * 100).toFixed(1)}%`;
    }
}