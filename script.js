/**
 * LIMIT GLITCH V1.0
 * Core Game Logic
 */

const levels = [
    {
        id: 'rem1',
        name: 'The Vanishing Point',
        type: 'removable',
        func: 'f(x) = \\frac{x^2-4}{x-2}',
        desmos: 'y=(x^2-4)/(x-2)',
        targetX: 2,
        answer: '4',
        solution: 'Level: $\\lim_{x \\to 2} \\frac{x^2-4}{x-2}$\n\n1. Factor numerator: $\\frac{(x-2)(x+2)}{x-2}$\n2. Cancel common factor: $x+2$ (for $x \\neq 2$)\n3. Substitute target $x$: $2 + 2 = 4$\n\nRESULT: The limit exists at 4, even though the function is undefined at $x=2$.'
    },
    {
        id: 'rem2',
        name: 'Rational Glitch',
        type: 'removable',
        func: 'f(x) = \\frac{\\sqrt{x+1}-1}{x}',
        desmos: 'y=(sqrt(x+1)-1)/x',
        targetX: 0,
        answer: '0.5',
        solution: 'Level: $\\lim_{x \\to 0} \\frac{\\sqrt{x+1}-1}{x}$\n\n1. Rationalize the numerator by multiplying by the conjugate: $(\\sqrt{x+1}+1)$\n2. Simplified: $\\frac{(x+1)-1}{x(\\sqrt{x+1}+1)} = \\frac{x}{x(\\sqrt{x+1}+1)}$\n3. Cancel $x$: $\\frac{1}{\\sqrt{x+1}+1}$\n4. Substitute $x=0$: $\\frac{1}{\\sqrt{1} + 1} = \\frac{1}{2} = 0.5$'
    },
    {
        id: 'inf1',
        name: 'Infinite Divide',
        type: 'infinite',
        func: 'f(x) = \\frac{1}{x-2}',
        desmos: 'y=1/(x-2)',
        targetX: 2,
        answer: 'DNE',
        solution: 'Level: $\\lim_{x \\to 2} \\frac{1}{x-2}$\n\n1. Check Left Limit ($x \\to 2^-$): $\\frac{1}{-0.0001} \\to -\\infty$\n2. Check Right Limit ($x \\to 2^+$): $\\frac{1}{0.0001} \\to +\\infty$\n3. Since left and right limits do not match and are unbounded:\n\nRESULT: Does Not Exist (DNE)'
    }
];

class LimitGame {
    constructor() {
        this.calculator = null;
        this.yHelper = null; // Helper for tracking y-value
        this.currentLevelIdx = 0;
        this.score = 0;
        this.wrongAttempts = 0;
        this.maxAttempts = 5;
        this.progress = this.loadProgress();
        
        this.initCalculator();
        this.loadLevel(this.currentLevelIdx);
        this.setupEventListeners();
        this.updateUI();
    }

    initCalculator() {
        const elt = document.getElementById('calculator');
        this.calculator = Desmos.GraphingCalculator(elt, {
            keypad: false,
            expressions: false,
            settingsMenu: false,
            zoomButtons: false,
            lockViewport: true,
            backgroundColor: "#000000",
            willReadFrequently: true
        });
        
        // Set default viewport
        this.calculator.setMathBounds({
            left: -5, right: 9, bottom: -2, top: 10
        });
    }

    loadLevel(idx) {
        const level = levels[idx];
        this.wrongAttempts = 0;
        
        // Update Desmos
        this.calculator.setExpression({
            id: 'graph',
            latex: level.desmos,
            color: '#00ff41'
        });

        // Add tracer point
        const yLatex = level.desmos.replace('y=', '').replace(/x/g, 'a');
        this.calculator.setExpression({
            id: 'tracer',
            latex: `(a, ${yLatex})`,
            color: '#ff003c',
            pointStyle: Desmos.Styles.POINT
        });

        // Initialize Helper for Y-value evaluation
        if (this.yHelper) this.yHelper.unobserve('numericValue');
        this.yHelper = this.calculator.HelperExpression({ latex: yLatex });
        this.yHelper.observe('numericValue', () => this.updateCoordDisplay());

        // Update Math Bounds based on level type
        if (level.type === 'removable') {
            this.calculator.setMathBounds({
                left: level.targetX - 5,
                right: level.targetX + 5,
                bottom: -2,
                top: 10
            });
        } else if (level.type === 'infinite') {
            this.calculator.setMathBounds({
                left: level.targetX - 5,
                right: level.targetX + 5,
                bottom: -10,
                top: 10
            });
        }

        // Update UI
        document.getElementById('level-name').textContent = level.name;
        
        // Render math using KaTeX
        const funcEl = document.getElementById('func-display');
        const targetXEl = document.getElementById('target-x-display');
        
        if (window.katex) {
            katex.render(level.func, funcEl, { throwOnError: false });
            katex.render(`x \\to ${level.targetX}`, targetXEl, { throwOnError: false });
        } else {
            funcEl.textContent = level.func;
            targetXEl.textContent = level.targetX;
        }

        document.getElementById('level-idx').textContent = idx + 1;
        document.getElementById('guess-input').value = '';
        
        this.updateTracer(level.targetX - 2); // Start near target
    }

