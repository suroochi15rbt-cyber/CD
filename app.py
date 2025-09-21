from flask import Flask, render_template, request, send_file

app = Flask(__name__)

HISTORY_FILE = "history.txt"

# Helper: read history from file
def read_history():
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()
            history = []
            for line in lines:
                if "->" in line:
                    req, res = line.strip().split(" -> ")
                    history.append({"request": req, "result": res})
            return history
    except FileNotFoundError:
        return []

@app.route('/', methods=['GET', 'POST'])
def home():
    result = None
    if request.method == 'POST':
        user_request = request.form['request']

        # Threat checks
        if "<script>" in user_request.lower():
            result = "[Alert] Potential XSS detected!"
        elif "drop" in user_request.lower() or "delete" in user_request.lower():
            result = "[Alert] SQL/DB threat detected!"
        elif "../" in user_request.lower():
            result = "[Alert] Path Traversal threat detected!"
        elif "rm -rf" in user_request.lower():
            result = "[Alert] Command Injection detected!"
        else:
            result = "[Safe] Request looks safe."

        # Save to file
        with open(HISTORY_FILE, "a", encoding="utf-8") as f:
            f.write(f"{user_request} -> {result}\n")

    return render_template('index.html', result=result)

@app.route('/history')
def view_history():
    history = read_history()
    return render_template('history.html', history=history)

@app.route('/download')
def download_history():
    return send_file(HISTORY_FILE, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
