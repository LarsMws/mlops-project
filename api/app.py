from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from model_service import get_model_prediction

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def hello():
    return {"message": "Hello, World!"}

@app.post("/predict")
async def predict(request: Request):
    pixel_values = await request.json()
    return get_model_prediction(pixel_values)
