#!/bin/bash
cd /home/kavia/workspace/code-generation/real-time-user-tracking-dashboard-9145-9154/dashboard_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

