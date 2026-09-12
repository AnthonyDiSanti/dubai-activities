"""Protect reviewed photo credits from malformed CSV maintenance input."""

import importlib.util
import tempfile
import unittest
from pathlib import Path


spec = importlib.util.spec_from_file_location(
    "photo_attributions", Path(__file__).with_name("photo-attributions.py")
)
credits = importlib.util.module_from_spec(spec)
spec.loader.exec_module(credits)


class AttributionCsvTests(unittest.TestCase):
    def test_quoted_comma_remains_part_of_note(self):
        """A legitimate quoted note must survive the stricter width check."""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "credits.csv"
            path.write_text('filename,notes\nphoto.jpg,"Creator supplied, no license stated."\n')
            self.assertEqual(credits.read_csv(path)[0]["notes"], "Creator supplied, no license stated.")

    def test_wrong_width_reports_source_line(self):
        """Reject both extra and absent cells rather than silently losing credit text."""
        for row in ("photo.jpg,Creator supplied, no license stated.", "photo.jpg"):
            with self.subTest(row=row), tempfile.TemporaryDirectory() as directory:
                path = Path(directory) / "credits.csv"
                path.write_text(f"filename,notes\n{row}\n")
                with self.assertRaisesRegex(ValueError, r"credits\.csv:2: row width"):
                    credits.read_csv(path)

    def test_failed_sync_preserves_original_ledger(self):
        """Reproduce an unquoted comma in an existing reviewed attribution."""
        with tempfile.TemporaryDirectory() as directory:
            manifest = Path(directory) / "manifest.csv"
            manifest.write_text("filename,disposition\nphoto.jpg,selected\n")
            ledger = Path(directory) / "credits.csv"
            original = b"filename,notes\nphoto.jpg,Creator supplied, no license stated.\n"
            ledger.write_bytes(original)
            with self.assertRaises(ValueError):
                credits.sync(manifest, ledger, False)
            self.assertEqual(ledger.read_bytes(), original)

    def test_failed_serialization_preserves_original_ledger(self):
        """Validate the write boundary even when callers construct rows directly."""
        with tempfile.TemporaryDirectory() as directory:
            ledger = Path(directory) / "credits.csv"
            original = b"Reviewed credits must survive.\n"
            ledger.write_bytes(original)
            with self.assertRaises(ValueError):
                credits.write_ledger(ledger, [{"filename": "photo.jpg"}, {"unexpected": "field"}])
            self.assertEqual(ledger.read_bytes(), original)


if __name__ == "__main__":
    unittest.main()
