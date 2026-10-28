import os
import secrets
import sqlite3
import unicodedata
from contextlib import closing
from hmac import compare_digest
from pathlib import Path

from flask import (
    Flask,
    abort,
    flash,
    redirect,
    render_template,
    request,
    send_from_directory,
    session,
    url_for,
)


BASE_DIR = Path(__file__).resolve().parent
ALLOWED_FILES = {
    "about.html",
    "feedback.html",
    "global.css",
    "index.html",
    "page1.html",
    "page1.js",
    "page2.html",
    "page2.js",
}
FEEDBACK_TYPES = {
    "confusing": "Something was confusing",
    "broken": "Something did not work",
    "suggestion": "I have a suggestion",
    "positive": "Something I liked",
}
PAGE_OPTIONS = {
    "home": "Home",
    "about": "About",
    "limits": "Limits lesson",
    "continuity": "Continuity lesson",
    "other": "Other",
}
MAX_FEEDBACK_LENGTH = 2000


def sanitize_plain_text(value: str) -> str:
    """Normalize feedback text and remove control characters without interpreting HTML."""
    normalized = unicodedata.normalize("NFC", value).replace("\r\n", "\n").replace("\r", "\n")
    cleaned = "".join(
        character
        for character in normalized
        if character in "\n\t" or not unicodedata.category(character).startswith("C")
    )
    return cleaned.strip()


def create_app(test_config: dict | None = None) -> Flask:
    app = Flask(__name__, instance_relative_config=True)
    secret_key = os.environ.get("FLASK_SECRET_KEY")
    if not secret_key:
        secret_key = secrets.token_hex(32)
        app.logger.warning(
            "FLASK_SECRET_KEY is unset; using an ephemeral key. Set it for deployments."
        )

    app.config.from_mapping(
        SECRET_KEY=secret_key,
        DATABASE=str(Path(app.instance_path) / "feedback.sqlite3"),
        MAX_CONTENT_LENGTH=16 * 1024,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=os.environ.get("FLASK_COOKIE_SECURE") == "1",
    )
    if test_config:
        app.config.update(test_config)

    Path(app.instance_path).mkdir(parents=True, exist_ok=True)

    @app.after_request
    def set_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-Frame-Options"] = "DENY"
        return response

    def get_csrf_token() -> str:
        token = session.get("csrf_token")
        if token is None:
            token = secrets.token_urlsafe(32)
            session["csrf_token"] = token
        return token

    @app.get("/")
    def home():
        return send_from_directory(BASE_DIR, "index.html")

    @app.get("/<path:filename>")
    def static_site_file(filename: str):
        if filename not in ALLOWED_FILES:
            abort(404)
        return send_from_directory(BASE_DIR, filename)

    @app.route("/feedback", methods=["GET", "POST"])
    def feedback():
        form_values = {"kind": "", "page": "", "details": ""}
        errors = []

        if request.method == "POST":
            token = request.form.get("csrf_token", "")
            expected_token = session.get("csrf_token", "")
            if not token or not expected_token or not compare_digest(token, expected_token):
                abort(400, description="The form expired. Reload the page and try again.")

            form_values = {
                "kind": request.form.get("kind", ""),
                "page": request.form.get("page", ""),
                "details": sanitize_plain_text(request.form.get("details", "")),
            }

            if request.form.get("website", "").strip():
                abort(400, description="This submission could not be accepted.")

            if form_values["kind"] not in FEEDBACK_TYPES:
                errors.append("Choose the type of feedback you want to share.")
            if form_values["page"] and form_values["page"] not in PAGE_OPTIONS:
                errors.append("Choose a page from the list, or leave this field blank.")
            if not form_values["details"]:
                errors.append("Add a little detail so we know what to improve.")
            elif len(form_values["details"]) > MAX_FEEDBACK_LENGTH:
                errors.append(
                    f"Keep your feedback to {MAX_FEEDBACK_LENGTH} characters or fewer."
                )

            if not errors:
                with closing(sqlite3.connect(app.config["DATABASE"])) as connection:
                    with connection:
                        connection.execute(
                            """
                            CREATE TABLE IF NOT EXISTS feedback (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                kind TEXT NOT NULL,
                                page TEXT,
                                details TEXT NOT NULL,
                                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                            )
                            """
                        )
                        connection.execute(
                            """
                            INSERT INTO feedback (kind, page, details)
                            VALUES (?, ?, ?)
                            """,
                            (form_values["kind"], form_values["page"] or None, form_values["details"]),
                        )
                flash("Thanks for helping us improve Calculus Explorer.", "success")
                return redirect(url_for("feedback"))
        else:
            selected_page = request.args.get("page", "")
            if selected_page in PAGE_OPTIONS:
                form_values["page"] = selected_page

        return render_template(
            "feedback.html",
            csrf_token=get_csrf_token(),
            errors=errors,
            feedback_types=FEEDBACK_TYPES,
            form_values=form_values,
            max_feedback_length=MAX_FEEDBACK_LENGTH,
            page_options=PAGE_OPTIONS,
        ), (400 if errors else 200)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(port=5001)
