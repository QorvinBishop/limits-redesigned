document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const glitchToggle = document.getElementById('glitch-toggle');
    const motionToggle = document.getElementById('motion-toggle');
    const body = document.body;

    function updateThemeToggleLabel() {
        const isDark = body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    function refreshVisibleCalculator(calculator) {
        if (!calculator) return;
        calculator.resize();
        requestAnimationFrame(() => calculator.resize());
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeToggleLabel();
        updateDesmosTheme(isDark);

        // Force recalculation for all graphs on theme switch
        refreshVisibleCalculator(calculator1);
        refreshVisibleCalculator(calculator2);
        refreshVisibleCalculator(calculator2Copy);
        refreshVisibleCalculator(calculator3);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }
    updateThemeToggleLabel();

    initDesmosGraph(); // Initialize Desmos on load
    initDesmosGraph2(); // Initialize the second graph on load so it appears when section 2 is revealed
    initDesmosGraph2Copy(); // Duplicate the portal graph for the later discontinuity explanation
    initDesmosGraph3(); // Initialize the third graph for the limit discussion

    // Initialize Desmos theme based on loaded theme
    updateDesmosTheme(savedTheme === 'dark');

    // Section visibility control
    const section1 = document.getElementById('section-1');
    const section2 = document.getElementById('section-2');
    const section3 = document.getElementById('section-3');
    const section4 = document.getElementById('section-4');

    section2.classList.add('hidden');
    section3.classList.add('hidden');
    section4.classList.add('hidden');

    var calculator1;
    var calculator2;
    var calculator2Copy;
    var calculator3;

    function updateGraph1SliderMotion() {
        if (!calculator1) return;

        const moving = motionToggle ? motionToggle.checked : true;
        calculator1.setExpression({
            id: 'slider-a',
            latex: 'a = 2',
            sliderBounds: { min: 0, max: 10 },
            playing: moving,
        });
        calculator1.setExpression({
            id: 'car_tracer',
            latex: '(a,f(a))',
            color: Desmos.Colors.RED,
            pointStyle: 'POINT',
            dragMode: Desmos.DragModes.NONE,
            pointSize: 23,
            pointOpacity: 0.9
        });

        const state = calculator1.getState();
        calculator1.setDefaultState(state);
    }

    function restoreGraph1MotionDefaults() {
        if (!calculator1) return;

        const moving = motionToggle ? motionToggle.checked : true;
        calculator1.setExpression({
            id: 'time',
            latex: 't = 0',
            playing: true,
            loopMode: 'LOOP_FORWARD'
        });
        calculator1.controller.dispatch({
            type: 'set-slider-animationperiod',
            id: 'time',
            animationPeriod: 1000
        });
        calculator1.setExpression({
            id: 'slider-a',
            latex: 'a = 2',
            sliderBounds: { min: 0, max: 10 },
            playing: moving,
        });
        calculator1.setExpression({
            id: 'car_tracer',
            latex: '(a,f(a))',
            color: Desmos.Colors.RED,
            pointStyle: 'POINT',
            dragMode: Desmos.DragModes.NONE,
            pointSize: 23,
            pointOpacity: 0.9
        });

        const defaultState = calculator1.getState();
        calculator1.setDefaultState(defaultState);
        if (moving) {
            calculator1.setExpression({
                id: 'slider-a',
                latex: 'a = 2',
                sliderBounds: { min: 0, max: 10 },
                playing: true,
            });
        }
    }

    function initDesmosGraph() {
        const enabled = glitchToggle ? glitchToggle.checked : true;
        const elt1 = document.getElementById('desmos-graph-1');
        if (!elt1) {
            console.error("Desmos graph element not found!");
            return;
        }

        if (calculator1) {
            calculator1.destroy();
            calculator1 = null;
        }

        const isDark = body.classList.contains('dark-theme');

        calculator1 = Desmos.GraphingCalculator(elt1, {
            keypad: false,
            expressions: false,
            settingsMenu: false,
            zoomButtons: false,
            lockViewport: true,
            showResetButtonOnGraphpaper: true,
            showXAxis: true,
            showYAxis: false,
            showGrid: false,
            backgroundColor: isDark ? '#263238' : '#e0f7fa',
            pointsOfInterest: false,
            trace: false,
        });

        const resetButton = elt1.querySelector('.dcg-btn-reset');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                setTimeout(() => {
                    restoreGraph1MotionDefaults();
                }, 0);
            }, { once: true });
        }

        calculator1.setExpression({
            id: 'time',
            latex: 't = 0',
            playing: true,
            loopMode: 'LOOP_FORWARD'
        });
        calculator1.controller.dispatch({
            type: 'set-slider-animationperiod',
            id: 'time',
            animationPeriod: 1000
        });

        if (enabled) {
            calculator1.setExpression({
                id: 'glitched-flatline1',
                latex: 'y = \\frac{(0.1t + 1) \\cdot \\sin(80(x - 0.1) - 0.1t)}{1 + 300(x-5)^2}',
                color: '#38ffda',
            });
            calculator1.setExpression({
                id: 'glitched-flatline2',
                latex: 'y = \\frac{(0.01t + 1) \\cdot \\sin(80x - 0.1t)}{1 + 300(x-5)^2}',
                color: '#FF00FF',
                lineOpacity: 0.6
            });            
        } else {  
            calculator1.setExpression({
                id: 'hole-discontinuity',
                latex: '(5,0)',
                color: Desmos.Colors.BLUE,
                pointStyle: Desmos.Styles.OPEN,
                pointSize: 15
            });
        }
        calculator1.setExpression({ 
            id: 'road', 
            latex: enabled ? "f\\left(x\\right)=\\left\\{\\left|x-5\\right|<0.2:10,0\\right\\}" : "f\\left(x\\right)=\\left\\{\\left|x-5\\right|<0.09:10,0\\right\\}", 
            color: Desmos.Colors.BLUE,
            lineWidth: 5
        });
        calculator1.setExpression({
            id: 'slider-a',
            latex: 'a = 2',
            sliderBounds: { min: 0, max: 10 },
            playing: motionToggle ? motionToggle.checked : true,
        });
        calculator1.setExpression({
            id: 'car_tracer',
            latex: '(a,f(a))',
            color: Desmos.Colors.RED,
            pointStyle: 'POINT',
            dragMode: Desmos.DragModes.NONE,
            pointSize: 23,
            pointOpacity: 0.9
        });

        calculator1.setMathBounds({
            left: 0, right: 10, bottom: -2, top: 2
        });

        const newDefaultState = calculator1.getState();
        calculator1.setDefaultState(newDefaultState);
    }

    if (glitchToggle) {
        glitchToggle.addEventListener('change', () => {
            initDesmosGraph();
            updateDesmosTheme(body.classList.contains('dark-theme'));
        });
    }

    if (motionToggle) {
        motionToggle.addEventListener('change', () => {
            updateGraph1SliderMotion();
            refreshVisibleCalculator(calculator1);
        });
    }

    function updateCalculator2SliderColors(isDark) {
        if (!calculator2) return;

        const trackColor = isDark ? '#ffffff' : Desmos.Colors.BLACK;

        calculator2.setExpression({
            id: 'slider_handle_point',
            latex: '\\left(c,-0.5\\right)',
            color: trackColor,
            pointSize: 12,
            dragMode: Desmos.DragModes.X
        });

        calculator2.setExpression({
            id: 'slider_track',
            latex: 'y = -0.5 \\left\\{1 \\le x \\le 9\\right\\}',
            color: trackColor,
            lineStyle: Desmos.Styles.DASHED,
            lineWidth: 2
        });

        calculator2.setExpression({
            id: 'slider_track_edges',
            latex: 'x=5+\\left[-4,4\\right]\\left\\{-0.6\\le y\\le-0.4\\right\\}',
            color: trackColor,
            lineStyle: Desmos.Styles.SOLID,
            lineWidth: 2
        });
    }

    function initDesmosGraph2() {
        const elt2 = document.getElementById('desmos-graph-2');
        if (!elt2) {
            console.error("Second Desmos graph element not found!");
            return;
        }

        const isDark = body.classList.contains('dark-theme');

        calculator2 = Desmos.GraphingCalculator(elt2, {
            keypad: false,
            expressions: false,
            settingsMenu: false,
            zoomButtons: false,
            lockViewport: true,
            showResetButtonOnGraphpaper: true,
            showXAxis: true,
            showYAxis: true,
            showGrid: false,
            backgroundColor: isDark ? '#263238' : '#e0f7fa',
            trace: false,
            pointsOfInterest: true,
        });

        // Define the piecewise function
        calculator2.setExpression({ 
            id: 'road-2', 
            latex: 'f(x)=\\left\\{x=5:1,\\ 0\\right\\}', 
            color: Desmos.Colors.BLUE,
            lineWidth: 5
        });

        // Portal point at (5,1)
        calculator2.setExpression({
            id: 'portal_point_2',
            latex: '(5,1)',
            color: Desmos.Colors.BLUE,
            pointSize: 15,
        });
        
        // Hole discontinuity at (5,0)
        calculator2.setExpression({
            id: 'hole_discontinuity_2',
            latex: '(5,0)',
            color: Desmos.Colors.BLUE,
            pointStyle: Desmos.Styles.OPEN,
            pointSize: 15,
        });

        // 1. Draggable On-Graph Slider Point
  // Restricts y to -0.5 (or any track line height you prefer) and limits x between 0 and 10
  calculator2.setExpression({
    id: 'slider_handle_x',
    latex: 'c = 2',
    sliderBounds: { min: 1, max: 9 }
  });

  calculator2.setExpression({
    id: 'slider_handle_point',
    latex: '\\left(c,-0.5\\right)',
    color: isDark ? '#ffffff' : Desmos.Colors.BLACK,
    pointSize: 12,
    dragMode: Desmos.DragModes.X // Restricts dragging strictly to the horizontal X axis
  });

  // Optional: Visual track line for the slider handle
  calculator2.setExpression({
    id: 'slider_track',
    latex: 'y = -0.5 \\left\\{1 \\le x \\le 9\\right\\}',
    color: isDark ? '#ffffff' : Desmos.Colors.BLACK,
    lineStyle: Desmos.Styles.DASHED,
    lineWidth: 2
  });
  calculator2.setExpression({
    id: 'slider_track_edges',
    latex: 'x=5+\\left[-4,4\\right]\\left\\{-0.6\\le y\\le-0.4\\right\\}',
    color: isDark ? '#ffffff' : Desmos.Colors.BLACK,
    lineStyle: Desmos.Styles.SOLID,
    lineWidth: 2
  });
  // 2. Define the snapping logic variable 'a'
  // If the slider x is within 0.2 of 5, snap 'a' to 5; otherwise, evaluate to x_slider
  calculator2.setExpression({
    id: 'snap_logic',
    latex: 'a=\\left\\{\\left|c-5\\right|<0.2:5,c\\right\\}',
  });

  // 3. Updated Car Tracer
  // Evaluates using the snapping variable 'a'
  calculator2.setExpression({
    id: 'car_tracer_2',
    latex: '(a,f(a))',
    color: Desmos.Colors.RED,
    pointStyle: 'POINT',
    pointSize: 23,
    pointOpacity: 0.9
  });


        calculator2.setMathBounds({
            left: 0, right: 10, bottom: -1.5, top: 1.5
        });

        const newDefaultState = calculator2.getState();
        calculator2.setDefaultState(newDefaultState);
    }

    function initDesmosGraph2Copy() {
        const elt2Copy = document.getElementById('desmos-graph-2-copy');
        if (!elt2Copy) {
            console.error("Portal graph copy element not found!");
            return;
        }

        const isDark = body.classList.contains('dark-theme');

        calculator2Copy = Desmos.GraphingCalculator(elt2Copy, {
            keypad: false,
            expressions: false,
            settingsMenu: false,
            zoomButtons: false,
            lockViewport: true,
            showResetButtonOnGraphpaper: false,
            showXAxis: true,
            showYAxis: true,
            showGrid: true,
            backgroundColor: isDark ? '#263238' : '#e0f7fa',
            trace: false,
            pointsOfInterest: true,
        });

        calculator2Copy.setExpression({
            id: 'road-2-copy',
            latex: 'f(x)=\\left\\{x=5:1,\\ 0\\right\\}',
            color: Desmos.Colors.BLUE,
            lineWidth: 5
        });

        calculator2Copy.setExpression({
            id: 'portal_point_2_copy',
            latex: '(5,1)',
            color: Desmos.Colors.BLUE,
            pointSize: 15,
        });

        calculator2Copy.setExpression({
            id: 'hole_discontinuity_2_copy',
            latex: '(5,0)',
            color: Desmos.Colors.BLUE,
            pointStyle: Desmos.Styles.OPEN,
            pointSize: 15,
        });

        calculator2Copy.setMathBounds({
            left: 0, right: 10, bottom: -1.5, top: 1.5
        });
        const copyDefaultState = calculator2Copy.getState();
        calculator2Copy.setDefaultState(copyDefaultState);
    }

    function initDesmosGraph3() {
        const elt3 = document.getElementById('desmos-graph-3');
        if (!elt3) {
            console.error("Third Desmos graph element not found!");
            return;
        }

        const defaultBounds = {
            left: -2,
            right: 2,
            bottom: -0.5,
            top: 1.5
        };

        calculator3 = Desmos.GraphingCalculator(elt3, {
            keypad: false,
            expressions: false,
            settingsMenu: false,
            zoomButtons: true,
            lockViewport: false,
            showXAxis: true,
            showYAxis: true,
            showGrid: true,
            backgroundColor: '#263238',
            showResetButtonOnGraphpaper: true,
            trace: false,
        });

        calculator3.setExpression({
            id: 'arbitrary-function',
            latex: 'f(x)=x\\sin\\left(\\frac{1}{x}\\right) + 0.5',
            color: '#2d70b3',
            lineWidth: 3,
            lineOpacity: 0.8
        });

        calculator3.setMathBounds(defaultBounds);
        const newDefaultState = calculator3.getState();
        calculator3.setDefaultState(newDefaultState);
    }

