from flask import Flask, send_from_directory, request, jsonify
import sqlite3, json, os

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
        conn.commit()

init_db()

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
    # keep best score per player
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
    # return rank
    cur.execute('SELECT COUNT(*) as rank FROM scores WHERE score > ?', (data['score'],))
    rank = cur.fetchone()['rank'] + 1
    conn.close()
    return jsonify({'status': 'ok', 'rank': rank})

if __name__ == '__main__':
    app.run()
