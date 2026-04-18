const state = {
  quizzes: JSON.parse(localStorage.getItem('quizzes') || '[]'),
  editingIndex: -1,
  currentQuiz: null,
  shuffledQuestions: [],
  currentQuestionIndex: 0,
  studentAnswers: [],
  studentProfile: { name: '', year: '', block: '' },
  quizTimerInterval: null,
  quizSecondsLeft: 0,
  pmScores: JSON.parse(localStorage.getItem('pm_scores') || '[]'),
  PM_Q: [],
  pmQ: 0,
  pmScore: 0,
  pmStreak: 0,
  pmBest: 0,
  pmCorrect: 0,
  pmAnswered: false,
  pmUser: '',
  pmTimerInterval: null,
  pmSecondsLeft: 20,
};

const PM_QUESTIONS_BANK = [
  { q: 'What is the time complexity of binary search?', cat: 'Algorithms', choices: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], ans: 1 },
  { q: 'Which sorting algorithm has the best worst-case time complexity?', cat: 'Algorithms', choices: ['Quick Sort', 'Bubble Sort', 'Merge Sort', 'Selection Sort'], ans: 2 },
  { q: 'What does "Big O notation" describe?', cat: 'Algorithms', choices: ['Memory usage', 'Code readability', 'Algorithm performance as input grows', 'Number of bugs'], ans: 2 },
  { q: 'Which algorithm is used to find the shortest path in a graph?', cat: 'Algorithms', choices: ['DFS', 'BFS', "Dijkstra's", 'Bubble Sort'], ans: 2 },
  { q: 'Which data structure follows LIFO (Last In, First Out)?', cat: 'Data Structures', choices: ['Queue', 'Stack', 'Linked List', 'Tree'], ans: 1 },
  { q: 'What is the average time complexity for lookup in a hash table?', cat: 'Data Structures', choices: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], ans: 3 },
  { q: 'In a binary search tree, where is the smallest value?', cat: 'Data Structures', choices: ['Root', 'Right-most node', 'Left-most node', 'Any leaf node'], ans: 2 },
  { q: 'Which data structure is used to implement a priority queue efficiently?', cat: 'Data Structures', choices: ['Array', 'Linked List', 'Heap', 'Hash Table'], ans: 2 },
  { q: 'What does SQL stand for?', cat: 'Databases', choices: ['Structured Query Language', 'Simple Queue Logic', 'Sequential Query List', 'Standard Query Logic'], ans: 0 },
  { q: 'Which SQL clause filters rows after grouping?', cat: 'Databases', choices: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], ans: 1 },
  { q: 'What is a PRIMARY KEY in a relational database?', cat: 'Databases', choices: ['A foreign reference', 'A unique identifier for a row', 'An index on all columns', 'A encrypted password'], ans: 1 },
  { q: 'What type of join returns all rows from both tables, with NULLs where no match exists?', cat: 'Databases', choices: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'FULL OUTER JOIN'], ans: 3 },
  { q: 'What does HTTP stand for?', cat: 'Networking', choices: ['HyperText Transfer Protocol', 'High Transfer Text', 'Hyper Terminal Transfer Program', 'Host Text Tunnel Protocol'], ans: 0 },
  { q: 'Which layer of the OSI model handles IP addressing?', cat: 'Networking', choices: ['Data Link', 'Transport', 'Network', 'Application'], ans: 2 },
  { q: 'What port does HTTPS typically use?', cat: 'Networking', choices: ['80', '21', '443', '8080'], ans: 2 },
  { q: 'What does DNS stand for?', cat: 'Networking', choices: ['Data Network System', 'Domain Name System', 'Dynamic Node Service', 'Distributed Node Server'], ans: 1 },
  { q: 'What is a deadlock in an operating system?', cat: 'Operating Systems', choices: ['A crashed process', 'Two processes waiting on each other indefinitely', 'An infinite loop', 'A memory leak'], ans: 1 },
  { q: 'What is virtual memory?', cat: 'Operating Systems', choices: ['RAM inside the GPU', 'Disk space used as extra RAM', 'A type of cache', 'Memory in a virtual machine'], ans: 1 },
  { q: 'Which scheduling algorithm gives CPU time in a round-robin fashion?', cat: 'Operating Systems', choices: ['FCFS', 'SJF', 'Priority Scheduling', 'Round Robin'], ans: 3 },
  { q: 'What does the "S" in SOLID principles stand for?', cat: 'Software Engineering', choices: ['Separation', 'Single Responsibility', 'Scalability', 'Synchronization'], ans: 1 },
  { q: 'What is the purpose of version control (e.g., Git)?', cat: 'Software Engineering', choices: ['Running code faster', 'Tracking and managing code changes', 'Compiling programs', 'Encrypting source code'], ans: 1 },
  { q: 'What is a REST API?', cat: 'Software Engineering', choices: ['A sleep function', 'A relational entity syntax template', 'A stateless architectural style for web services', 'A UI framework'], ans: 2 },
  { q: 'What does OOP stand for?', cat: 'Programming Languages', choices: ['Object-Oriented Programming', 'Open Operand Process', 'Output Oriented Pipeline', 'Operator Overload Paradigm'], ans: 0 },
  { q: 'In Python, what keyword is used to define a function?', cat: 'Programming Languages', choices: ['func', 'function', 'def', 'lambda'], ans: 2 },
  { q: 'What is the difference between a compiled and interpreted language?', cat: 'Programming Languages', choices: ['No difference', 'Compiled translates to machine code ahead of time; interpreted runs line-by-line', 'Interpreted is faster', 'Compiled runs in a browser'], ans: 1 },
];

