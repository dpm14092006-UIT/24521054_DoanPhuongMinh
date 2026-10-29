# HW2 progress

Step 1: scaffold complete; MP3 files skipped at user request.

Step 2: FIFO processing uses one worker. Each fetch, response body read and decode finishes before the next task begins. Cancellation aborts fetch; decode results are discarded after cancellation.
