#!/bin/bash
# Stop anything on port 3000 or 3004, then start the dev server clean.

echo "Stopping any process on port 3000..."
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

echo "Stopping any process on port 3004..."
lsof -ti :3004 | xargs kill -9 2>/dev/null || true

echo "Waiting 2 seconds..."
sleep 2

echo "Starting dev server..."
cd "$(dirname "$0")/.." && npm run dev
