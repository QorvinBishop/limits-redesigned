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


    // Question 1 Logic
    const guessHeight4999Input = document.getElementById('guess-height-4999');
    const submitGuess4999Btn = document.getElementById('submit-guess-4999');
    const retryGuess4999Btn = document.getElementById('retry-guess-4999');
    const feedback4999 = document.getElementById('feedback-4999');
    const guessHeight5001Input = document.getElementById('guess-height-5001');
    const submitGuess5001Btn = document.getElementById('submit-guess-5001');
    const retryGuess5001Btn = document.getElementById('retry-guess-5001');
    const feedback5001 = document.getElementById('feedback-5001');
    const guessInput = document.getElementById('guess-height');
    const submitGuessBtn = document.getElementById('submit-guess');
    const hint1Btn = document.getElementById('hint-1');
    const revealAnswer1Btn = document.getElementById('reveal-answer-1');
    const feedback1 = document.getElementById('feedback-1');

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

    submitGuess4999Btn.addEventListener('click', () => {
        checkNearPointGuess(guessHeight4999Input, feedback4999, 0, 'Correct! At x = 4.999, the camera sees that the car is on the road, so the height is 0.');
    });

    retryGuess4999Btn.addEventListener('click', () => {
        guessHeight4999Input.value = '';
        feedback4999.innerHTML = '';
        feedback4999.classList.remove('correct', 'incorrect');
    });

    submitGuess5001Btn.addEventListener('click', () => {
        checkNearPointGuess(guessHeight5001Input, feedback5001, 0, 'Correct! At x = 5.001, the camera sees that the car is on the road, so the height is 0.');
    });

    retryGuess5001Btn.addEventListener('click', () => {
        guessHeight5001Input.value = '';
        feedback5001.innerHTML = '';
        feedback5001.classList.remove('correct', 'incorrect');
    });

    submitGuessBtn.addEventListener('click', () => {
        const guess = parseFloat(guessInput.value);
        if (guess === 0) {
            feedback1.innerHTML = "<p class=\"correct\">You made a reasonable guess! Based on the surrounding path, 0 meters is exactly what we'd expect. However, some mischievous guy named <strong>Waniel</strong> placed a portal there!</p>";
            feedback1.classList.remove('incorrect');
            feedback1.classList.add('correct');
            // Reveal section 2
            section2.classList.remove('hidden');
            refreshVisibleCalculator(calculator2);
            if (window.renderMathInElement) {
                renderMathInElement(section2);
            }
        } else {
            feedback1.innerHTML = '<p class="incorrect">Not quite. Remember, the camera malfunctions <strong>at</strong> x = 5, but based on the car\'s known path, what do you <strong>expect</strong> the car\'s height to be at x = 5 ?</p>';
            feedback1.classList.remove('correct');
            feedback1.classList.add('incorrect');
        }
    });

    hint1Btn.addEventListener('click', () => {
        feedback1.innerHTML = '<p class="feedback">Think about the car\'s height just before and just after x = 5. What height does it <strong>approach</strong>?</p>';
        feedback1.classList.remove('correct', 'incorrect');
    });

    revealAnswer1Btn.addEventListener('click', () => {
        guessInput.value = '0';
        submitGuessBtn.click(); // Simulate clicking submit to show feedback and reveal next section
    });


    // Question 2 Logic
    const submitMcBtn = document.getElementById('submit-mc');
    const hint2Btn = document.getElementById('hint-2');
    const revealAnswer2Btn = document.getElementById('reveal-answer-2');
    const feedback2 = document.getElementById('feedback-2');

    submitMcBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="prediction-match"]:checked');
        if (selectedOption && selectedOption.value === 'false') {
            feedback2.innerHTML = '<p class="correct">Correct! Your prediction (the limit) was 0, but the actual height at x = 5 was 1 meter. They are not the same!</p>';
            feedback2.classList.remove('incorrect');
            feedback2.classList.add('correct');
            // Reveal section 3
            section3.classList.remove('hidden');

            refreshVisibleCalculator(calculator3);

            if (window.renderMathInElement) {
                renderMathInElement(section3);
            }
        } else {
            feedback2.innerHTML = '<p class="incorrect">Not quite. Think about what your prediction was for the car\'s height at x = 5, versus what actually happened due to the portal.</p>';
            feedback2.classList.remove('correct');
            feedback2.classList.add('incorrect');
        }
    });

    hint2Btn.addEventListener('click', () => {
        feedback2.innerHTML = '<p class="feedback">Your <strong>prediction</strong> was based on the trend. Did the portal follow that trend at x = 5?</p>';
        feedback2.classList.remove('correct', 'incorrect');
    });

    revealAnswer2Btn.addEventListener('click', () => {
        document.getElementById('mc-false').checked = true;
        submitMcBtn.click();
    });
    
    // Question 3 Logic
    const guessLimitInput = document.getElementById('guess-limit');
    const submitLimitBtn = document.getElementById('submit-limit');
    const revealAnswer3Btn = document.getElementById('reveal-answer-3');
    const feedback3 = document.getElementById('feedback-3');
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
        const guess = parseFloat(guessLimitInput.value);
        if (Math.abs(guess - 0.5) < 0.0001) {
            feedback3.innerHTML = '<p class="correct">Correct! The function approaches 0.5 as x approaches 0. That is the limit.</p>';
            feedback3.classList.remove('incorrect');
            feedback3.classList.add('correct');
            revealLimit5Question();
        } else {
            feedback3.innerHTML = '<p class="incorrect">Not quite. Consider the value the function gets close to as x approaches 0 from both sides.</p>';
            feedback3.classList.remove('correct');
            feedback3.classList.add('incorrect');
        }
    });

    revealAnswer3Btn.addEventListener('click', () => {
        guessLimitInput.value = '0.5';
        submitLimitBtn.click();
        revealLimit5Question();
    });

    const guessLimit5Input = document.getElementById('guess-limit-5');
    const submitLimit5Btn = document.getElementById('submit-limit-5');
    const revealAnswer5Btn = document.getElementById('reveal-answer-5');
    const feedback5 = document.getElementById('feedback-5');

    submitLimit5Btn.addEventListener('click', () => {
        const guess = parseFloat(guessLimit5Input.value);
        if (Math.abs(guess - 0) < 0.0001) {
            feedback5.innerHTML = '<p class="correct">Correct! The limit as x approaches 4.999 is 0, because at values near 4.999 (like 4.9989 and 4.9991), the car is still on the ground.</p>';
            feedback5.classList.remove('incorrect');
            feedback5.classList.add('correct');
            revealAValueQuestion();
        } else {
            feedback5.innerHTML = '<p class="incorrect">Not quite. The function is still 0 for values extremely close to 4.999 from either side. So what is the limit at 4.999?</p>';
            feedback5.classList.remove('correct');
            feedback5.classList.add('incorrect');
        }
    });

    revealAnswer5Btn.addEventListener('click', () => {
        guessLimit5Input.value = '0';
        submitLimit5Btn.click();
        revealAValueQuestion();
    });

    const submitMultiABtn = document.getElementById('submit-multi-a');
    const revealAnswerABtn = document.getElementById('reveal-answer-a');
    const feedbackA = document.getElementById('feedback-a');
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
        revealLimitExplanation();
    }

    submitMultiABtn.addEventListener('click', () => {
        const selected = selectedAValues();
        const correct = allPossibleAValues.slice();
        const isCorrect = selected.length === correct.length && correct.every((value) => selected.includes(value));

        if (isCorrect) {
            feedbackA.innerHTML = '<p class="correct">Correct! Every listed value of a could work, because the limit statement only depends on how f(x) behaves as x gets close to a.</p>';
            feedbackA.classList.remove('incorrect');
            feedbackA.classList.add('correct');
            revealLimitExplanation();
        } else {
            feedbackA.innerHTML = '<p class="incorrect">Not quite. If the limit is 0, then the function must <strong>approach 0</strong> as x gets close to a. Think about which values of a would make this true.</p>';
            feedbackA.classList.remove('correct');
            feedbackA.classList.add('incorrect');
        }
    });

    revealAnswerABtn.addEventListener('click', () => {
        revealAllAValues();
    });

});