# HW2 progress

Step 1: scaffold complete; MP3 files skipped at user request.

Step 2: FIFO processing uses one worker. Each fetch, response body read and decode finishes before the next task begins. Cancellation aborts fetch; decode results are discarded after cancellation.

Step 8: dev server smoke test passed: controls render, missing MP3 reports an error, Cancel All clears the error. Actual audio playback remains untested because MP3 files were skipped.

Step 10: applied 1ms frame tolerance; exact sustained 60fps is not yet verified.
Step 11: six real MP3 load/play/cancel cycles completed; post-GC JS heap samples saved in reports/memory-smoke.json. Native audio memory and retained heap snapshots have not been audited; zero leaks is not claimed.

Step 12: production build and two Vitest tests passed. Real MP3 loading, playback state, 512-bin selection and Stop passed browser smoke testing. Manual listening, sustained frame performance and full memory profiling remain to be checked.
