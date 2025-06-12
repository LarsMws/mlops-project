#!/bin/bash

# install_cron.sh
# Adds a cron job to run poll_model.sh every 15 minutes

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POLL_SCRIPT="$SCRIPT_DIR/poll_model.sh"
CRON_JOB="*/15 * * * * $POLL_SCRIPT"

# Ensure poll_model.sh is executable
chmod +x "$POLL_SCRIPT"

# Check if the cron job already exists
crontab -l 2>/dev/null | grep -F "$POLL_SCRIPT" >/dev/null
if [ $? -eq 0 ]; then
    echo "Cron job already exists. No changes made."
else
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "Cron job added to run poll_model.sh every 15 minutes."
fi
