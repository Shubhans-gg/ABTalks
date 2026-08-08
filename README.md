# ABTalks — 60-Day Coding Challenge Platform

> **Redesign & Implementation for Vibecode Hackathon**  
> A mobile-first (390px viewport), dark-themed platform designed for college students participating in a 60-day daily coding challenge.

---

## 📌 Route Map

As required for submission, below are the three core routes implemented in this repository:

```
/
/dashboard
/day/12
```

---

## 🚀 Overview

ABTalks runs a 60-day coding challenge for Indian college students. Students pick a track, build something every day, and maintain a public learning streak by submitting:
1. **A GitHub commit** (proof of code)
2. **A LinkedIn post** (proof of public learning & visibility)

This redesign reimagines the student experience for late-night mobile usage on smartphones (390px mobile viewport first).

---

## ✨ Features & Screen Overview

### 1. Landing Page (`/`)
* **First Impression & Trust**: High-energy hero section with animated background elements and real-time student activity badges.
* **Platform Stats**: Highlights 1,200+ students, 38K+ commits, 29K+ LinkedIn posts across 45+ colleges.
* **Track Explorer**: Detailed breakdown of 4 tracks (Full Stack, AI/ML, Mobile Dev, DevOps).
* **Proof of Outcome**: Testimonials from real students highlighting career & internship outcomes.

### 2. Student Dashboard (`/dashboard`)
* **Streak Counter**: Prominent fire animation with current active streak count.
* **Progress Ring**: SVG ring showing overall completion progress (e.g. 10 of 60 days).
* **Today's Action Card**: Direct shortcut to the active day's challenge with difficulty, time estimate, and XP rewards.
* **XP & Standing**: Real-time XP display and student leaderboard ranking.
* **Weekly Timeline**: Visual tracker showing completed (✓), missed (✕), active (◉), and locked (🔒) days.
* **Badges & Achievements**: Visual badges unlocked through milestones.

### 3. Challenge Day Experience (`/day/12`)
* **Task Specification**: Title, estimated effort, difficulty, and step-by-step description.
* **Interactive Objectives**: Checkable task list for real-time progress tracking.
* **Curated Resources**: Quick links to documentation, guides, and tools.
* **Proof of Work Submission**: Form for submitting GitHub repository/commit and LinkedIn post URLs.
* **Prev/Next Navigation**: Quick navigation between day challenges.

---

## 💡 Thoughtful Features Introduced

### 🛡️ 1. Streak Shields
* **Problem**: Missing a single day due to exams or emergencies often causes complete demotivation and dropouts.
* **Solution**: Students earn **Streak Shields** (2 per challenge). Activating a shield retroactively protects an active streak on a missed day without breaking momentum.

### ✍️ 2. One-Click LinkedIn Post Generator
* **Problem**: Students often struggle with writing daily LinkedIn posts, creating friction in building in public.
* **Solution**: A built-in post generator crafts a structured, professional LinkedIn update customized to the day's challenge title, track, and GitHub URL. Includes copy-to-clipboard functionality.

---

## 🛡️ Edge Cases Handled

* **First Day / Zero Streak**: Welcoming empty state with motivational onboarding cues.
* **Missed Day (`/day/5`)**: Highlights missed status with option to use a Streak Shield.
* **Completed Day (`/day/1`)**: Displays verified badge, submission links, and timestamp.
* **Locked Future Days (`/day/14`)**: Graceful locked state preventing premature submissions.

---

## 🛠️ Tech Stack & Architecture

* **Backend**: Python 3.14 + Flask 3.1.3
* **Templating**: Jinja2 (Modular layout inheritance)
* **Frontend**: Vanilla CSS3 (Custom Design System with CSS variables, Glassmorphism, Responsive Breakpoints) & Vanilla JavaScript (ES6+, IntersectionObserver animations)
* **Data**: Local JSON dataset (`data/mock_data.json`)

---

## 📂 Project Structure

```
abtalks/
├── app.py                  # Flask server & route handlers
├── data/
│   └── mock_data.json      # Structured mock data (students, days, tracks)
├── templates/
│   ├── base.html           # Base layout template (fonts, meta, styles)
│   ├── index.html          # Landing page (/)
│   ├── dashboard.html      # Student dashboard (/dashboard)
│   └── day.html            # Challenge day (/day/<int>)
└── static/
    ├── css/
    │   └── style.css       # Complete mobile-first design system
    └── js/
        └── app.js          # Interactions, post generator, animations
```

---

## ⚙️ Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shubhans-gg/ABTalks.git
   cd ABTalks
   ```

2. **Run with Python**:
   ```bash
   # Using standard Python environment or virtual environment
   python app.py
   ```

3. **Open in browser**:
   Navigate to `http://localhost:5000` (Use Mobile Viewport mode at `390px` width for optimal experience).
