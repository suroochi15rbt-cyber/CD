# Main route handlers

from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('home.html')

from flask import render_template

# Temporary in-memory history
history = []

@app.route('/check_request', methods=['POST'])
def check_request():
    user_request = request.form.get('user_request')
    result = analyze_request(user_request)

    # store in history
    history.append({"request": user_request, "result": result})

    return render_template('result.html', request=user_request, result=result)

@app.route('/history')
def view_history():
    return render_template('history.html', history=history)
