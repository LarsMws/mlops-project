#!/bin/bash

# poll_model.sh
# Runs the model polling Python script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_EXEC=$(which python3 || which python)

"$PYTHON_EXEC" "$SCRIPT_DIR/model_polling_script.py"