const selectors = {
  app: document.getElementById('app'),
  toast: document.getElementById('toast'),
  questionsContainer: document.getElementById('questions-container'),
  quizGrid: document.getElementById('quiz-grid'),
  emptyState: document.getElementById('quiz-empty-state'),
  codeModal: document.getElementById('code-modal'),
  generatedCode: document.getElementById('generated-code'),
  codeBtn: document.getElementById('copy-btn'),
  codeErrorMsg: document.getElementById('code-error-msg'),
  studentQuizCode: document.getElementById('student-quiz-code'),
  studentInfoStep: document.getElementById('student-info-step'),
  studentCodeStep: document.getElementById('student-code-step'),
  studentFullName: document.getElementById('student-fullname'),
  studentYear: document.getElementById('student-year'),
  studentBlock: document.getElementById('student-block'),
  studentInfoError: document.getElementById('student-info-error'),
  studentInfoNextBtn: document.getElementById('student-info-next-btn'),
  studentInputArea: document.getElementById('student-input-area'),
  prevQBtn: document.getElementById('prev-q-btn'),
  nextQBtn: document.getElementById('next-q-btn'),
  submitQuizBtn: document.getElementById('submit-quiz-btn'),
  activeQuizTitle: document.getElementById('active-quiz-title'),
  activeQuizInfo: document.getElementById('active-quiz-info'),
  quizTimerText: document.getElementById('quiz-timer-text'),
  quizTimerBadge: document.getElementById('quiz-timer-badge'),
  questionProgress: document.getElementById('question-progress'),
  quizProgressFill: document.getElementById('quiz-progress-fill'),
  finalScore: document.getElementById('final-score'),
  finalPct: document.getElementById('final-pct'),
  resultTitle: document.getElementById('result-title'),
  resultSub: document.getElementById('result-sub'),
  resCorrect: document.getElementById('res-correct'),
  resIncorrect: document.getElementById('res-incorrect'),
  resPct2: document.getElementById('res-pct2'),
  reviewList: document.getElementById('review-list'),
  pmUsername: document.getElementById('pm-username'),
  pmTabLearn: document.getElementById('pm-tab-learn'),
  pmTabLb: document.getElementById('pm-tab-lb'),
  pmLearn: document.getElementById('pm-learn'),
  pmLb: document.getElementById('pm-lb'),
  pmStateUsername: document.getElementById('pm-state-username'),
  pmStateQuiz: document.getElementById('pm-state-quiz'),
  pmStateResult: document.getElementById('pm-state-result'),
  pmProgressFill: document.getElementById('pm-progress-fill'),
  pmProgressLabel: document.getElementById('pm-progress-label'),
  pmScoreVal: document.getElementById('pm-score-val'),
  pmStreakNum: document.getElementById('pm-streak-num'),
  pmQCat: document.getElementById('pm-q-cat'),
  pmQBadge: document.getElementById('pm-q-badge'),
  pmQText: document.getElementById('pm-q-text'),
  pmFeedback: document.getElementById('pm-feedback'),
  pmChoices: document.getElementById('pm-choices'),
  pmSkipBtn: document.getElementById('pm-skip-btn'),
  pmResPct: document.getElementById('pm-res-pct'),
  pmResScore: document.getElementById('pm-res-score'),
  pmResCorrect: document.getElementById('pm-res-correct'),
  pmResStreak: document.getElementById('pm-res-streak'),
  pmPodium: document.getElementById('pm-podium'),
  pmLbRows: document.getElementById('pm-lb-rows'),
  pmLbRestLabel: document.getElementById('pm-lb-rest-label'),
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toast(msg, duration = 2000) {
  const el = selectors.toast;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), duration);
}

