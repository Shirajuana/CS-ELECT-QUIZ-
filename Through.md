# CS-ELECT Deployment & Setup Guide

## What this project is
CS-ELECT is a Flask-backed quiz platform for Computer Science learning.
It includes:
- Teacher quiz creation and management
- Student quiz access by code
- Practice mode with timed questions and leaderboard
- PDF report download for quiz results

This repo uses a Python backend and vanilla HTML/CSS/JS frontend.

---

## Quick Start (Local)

### 1. Open the project folder
```bash
cd "C:\Users\ASUS\OneDrive\Desktop\CS_ELECT"
```

### 2. Activate your Python environment
If you already have a venv in this folder:
```powershell
.\venv\Scripts\Activate.ps1
```

If you need to create one:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install dependencies
```powershell
pip install -r requirements.txt
```

### 4. Run the app
```powershell
python app.py
```

### 5. Open the app
Visit:
```
http://127.0.0.1:5000/
```

---

## Optional: Seed the database
If you want sample practice questions in the SQLite database:
```powershell
python seed.py
```

---

## Important files
- `app.py` - Flask server and API endpoints
- `index (1).html` - Main frontend page and views
- `script.js` - Frontend logic for quizzes, practice mode, and leaderboard
- `styles.css` - Application styles
- `requirements.txt` - Python dependencies
- `cs_questions.db` - SQLite database for practice questions and scores
- `seed.py` - Script to populate the question database

---

## PythonAnywhere Deployment
This repository is ready to deploy as a Flask app. There is no separate frontend build step.

### 1. Push your repo to GitHub
```bash
git add .
git commit -m "Deploy CS-ELECT"
git push origin main
```

### 2. Clone on PythonAnywhere
In a Bash console on PythonAnywhere:
```bash
git clone https://github.com/YOUR-USERNAME/REPO-NAME.git
cd REPO-NAME
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure the web app
- In the PythonAnywhere **Web** tab, add a new web app
- Choose **Manual configuration** and select **Python 3.x**
- Edit the WSGI file and add:
```python
import sys
path = '/home/YOUR-USERNAME/REPO-NAME'
if path not in sys.path:
    sys.path.insert(0, path)
from app import app as application
```
- Save and reload the web app

### 4. Static files
The Flask app already serves static files from the repository root using `app.py`.
No extra static mapping is required for `styles.css`, `script.js`, or `quizimage.jpg`.

---

## If you want to rename the HTML file
This repo currently uses `index (1).html`.
If you rename it to `index.html`, update `app.py` accordingly:
```python
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')
```

---

## Troubleshooting

### Common issues
- **App does not start**
  - Make sure the venv is activated
  - Run `pip install -r requirements.txt`
  - Confirm `python app.py` runs without syntax errors

- **Practice mode fails**
  - The Flask server must be running
  - Open the app through `http://127.0.0.1:5000/`
  - Do not open the HTML file directly from disk

- **Database or score errors**
  - Ensure `cs_questions.db` exists in the project root
  - Run `python seed.py` if you need sample questions

### Deployment checks
- Verify the WSGI path matches your PythonAnywhere project path
- Confirm the server is using the correct `app.py` file
- Check PythonAnywhere error logs for traceback details

---

## Notes
- This project is built with plain Flask and vanilla frontend code.
- There is no `npm run build` step required here.
- The UI and practice mode are powered by `index (1).html` and `script.js`.
- Use `README.md` for full project details and feature descriptions.
