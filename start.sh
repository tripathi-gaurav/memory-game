#!/bin/bash

export MIX_ENV=prod
export PORT=4792

echo "Starting app..."

# Start to run in background from shell.
#_build/prod/rel/memory/bin/memory start

echo "Stopping old copy of app, if any..."

_build/prod/rel/memory/bin/memory stop || true

echo "Starting app..."

_build/prod/rel/memory/bin/memory start
