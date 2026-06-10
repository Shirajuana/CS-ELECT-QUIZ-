# PythonAnywhere Deployment - QUICK START

## The Simplest Path (5 Steps)

### Step 1: Prepare Locally
```bash
cd c:\Users\ASUS\OneDrive\Desktop\Bday
npm install
npm run build
```

### Step 2: Create PythonAnywhere Account
- Go to https://www.pythonanywhere.com/pricing/
- Click "Create a Beginner account"
- Sign up with your username (this becomes your domain)

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Deployment ready"
git push origin main
```

### Step 4: Clone on PythonAnywhere
1. Open Bash console in PythonAnywhere
2. Run:
```bash
git clone https://github.com/YOUR-USERNAME/BirthdayApp.git
cd BirthdayApp
npm install
npm run build
pip install -r requirements.txt
```

### Step 5: Configure Web App
1. Go to **Web** tab in PythonAnywhere
2. Click **"Add a new web app"**
3. Click **"Manual configuration"** → Select **Python 3.8+**
4. In WSGI file, paste this (replace YOUR-USERNAME):

```python
import sys
path = '/home/YOUR-USERNAME/BirthdayApp'
if path not in sys.path:
    sys.path.insert(0, path)
from app import app as application
```

5. Go to **Static files** (same page)
6. Add mapping:
   - URL: `/`
   - Directory: `/home/YOUR-USERNAME/BirthdayApp/dist`
7. Click **"Reload"** button

### Done! 🎉
Visit: `https://YOUR-USERNAME.pythonanywhere.com/`

---

## What Was Added

- **app.py** - Flask app to serve your files
- **wsgi.py** - PythonAnywhere configuration template
- **requirements.txt** - Python dependencies (Flask)
- **.gitignore** - Files to exclude from git
- **DEPLOYMENT_GUIDE.md** - Full detailed guide

---

## Next Steps After Deployment

1. **Update audio file path** if needed:
   - Ensure the MP3 file is in `dist/` after build
   - Modify reference in `index.html` if necessary

2. **Custom domain** (if desired):
   - Add your own domain in PythonAnywhere settings

3. **Enable HTTPS**:
   - PythonAnywhere provides free SSL certificates

4. **Monitor logs**:
   - Check PythonAnywhere dashboard for errors

---

## Troubleshooting

**"404 Not Found" error:**
- Verify dist folder exists: `ls -la dist/`
- Check static files mapping in Web tab
- Rebuild with: `npm run build`

**"Module not found" error:**
- Run: `pip install -r requirements.txt`
- Check Python version compatibility

**Audio not playing:**
- Check console logs in browser (F12)
- Verify audio file is in `dist/` folder

**Still stuck?**
- Check PythonAnywhere error log
- See full DEPLOYMENT_GUIDE.md for detailed steps
