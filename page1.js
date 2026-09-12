document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateDesmosTheme(isDark);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    initDesmosGraph(); // Initialize Desmos on load
    initDesmosGraph2(); // Initialize the second graph on load so it appears when section 2 is revealed

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
        });
        console.log("calculator1 assigned:", calculator1);


        // Function for the road (y=0 with a hole at x=5, point at (5,1))
        calculator1.setExpression({ 
            id: 'road', 
            latex: 'f\\left(x\\right)=0\\left\\{\\left|x-5\\right|>0.1\\right\\}', 
            color: Desmos.Colors.BLUE ,
            lineWidth: 5
        });

        calculator1.setExpression({
            id: 'portal_point',
            latex: '(5,1)',
            color: Desmos.Colors.BLUE,
            pointStyle: 'POINT',
            pointSize: 15,
        });

        calculator1.setExpression({
            id: 'hole_discontinuity',
            latex: '(5,0)',
            color: Desmos.Colors.BLUE,
            pointStyle: Desmos.Styles.OPEN,
            pointSize: 15,
        });

        calculator1.setExpression({
            id: 'car_tracer',
            latex: '(a,0)',
            color: Desmos.Colors.RED,
            pointStyle: 'POINT'
        });

        calculator1.setExpression({
            id: 'blocked_camera',
            latex: 'x=5',
            color: Desmos.Colors.PURPLE,
            lineWidth: 15,
        });

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
            showYAxis: false,
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
            feedback1.innerHTML = "<p class=\"correct\">You made a reasonable guess! Based on the surrounding path, 0 meters is exactly what we'd expect. However, some mischievous guy named Waniel placed a portal there!</p>";
            feedback1.classList.remove('incorrect');
            feedback1.classList.add('correct');
            // Reveal section 2
            section2.classList.remove('hidden');
            if (window.renderMathInElement) {
                renderMathInElement(section2);
            }
        } else {
            feedback1.innerHTML = '<p class="incorrect">Not quite. Remember, the camera malfunctions *at* x=5, but what do you *expect* based on where the car is everywhere else?</p>';
            feedback1.classList.remove('correct');
            feedback1.classList.add('incorrect');
        }
    });

    hint1Btn.addEventListener('click', () => {
        feedback1.innerHTML = '<p class="feedback">Think about the car\'s height just before and just after x=5. What height does it *tend towards*?</p>';
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
            feedback2.innerHTML = '<p class="correct">Correct! Your prediction (the limit) was 0, but the actual height at x=5 was 1 meter. They are not the same!</p>';
            feedback2.classList.remove('incorrect');
            feedback2.classList.add('correct');
            // Reveal section 3
            section3.classList.remove('hidden');
            if (window.renderMathInElement) {
                renderMathInElement(section3);
            }
        } else {
            feedback2.innerHTML = '<p class="incorrect">Not quite. Think about what your prediction was for the car\'s height at x=5, versus what actually happened due to the portal.</p>';
            feedback2.classList.remove('correct');
            feedback2.classList.add('incorrect');
        }
    });

    hint2Btn.addEventListener('click', () => {
        feedback2.innerHTML = '<p class="feedback">Your *prediction* was based on the trend. Did the portal follow that trend at x=5?</p>';
        feedback2.classList.remove('correct', 'incorrect');
    });

    revealAnswer2Btn.addEventListener('click', () => {
        document.getElementById('mc-false').checked = true;
        submitMcBtn.click();
    });
});