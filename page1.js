document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function updateThemeToggleLabel() {
        const isDark = body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeToggleLabel();
        updateDesmosTheme(isDark);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }
    updateThemeToggleLabel();

    initDesmosGraph(); // Initialize Desmos on load
    initDesmosGraph2(); // Initialize the second graph on load so it appears when section 2 is revealed
    initDesmosGraph3(); // Initialize the third graph for the limit discussion

    // Initialize Desmos theme based on loaded theme
    updateDesmosTheme(savedTheme === 'dark');

    // Section visibility control
    const section1 = document.getElementById('section-1');
    const section2 = document.getElementById('section-2');
    const section3 = document.getElementById('section-3');

    section2.classList.add('hidden');
    section3.classList.add('hidden');

    var calculator1;
    var calculator2;
    var calculator3;

    function initDesmosGraph() {
        const elt1 = document.getElementById('desmos-graph-1');
        if (!elt1) {
            console.error("Desmos graph element not found!");
            return;
        }
        console.log("Desmos element found:", elt1);
        calculator1 = Desmos.GraphingCalculator(elt1, {
            keypad: false,
            expressions: false,
            settingsMenu: false,
            zoomButtons: false,
            lockViewport: true,
            showXAxis: true,
            showYAxis: false,
            showGrid: false,
            backgroundColor: '#263238', // Dark background for the graph
            pointsOfInterest: false,
            trace: false,
        });
        console.log("calculator1 assigned:", calculator1);


        // Function for the road (y=0 with a hole at x=5, point at (5,1))
        calculator1.setExpression({
        id: 'time',
        latex: 't = 0',
        playing: true,
        loopMode: 'LOOP_FORWARD',
        sliderSpeedMultiplier: 0.1
        });
calculator1.setExpression({
        id: 'cyanlist',
        latex: 'C = [0, 0.2, 0.4, 0.6, 0.8, 1.0]',
        });
        calculator1.setExpression({
        id: 'magentalist',
        latex: 'M = [0.1, 0.3, 0.5, 0.7, 0.9]',
        });
        calculator1.controller.dispatch({
  type: 'set-slider-animationperiod', 
  id: 'time', 
  animationPeriod: 20 // 2000ms = 2x speed
});
        // Create the flat line that glitches out at x = 5
        
        calculator1.setExpression({
        id: 'glitched-flatline1',
        latex: 'y = \\frac{(0.2t + 2) \\cdot \\sin(80(x - M[1]) - 0.1t)}{1 + 30(x-5)^2}',
        color: '#38ffda', // Gives it a clean digital cyan look 38ffda
        });
        calculator1.setExpression({
        id: 'glitched-flatline2',
        latex: 'y = \\frac{(0.02t + 2) \\cdot \\sin(80(x - C[1]) - 0.1t)}{1 + 30(x-5)^2}',
        color: '#FF00FF', // Gives it a clean digital magenta look FF00FF
        lineOpacity: 0.6
        });
        
        calculator1.setExpression({ 
            id: 'road', 
            latex: 'f(x)=0', 
            color: Desmos.Colors.BLUE ,
            lineWidth: 5
        });
        /*
        calculator1.setExpression({
  id: 'fading-graph',
  latex: 'f(x) \\left\\{ 0 \\le x \\le 5 \\right\\}',
  lineOpacity: '[1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]'
});
*/
        calculator1.setExpression({
            id: 'car_tracer',
            latex: '(a,0)',
            color: Desmos.Colors.RED,
            pointStyle: 'POINT'
        });

        /*calculator1.setExpression({
            id: 'blocked_camera',
            latex: 'x=5',
            color: Desmos.Colors.PURPLE,
            lineWidth: 15,
        });*/

        // Example for the Signal Tear distortion on a sine wave
        // 1. Initialize the animated time variable
        // 1. Create and auto-start the animation clock




        calculator1.setMathBounds({
            left: 0, right: 10, bottom: -2, top: 2
        });

        let currentCarX = 2;
    calculator1.setExpression({ id: 'a', latex: `a=${currentCarX}` });
}

    function initDesmosGraph2() {
        const elt2 = document.getElementById('desmos-graph-2');
        if (!elt2) {
            console.error("Second Desmos graph element not found!");
            return;
        }

        calculator2 = Desmos.GraphingCalculator(elt2, {
            keypad: false,
            expressions: true,
            expressionsCollapsed: true,
            settingsMenu: false,
            zoomButtons: false,
            lockViewport: true,
            showXAxis: true,
            showYAxis: true,
            showGrid: false,
            backgroundColor: '#263238',
        });

        calculator2.setExpression({ 
            id: 'road-2', 
            latex: 'f(x)=\\left\\{x=5:1,\\ 0\\right\\}', 
            color: Desmos.Colors.BLUE,
            lineWidth: 5
        });

        calculator2.setExpression({
            id: 'portal_point_2',
            latex: '(5,1)',
            color: Desmos.Colors.BLUE,
            pointSize: 15,
            //label: 'asdf',
            //showLabel: true,
        });

        calculator2.setExpression({
            id: 'hole_discontinuity_2',
            latex: '(5,0)',
            color: Desmos.Colors.BLUE,
            pointStyle: Desmos.Styles.OPEN,
            pointSize: 15,
        });

        calculator2.setExpression({
            id: 'car_tracer_2',
            latex: '(a,f(a))',
            color: Desmos.Colors.RED,
            pointStyle: 'POINT'
        });

        calculator2.setMathBounds({
            left: 0, right: 10, bottom: -2, top: 2
        });

        let currentCarX = 2;
        calculator2.setExpression({ id: 'a_2', latex: `a=${currentCarX}` });
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
            bottom: -1,
            top: 1
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
        });

        calculator3.setExpression({
            id: 'arbitrary-function',
            latex: 'f(x)=x\\sin\\left(\\frac{1}{x}\\right)',
            color: Desmos.Colors.BLUE,
            lineWidth: 3
        });

        calculator3.setMathBounds(defaultBounds);

        const resetZoomBtn = document.getElementById('reset-zoom-btn');
        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', () => {
                calculator3.setMathBounds(defaultBounds);
            });
        }
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
    calculator2.setOptions({
        backgroundColor: isDark ? '#263238' : '#e0f7fa',
        textColor: isDark ? '#e0f7fa' : '#263238'
    });
    if (calculator3) {
        calculator3.setOptions({
            backgroundColor: isDark ? '#263238' : '#e0f7fa',
            textColor: isDark ? '#e0f7fa' : '#263238'
        });
    }
}



    // Question 1 Logic
    const guessInput = document.getElementById('guess-height');
    const submitGuessBtn = document.getElementById('submit-guess');
    const hint1Btn = document.getElementById('hint-1');
    const revealAnswer1Btn = document.getElementById('reveal-answer-1');
    const feedback1 = document.getElementById('feedback-1');

    submitGuessBtn.addEventListener('click', () => {
        const guess = parseFloat(guessInput.value);
        if (guess === 0) {
            feedback1.innerHTML = "<p class=\"correct\">You made a reasonable guess! Based on the surrounding path, 0 meters is exactly what we'd expect. However, some mischievous guy named <strong>Waniel</strong> placed a portal there!</p>";
            feedback1.classList.remove('incorrect');
            feedback1.classList.add('correct');
            // Reveal section 2
            section2.classList.remove('hidden');
            if (window.renderMathInElement) {
                renderMathInElement(section2);
            }
        } else {
            feedback1.innerHTML = '<p class="incorrect">Not quite. Remember, the camera malfunctions <strong>at</strong> x = 5, but what do you <strong>expect</strong> the car to be at x = 5 based on its known path?</p>';
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

    function revealLimitExplanation() {
        if (limitReveal) {
            limitReveal.classList.remove('hidden');
            if (window.renderMathInElement) {
                renderMathInElement(section3);
            }
        }
    }

    submitLimitBtn.addEventListener('click', () => {
        const guess = parseFloat(guessLimitInput.value);
        if (Math.abs(guess) < 0.0001) {
            feedback3.innerHTML = '<p class="correct">Correct! The function approaches 0 as x approaches 0. That is the limit.</p>';
            feedback3.classList.remove('incorrect');
            feedback3.classList.add('correct');
            revealLimitExplanation();
        } else {
            feedback3.innerHTML = '<p class="incorrect">Not quite. Consider the value the function gets close to as x approaches 0 from both sides.</p>';
            feedback3.classList.remove('correct');
            feedback3.classList.add('incorrect');
        }
    });

    revealAnswer3Btn.addEventListener('click', () => {
        guessLimitInput.value = '0';
        submitLimitBtn.click();
        revealLimitExplanation();
    });
});