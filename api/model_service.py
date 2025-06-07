REQUIRED_SIZE = 28

def get_model_prediction(pixel_values):
    validate_input(pixel_values)
    return {
        "prediction": 5,
        "probability": 0.87   
    }
    


def validate_input(pixel_values):
    expected = REQUIRED_SIZE**2
    actual = len(pixel_values)
    if expected != actual:
        raise Exception(f"Wrong input size:\n- Expected: {expected}\n- Actual: {actual}")