from flask import Flask, send_from_directory, request, jsonify
import sqlite3, json, os, random, string

app = Flask(__name__)
DB_PATH = os.path.join(os.path.dirname(__file__), 'cs_questions.db')


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            score INTEGER NOT NULL,
            initials TEXT NOT NULL,
            correct INTEGER DEFAULT 0,
            total INTEGER DEFAULT 15,
            streak INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )""")
        conn.execute("""CREATE TABLE IF NOT EXISTS quizzes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            quiz_type TEXT NOT NULL,
            questions TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )""")
        conn.commit()


init_db()


def generate_code():
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        conn = get_db()
        existing = conn.execute('SELECT 1 FROM quizzes WHERE code = ?', (code,)).fetchone()
        conn.close()
        if not existing:
            return code


def serialize_quiz(row):
    return {
        'code': row['code'],
        'title': row['title'],
        'type': row['quiz_type'],
        'questions': json.loads(row['questions']),
        'date': row['created_at'][:10] if row['created_at'] else ''
    }


@app.route('/')
def home():
    return send_from_directory('.', 'index (1).html')


@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)


@app.route('/api/questions', methods=['GET'])
def api_questions():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM questions ORDER BY RANDOM() LIMIT 15')
    rows = cur.fetchall()
    conn.close()
    qs = []
    for r in rows:
        qs.append({
            'q': r['question'],
            'cat': r['category'],
            'choices': json.loads(r['choices']),
            'ans': r['answer']
        })
    return jsonify(qs)


@app.route('/api/leaderboard', methods=['GET'])
def api_leaderboard():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT name, score, initials, correct, total, streak, timestamp FROM scores ORDER BY score DESC LIMIT 100')
    rows = cur.fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/score', methods=['POST'])
def api_score():
    data = request.get_json()
    if not data or 'name' not in data or 'score' not in data:
        return jsonify({'error': 'name and score required'}), 400
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT id, score FROM scores WHERE name = ?', (data['name'],))
    existing = cur.fetchone()
    if existing:
        if data['score'] > existing['score']:
            cur.execute('UPDATE scores SET score=?, initials=?, correct=?, total=?, streak=? WHERE id=?',
                       (data['score'], data.get('initials', data['name'][:2].upper()),
                        data.get('correct', 0), data.get('total', 15), data.get('streak', 0), existing['id']))
    else:
        cur.execute('INSERT INTO scores (name, score, initials, correct, total, streak) VALUES (?, ?, ?, ?, ?, ?)',
                   (data['name'], data['score'], data.get('initials', data['name'][:2].upper()),
                    data.get('correct', 0), data.get('total', 15), data.get('streak', 0)))
    conn.commit()
    cur.execute('SELECT COUNT(*) as rank FROM scores WHERE score > ?', (data['score'],))
    rank = cur.fetchone()['rank'] + 1
    conn.close()
    return jsonify({'status': 'ok', 'rank': rank})


@app.route('/api/quizzes', methods=['GET'])
def api_get_quizzes():
    conn = get_db()
    rows = conn.execute('SELECT code, title, quiz_type, questions, created_at FROM quizzes ORDER BY created_at DESC').fetchall()
    conn.close()
    return jsonify([serialize_quiz(row) for row in rows])


@app.route('/api/quizzes', methods=['POST'])
def api_create_quiz():
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    quiz_type = (data.get('type') or 'multiple-choice').strip()
    questions = data.get('questions') or []

    if not title or not isinstance(questions, list) or not questions:
        return jsonify({'error': 'title and questions required'}), 400

    code = generate_code()
    conn = get_db()
    conn.execute('INSERT INTO quizzes (code, title, quiz_type, questions) VALUES (?, ?, ?, ?)',
                 (code, title, quiz_type, json.dumps(questions)))
    conn.commit()
    row = conn.execute('SELECT code, title, quiz_type, questions, created_at FROM quizzes WHERE code = ?', (code,)).fetchone()
    conn.close()
    return jsonify(serialize_quiz(row))


@app.route('/api/quizzes/<code>', methods=['GET'])
def api_get_quiz(code):
    conn = get_db()
    row = conn.execute('SELECT code, title, quiz_type, questions, created_at FROM quizzes WHERE code = ?', (code.upper(),)).fetchone()
    conn.close()
    if not row:
        return jsonify({'error': 'quiz not found'}), 404
    return jsonify(serialize_quiz(row))


@app.route('/api/quizzes/<code>', methods=['PUT'])
def api_update_quiz(code):
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    quiz_type = (data.get('type') or 'multiple-choice').strip()
    questions = data.get('questions') or []

    if not title or not isinstance(questions, list) or not questions:
        return jsonify({'error': 'title and questions required'}), 400

    conn = get_db()
    row = conn.execute('SELECT code, title, quiz_type, questions, created_at FROM quizzes WHERE code = ?', (code.upper(),)).fetchone()
    if not row:
        conn.close()
        return jsonify({'error': 'quiz not found'}), 404

    conn.execute('UPDATE quizzes SET title = ?, quiz_type = ?, questions = ? WHERE code = ?',
                 (title, quiz_type, json.dumps(questions), code.upper()))
    conn.commit()
    updated = conn.execute('SELECT code, title, quiz_type, questions, created_at FROM quizzes WHERE code = ?', (code.upper(),)).fetchone()
    conn.close()
    return jsonify(serialize_quiz(updated))


@app.route('/api/quizzes/<code>', methods=['DELETE'])
def api_delete_quiz(code):
    conn = get_db()
    conn.execute('DELETE FROM quizzes WHERE code = ?', (code.upper(),))
    conn.commit()
    conn.close()
    return jsonify({'status': 'deleted'})


if __name__ == '__main__':
    app.run()
