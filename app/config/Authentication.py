import random
import smtplib
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import re
import string
from nltk.tokenize import RegexpTokenizer
from nltk.stem.snowball import SnowballStemmer
import pickle

app = Flask(__name__)
CORS(app)

nltk.download('punkt')
nltk.download('stopwords')

rf_model = joblib.load(r'D:\Backend\sms\spam_detection_model.pkl')          # Load the RandomForest model
tfidf_vectorizer = joblib.load(r'D:\Backend\sms\tfidf_vectorizer.pkl')
nb = joblib.load(r'D:\Backend\Email\Phishing_detection_model.pkl')
tfidf = joblib.load(r'D:\Backend\Email\tfidf_vectorizer.pkl')
# Load URL classification model and vectorizer
with open(r'D:\Backend\url\logistic_regression_model.pkl', 'rb') as model_file:
    url_model = pickle.load(model_file)

with open(r'D:\Backend\url\count_vectorizer.pkl', 'rb') as cv_file:
    count_vectorizer = pickle.load(cv_file)
ps = PorterStemmer()
url_stemmer = SnowballStemmer("english")
  # To allow cross-origin requests from your React Native app

# Temporary in-memory storage for OTPs (can be stored in a database instead)
otp_storage = {}

def cleaned_data(text):
    text = text.lower()
    text = re.sub('[^a-zA-Z0-9]', ' ', text)
    text = re.sub(r'http\S+', '', text)
    text = nltk.word_tokenize(text)
    
    y = []
    for i in text:
        if i.isalnum():
            y.append(i)
    
    text = y[:]
    y.clear()
    
    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)
    
    text = y[:]
    y.clear()
    
    for i in text:
        y.append(ps.stem(i))
    
    return " ".join(y)

# Preprocess the input URL
def preprocess_input(url):
    # Tokenize the URL
    tokenizer = RegexpTokenizer(r'[A-Za-z]+')
    tokens = tokenizer.tokenize(url)
    
    # Stem the tokens
    stemmed_tokens = [url_stemmer.stem(token) for token in tokens]
    
    # Join the stemmed tokens to form the final text
    processed_text = ' '.join(stemmed_tokens)
    
    return processed_text

# Function to classify message
def classify_message(user_input):
    cleaned_input = cleaned_data(user_input)
    input_transformed = tfidf_vectorizer.transform([cleaned_input]).toarray()
    prediction = rf_model.predict(input_transformed)
    
    return "PHISHING" if prediction[0] == 1 else "SAFE"


# Function to generate a 6-digit OTP
def generate_otp():
    return random.randint(100000, 999999)

# Function to send email using SMTP
def send_otp_email(email, otp):
    try:
        smtp_server = "smtp.gmail.com"  # Replace with your actual SMTP server
        smtp_port = 587
        sender_email = "shaikhaihtesham720@gmail.com"  # Replace with your sender email
        sender_password = "hdbo qioq dliv wtfy"  # Replace with your email password
        
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            message = f"Subject: Your PhishGuard OTP Verification Code\n\nYour OTP code is {otp}. It will expire in 5 minutes."
            server.sendmail(sender_email, email, message)
        
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

# Function to classify URL
def classify_url(url_input):
    processed_input = preprocess_input(url_input)  # Preprocess the URL
    input_vector = count_vectorizer.transform([processed_input])  # Vectorize the URL
    prediction = url_model.predict(input_vector)

    return prediction[0], 'The URL is classified as a phishing (bad) site!' if prediction[0] == 'bad' else 'The URL is classified as a good site.'

def cleaned_data(text):
    text = text.lower()
    text = re.sub('[^a-zA-Z0-9]', ' ', text)
    text = re.sub(r'http\S+', '', text)
    text = nltk.word_tokenize(text)

    y = []
    for i in text:
        if i.isalnum():
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        y.append(ps.stem(i))

    return " ".join(y)

# API route to send OTP
@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    otp = generate_otp()
    expiration_time = time.time() + 300  # OTP will expire in 5 minutes

    otp_storage[email] = {"otp": otp, "expires_at": expiration_time}

    if send_otp_email(email, otp):
        return jsonify({"message": otp}), 200
    else:
        return jsonify({"error": "Failed to send OTP"}), 500

# API route to verify OTP
@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    user_otp = data.get('otp')

    if not email or not user_otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    stored_otp_data = otp_storage.get(email)

    if not stored_otp_data:
        return jsonify({"error": "No OTP found for this email"}), 400

    current_time = time.time()
    if current_time > stored_otp_data["expires_at"]:
        return jsonify({"error": "OTP has expired"}), 400

    if int(user_otp) == stored_otp_data["otp"]:
        # You can delete OTP after successful verification
        del otp_storage[email]
        return jsonify({"message": "OTP verified successfully"}), 200
    else:
        return jsonify({"error": "Invalid OTP"}), 400
    
@app.route('/classify', methods=['POST'])
def classify():
    data = request.json  # Get the JSON data from the request
    user_input = data.get('message')  # Extract message from the JSON data
    
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400
    
    result = classify_message(user_input)  # Classify the message
    return jsonify({'result': result})

# API route to predict if email is phishing
@app.route('/predict', methods=['POST'])
def predict_phishing():
    try:
        # Get the email content from the request
        data = request.json
        email = data.get('email')

        # Preprocess the input
        cleaned_user_input = cleaned_data(email)

        # Transform the input into TF-IDF features
        user_input_tfidf = tfidf.transform([cleaned_user_input]).toarray()

        # Predict using the loaded model
        user_prediction = nb.predict(user_input_tfidf)

        # Debugging: Print the raw prediction value
        print(f"Model Prediction: {user_prediction[0]}")

        # Map the prediction to the label (0: Safe, 1: Phishing)
        label_mapping = {0: 'Safe Email', 1: 'Phishing Email'}
        predicted_label = label_mapping[user_prediction[0]]

        # Return the result as JSON
        return jsonify({'prediction': predicted_label})

    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({'error': 'An internal error occurred.'}), 500

# API route to classify a URL
@app.route('/check-url', methods=['POST'])
def check_url():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({'error': 'No URL provided'}), 400
    
    # Preprocess the input
    processed_input = preprocess_input(url)

    # Vectorize the input using the same CountVectorizer used during training
    input_vector = count_vectorizer.transform([processed_input])

    # Make a prediction using the logistic regression model
    prediction = url_model.predict(input_vector)

    # Output the result
    result = {
        'url': url,
        'prediction': prediction[0],
        'message': 'The URL is classified as a phishing (bad) site!' if prediction[0] == 'bad' else 'The URL is classified as a good site.'
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='192.168.254.229', port=5000, debug=True)
