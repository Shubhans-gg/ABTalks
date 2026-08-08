from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)


def load_data():
    """Load mock data from JSON file."""
    data_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "data", "mock_data.json"
    )
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)


# ─── Page Routes ─────────────────────────────────────────────


@app.route("/")
def landing():
    """Landing page — first experience for new students."""
    data = load_data()
    return render_template(
        "index.html",
        tracks=data["tracks"],
        testimonials=data["testimonials"],
        stats=data["stats"],
    )


@app.route("/dashboard")
def dashboard():
    """Student dashboard — home after login."""
    data = load_data()
    return render_template(
        "dashboard.html",
        student=data["student"],
        days=data["days"],
    )


@app.route("/day/<int:day_number>")
def challenge_day(day_number):
    """Single challenge day experience."""
    data = load_data()
    student = data["student"]
    days = data["days"]

    # Find the requested day
    day = next((d for d in days if d["day"] == day_number), None)

    # Generate a locked placeholder if day doesn't exist in mock data
    if day is None:
        day = {
            "day": day_number,
            "title": f"Day {day_number} Challenge",
            "description": "This challenge day hasn't been unlocked yet. Keep building to get here!",
            "objectives": [],
            "resources": [],
            "difficulty": "TBD",
            "estimated_time": "TBD",
            "xp_reward": 100,
            "status": "locked",
        }

    # Customize student object for Day 0 (new user state with 0 streak)
    if day_number == 0:
        student = dict(student)
        student["streak"] = 0
        student["total_completed"] = 0
        student["best_streak"] = 0

    prev_day = day_number - 1 if day_number >= 1 else None
    next_day = day_number + 1 if day_number < 60 else None

    return render_template(
        "day.html",
        student=student,
        day=day,
        days=days,
        prev_day=prev_day,
        next_day=next_day,
    )


# ─── API Endpoints ───────────────────────────────────────────


@app.route("/api/submit", methods=["POST"])
def submit_day():
    """Mock submission endpoint."""
    return jsonify(
        {
            "success": True,
            "message": "Submission received! Keep the streak going! 🔥",
            "xp_earned": 200,
        }
    )


@app.route("/api/generate-post", methods=["POST"])
def generate_post():
    """Generate a LinkedIn post template for the student."""
    data = request.json
    day_num = data.get("day", 1)
    title = data.get("title", "a coding challenge")
    track = data.get("track", "Full Stack Development")
    github_url = data.get("github_url", "")

    post = f"""🔥 Day {day_num}/60 — #ABTalks60DayChallenge

Today I built: {title}

Every day of this challenge pushes me to learn something new and ship real code. The consistency is building habits that will last way beyond these 60 days.

Key takeaway: Show up, write code, share your work. Repeat.

{"🔗 Code: " + github_url if github_url else ""}

#BuildInPublic #60DayChallenge #{track.replace(" ", "")} #ABTalks #CodeDaily #LearnInPublic"""

    return jsonify({"post": post.strip()})


@app.route("/api/use-shield", methods=["POST"])
def use_shield():
    """Mock endpoint for using a streak shield."""
    data = request.json
    day_num = data.get("day", 1)
    return jsonify(
        {
            "success": True,
            "message": f"Shield activated for Day {day_num}! Your streak is protected. 🛡️",
            "shields_remaining": 5,
        }
    )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)