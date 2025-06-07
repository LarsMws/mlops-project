import tensorflow as tf
from keras.layers import TFSMLayer
import matplotlib.pyplot as plt
import numpy as np
import random

REQUIRED_SIZE = 28
model = TFSMLayer("../models/mnist-cnn", call_endpoint="serving_default")


# Used for debugging
def save_input_as_image(pixel_values, filename="debug_input.png"):
    img_array = np.array(pixel_values).reshape(REQUIRED_SIZE, REQUIRED_SIZE)
    
    if img_array.max() <= 1.0:
        img_array = (img_array * 255).astype(np.uint8)
    
    plt.imsave(filename, img_array, cmap='gray')
    print(f"Debug image saved as {filename}")


def get_model_prediction(pixel_values):
    validate_input(pixel_values)
    
    # save_input_as_image(pixel_values)
    
    input_tensor = tf.convert_to_tensor([pixel_values], dtype=tf.float32)
    input_tensor = tf.reshape(input_tensor, (-1, 28, 28, 1)) 
    
    raw_output = model(input_tensor)
    # print(raw_output)
    predictions = raw_output["activation_7"]
    
    predicted_class = tf.argmax(predictions, axis=1).numpy()[0]
    probability = tf.reduce_max(predictions, axis=1).numpy()[0]

    print(predicted_class, probability)
    
    return {
        "prediction": int(predicted_class),
        "probability": float(probability)
    }
    

def validate_input(pixel_values):
    expected = REQUIRED_SIZE**2
    actual = len(pixel_values)
    if expected != actual:
        raise Exception(f"Wrong input size:\n- Expected: {expected}\n- Actual: {actual}")