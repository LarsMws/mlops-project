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
        this.ctx.lineWidth = 6;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
    }

    initEvents() {
        this.clearButton.addEventListener("click", () => this.clear());

        this.canvas.addEventListener("mousedown", (e) => { 
            this.isDrawing = true;
            const pos = this.getMousePos(e);
            [this.lastX, this.lastY] = [pos.x, pos.y];
        });
        
        this.canvas.addEventListener("mouseup", () => { 
            this.isDrawing = false;
        });
        
        this.canvas.addEventListener("mousemove", (e) => {
            if (!this.isDrawing) return;
            const pos = this.getMousePos(e);
            this.draw(pos.x, pos.y);
        });

        // Update canvas position on resize/scroll
        window.addEventListener('resize', this.updateCanvasPosition.bind(this));
        window.addEventListener('scroll', this.updateCanvasPosition.bind(this));
    }
    
    getMousePos(e) {
        // Get updated canvas position
        this.updateCanvasPosition();
        
        // Calculate mouse position relative to canvas
        return {
            x: (e.clientX - this.rect.left) * (this.canvas.width / this.rect.width),
            y: (e.clientY - this.rect.top) * (this.canvas.height / this.rect.height)
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
    }
}