function updateDesmosTheme(isDark) {
    console.log("updateDesmosTheme called.");
    console.log("Is calculator1 defined?", calculator1 !== undefined && calculator1 !== null);
    console.log("Type of calculator1:", typeof calculator1);

    if (!calculator1) {
        console.error("ERROR: calculator1 is not initialized when updateDesmosTheme is called, returning!");
        return;
    }

    // Dynamically set background and invertedColors
    calculator1.setOptions({
        backgroundColor: isDark ? '#263238' : '#e0f7fa',
        textColor: isDark ? '#e0f7fa' : '#263238'
    });
    if (calculator2) {
        calculator2.setOptions({
            backgroundColor: isDark ? '#263238' : '#e0f7fa',
            textColor: isDark ? '#e0f7fa' : '#263238'
        });
        updateCalculator2SliderColors(isDark);
    }
    if (calculator2Copy) {
        calculator2Copy.setOptions({
            backgroundColor: isDark ? '#263238' : '#e0f7fa',
            textColor: isDark ? '#e0f7fa' : '#263238'
        });
    }
    if (calculator3) {
        calculator3.setOptions({
            backgroundColor: isDark ? '#263238' : '#e0f7fa',
            textColor: isDark ? '#e0f7fa' : '#263238'
        });
    }
}


    const question1ScrollOffset = 80;
    const question2ScrollOffset = 80;
    const question3ScrollOffset = 80;
    const question4ScrollOffset = 80;
    const question5ScrollOffset = 30;

    function smoothScrollToTarget(target, offset = 80) {
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const targetTop = rect.top + window.scrollY - offset;
        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    }

    // Question 1 Logic
    const guessHeight4999Input = document.getElementById('guess-height-4999');
    const submitGuess4999Btn = document.getElementById('submit-guess-4999');
    const hint4999Btn = document.getElementById('hint-4999');
    const retryGuess4999Btn = document.getElementById('retry-guess-4999');
    const feedback4999 = document.getElementById('feedback-4999');
    const guessHeight5001Input = document.getElementById('guess-height-5001');
    const submitGuess5001Btn = document.getElementById('submit-guess-5001');
    const hint5001Btn = document.getElementById('hint-5001');
    const retryGuess5001Btn = document.getElementById('retry-guess-5001');
    const feedback5001 = document.getElementById('feedback-5001');
    const guessInput = document.getElementById('guess-height');
    const submitGuessBtn = document.getElementById('submit-guess');
    const hint1Btn = document.getElementById('hint-1');
    const retryGuessBtn = document.getElementById('retry-guess');
    const feedback1 = document.getElementById('feedback-1');
    const next1Btn = document.getElementById('next-1');

    function checkNearPointGuess(input, feedback, expected, message) {
        const guess = parseFloat(input.value);
        if (Math.abs(guess - expected) < 0.0001) {
            feedback.innerHTML = `<p class="correct">${message}</p>`;
            feedback.classList.remove('incorrect');
            feedback.classList.add('correct');
            return true;
        }
        feedback.innerHTML = '<p class="incorrect">Not quite. Remember, the camera malfunctions <strong>at</strong> x = 5, but the camera still works elsewhere.</p>';
        feedback.classList.remove('correct');
        feedback.classList.add('incorrect');
        return false;
    }

    function setQuestionDisabled(input, submitBtn, hintBtn, revealBtn, retryBtn, disabled, showRetry) {
        const controls = [input, submitBtn, hintBtn, revealBtn].filter(Boolean);
        controls.forEach((control) => {
            control.disabled = disabled;
        });
        if (retryBtn) {
            retryBtn.classList.toggle('hidden', !showRetry);
            retryBtn.disabled = false;
        }
    }

    const revealWrongAttemptThreshold = 3;
    const revealWrongAttempts = new Map();

    function updateRevealGateState(button, key) {
        if (!button) return;
        const count = revealWrongAttempts.get(key) || 0;
        const shouldShow = count >= revealWrongAttemptThreshold;
        button.classList.toggle('hidden', !shouldShow);
        button.disabled = !shouldShow;
    }

    function revealGateOnWrong(button, key) {
        if (!button) return;
        registerWrongAttempt(key, button);
    }

    function registerWrongAttempt(key, button) {
        const count = (revealWrongAttempts.get(key) || 0) + 1;
        revealWrongAttempts.set(key, count);
        updateRevealGateState(button, key);
        return count;
    }

    function resetRevealGate(key, button) {
        revealWrongAttempts.set(key, 0);
        updateRevealGateState(button, key);
    }

    submitGuess4999Btn.addEventListener('click', () => {
        const isCorrect = checkNearPointGuess(guessHeight4999Input, feedback4999, 0, 'Correct! At x = 4.999, the camera sees that the car is on the road, so the height is 0.');
        setQuestionDisabled(guessHeight4999Input, submitGuess4999Btn, hint4999Btn, null, retryGuess4999Btn, true, !isCorrect);
    });

    hint4999Btn.addEventListener('click', () => {
        feedback4999.innerHTML = '<p class="feedback">Think about the road just before and after x = 5. If the car is on the road, what is its height?</p>';
        feedback4999.classList.remove('correct', 'incorrect');
        setQuestionDisabled(guessHeight4999Input, submitGuess4999Btn, hint4999Btn, null, retryGuess4999Btn, false, false);
    });

    retryGuess4999Btn.addEventListener('click', () => {
        guessHeight4999Input.value = '';
        feedback4999.innerHTML = '';
        feedback4999.classList.remove('correct', 'incorrect');
        setQuestionDisabled(guessHeight4999Input, submitGuess4999Btn, hint4999Btn, null, retryGuess4999Btn, false, false);
    });

    submitGuess5001Btn.addEventListener('click', () => {
        const isCorrect = checkNearPointGuess(guessHeight5001Input, feedback5001, 0, 'Correct! At x = 5.001, the camera sees that the car is on the road, so the height is 0.');
        setQuestionDisabled(guessHeight5001Input, submitGuess5001Btn, hint5001Btn, null, retryGuess5001Btn, true, !isCorrect);
    });

    hint5001Btn.addEventListener('click', () => {
        feedback5001.innerHTML = '<p class="feedback">Think about the road just before and after x = 5. If the car is on the road, what is its height?</p>';
        feedback5001.classList.remove('correct', 'incorrect');
        setQuestionDisabled(guessHeight5001Input, submitGuess5001Btn, hint5001Btn, null, retryGuess5001Btn, false, false);
    });

    retryGuess5001Btn.addEventListener('click', () => {
        guessHeight5001Input.value = '';
        feedback5001.innerHTML = '';
        feedback5001.classList.remove('correct', 'incorrect');
        setQuestionDisabled(guessHeight5001Input, submitGuess5001Btn, hint5001Btn, null, retryGuess5001Btn, false, false);
    });

    function showNextButton(button, onNext) {
        if (!button) return;
        button.classList.remove('hidden');
        button.onclick = onNext;
    }

    submitGuessBtn.addEventListener('click', () => {
        const questionBlock = document.querySelector('#guess-height').closest('.question');
        const guess = parseFloat(guessInput.value);
        if (guess === 0) {
            feedback1.innerHTML = "<p class=\"correct\">You made a reasonable guess! Based on the surrounding path, 0 meters is exactly what we'd expect. However, some mischievous guy named <strong>Waniel</strong> placed a portal there!</p>";
            feedback1.classList.remove('incorrect');
            feedback1.classList.add('correct');
            setQuestionDisabled(guessInput, submitGuessBtn, hint1Btn, null, retryGuessBtn, true, false);
            showNextButton(next1Btn, () => {
                section2.classList.remove('hidden');
                refreshVisibleCalculator(calculator2);
                if (window.renderMathInElement) {
                    renderMathInElement(section2);
                }
                smoothScrollToTarget(section2, question2ScrollOffset);
                next1Btn.classList.add('hidden');
            });
            smoothScrollToTarget(questionBlock || feedback1, question1ScrollOffset);
        } else {
            feedback1.innerHTML = '<p class="incorrect">Not quite. Remember, the camera malfunctions <strong>at</strong> x = 5, but based on the car\'s known path, what do you <strong>expect</strong> the car\'s height to be at x = 5 ?</p>';
            feedback1.classList.remove('correct');
            feedback1.classList.add('incorrect');
            if (next1Btn) next1Btn.classList.add('hidden');
            setQuestionDisabled(guessInput, submitGuessBtn, hint1Btn, null, retryGuessBtn, true, true);
            smoothScrollToTarget(questionBlock || feedback1, question1ScrollOffset);
        }
    });

    hint1Btn.addEventListener('click', () => {
        const questionBlock = document.querySelector('#guess-height').closest('.question');
        feedback1.innerHTML = '<p class="feedback">Think about the car\'s height just before and just after x = 5. What height does it <strong>approach</strong>?</p>';
        feedback1.classList.remove('correct', 'incorrect');
        if (next1Btn) next1Btn.classList.add('hidden');
        setQuestionDisabled(guessInput, submitGuessBtn, hint1Btn, null, retryGuessBtn, false, false);
        smoothScrollToTarget(questionBlock || feedback1, question1ScrollOffset);
    });

    retryGuessBtn.addEventListener('click', () => {
        guessInput.value = '';
        feedback1.innerHTML = '';
        feedback1.classList.remove('correct', 'incorrect');
        if (next1Btn) next1Btn.classList.add('hidden');
        setQuestionDisabled(guessInput, submitGuessBtn, hint1Btn, null, retryGuessBtn, false, false);
    });


    // Question 2 Logic
    const submitMcBtn = document.getElementById('submit-mc');
    const hint2Btn = document.getElementById('hint-2');
    const revealAnswer2Btn = document.getElementById('reveal-answer-2');
    const feedback2 = document.getElementById('feedback-2');
    const next2Btn = document.getElementById('next-2');

    submitMcBtn.addEventListener('click', () => {
        const questionBlock = document.querySelector('#section-2 .question') || feedback2;
        const selectedOption = document.querySelector('input[name="prediction-match"]:checked');
        if (selectedOption && selectedOption.value === 'false') {
            feedback2.innerHTML = '<p class="correct">Correct! Your prediction (the limit) was 0, but the actual height at x = 5 was 1 meter. They are not the same!</p>';
            feedback2.classList.remove('incorrect');
            feedback2.classList.add('correct');
            const mcInputs = document.querySelectorAll('input[name="prediction-match"]');
            mcInputs.forEach((input) => { input.disabled = true; });
            document.getElementById('submit-mc').disabled = true;
            document.getElementById('hint-2').disabled = true;
            document.getElementById('reveal-answer-2').disabled = true;
            showNextButton(next2Btn, () => {
                section3.classList.remove('hidden');
                refreshVisibleCalculator(calculator3);
                if (window.renderMathInElement) {
                    renderMathInElement(section3);
                }
                smoothScrollToTarget(section3, question3ScrollOffset);
                next2Btn.classList.add('hidden');
            });
            smoothScrollToTarget(questionBlock || feedback2, question2ScrollOffset);
        } else {
            feedback2.innerHTML = '<p class="incorrect">Not quite. Think about what your prediction was for the car\'s height at x = 5, versus what actually happened due to the portal.</p>';
            feedback2.classList.remove('correct');
            feedback2.classList.add('incorrect');
            const mcInputs = document.querySelectorAll('input[name="prediction-match"]');
            mcInputs.forEach((input) => { input.disabled = true; });
            document.getElementById('submit-mc').disabled = true;
            document.getElementById('hint-2').disabled = true;
            document.getElementById('reveal-answer-2').disabled = true;
            document.getElementById('retry-guess-2').classList.remove('hidden');
            if (next2Btn) next2Btn.classList.add('hidden');
            smoothScrollToTarget(questionBlock || feedback2, question2ScrollOffset);
        }
    });

    hint2Btn.addEventListener('click', () => {
        const questionBlock = document.querySelector('#section-2 .question') || feedback2;
        feedback2.innerHTML = '<p class="feedback">Your <strong>prediction</strong> was based on the trend. Did the portal follow that trend at x = 5?</p>';
        feedback2.classList.remove('correct', 'incorrect');
        const mcInputs = document.querySelectorAll('input[name="prediction-match"]');
        mcInputs.forEach((input) => { input.disabled = false; });
        document.getElementById('submit-mc').disabled = false;
        document.getElementById('hint-2').disabled = false;
        document.getElementById('reveal-answer-2').disabled = false;
        document.getElementById('retry-guess-2').classList.add('hidden');
        if (next2Btn) next2Btn.classList.add('hidden');
        smoothScrollToTarget(questionBlock || feedback2, question2ScrollOffset);
    });

    document.getElementById('retry-guess-2').addEventListener('click', () => {
        const mcInputs = document.querySelectorAll('input[name="prediction-match"]');
        mcInputs.forEach((input) => { input.disabled = false; input.checked = false; });
        document.getElementById('submit-mc').disabled = false;
        document.getElementById('hint-2').disabled = false;
        document.getElementById('reveal-answer-2').disabled = false;
        document.getElementById('retry-guess-2').classList.add('hidden');
        feedback2.innerHTML = '';
        feedback2.classList.remove('correct', 'incorrect');
    });

    revealAnswer2Btn.addEventListener('click', () => {
        document.getElementById('mc-false').checked = true;
        feedback2.innerHTML = '<p class="correct">Correct! Your prediction (the limit) was 0, but the actual height at x = 5 was 1 meter. They are not the same!</p>';
        feedback2.classList.remove('incorrect');
        feedback2.classList.add('correct');
        const mcInputs = document.querySelectorAll('input[name="prediction-match"]');
        mcInputs.forEach((input) => { input.disabled = true; });
        document.getElementById('submit-mc').disabled = true;
        document.getElementById('hint-2').disabled = true;
        document.getElementById('reveal-answer-2').disabled = true;
        showNextButton(next2Btn, () => {
            section3.classList.remove('hidden');
            refreshVisibleCalculator(calculator3);
            if (window.renderMathInElement) {
                renderMathInElement(section3);
            }
            smoothScrollToTarget(section3, question3ScrollOffset);
            next2Btn.classList.add('hidden');
        });
        smoothScrollToTarget(document.querySelector('#section-2 .question') || feedback2, question2ScrollOffset);
    });
    
    // Question 3 Logic
    const guessLimitInput = document.getElementById('guess-limit');
    const submitLimitBtn = document.getElementById('submit-limit');
    const revealAnswer3Btn = document.getElementById('reveal-answer-3');
    const feedback3 = document.getElementById('feedback-3');
    const next3Btn = document.getElementById('next-3');
    const limitReveal = document.getElementById('limit-reveal');
    const limit5Reveal = document.getElementById('limit-5-reveal');
    const aValueReveal = document.getElementById('a-value-reveal');
    const page1Outro = document.getElementById('page1-outro');

    function revealPage1Outro() {
        if (page1Outro) {
            page1Outro.classList.remove('hidden');
            if (window.renderMathInElement) {
                renderMathInElement(page1Outro);
            }
        }
    }

    function revealLimitExplanation() {
        if (limitReveal) {
            limitReveal.classList.remove('hidden');
            refreshVisibleCalculator(calculator2Copy);
        }
        if (window.renderMathInElement) {
            renderMathInElement(section4);
        }
        revealPage1Outro();
    }

    function revealLimit5Question() {
        if (section4) {
            section4.classList.remove('hidden');
        }
        if (limit5Reveal) {
            limit5Reveal.classList.remove('hidden');
            if (window.renderMathInElement) {
                renderMathInElement(section4);
            }
        }
    }

    function revealAValueQuestion() {
        if (section4) {
            section4.classList.remove('hidden');
        }
        
        if (aValueReveal) {
            aValueReveal.classList.remove('hidden');
            refreshVisibleCalculator(calculator2Copy);
            if (window.renderMathInElement) {
                renderMathInElement(section4);
            }
        }
    }

    submitLimitBtn.addEventListener('click', () => {
        const questionBlock = guessLimitInput.closest('.question');
        const guess = parseFloat(guessLimitInput.value);
        if (Math.abs(guess - 0.5) < 0.0001) {
            feedback3.innerHTML = '<p class="correct">Correct! The function approaches 0.5 as x approaches 0. That is the limit.</p>';
            feedback3.classList.remove('incorrect');
            feedback3.classList.add('correct');
            resetRevealGate('limit-3', revealAnswer3Btn);
            setQuestionDisabled(guessLimitInput, submitLimitBtn, document.getElementById('hint-3'), null, document.getElementById('retry-guess-3'), true, false);
            showNextButton(next3Btn, () => {
                revealLimit5Question();
                smoothScrollToTarget(limit5Reveal || section4, question4ScrollOffset);
                next3Btn.classList.add('hidden');
            });
            smoothScrollToTarget(questionBlock || feedback3, question3ScrollOffset);
        } else {
            feedback3.innerHTML = '<p class="incorrect">Not quite. Consider the value the function gets close to as x approaches 0 from both sides.</p>';
            feedback3.classList.remove('correct');
            feedback3.classList.add('incorrect');
            revealGateOnWrong(revealAnswer3Btn, 'limit-3');
            setQuestionDisabled(guessLimitInput, submitLimitBtn, document.getElementById('hint-3'), null, document.getElementById('retry-guess-3'), true, true);
            if (next3Btn) next3Btn.classList.add('hidden');
            smoothScrollToTarget(questionBlock || feedback3, question3ScrollOffset);
        }
    });

    document.getElementById('retry-guess-3').addEventListener('click', () => {
        guessLimitInput.value = '';
        feedback3.innerHTML = '';
        feedback3.classList.remove('correct', 'incorrect');
        setQuestionDisabled(guessLimitInput, submitLimitBtn, document.getElementById('hint-3'), null, document.getElementById('retry-guess-3'), false, false);
        if (next3Btn) next3Btn.classList.add('hidden');
    });

    document.getElementById('hint-3').addEventListener('click', () => {
        feedback3.innerHTML = '<p class="feedback">Look at the graph near x = 0. What value does the function get close to from the left and right?</p>';
        feedback3.classList.remove('correct', 'incorrect');
        setQuestionDisabled(guessLimitInput, submitLimitBtn, document.getElementById('hint-3'), null, document.getElementById('retry-guess-3'), false, false);
        if (next3Btn) next3Btn.classList.add('hidden');
    });

    revealAnswer3Btn.addEventListener('click', () => {
        const questionBlock = guessLimitInput.closest('.question');
        guessLimitInput.value = '0.5';
        feedback3.innerHTML = '<p class="correct">Correct! The function approaches 0.5 as x approaches 0. That is the limit.</p>';
        feedback3.classList.remove('incorrect');
        feedback3.classList.add('correct');
        resetRevealGate('limit-3', revealAnswer3Btn);
        setQuestionDisabled(guessLimitInput, submitLimitBtn, document.getElementById('hint-3'), null, document.getElementById('retry-guess-3'), true, false);
        showNextButton(next3Btn, () => {
            revealLimit5Question();
            smoothScrollToTarget(limit5Reveal || section4, question4ScrollOffset);
            next3Btn.classList.add('hidden');
        });
        smoothScrollToTarget(questionBlock || feedback3, question3ScrollOffset);
    });

    const guessLimit5Input = document.getElementById('guess-limit-5');
    const submitLimit5Btn = document.getElementById('submit-limit-5');
    const revealAnswer5Btn = document.getElementById('reveal-answer-5');
    const feedback5 = document.getElementById('feedback-5');
    const next5Btn = document.getElementById('next-5');

    submitLimit5Btn.addEventListener('click', () => {
        const questionBlock = guessLimit5Input.closest('.question');
        const guess = parseFloat(guessLimit5Input.value);
        if (Math.abs(guess - 0) < 0.0001) {
            feedback5.innerHTML = '<p class="correct">Correct! The limit as x approaches 4.999 is 0, because at values near 4.999 (like 4.9989 and 4.9991), the car is still on the ground.</p>';
            feedback5.classList.remove('incorrect');
            feedback5.classList.add('correct');
            resetRevealGate('limit-5', revealAnswer5Btn);
            setQuestionDisabled(guessLimit5Input, submitLimit5Btn, document.getElementById('hint-5'), null, document.getElementById('retry-guess-5'), true, false);
            showNextButton(next5Btn, () => {
                revealAValueQuestion();
                smoothScrollToTarget(aValueReveal || section4, question5ScrollOffset);
                next5Btn.classList.add('hidden');
            });
            smoothScrollToTarget(questionBlock || feedback5, question4ScrollOffset);
        } else {
            feedback5.innerHTML = '<p class="incorrect">Not quite. The function is still 0 for values extremely close to 4.999 from either side. So what is the limit at 4.999?</p>';
            feedback5.classList.remove('correct');
            feedback5.classList.add('incorrect');
            revealGateOnWrong(revealAnswer5Btn, 'limit-5');
            setQuestionDisabled(guessLimit5Input, submitLimit5Btn, document.getElementById('hint-5'), null, document.getElementById('retry-guess-5'), true, true);
            if (next5Btn) next5Btn.classList.add('hidden');
            smoothScrollToTarget(questionBlock || feedback5, question4ScrollOffset);
        }
    });

    document.getElementById('retry-guess-5').addEventListener('click', () => {
        guessLimit5Input.value = '';
        feedback5.innerHTML = '';
        feedback5.classList.remove('correct', 'incorrect');
        setQuestionDisabled(guessLimit5Input, submitLimit5Btn, document.getElementById('hint-5'), null, document.getElementById('retry-guess-5'), false, false);
        if (next5Btn) next5Btn.classList.add('hidden');
    });

    document.getElementById('hint-5').addEventListener('click', () => {
        feedback5.innerHTML = '<p class="feedback">Near x = 4.999, the car is still on the ground, so what height does it approach?</p>';
        feedback5.classList.remove('correct', 'incorrect');
        setQuestionDisabled(guessLimit5Input, submitLimit5Btn, document.getElementById('hint-5'), null, document.getElementById('retry-guess-5'), false, false);
        if (next5Btn) next5Btn.classList.add('hidden');
    });

    revealAnswer5Btn.addEventListener('click', () => {
        const questionBlock = guessLimit5Input.closest('.question');
        guessLimit5Input.value = '0';
        feedback5.innerHTML = '<p class="correct">Correct! The limit as x approaches 4.999 is 0, because at values near 4.999 (like 4.9989 and 4.9991), the car is still on the ground.</p>';
        feedback5.classList.remove('incorrect');
        feedback5.classList.add('correct');
        resetRevealGate('limit-5', revealAnswer5Btn);
        setQuestionDisabled(guessLimit5Input, submitLimit5Btn, document.getElementById('hint-5'), null, document.getElementById('retry-guess-5'), true, false);
        showNextButton(next5Btn, () => {
            revealAValueQuestion();
            smoothScrollToTarget(aValueReveal || section4, question5ScrollOffset);
            next5Btn.classList.add('hidden');
        });
        smoothScrollToTarget(questionBlock || feedback5, question4ScrollOffset);
    });

    const submitMultiABtn = document.getElementById('submit-multi-a');
    const revealAnswerABtn = document.getElementById('reveal-answer-a');
    const feedbackA = document.getElementById('feedback-a');
    const nextABtn = document.getElementById('next-a');
    const allPossibleAValues = ['-2', '0', '3', '5', '\\pi', '42.67'];

    function selectedAValues() {
        return [...document.querySelectorAll('input[name="possible-a"]:checked')].map((input) => input.value);
    }

    function revealAllAValues() {
        const checkboxes = document.querySelectorAll('input[name="possible-a"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
        });
        feedbackA.innerHTML = '<p class="correct">All of these values are valid choices for a, because the limit statement only asks that the function approaches 0 as x gets close to a. The limit is about the nearby behavior, not the point itself.</p>';
        feedbackA.classList.remove('incorrect');
        feedbackA.classList.add('correct');
    }

    submitMultiABtn.addEventListener('click', () => {
        const questionBlock = document.querySelector('#a-value-reveal .question') || feedbackA;
        const selected = selectedAValues();
        const correct = allPossibleAValues.slice();
        const isCorrect = selected.length === correct.length && correct.every((value) => selected.includes(value));

        if (isCorrect) {
            feedbackA.innerHTML = '<p class="correct">Correct! Every listed value of a could work, because the limit statement only depends on how f(x) behaves as x gets close to a.</p>';
            feedbackA.classList.remove('incorrect');
            feedbackA.classList.add('correct');
            const checkboxes = document.querySelectorAll('input[name="possible-a"]');
            checkboxes.forEach((checkbox) => { checkbox.disabled = true; });
            document.getElementById('submit-multi-a').disabled = true;
            document.getElementById('hint-a').disabled = true;
            resetRevealGate('possible-a', revealAnswerABtn);
            showNextButton(nextABtn, () => {
                revealLimitExplanation();
                smoothScrollToTarget(limitReveal || section4, question5ScrollOffset);
                nextABtn.classList.add('hidden');
            });
            smoothScrollToTarget(questionBlock, question5ScrollOffset);
        } else {
            feedbackA.innerHTML = '<p class="incorrect">Not quite. If the limit is 0, then the function must <strong>approach 0</strong> as x gets close to a. Think about which values of a would make this true.</p>';
            feedbackA.classList.remove('correct');
            feedbackA.classList.add('incorrect');
            const checkboxes = document.querySelectorAll('input[name="possible-a"]');
            checkboxes.forEach((checkbox) => { checkbox.disabled = true; });
            document.getElementById('submit-multi-a').disabled = true;
            document.getElementById('hint-a').disabled = true;
            revealGateOnWrong(revealAnswerABtn, 'possible-a');
            document.getElementById('retry-guess-a').classList.remove('hidden');
            if (nextABtn) nextABtn.classList.add('hidden');
            smoothScrollToTarget(questionBlock, question5ScrollOffset);
        }
    });

    document.getElementById('hint-a').addEventListener('click', () => {
        feedbackA.innerHTML = '<p class="feedback">The limit cares about nearby values of x, not the exact point itself. Which values of a keep the function near 0?</p>';
        feedbackA.classList.remove('correct', 'incorrect');
        const checkboxes = document.querySelectorAll('input[name="possible-a"]');
        checkboxes.forEach((checkbox) => { checkbox.disabled = false; });
        document.getElementById('submit-multi-a').disabled = false;
        document.getElementById('hint-a').disabled = false;
        document.getElementById('retry-guess-a').classList.add('hidden');
        if (nextABtn) nextABtn.classList.add('hidden');
    });

    document.getElementById('retry-guess-a').addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('input[name="possible-a"]');
        checkboxes.forEach((checkbox) => { checkbox.disabled = false; checkbox.checked = false; });
        document.getElementById('submit-multi-a').disabled = false;
        document.getElementById('hint-a').disabled = false;
        document.getElementById('retry-guess-a').classList.add('hidden');
        feedbackA.innerHTML = '';
        feedbackA.classList.remove('correct', 'incorrect');
    });

    revealAnswerABtn.addEventListener('click', () => {
        const questionBlock = document.querySelector('#a-value-reveal .question') || feedbackA;
        revealAllAValues();
        resetRevealGate('possible-a', revealAnswerABtn);
        showNextButton(nextABtn, () => {
            revealLimitExplanation();
            smoothScrollToTarget(limitReveal || section4, 150);
            nextABtn.classList.add('hidden');
        });
        smoothScrollToTarget(questionBlock, question5ScrollOffset);
    });

});