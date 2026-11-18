"""Real CLI fixtures and headless viewport checks for every Q decision kind."""
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import tempfile
import unittest
from human_support import CHROME
from test_questions20 import SCREENS, fixtures

@unittest.skipUnless(shutil.which('node') and Path(CHROME).is_file(), 'headless Chrome and Node required')
class QuestionBrowser20Tests(unittest.TestCase):
    def test_every_question_choices_and_consequences_fit_desktop_and_phone(self):
        rows=[r for r in json.loads((SCREENS/'screens.json').read_text()) if r.get('decision_screen')]
        with tempfile.TemporaryDirectory(prefix='question-browser-') as scratch:
            root=Path(scratch);directory=root/'fixtures';directory.mkdir()
            entries={name:fixtures.build(directory,name) for name in sorted({r['scenario'] for r in rows})}
            (directory/'index.json').write_text(json.dumps(entries))
            env = {**os.environ, 'GF_HOME': str(root/'unused-home'), 'GF_NO_OPEN': '1',
                   'CHROME_BIN': CHROME, 'SCREENS_PYTHON': sys.executable}
            numbers = ','.join(str(row['number']) for row in rows)
            command = [shutil.which('node'), str(SCREENS/'capture.mjs'), str(root), numbers]
            # Each scene starts its own server and runs browser and image checks.
            timeout = 30 + 24 * len(rows)
            with subprocess.Popen(command, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                  text=True, start_new_session=True) as proc:
                try:
                    stdout, stderr = proc.communicate(timeout=timeout)
                except subprocess.TimeoutExpired:
                    os.killpg(proc.pid, signal.SIGKILL)
                    stdout, stderr = proc.communicate()
                    self.fail(f'{len(rows)} decision scenes timed out after {timeout}s\n{stdout}\n{stderr}')
            self.assertEqual(proc.returncode, 0, stdout + '\n' + stderr)
            self.assertIn('no profile helpers remain', stdout)
            for line in stdout.splitlines():
                if line.startswith('Chrome WebGL2 context:'):
                    print(line, flush=True)