    setupEventListeners() {
        const slider = document.getElementById('x-slider');
        slider.addEventListener('input', (e) => {
            this.updateTracer(parseFloat(e.target.value));
        });

        document.getElementById('guess-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitGuess();
        });
    }

    updateTracer(x) {
        this.calculator.setExpression({ id: 'a', latex: `a=${x}` });
        this.updateCoordDisplay();
    }

    updateCoordDisplay() {
        const x = this.calculator.HelperExpression({ latex: 'a' }).numericValue;
        const y = this.yHelper ? this.yHelper.numericValue : NaN;
        
        document.getElementById('coord-display').textContent = `x: ${x !== undefined ? x.toFixed(2) : '0.00'}, y: ${y === undefined || isNaN(y) ? 'undefined' : y.toFixed(2)}`;
        
        if (x !== undefined) {
            document.getElementById('x-slider').value = x;
        }
    }

    submitGuess() {
        const guess = document.getElementById('guess-input').value.trim().toLowerCase();
        const level = levels[this.currentLevelIdx];
        const correct = level.answer.toLowerCase();

        if (guess === correct) {
            this.handleWin();
        } else {
            this.handleWrong();
        }
    }

    handleWin() {
        const bonus = this.wrongAttempts === 0 ? 50 : 10;
        this.score += 100 + bonus;
        this.updateStatus("LEVEL_SUCCESS: CORRUPTION_CLEARED", "#00ff41");
        this.showOverlay("LEVEL_CLEARED", levels[this.currentLevelIdx].solution);
        
        // Save progress
        if (!this.progress.completed.includes(levels[this.currentLevelIdx].id)) {
            this.progress.completed.push(levels[this.currentLevelIdx].id);
        }
        this.progress.score = this.score;
        this.saveProgress();
        this.updateUI();
    }

    handleWrong() {
        this.wrongAttempts++;
        this.triggerGlitch();
        
        if (this.wrongAttempts >= this.maxAttempts) {
            this.updateStatus("CRITICAL_ERROR: SYSTEM_FAILURE", "#ff003c");
            this.showOverlay("GAME_OVER", levels[this.currentLevelIdx].solution);
        } else {
            this.updateStatus(`ERROR: GLITCH_DETECTED (${this.wrongAttempts}/${this.maxAttempts})`, "#ff003c");
        }
    }

    triggerGlitch() {
        const body = document.getElementById('body');
        const intensity = this.wrongAttempts;
        
        body.classList.add('glitch-active', 'glitch-shake');
        
        // Add random perturbation to graph
        const level = levels[this.currentLevelIdx];
        this.calculator.setExpression({
            id: 'graph',
            latex: level.desmos + `+ ${Math.random() * 0.5 * intensity}`,
            color: '#ff003c'
        });

        setTimeout(() => {
            body.classList.remove('glitch-shake');
            // Reset graph color but keep a bit of distortion if consecutive fails
            this.calculator.setExpression({
                id: 'graph',
                latex: level.desmos,
                color: this.wrongAttempts > 2 ? '#ff003c' : '#00ff41'
            });
            
            if (this.wrongAttempts < 2) body.classList.remove('glitch-active');
        }, 200);
    }

    showOverlay(title, solution) {
        const overlay = document.getElementById('completion-overlay');
        document.getElementById('completion-title').textContent = title;
        const solutionDisplay = document.getElementById('solution-display');
        solutionDisplay.textContent = solution;
        
        // Trigger KaTeX auto-render on the solution display
        if (window.renderMathInElement) {
            renderMathInElement(solutionDisplay, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        }
        
        overlay.style.display = 'flex';
    }

    closeOverlay() {
        document.getElementById('completion-overlay').style.display = 'none';
        document.getElementById('body').classList.remove('glitch-active');
        this.loadLevel(this.currentLevelIdx);
    }

    nextLevel() {
        this.currentLevelIdx = (this.currentLevelIdx + 1) % levels.length;
        document.getElementById('completion-overlay').style.display = 'none';
        document.getElementById('body').classList.remove('glitch-active');
        this.loadLevel(this.currentLevelIdx);
    }

    updateStatus(msg, color) {
        const status = document.getElementById('status-msg');
        status.textContent = msg;
        status.style.color = color;
    }

    updateUI() {
        document.getElementById('score-val').textContent = this.score;
        const stars = document.querySelectorAll('.star');
        stars.forEach((s, i) => {
            if (i < Math.floor(this.score / 200)) s.classList.add('earned');
        });
    }

    // Persistence
    loadProgress() {
        const data = localStorage.getItem('limitGlitchProgress');
        return data ? JSON.parse(data) : { score: 0, completed: [] };
    }

    saveProgress() {
        localStorage.setItem('limitGlitchProgress', JSON.stringify(this.progress));
    }

    resetProgress() {
        localStorage.removeItem('limitGlitchProgress');
        location.reload();
    }

    filterLevels(type) {
        // Stub for V1.0 - just shows status
        this.updateStatus(`MODE_SELECTED: ${type.toUpperCase()}`, "#fff");
    }
}

// Initialize Game
const game = new LimitGame();
