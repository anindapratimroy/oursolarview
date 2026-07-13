#!/bin/bash
cd "$(dirname "$0")"
echo "============================================="
echo " Starting Local Server for 3D Solar System"
echo "============================================="
echo "Note: 3D textures require a web server to bypass browser CORS security."
echo "This script simulates how it will run on Cloudpanel."
echo ""
python3 -m http.server 8082 &
SERVER_PID=$!
sleep 1
open http://localhost:8082/index.html

# Wait for user to close terminal
echo "Press Control+C to stop the server."
wait $SERVER_PID
