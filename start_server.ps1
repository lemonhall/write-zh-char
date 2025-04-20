# Simple Python HTTP Server
# Port: 8000
# IP: 0.0.0.0

Write-Host "Starting Python HTTP Server on port 8000..."
Write-Host "Access from your phone: http://YOUR-PC-IP:8000/draw-chinese-congrats.html"
Write-Host "Press Ctrl+C to stop the server."

# Run the Python HTTP server
python -m http.server 8000 --bind 0.0.0.0

Write-Host "Server stopped." 