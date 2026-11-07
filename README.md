# Limits Redesigned

A work-in-progress interactive website that introduces calculus through visual exploration, playful problem-solving, and conceptual intuition. Created by high school student Daniel Wen, Limits Redesigned aims to make calculus more approachable for middle and high school students and anyone curious about mathematics.

The current site includes a public homepage, project About page, feedback page, and an interactive limits lesson. A separate continuity lesson is available as a template, but is not linked from the main site navigation. Rather than presenting calculus as a wall of formulas, the experience invites learners to experiment, notice patterns, and build understanding through guided interaction.

## Overview

Limits Redesigned is a lightweight educational website built with static HTML, CSS, and JavaScript. It is intended to supplement traditional learning rather than replace it, and to make calculus feel more engaging and human.

This project is especially aimed at students who may be:

- curious about calculus but not yet confident in it
- disengaged by traditional textbook-driven instruction
- looking for a more intuitive introduction before deeper formal study
- interested in exploring mathematical ideas visually and interactively

## Core aims

### 1. Engage disinterested students

The project uses game-like framing, visual storytelling, and interactive exploration to make calculus feel less intimidating and more inviting. Instead of beginning with procedural drills, learners are encouraged to play with ideas, compare patterns, and make sense of mathematical behavior in context.

### 2. Support struggling learners

The experience is designed to help students who are confused by abstract notation and symbolic manipulation by providing intuitive visual explanations, guided exploration, and immediate feedback. It supports conceptual understanding before procedural fluency.

### 3. Go beyond AP rigor

This project is not limited to the scope of a standard AP Calculus course. It aims to help students go beyond surface-level exam preparation and develop deeper mathematical intuition, curiosity, and conceptual readiness for higher-level study.

## Target audience

- Middle and high school students curious about mathematics and calculus
- Former learners who want to revisit concepts in a more approachable way
- Prospective calculus students who want a gentler introduction before formal coursework
- Teachers and parents looking for supplementary learning experiences
- Anyone with a curious mind

## What this project is and is not

The project focuses on introducing ideas intuitively and helping learners understand why a concept matters, how it behaves, and how it connects to visual and real-world patterns.

> This project is NOT intended to replace a traditional calculus course or practice solving problems. Building mathematical fluency and muscle memory still requires repetition, guided instruction, and regular problem solving.

## Tech stack

- HTML5
- CSS3
- JavaScript
- Desmos API for interactive graphs
- KaTeX for mathematical notation
- Google Forms for feedback collection
- Google Analytics
- Multi-page static site hosted on GitHub Pages

The project is intentionally lightweight and portable, with no application backend. The lesson loads Desmos and KaTeX from external services, and feedback is collected through an embedded Google Form with a direct-link fallback. An internet connection is needed for these services and Google Analytics.

## Run locally

Open `index.html` in a browser, or serve the project directory with `python3 -m http.server 8000` and visit `http://localhost:8000`. An internet connection is needed for the embedded Google Form, Desmos graphs, KaTeX, and Google Analytics.

## Development environment

- macOS
- Static site hosted on GitHub Pages
- Minimal tooling and dependency overhead
- Designed for quick iteration and experimentation

## Current experience

- **Homepage and About page:** introduce the project's mission to make math feel more intuitive, visual, and exploratory.
- **Limits lesson:** the main interactive lesson, using a car scenario, graphs, guided questions, hints, answer reveals, and retry prompts to explore limit intuition and notation. It also provides theme and motion controls.
- **Continuity template:** `page2.html` contains a separate, template-only lesson with guided questions about continuity and discontinuities. It is not linked from the main navigation and should be considered experimental.
- **Feedback page:** lets visitors share feedback through an embedded Google Form.

The site currently focuses on limits; derivatives and integrals are not covered. The project is still under development, with the goal of keeping the experience accessible, conceptually rich, and easy to expand.

## Live demo

- https://qorvinbishop.github.io/limits-redesigned/

## Project structure

The repository currently includes:

- `index.html` — homepage
- `about.html` — project mission and background
- `page1.html` / `page1.js` — interactive limits lesson, including Desmos graphs, theme and motion controls, and guided questions
- `page2.html` / `page2.js` — template-only continuity lesson with interactive questions
- `global.css` — shared styling
- `feedback.html` — feedback page and embedded Google Form
- `local/GOOGLE_FORM_QUESTIONS.md` — copy-ready feedback form content

The working copy also contains ignored older backend code, the earlier `v1/` prototype, and project/presentation documents under `local/archive/`. These files are not part of the tracked repository or the GitHub Pages site.

## Credits and acknowledgments

This project is a collaborative educational experiment inspired by the idea that math learning can be more engaging, visual, and intuitive when it is designed around curiosity rather than pressure.

Special acknowledgment goes to the broader educational and mathematical community that continues to make advanced concepts more accessible through visual reasoning, open resources, and creative teaching. This work builds on that spirit and aims to create a student-friendly entry point into calculus.

Thanks to the ongoing efforts of educators, developers, and creators who share mathematical intuition and interactive learning tools with the public.

## Notes

This project is intentionally a learning-oriented prototype rather than a polished commercial product. It is meant to evolve over time, with new modules, improved design, and deeper educational content added as the project develops.

## License

This project does not currently include a formal license file. If you want to reuse or adapt it, it is best to contact the project owner before using it beyond personal or educational experimentation.
