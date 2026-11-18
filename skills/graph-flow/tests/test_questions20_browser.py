"""Real CLI fixtures and headless viewport checks for every Q decision kind."""
import json
import os
from pathlib import Path
import shutil
import subprocess
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
            env={**os.environ,'GF_HOME':str(root/'unused-home'),'GF_NO_OPEN':'1'}
            result=subprocess.run([shutil.which('node'),str(SCREENS/'capture.mjs'),str(root),','.join(str(r['number']) for r in rows)],env=env,capture_output=True,text=True,timeout=240)
            self.assertEqual(result.returncode,0,result.stdout+'\n'+result.stderr)
            self.assertIn('no profile helpers remain',result.stdout)
