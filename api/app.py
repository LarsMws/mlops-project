from flask import Flask, jsonify, request
from flask_cors import CORS
from model_service import get_model_prediction

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return jsonify(message="Hello, World!")


@app.post("/predict")
def predict():
    pixel_values = request.get_json()
    return get_model_prediction(pixel_values)


if __name__ == "__main__":
    app.run(debug=True)
