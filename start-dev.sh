#!/bin/bash

echo "==================================="
echo "Pet Care Full Stack Application"
echo "==================================="
echo ""
echo "Starting Backend Server..."
echo ""

# Start backend in a new terminal
cd server
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "npm run dev; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -e "npm run dev" &
else
    npm run dev &
fi

sleep 3

echo ""
echo "Starting Frontend Server..."
echo ""

# Start frontend in a new terminal
cd ../Client
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "npm run dev; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -e "npm run dev" &
else
    npm run dev &
fi

echo ""
echo "==================================="
echo "Both servers are starting!"
echo "==================================="
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "==================================="
