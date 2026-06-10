# CS-ELECT

**Computer Science Enhanced Learning & Evaluation for Competency Training**

An interactive quiz platform for Computer Science education with three integrated modes — designed for both teachers and students.

---

## Features

### 👨‍🏫 Teacher Deck
- Create quizzes with three question types: **Multiple Choice**, **Identification**, and **Essay**
- Add, edit, and delete questions dynamically
- Each quiz is assigned a unique **access code** — share it with your students
- Edit or delete existing quizzes from the dashboard

### 👩‍🎓 Student Deck
- Enter your profile (name, year, block) and a quiz code provided by your teacher
- Take the quiz with a built-in timer, progress tracking, and question navigation
- Review correct/incorrect answers after submission
- **Download a PDF report** of your quiz results

### 🎯 Practice Mode
- Hone your CS knowledge with 50+ questions across:
  - **Algorithms** – time complexity, sorting, graph traversal
  - **Data Structures** – stacks, queues, hash tables, trees, heaps
  - **Databases** – SQL, keys, joins
  - **Networking** – HTTP, OSI model, DNS, ports
  - **Operating Systems** – deadlocks, virtual memory, scheduling
  - **Software Engineering** – SOLID, Git, REST APIs
  - **Programming Languages** – OOP, Python, compiled vs interpreted
- 20-second timer per question with streak tracking (+20 pts per correct answer)
- Instant feedback showing the correct answer
- Sessions are 15 randomized questions

### 🏆 Leaderboard
- Top 3 podium with crown, initials, and scores
- Full ranking table showing all players
- Highlights your own rank
- Encourages repeated practice through friendly competition

---

## Tech Stack

- **Backend:** Python / Flask
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Database:** SQLite (student quiz scores)
- **Storage:** localStorage (quizzes, practice scores)
- **Libraries:** Lucide Icons, jsPDF
- **Styling:** Custom CSS with responsive design

---

## Getting Started

### Prerequisites
- Python 3.8+
- pip

### Installation

```bash
# Clone the repo
cd cs-elect

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```

The app will be available at `http://localhost:5000`.

### Seed Data (Optional)

```bash
python seed.py
```

Populates the database with sample questions from the practice question bank.

---

## Project Structure

| File | Purpose |
|------|---------|
| `app.py` | Flask server — serves the app and API endpoints for questions, scores, and leaderboard |
| `index (1).html` | Main HTML with all views (home, teacher, student, practice, results) and embedded CSS |
| `script.js` | All frontend logic: quiz CRUD, student quiz-taking, practice mode, leaderboard |
| `styles.css` | External stylesheet |
| `cs_questions.db` | SQLite database storing student scores |
| `seed.py` | Seeds the database with practice questions |
| `gen_questions.py` | Question generation utility |
| `requirements.txt` | Python dependencies (Flask) |

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/questions` | Returns 15 random questions from the database |
| GET | `/api/leaderboard` | Returns top 100 scores |
| POST | `/api/score` | Submits or updates a student's best score |

---

## License

MIT
