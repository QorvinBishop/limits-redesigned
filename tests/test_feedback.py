import sqlite3
import tempfile
import unittest
from contextlib import closing
from pathlib import Path

from app import MAX_FEEDBACK_LENGTH, create_app, sanitize_plain_text


class FeedbackCollectorTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.database = str(Path(self.temp_dir.name) / "feedback.sqlite3")
        self.app = create_app(
            {
                "TESTING": True,
                "SECRET_KEY": "test-secret-key",
                "DATABASE": self.database,
            }
        )
        self.client = self.app.test_client()

    def tearDown(self):
        self.temp_dir.cleanup()

    def csrf_token(self):
        with self.client.session_transaction() as session:
            session["csrf_token"] = "valid-test-token"
        return "valid-test-token"

    def post_feedback(self, **overrides):
        data = {
            "csrf_token": self.csrf_token(),
            "kind": "confusing",
            "page": "limits",
            "details": "The graph explanation helped.",
        }
        data.update(overrides)
        return self.client.post("/feedback", data=data)

    def test_feedback_page_and_allowed_site_page_are_served(self):
        self.assertEqual(self.client.get("/feedback").status_code, 200)
        with self.client.get("/feedback.html") as response:
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"python3 app.py", response.data)
        with self.client.get("/") as response:
            self.assertEqual(response.status_code, 200)
        with self.client.get("/about.html") as response:
            self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.get("/app.py").status_code, 404)
        self.assertEqual(self.client.get("/README.md").status_code, 404)

    def test_feedback_link_can_preselect_a_page(self):
        response = self.client.get("/feedback?page=limits")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<option value="limits" selected>', response.data)

    def test_feedback_is_saved_as_plain_text(self):
        response = self.post_feedback(details="  Helpful feedback\n  ")

        self.assertEqual(response.status_code, 302)
        with closing(sqlite3.connect(self.database)) as connection:
            row = connection.execute(
                "SELECT kind, page, details FROM feedback"
            ).fetchone()
        self.assertEqual(row, ("confusing", "limits", "Helpful feedback"))

    def test_feedback_is_inserted_as_data_not_sql(self):
        payload = "Nice'); DROP TABLE feedback; --"
        response = self.post_feedback(details=payload)

        self.assertEqual(response.status_code, 302)
        with closing(sqlite3.connect(self.database)) as connection:
            row = connection.execute("SELECT details FROM feedback").fetchone()
        self.assertEqual(row, (payload,))

    def test_html_is_not_interpreted_and_is_escaped_when_reflected(self):
        payload = '<script>alert("x")</script>'
        response = self.post_feedback(details=payload, kind="not-a-category")

        self.assertEqual(response.status_code, 400)
        self.assertIn(b"&lt;script&gt;", response.data)
        self.assertNotIn(payload.encode(), response.data)

    def test_controls_are_removed_and_unicode_is_normalized(self):
        self.assertEqual(sanitize_plain_text("A\x00e\u0301\r\nB"), "Aé\nB")

    def test_oversized_feedback_is_rejected(self):
        response = self.post_feedback(details="x" * (MAX_FEEDBACK_LENGTH + 1))

        self.assertEqual(response.status_code, 400)
        self.assertIn(b"characters or fewer", response.data)
        self.assertFalse(Path(self.database).exists())

    def test_invalid_csrf_token_is_rejected(self):
        response = self.client.post(
            "/feedback",
            data={
                "csrf_token": "wrong-token",
                "kind": "confusing",
                "details": "Feedback",
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(Path(self.database).exists())

    def test_honeypot_submission_is_not_saved(self):
        response = self.post_feedback(website="automated spam")

        self.assertEqual(response.status_code, 400)
        self.assertFalse(Path(self.database).exists())


if __name__ == "__main__":
    unittest.main()
