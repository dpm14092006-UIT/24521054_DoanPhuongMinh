# HW2 progress

Step 1: scaffold complete; MP3 files skipped at user request.

Step 2: FIFO processing uses one worker. Each fetch, response body read and decode finishes before the next task begins. Cancellation aborts fetch; decode results are discarded after cancellation.

Step 8: dev server smoke test passed: controls render, missing MP3 reports an error, Cancel All clears the error. Actual audio playback remains untested because MP3 files were skipped.
