# Limits Redesigned

A work-in-progress interactive web experience for learning calculus through visual exploration, playful problem-solving, and intuitive engagement. This project reimagines calculus education as a more approachable, exploratory journey for middle and high school students, as well as anyone curious about the subject.

The current experience introduces limits through an interactive lesson and includes an in-progress continuity lesson. Rather than presenting calculus as a wall of formulas, it invites students to experiment, notice patterns, and build understanding through guided interaction.

## Overview

Limits Redesigned (branded on the site as Calculus Explorer) is a lightweight educational website built with static HTML, CSS, and JavaScript. It is intended to supplement traditional learning rather than replace it, and to make calculus feel more engaging and human.

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

This project is intended to supplement learning, not replace a traditional calculus course or the value of solving many practice problems. Building mathematical fluency and muscle memory still requires repetition, guided instruction, and regular problem solving.

The focus here is on introducing ideas intuitively and helping students understand why a concept matters, how it behaves, and how it connects to visual and real-world patterns.

> This is not intended to replace a traditional calculus course or the practice needed to build mathematical muscle memory. Instead, it is meant to supplement and enrich the learning experience in a more engaging and intuitive way. The project focuses primarily on introducing concepts and helping learners understand them intuitively, with fewer practice problems because there are many excellent resources available online for that kind of repetition and skill-building.

## Tech stack

- HTML5
- CSS3
- JavaScript
- Python and Flask for the feedback collector
- SQLite for local feedback storage
- Desmos API for interactive graphs
- KaTeX for mathematical notation
- Multi-page site with static lesson pages and a small Flask feedback backend

The project is intentionally lightweight and portable. The pages load Desmos and KaTeX from external services, so an internet connection is needed for graphs and rendered math. Feedback is available when the site is served through Flask; GitHub Pages does not run the Python backend.

## Run locally

Install dependencies with `python3 -m pip install -r requirements.txt`, then run `python3 app.py` from the project directory and visit `http://127.0.0.1:5001`. The app serves the existing lesson pages and the feedback form. Port 5000 may be occupied by macOS AirPlay Receiver, so the development server uses port 5001. If you open a lesson directly from disk, its Feedback link opens a local instruction page; start Flask and select “Open feedback form” there to submit. An internet connection is needed for the embedded Desmos, KaTeX, and Google Analytics resources.

The collector stores submissions in `instance/feedback.sqlite3`. Feedback is treated as plain text: the server normalizes Unicode, removes control characters, trims whitespace, validates category/page choices, and limits the message to 2,000 characters. Database writes use SQL parameters, and Jinja auto-escapes values when displayed. The form does not ask for names, email addresses, or school information.

For deployment, set a persistent, random `FLASK_SECRET_KEY` environment variable and enable secure session cookies by setting `FLASK_COOKIE_SECURE=1` behind HTTPS. Keep the `instance/` database private and back it up securely. Do not deploy the feedback collector on GitHub Pages; use a Python-capable host.

To inspect collected submissions on macOS, use `sqlite3 instance/feedback.sqlite3 "SELECT created_at, kind, page, details FROM feedback ORDER BY id DESC;"`. Handle the output as private learner feedback.

## Development environment

- macOS
- Multi-page site with static lesson pages and a Flask feedback endpoint
- SQLite database stored outside the web-served directory
- Minimal tooling and dependency overhead
- Designed for quick iteration and experimentation

## Project status

This project is actively under development. The limits lesson is the primary interactive lesson. A continuity lesson is also present at `page2.html`, but is labeled template-only and is not yet linked from the main navigation. Derivatives and integrals are not currently covered by the site. The current goal is to keep the experience accessible, conceptually rich, and easy to expand over time.

## Live demo

- https://qorvinbishop.github.io/limits-redesigned/page1.html/

## Project structure

The repository currently includes:

- `index.html` — Calculus Explorer homepage
- `about.html` — project mission and background
- `page1.html` / `page1.js` — interactive limits lesson, including Desmos graphs, theme and motion controls, and guided questions
- `page2.html` / `page2.js` — template-only continuity lesson with interactive questions
- `global.css` — shared styling
- `app.py` / `templates/feedback.html` — Flask feedback form and collector
- `instance/feedback.sqlite3` — local feedback database (created after the first valid submission; ignored by Git)
- `tests/test_feedback.py` — feedback collector tests
- `v1/` — earlier prototype iteration

## Credits and acknowledgments

This project is a collaborative educational experiment inspired by the idea that math learning can be more engaging, visual, and intuitive when it is designed around curiosity rather than pressure.

Special acknowledgment goes to the broader educational and mathematical community that continues to make advanced concepts more accessible through visual reasoning, open resources, and creative teaching. This work builds on that spirit and aims to create a student-friendly entry point into calculus.

Thanks to the ongoing efforts of educators, developers, and creators who share mathematical intuition and interactive learning tools with the public.

## Notes

This project is intentionally a learning-oriented prototype rather than a polished commercial product. It is meant to evolve over time, with new modules, improved design, and deeper educational content added as the project develops.

## License

This project does not currently include a formal license file. If you want to reuse or adapt it, it is best to contact the project owner before using it beyond personal or educational experimentation.
