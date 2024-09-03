#!/bin/bash
cd ${0%/*}

cd ../desktop-import

# npm run start -- --ddebug --width_trim 0.40
# npm run start -- --portrait 1.0 --screen 1 --root "https://poets.org/poem/let-america-be-america-again"
npm run start -- --room room0 --portrait 1.0 --screen 1 --root "https://poets.org/poem/let-america-be-america-again"

