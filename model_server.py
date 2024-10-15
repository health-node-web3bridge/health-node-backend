from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load the model
with open('liver_cirrhosis_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = np.array(data['features']).reshape(1, -1)
        prediction = model.predict(features)

        # Convert prediction to a standard Python type
        return jsonify({'prediction': prediction[0].item()})  # Use .item() to convert to a standard type
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': 'Error during prediction'}), 400

if __name__ == '__main__':
    app.run(port=5000)