function showView(viewId) {
  document.querySelectorAll('.view').forEach((view) => view.classList.add('hidden'));
  const target = document.getElementById(viewId);
  if (!target) return;
  target.classList.remove('hidden');
  if (viewId === 'teacher-dashboard') {
    state.editingIndex = -1;
    renderQuizzes();
  }
  if (viewId === 'create-quiz-view' && state.editingIndex === -1) {
    resetQuizForm();
  }
  if (viewId === 'student-view') {
    handleStudentViewEntry();
  }
  if (viewId === 'practice-view') {
    selectors.pmStateUsername.style.display = 'block';
    selectors.pmStateQuiz.style.display = 'none';
    selectors.pmStateResult.classList.remove('show');
  }
  lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function persistQuizzes() {
  localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
}

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function resetQuizForm() {
  document.getElementById('quiz-title').value = '';
  document.getElementById('quiz-type').value = 'multiple-choice';
  document.getElementById('form-view-title').textContent = 'Create New Quiz';
  document.getElementById('save-quiz-btn').innerHTML = '<i data-lucide="save"></i> Save &amp; Generate Code';
  selectors.questionsContainer.innerHTML = '';
  addQuestion();
  lucide.createIcons();
}

function showStudentInfoStep() {
  selectors.studentInfoStep.classList.remove('hidden');
  selectors.studentCodeStep.classList.add('hidden');
  selectors.studentInfoError.classList.remove('show');
}

function showStudentCodeStep() {
  selectors.studentInfoStep.classList.add('hidden');
  selectors.studentCodeStep.classList.remove('hidden');
  selectors.studentInfoError.classList.remove('show');
  selectors.studentQuizCode.value = '';
  selectors.codeErrorMsg.classList.remove('show');
}

function resetStudentProfile() {
  selectors.studentFullName.value = '';
  selectors.studentYear.value = '';
  selectors.studentBlock.value = '';
  selectors.studentInfoError.classList.remove('show');
  state.studentProfile = { name: '', year: '', block: '' };
}

function validateStudentInfo() {
  const name = selectors.studentFullName.value.trim();
  const year = selectors.studentYear.value.trim();
  const block = selectors.studentBlock.value.trim();
  if (!name || !year || !block) {
    selectors.studentInfoError.textContent = '⚠ Please complete all fields before continuing.';
    selectors.studentInfoError.classList.add('show');
    return false;
  }
  state.studentProfile = { name, year, block };
  selectors.studentInfoError.classList.remove('show');
  return true;
}

function handleStudentInfoNext() {
  if (validateStudentInfo()) {
    showStudentCodeStep();
  }
}

function handleStudentViewEntry() {
  resetStudentProfile();
  showStudentInfoStep();
}

function handleTypeChange() {
  selectors.questionsContainer.innerHTML = '';
  addQuestion();
  lucide.createIcons();
}

function addQuestion() {
  const container = selectors.questionsContainer;
  const type = document.getElementById('quiz-type').value;
  const num = container.children.length + 1;
  const div = document.createElement('div');
  div.className = 'q-block';
  let extra = '';
  if (type === 'multiple-choice') {
    const opts = ['A', 'B', 'C', 'D'];
    const pairs = opts
      .map((l) => `
      <div class="choice-wrap">
        <span class="choice-label-badge">${l}</span>
        <input type="text" class="form-input choice-input" data-label="${l}" placeholder="Option ${l}" />
      </div>`)
      .join('');
    extra = `
      <div class="choices-grid">${pairs}</div>
      <div class="answer-row">
        <label>✓ Correct answer:</label>
        <input type="text" class="answer-input" placeholder="A" maxlength="1" />
      </div>`;
  } else if (type === 'identification') {
    extra = `
      <div class="answer-row wide">
        <label>✓ Answer:</label>
        <input type="text" class="answer-input" placeholder="Exact answer" />
      </div>`;
  } else {
    extra = `<p style="font-size:0.85rem;color:#6b7280;font-style:italic;font-weight:600;">Students will write a long-form essay response.</p>`;
  }
  div.innerHTML = `
    <div class="q-block-header">
      <h4>Question ${num}</h4>
      <button type="button" class="remove-q-btn" data-action="remove-question" title="Remove question">
        <i data-lucide="trash-2"></i>
      </button>
    </div>
    <div class="form-group" style="margin-bottom:1rem;">
      <input type="text" class="form-input question-input" placeholder="Enter your question here…" />
    </div>
    ${extra}`;
  container.appendChild(div);
  lucide.createIcons();
}

function removeQuestion(button) {
  const block = button.closest('.q-block');
  if (!block) return;
  block.remove();
  renumberQuestions();
}

function renumberQuestions() {
  document.querySelectorAll('#questions-container .q-block h4').forEach((h, i) => {
    h.textContent = `Question ${i + 1}`;
  });
}

function saveQuiz() {
  const title = document.getElementById('quiz-title').value.trim();
  const type = document.getElementById('quiz-type').value;
  if (!title) {
    toast('⚠ Please enter a quiz title.');
    return;
  }
  const blocks = document.querySelectorAll('#questions-container .q-block');
  if (!blocks.length) {
    toast('⚠ Add at least one question.');
    return;
  }
  const questions = [];
  let valid = true;
  blocks.forEach((block, idx) => {
    if (!valid) return;
    const qText = block.querySelector('.question-input').value.trim();
    if (!qText) {
      toast(`⚠ Question ${idx + 1} is empty.`);
      valid = false;
      return;
    }
    const ans = (block.querySelector('.answer-input')?.value.trim() || '').toUpperCase();
    const choices = Array.from(block.querySelectorAll('.choice-input')).map((input) => input.value.trim());
    if (type === 'multiple-choice' && !['A', 'B', 'C', 'D'].includes(ans)) {
      toast(`⚠ Q${idx + 1}: correct answer must be A, B, C, or D.`);
      valid = false;
      return;
    }
    questions.push({ question: qText, answer: ans, choices });
  });
  if (!valid) return;
  if (state.editingIndex > -1) {
    state.quizzes[state.editingIndex] = { ...state.quizzes[state.editingIndex], title, type, questions };
    persistQuizzes();
    toast('✓ Quiz updated!');
    showView('teacher-dashboard');
  } else {
    const code = generateCode();
    state.quizzes.push({ title, type, code, questions, date: new Date().toLocaleDateString() });
    persistQuizzes();
    selectors.generatedCode.textContent = code;
    selectors.codeModal.classList.remove('hidden');
    lucide.createIcons();
  }
  state.editingIndex = -1;
}

function editQuiz(index) {
  state.editingIndex = index;
  const quiz = state.quizzes[index];
  document.getElementById('form-view-title').textContent = 'Edit Quiz';
  document.getElementById('save-quiz-btn').innerHTML = '<i data-lucide="check"></i> Update Quiz';
  document.getElementById('quiz-title').value = quiz.title;
  document.getElementById('quiz-type').value = quiz.type;
  selectors.questionsContainer.innerHTML = '';
  quiz.questions.forEach((question) => {
    addQuestion();
    const blocks = document.querySelectorAll('#questions-container .q-block');
    const last = blocks[blocks.length - 1];
    last.querySelector('.question-input').value = question.question;
    if (quiz.type === 'multiple-choice') {
      const choiceInputs = last.querySelectorAll('.choice-input');
      question.choices.forEach((choice, index) => {
        if (choiceInputs[index]) choiceInputs[index].value = choice;
      });
      const answerInput = last.querySelector('.answer-input');
      if (answerInput) answerInput.value = question.answer;
    } else {
      const answerInput = last.querySelector('.answer-input');
      if (answerInput) answerInput.value = question.answer;
    }
  });
  showView('create-quiz-view');
}

function deleteQuiz(index) {
  if (!confirm('Delete this quiz? This cannot be undone.')) return;
  state.quizzes.splice(index, 1);
  persistQuizzes();
  renderQuizzes();
  toast('🗑 Quiz deleted.');
}

function copyCode() {
  const code = selectors.generatedCode.textContent;
  navigator.clipboard.writeText(code).then(() => toast('✓ Code copied!')).catch(() => {});
  selectors.codeBtn.innerHTML = '<i data-lucide="check"></i>';
  lucide.createIcons();
  setTimeout(() => {
    selectors.codeBtn.innerHTML = '<i data-lucide="copy"></i>';
    lucide.createIcons();
  }, 2000);
}

function closeModal() {
  selectors.codeModal.classList.add('hidden');
  showView('teacher-dashboard');
}

function renderQuizzes() {
  const grid = selectors.quizGrid;
  const empty = selectors.emptyState;
  if (!state.quizzes.length) {
    grid.classList.add('hidden');
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  grid.classList.remove('hidden');
  const badgeClass = (type) => ({ 'multiple-choice': 'mc', identification: 'id', essay: 'ess' }[type] || 'mc');
  const badgeLabel = (type) => ({ 'multiple-choice': 'Multiple Choice', identification: 'Identification', essay: 'Essay' }[type] || type);
  grid.innerHTML = state.quizzes
    .map((quiz, index) => `
      <div class="quiz-card">
        <div class="quiz-card-header">
          <h3 class="quiz-card-title">${quiz.title}</h3>
          <span class="quiz-badge ${badgeClass(quiz.type)}">${badgeLabel(quiz.type)}</span>
        </div>
        <p class="quiz-card-meta">${quiz.questions.length} question${quiz.questions.length !== 1 ? 's' : ''} • ${quiz.date}</p>
        <div class="quiz-code-chip">
          <span class="code-text">${quiz.code}</span>
          <button type="button" class="copy-chip-btn" data-action="copy-code" data-code="${quiz.code}" title="Copy code">
            <i data-lucide="copy"></i>
          </button>
        </div>
        <div class="quiz-card-actions">
          <button type="button" class="btn-secondary" data-action="edit-quiz" data-index="${index}">
            <i data-lucide="edit-3"></i> Edit
          </button>
          <button type="button" class="btn-danger" data-action="delete-quiz" data-index="${index}">
            <i data-lucide="trash-2"></i> Delete
          </button>
        </div>
      </div>`)
    .join('');
  lucide.createIcons();
}

function joinQuiz() {
  const code = selectors.studentQuizCode.value.trim().toUpperCase();
  selectors.studentQuizCode.classList.remove('error');
  selectors.codeErrorMsg.classList.remove('show');
  if (!code) {
    selectors.studentQuizCode.classList.add('error');
    selectors.codeErrorMsg.textContent = '⚠ Please enter a quiz code.';
    selectors.codeErrorMsg.classList.add('show');
    return;
  }
  const quiz = state.quizzes.find((item) => item.code === code);
  if (!quiz) {
    selectors.studentQuizCode.classList.add('error');
    selectors.codeErrorMsg.textContent = '⚠ Invalid code. Please check and try again.';
    selectors.codeErrorMsg.classList.add('show');
    return;
  }
  state.currentQuiz = quiz;
  state.currentQuestionIndex = 0;
  state.shuffledQuestions = shuffle(quiz.questions);
  state.studentAnswers = new Array(state.shuffledQuestions.length).fill(null);
  selectors.studentQuizCode.value = '';
  selectors.codeErrorMsg.classList.remove('show');
  showView('quiz-view');
  renderQuizHeader();
  renderQuizQuestion();
  startQuizTimer(quiz.questions.length * 60);
}

function confirmExitQuiz() {
  if (confirm('Exit the quiz? Your progress will be lost.')) {
    clearInterval(state.quizTimerInterval);
    showView('student-view');
  }
}

function renderQuizHeader() {
  selectors.activeQuizTitle.textContent = state.currentQuiz.title;
  selectors.activeQuizInfo.textContent = `${state.currentQuiz.type.replace('-', ' ')} • ${state.currentQuiz.date}`;
}

function renderQuizQuestion() {
  const question = state.shuffledQuestions[state.currentQuestionIndex];
  const total = state.shuffledQuestions.length;
  const currentIndex = state.currentQuestionIndex;
  selectors.questionProgress.textContent = `${currentIndex + 1} / ${total}`;
  selectors.quizProgressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;
  document.getElementById('student-q-text').textContent = question.question;
  const area = selectors.studentInputArea;
  const letters = ['A', 'B', 'C', 'D'];
  if (state.currentQuiz.type === 'multiple-choice') {
    area.innerHTML = `<div class="choices-list">
      ${question.choices
        .map((choice, index) => {
          const letter = letters[index];
          const selected = state.studentAnswers[currentIndex] === letter ? 'selected' : '';
          return `<button type="button" class="choice-btn ${selected}" data-action="select-choice" data-letter="${letter}">
            <span class="choice-letter">${letter}</span>
            <span>${choice || '(empty)'}</span>
          </button>`;
        })
        .join('')}
    </div>`;
  } else if (state.currentQuiz.type === 'identification') {
    const value = (state.studentAnswers[currentIndex] || '').replace(/"/g, '&quot;');
    area.innerHTML = `<input type="text" class="answer-input-student" placeholder="Type your answer here…" value="${value}" data-index="${currentIndex}" />`;
  } else {
    const value = state.studentAnswers[currentIndex] || '';
    area.innerHTML = `<textarea class="essay-input" placeholder="Write your response here…" data-index="${currentIndex}">${value}</textarea>`;
  }
  selectors.prevQBtn.disabled = currentIndex === 0;
  const isLast = currentIndex === total - 1;
  selectors.nextQBtn.classList.toggle('hidden', isLast);
  selectors.submitQuizBtn.classList.toggle('hidden', !isLast);
}

function selectChoice(letter) {
  state.studentAnswers[state.currentQuestionIndex] = letter;
  renderQuizQuestion();
}

function changeQuestion(delta) {
  const nextIndex = state.currentQuestionIndex + delta;
  if (nextIndex < 0 || nextIndex >= state.shuffledQuestions.length) return;
  state.currentQuestionIndex = nextIndex;
  renderQuizQuestion();
}

function startQuizTimer(seconds) {
  clearInterval(state.quizTimerInterval);
  state.quizSecondsLeft = seconds;
  updateTimerDisplay();
  state.quizTimerInterval = setInterval(() => {
    state.quizSecondsLeft -= 1;
    updateTimerDisplay();
    if (state.quizSecondsLeft <= 0) {
      clearInterval(state.quizTimerInterval);
      toast("⏰ Time's up! Submitting quiz…", 2500);
      setTimeout(showResults, 2500);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(state.quizSecondsLeft / 60)).padStart(2, '0');
  const seconds = String(state.quizSecondsLeft % 60).padStart(2, '0');
  selectors.quizTimerText.textContent = `${minutes}:${seconds}`;
  const badge = selectors.quizTimerBadge;
  badge.className = 'timer-badge';
  if (state.quizSecondsLeft < 60) badge.classList.add('warn');
  if (state.quizSecondsLeft < 20) badge.classList.add('danger');
}

function submitQuiz() {
  const unanswered = state.studentAnswers.filter((answer) => !answer || !String(answer).trim()).length;
  if (unanswered > 0) {
    if (!confirm(`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`)) return;
  } else if (!confirm('Submit your quiz?')) {
    return;
  }
  clearInterval(state.quizTimerInterval);
  showResults();
}

function showResults() {
  const total = state.shuffledQuestions.length;
  let score = 0;
  const reviewHTML = state.shuffledQuestions
    .map((question, idx) => {
      const studentAnswer = (state.studentAnswers[idx] || '').trim();
      const correctAnswer = (question.answer || '').trim().toUpperCase();
      let success = false;
      let displayStudent = studentAnswer || '(No answer)';
      let displayCorrect = correctAnswer;
      if (state.currentQuiz.type === 'essay') {
        success = studentAnswer.length > 0;
      } else if (state.currentQuiz.type === 'multiple-choice') {
        success = studentAnswer.toUpperCase() === correctAnswer;
        const labels = ['A', 'B', 'C', 'D'];
        const correctIndex = labels.indexOf(correctAnswer);
        const studentIndex = labels.indexOf(studentAnswer.toUpperCase());
        if (correctIndex >= 0 && question.choices[correctIndex]) {
          displayCorrect = `${correctAnswer}: ${question.choices[correctIndex]}`;
        }
        if (studentIndex >= 0 && question.choices[studentIndex]) {
          displayStudent = `${studentAnswer.toUpperCase()}: ${question.choices[studentIndex]}`;
        } else if (studentAnswer) {
          displayStudent = studentAnswer.toUpperCase();
        }
      } else {
        success = studentAnswer.toLowerCase() === correctAnswer.toLowerCase();
      }
      if (success) score += 1;
      return `
        <div class="review-item ${success ? 'correct' : 'incorrect'}">
          <div class="review-item-top">
            <span class="q-num">Question ${idx + 1}</span>
            <span class="status-badge ${success ? 'correct' : 'incorrect'}">
              <i data-lucide="${success ? 'check' : 'x'}"></i>
              ${success ? 'CORRECT' : 'INCORRECT'}
            </span>
          </div>
          <p class="review-q-text">${question.question}</p>
          ${success ? '' : `
            <div class="review-answer-row">
              <span class="ans-label">Your answer:</span>
              <span class="ans-val wrong">${displayStudent}</span>
            </div>
            <div class="review-answer-row" style="margin-top:0.3rem">
              <span class="ans-label">Correct answer:</span>
              <span class="ans-val correct">${displayCorrect}</span>
            </div>`}
        </div>`;
    })
    .join('');
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  let message = 'Keep practicing! Every attempt teaches you something new.';
  if (percentage >= 90) {
    message = "Excellent work! You've mastered this quiz! 🎉";
  } else if (percentage >= 70) {
    message = 'Great job! You have a solid understanding. 👍';
  } else if (percentage >= 50) {
    message = 'Good effort! Review the answers to improve. 💪';
  }
  selectors.finalScore.textContent = `${score}/${total}`;
  selectors.finalPct.textContent = `${percentage}%`;
  selectors.resultTitle.textContent = message.split('!')[0] + '!';
  selectors.resultSub.textContent = message;
  selectors.resCorrect.textContent = score;
  selectors.resIncorrect.textContent = total - score;
  selectors.resPct2.textContent = `${percentage}%`;
  selectors.reviewList.innerHTML = reviewHTML;
  showView('results-view');
  lucide.createIcons();
}

function pmSwitchTab(tab) {
  selectors.pmLearn.style.display = tab === 'learn' ? 'block' : 'none';
  selectors.pmLb.style.display = tab === 'lb' ? 'block' : 'none';
  selectors.pmTabLearn.classList.toggle('active', tab === 'learn');
  selectors.pmTabLb.classList.toggle('active', tab === 'lb');
  if (tab === 'lb') pmRenderLeaderboard();
}

function pmStartQuiz() {
  const username = selectors.pmUsername.value.trim();
  if (!username) {
    selectors.pmUsername.classList.add('pm-error');
    selectors.pmUsername.placeholder = 'Please enter a username first!';
    return;
  }
  state.pmUser = username;
  state.pmQ = 0;
  state.pmScore = 0;
  state.pmStreak = 0;
  state.pmBest = 0;
  state.pmCorrect = 0;
  state.pmAnswered = false;
  state.PM_Q = shuffle(PM_QUESTIONS_BANK).slice(0, 15);
  selectors.pmStateUsername.style.display = 'none';
  selectors.pmStateQuiz.style.display = 'block';
  selectors.pmStateResult.classList.remove('show');
  pmLoadQuestion();
}

function pmLoadQuestion() {
  state.pmAnswered = false;
  clearInterval(state.pmTimerInterval);
  state.pmSecondsLeft = 20;
  const question = state.PM_Q[state.pmQ];
  selectors.pmQText.textContent = question.q;
  selectors.pmQCat.textContent = question.cat;
  selectors.pmQBadge.textContent = `Q${state.pmQ + 1}`;
  selectors.pmProgressFill.style.width = `${((state.pmQ + 1) / state.PM_Q.length) * 100}%`;
  selectors.pmProgressLabel.textContent = `${state.pmQ + 1} / ${state.PM_Q.length}`;
  selectors.pmScoreVal.textContent = `${state.pmScore} pts`;
  selectors.pmStreakNum.textContent = `🔥 ${state.pmStreak}`;
  selectors.pmFeedback.className = 'pm-feedback';
  selectors.pmFeedback.textContent = '';
  selectors.pmChoices.innerHTML = question.choices
    .map((choice, index) => `
      <button type="button" class="pm-choice" data-action="pm-answer" data-index="${index}">
        <span class="pm-choice-letter">${['A', 'B', 'C', 'D'][index]}</span>${choice}
      </button>`)
    .join('');
  selectors.pmSkipBtn.textContent = state.pmQ === state.PM_Q.length - 1 ? 'Finish' : 'Skip →';
  pmUpdateTimerDisplay();
  state.pmTimerInterval = setInterval(() => {
    state.pmSecondsLeft -= 1;
    pmUpdateTimerDisplay();
    if (state.pmSecondsLeft <= 0) {
      clearInterval(state.pmTimerInterval);
      if (!state.pmAnswered) {
        state.pmAnswered = true;
        state.pmStreak = 0;
        const buttons = document.querySelectorAll('.pm-choice');
        const correctBtn = buttons[question.ans];
        if (correctBtn) correctBtn.classList.add('correct-ans');
        buttons.forEach((button) => (button.disabled = true));
        selectors.pmFeedback.innerHTML = "⏱ Time's up! Correct answer shown.";
        selectors.pmFeedback.className = 'pm-feedback show wrong';
        selectors.pmScoreVal.textContent = `${state.pmScore} pts`;
        selectors.pmStreakNum.textContent = `🔥 ${state.pmStreak}`;
        selectors.pmSkipBtn.textContent = state.pmQ === state.PM_Q.length - 1 ? 'See Results →' : 'Next →';
      }
    }
  }, 1000);
}

function pmUpdateTimerDisplay() {
  selectors.pmTimer.textContent = `⏱ ${state.pmSecondsLeft}s remaining`;
  selectors.pmTimer.className = 'pm-timer';
  if (state.pmSecondsLeft <= 10) selectors.pmTimer.classList.add('warn');
  if (state.pmSecondsLeft <= 5) selectors.pmTimer.classList.add('danger');
}

function pmAnswer(index) {
  if (state.pmAnswered) return;
  state.pmAnswered = true;
  clearInterval(state.pmTimerInterval);
  const question = state.PM_Q[state.pmQ];
  const buttons = document.querySelectorAll('.pm-choice');
  buttons.forEach((button) => (button.disabled = true));
  const feedback = selectors.pmFeedback;
  if (index === question.ans) {
    buttons[index].classList.add('correct-ans');
    state.pmScore += 20;
    state.pmStreak += 1;
    state.pmCorrect += 1;
    state.pmBest = Math.max(state.pmBest, state.pmStreak);
    feedback.innerHTML = '✓ Correct! +20 pts';
    feedback.className = 'pm-feedback show correct';
  } else {
    buttons[index].classList.add('wrong-ans');
    if (buttons[question.ans]) buttons[question.ans].classList.add('correct-ans');
    state.pmStreak = 0;
    feedback.innerHTML = '✗ Incorrect — correct answer highlighted';
    feedback.className = 'pm-feedback show wrong';
  }
  selectors.pmScoreVal.textContent = `${state.pmScore} pts`;
  selectors.pmStreakNum.textContent = `🔥 ${state.pmStreak}`;
  selectors.pmSkipBtn.textContent = state.pmQ === state.PM_Q.length - 1 ? 'See Results →' : 'Next →';
}

function pmNextQuestion() {
  if (state.pmQ < state.PM_Q.length - 1) {
    state.pmQ += 1;
    pmLoadQuestion();
  } else {
    pmShowResult();
  }
}

function pmShowResult() {
  clearInterval(state.pmTimerInterval);
  selectors.pmStateQuiz.style.display = 'none';
  selectors.pmStateResult.classList.add('show');
  const percentage = Math.round((state.pmCorrect / state.PM_Q.length) * 100);
  selectors.pmResPct.textContent = `${percentage}%`;
  selectors.pmResScore.textContent = state.pmScore;
  selectors.pmResCorrect.textContent = `${state.pmCorrect}/${state.PM_Q.length}`;
  selectors.pmResStreak.textContent = state.pmBest;
  const title = percentage >= 80 ? 'Excellent work! 🎉' : percentage >= 60 ? 'Nice effort! 👍' : 'Keep practicing! 💪';
  document.getElementById('pm-res-title').textContent = title;
  document.getElementById('pm-res-sub').textContent = `You scored ${state.pmScore} pts with a best streak of ${state.pmBest}. Keep going!`;
  const existingIndex = state.pmScores.findIndex((score) => score.name === state.pmUser);
  if (existingIndex >= 0) {
    if (state.pmScore > state.pmScores[existingIndex].score) {
      state.pmScores[existingIndex].score = state.pmScore;
    }
  } else {
    state.pmScores.push({ name: state.pmUser, score: state.pmScore, initials: state.pmUser.slice(0, 2).toUpperCase() });
  }
  state.pmScores.sort((a, b) => b.score - a.score);
  localStorage.setItem('pm_scores', JSON.stringify(state.pmScores));
}

function pmResetQuiz() {
  selectors.pmStateResult.classList.remove('show');
  selectors.pmStateUsername.style.display = 'block';
  selectors.pmUsername.value = '';
  selectors.pmUsername.classList.remove('pm-error');
  selectors.pmUsername.placeholder = 'e.g. alex_learns';
}

function pmRenderLeaderboard() {
  const sorted = [...state.pmScores].sort((a, b) => b.score - a.score);
  if (!sorted.length) {
    selectors.pmPodium.innerHTML = '<div class="pm-empty-lb">No scores yet — be the first!</div>';
    selectors.pmLbRows.innerHTML = '';
    selectors.pmLbRestLabel.style.display = 'none';
    return;
  }
  const top3 = sorted.slice(0, 3);
  const classes = ['first', 'second', 'third'];
  const labels = ['1st', '2nd', '3rd'];
  const order = top3.length >= 3 ? [1, 0, 2] : top3.length === 2 ? [1, 0] : [0];
  selectors.pmPodium.innerHTML = order
    .map((position) => `
      <div class="pm-pod ${classes[position]}">
        ${classes[position] === 'first' ? '<div class="pm-pod-crown">👑</div>' : ''}
        <div class="pm-pod-avatar">${top3[position].initials}</div>
        <div class="pm-pod-name">${top3[position].name}</div>
        <div class="pm-pod-score">${top3[position].score} pts</div>
        <div class="pm-pod-badge">${labels[position]}</div>
      </div>`)
    .join('');
  const rest = sorted.slice(3, 13);
  if (rest.length) {
    selectors.pmLbRestLabel.style.display = 'block';
    selectors.pmLbRows.innerHTML = rest
      .map((entry, index) => `
        <div class="pm-lb-row ${entry.name === state.pmUser ? 'me' : ''}">
          <div class="pm-lb-rank">${index + 4}</div>
          <div class="pm-lb-avatar">${entry.initials}</div>
          <div style="flex:1">
            <div class="pm-lb-name">${entry.name}${entry.name === state.pmUser ? ' (you)' : ''}</div>
            <div class="pm-lb-sub">Score</div>
          </div>
          <div class="pm-lb-score">${entry.score}</div>
        </div>`)
      .join('');
  } else {
    selectors.pmLbRestLabel.style.display = 'none';
    selectors.pmLbRows.innerHTML = '';
  }
}

function handleActionClick(event) {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  const index = Number(target.dataset.index);
  switch (action) {
    case 'remove-question':
      removeQuestion(target);
      break;
    case 'edit-quiz':
      editQuiz(index);
      break;
    case 'delete-quiz':
      deleteQuiz(index);
      break;
    case 'copy-code':
      navigator.clipboard.writeText(target.dataset.code).then(() => toast('✓ Code copied!')).catch(() => {});
      break;
    case 'select-choice':
      selectChoice(target.dataset.letter);
      break;
    case 'pm-answer':
      pmAnswer(index);
      break;
    default:
      break;
  }
}

function handleInputChange(event) {
  const target = event.target;
  if (target.matches('.answer-input-student') || target.matches('.essay-input')) {
    const index = Number(target.dataset.index);
    state.studentAnswers[index] = target.value;
  }
}

function initializeEvents() {
  document.getElementById('practice-btn').addEventListener('click', () => showView('practice-view'));
  document.getElementById('student-btn').addEventListener('click', () => showView('student-view'));
  document.getElementById('teacher-btn').addEventListener('click', () => showView('teacher-dashboard'));
  document.querySelectorAll('.back-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetView = link.dataset.target;
      if (targetView) showView(targetView);
    });
  });
  document.getElementById('create-quiz-btn').addEventListener('click', () => showView('create-quiz-view'));
  document.getElementById('add-question-btn').addEventListener('click', addQuestion);
  document.getElementById('cancel-quiz-btn').addEventListener('click', () => showView('teacher-dashboard'));
  document.getElementById('save-quiz-btn').addEventListener('click', saveQuiz);
  selectors.codeBtn.addEventListener('click', copyCode);
  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
  selectors.studentInfoNextBtn.addEventListener('click', handleStudentInfoNext);
  selectors.studentQuizCode.addEventListener('input', (event) => {
    event.target.value = event.target.value.toUpperCase();
  });
  selectors.studentQuizCode.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      joinQuiz();
    }
  });
  document.getElementById('join-quiz-btn').addEventListener('click', joinQuiz);
  selectors.prevQBtn.addEventListener('click', () => changeQuestion(-1));
  selectors.nextQBtn.addEventListener('click', () => changeQuestion(1));
  selectors.submitQuizBtn.addEventListener('click', submitQuiz);
  document.getElementById('results-retry-btn').addEventListener('click', () => showView('student-view'));
  document.getElementById('results-home-btn').addEventListener('click', () => showView('home-view'));
  selectors.pmTabLearn.addEventListener('click', () => pmSwitchTab('learn'));
  selectors.pmTabLb.addEventListener('click', () => pmSwitchTab('lb'));
  document.getElementById('pm-start-btn').addEventListener('click', pmStartQuiz);
  selectors.pmSkipBtn.addEventListener('click', pmNextQuestion);
  document.getElementById('pm-play-again-btn').addEventListener('click', pmResetQuiz);
  document.getElementById('pm-view-leaderboard-btn').addEventListener('click', () => pmSwitchTab('lb'));
  selectors.app.addEventListener('click', handleActionClick);
  selectors.app.addEventListener('input', handleInputChange);
  document.getElementById('quiz-type').addEventListener('change', handleTypeChange);
}

function setupPracticeSession() {
  state.PM_Q = shuffle(PM_QUESTIONS_BANK).slice(0, 15);
  document.getElementById('pm-q-count-label').textContent = `${state.PM_Q.length} total`;
}

function init() {
  setupPracticeSession();
  initializeEvents();
  lucide.createIcons();
  renderQuizzes();
}

window.addEventListener('DOMContentLoaded', init);
