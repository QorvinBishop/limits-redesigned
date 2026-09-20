document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function updateThemeToggleLabel() {
        const isDark = body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeToggleLabel();
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }
    updateThemeToggleLabel();

    const continuityCaseBtn = document.getElementById('submit-continuity-case');
    const revealContinuityCaseBtn = document.getElementById('reveal-answer-continuity-case');
    const continuityCaseFeedback = document.getElementById('feedback-continuity-case');
    const continuitySection2 = document.getElementById('continuity-section-2');

    continuityCaseBtn.addEventListener('click', () => {
        const selected = document.querySelector('input[name="continuity-case"]:checked');
        if (selected && selected.value === 'smooth-road') {
            continuityCaseFeedback.innerHTML = '<p class="correct">Exactly. A smooth road is continuous because it has no sudden jumps, gaps, or vanishing points.</p>';
            continuityCaseFeedback.classList.remove('incorrect');
            continuityCaseFeedback.classList.add('correct');
            if (continuitySection2) {
                continuitySection2.classList.remove('hidden');
            }
        } else {
            continuityCaseFeedback.innerHTML = '<p class="incorrect">Not quite. Ask yourself: does the path ever suddenly jump or disappear? A continuous path should feel unbroken.</p>';
            continuityCaseFeedback.classList.remove('correct');
            continuityCaseFeedback.classList.add('incorrect');
        }
    });

    revealContinuityCaseBtn.addEventListener('click', () => {
        document.getElementById('case-smooth-road').checked = true;
        continuityCaseBtn.click();
    });

    const breakTypeBtn = document.getElementById('submit-break-type');
    const revealBreakTypeBtn = document.getElementById('reveal-answer-break-type');
    const breakTypeFeedback = document.getElementById('feedback-break-type');
    const continuitySection3 = document.getElementById('continuity-section-3');

    breakTypeBtn.addEventListener('click', () => {
        const selected = document.querySelector('input[name="break-type"]:checked');
        if (selected && selected.value === 'removable') {
            breakTypeFeedback.innerHTML = '<p class="correct">Correct! A removable discontinuity is like a hole: the nearby values are fine, but one point is missing or out of place.</p>';
            breakTypeFeedback.classList.remove('incorrect');
            breakTypeFeedback.classList.add('correct');
            if (continuitySection3) {
                continuitySection3.classList.remove('hidden');
            }
        } else {
            breakTypeFeedback.innerHTML = '<p class="incorrect">Think of a missing tile. You can still see the pattern around it, but there is one point where the graph is not quite there.</p>';
            breakTypeFeedback.classList.remove('correct');
            breakTypeFeedback.classList.add('incorrect');
        }
    });

    revealBreakTypeBtn.addEventListener('click', () => {
        document.getElementById('break-removable').checked = true;
        breakTypeBtn.click();
    });

    const continuityConditionsBtn = document.getElementById('submit-continuity-conditions');
    const revealContinuityConditionsBtn = document.getElementById('reveal-answer-continuity-conditions');
    const continuityConditionsFeedback = document.getElementById('feedback-continuity-conditions');
    const continuityDefinitionReveal = document.getElementById('continuity-definition-reveal');

    function selectedContinuityConditions() {
        return [...document.querySelectorAll('input[name="continuity-conditions"]:checked')].map((input) => input.value);
    }

    continuityConditionsBtn.addEventListener('click', () => {
        const selected = selectedContinuityConditions();
        const correct = ['exists', 'limit-exists', 'equal'];
        const isCorrect = selected.length === correct.length && correct.every((value) => selected.includes(value));

        if (isCorrect) {
            continuityConditionsFeedback.innerHTML = '<p class="correct">Exactly. The value must exist, the nearby limit must exist, and they must match. That is the heart of continuity.</p>';
            continuityConditionsFeedback.classList.remove('incorrect');
            continuityConditionsFeedback.classList.add('correct');
            if (continuityDefinitionReveal) {
                continuityDefinitionReveal.classList.remove('hidden');
            }
        } else {
            continuityConditionsFeedback.innerHTML = '<p class="incorrect">A graph is continuous only when the nearby trend and the actual value agree. The point cannot be missing, split, or mismatched.</p>';
            continuityConditionsFeedback.classList.remove('correct');
            continuityConditionsFeedback.classList.add('incorrect');
        }
    });

    revealContinuityConditionsBtn.addEventListener('click', () => {
        document.getElementById('cont-exists').checked = true;
        document.getElementById('cont-limit-exists').checked = true;
        document.getElementById('cont-equal').checked = true;
        document.getElementById('cont-nearby').checked = false;
        continuityConditionsBtn.click();
    });
});
