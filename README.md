# Limit Glitch v1.0

**Limit Glitch** is an interactive, single-page calculus learning game designed to teach the foundational concept of limits through visual exploration and puzzle-solving. Students navigate "glitched" mathematical environments, solve discontinuities, and reveal hidden limit values.

## Project Aims

1.  **Engage**: Transform abstract calculus into a visual, interactive experience that captures student interest.
2.  **Support**: Provide intuitive tools (sliders, tracers, coordinate displays) and immediate feedback to help struggling learners build conceptual understanding.
3.  **Beyond AP Rigor**: Explore diverse limit types including removable discontinuities, infinite limits, jump discontinuities, and oscillating functions.

## Features

- **Desmos-Powered Graphing**: High-quality interactive graphs using the Desmos API.
- **Glitch Mechanic**: Escalating visual feedback (screen shake, static noise, graph distortion) when incorrect answers are submitted.
- **Level System**: Pre-configured levels covering different limit types (Removable, Infinite, Mixed).
- **Learning Reinforcement**: Detailed step-by-step algebraic solutions provided after every level completion or failure.
- **Progress Tracking**: Automatic saving of score and completed levels via `localStorage`.

## Development Environment Setup (macOS)

### 1. Project Directory
The project is contained within a single HTML file for maximum portability.

### 2. Running the Game Locally
- **Simple Open**: Double-click `index.html` to open it in your default web browser (Chrome or Safari recommended).
- **Local Server**: For better performance and API consistency, run a simple Python server:
  ```bash
  python3 -m http.server 8000
  ```
  Then visit `http://localhost:8000`.

## GitHub Import Instructions

Assume you have an empty GitHub repository created.

1.  **Initialize Git**:
    ```bash
    git init
    ```

2.  **Stage and Commit**:
    ```bash
    git add .
    git commit -m "feat: implement Limit Glitch V1.0"
    ```

3.  **Connect and Push**:
    ```bash
    git branch -M main
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin main
    ```

## Live Demo
*GitHub Pages URL to be added here after deployment.*

---
**Credits**: Built with [Desmos API](https://www.desmos.com/api).
