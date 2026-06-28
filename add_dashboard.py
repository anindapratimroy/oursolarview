with open("trajectory/index.html", "r") as f:
    html = f.read()

# Add more dashboard cards
dashboard_old = """  <div id="dashboard">
    <div class="dash-card">
      <span class="dc-label">Distance (r)</span>
      <span class="dc-value" id="distVal">-- AU</span>
    </div>
    <div class="dash-card">
      <span class="dc-label">Velocity (v)</span>
      <span class="dc-value" id="velVal">-- km/s</span>
    </div>
    <div class="dash-card highlight">
      <span class="dc-label">Period (T)</span>
      <span class="dc-value" id="periodVal">-- yrs</span>
    </div>
  </div>"""

dashboard_new = """  <div id="dashboard" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
    <div class="dash-card">
      <span class="dc-label">Distance (r)</span>
      <span class="dc-value" id="distVal">-- AU</span>
    </div>
    <div class="dash-card">
      <span class="dc-label">Velocity (v)</span>
      <span class="dc-value" id="velVal">-- km/s</span>
    </div>
    <div class="dash-card highlight">
      <span class="dc-label">Period (T)</span>
      <span class="dc-value" id="periodVal">-- yrs</span>
    </div>
    <div class="dash-card">
      <span class="dc-label">Periapsis (q)</span>
      <span class="dc-value" id="periapsisVal">-- AU</span>
    </div>
    <div class="dash-card">
      <span class="dc-label">Apoapsis (Q)</span>
      <span class="dc-value" id="apoapsisVal">-- AU</span>
    </div>
    <div class="dash-card">
      <span class="dc-label">Mech. Energy (E)</span>
      <span class="dc-value" id="energyVal">--</span>
    </div>
  </div>"""

html = html.replace(dashboard_old, dashboard_new)

with open("trajectory/index.html", "w") as f:
    f.write(html)

with open("trajectory/trajectory.js", "r") as f:
    js = f.read()

# Add DOM references for new dashboard cards
dom_old = """const distValEl   = document.getElementById('distVal');
const velValEl    = document.getElementById('velVal');
const periodValEl = document.getElementById('periodVal');"""

dom_new = """const distValEl   = document.getElementById('distVal');
const velValEl    = document.getElementById('velVal');
const periodValEl = document.getElementById('periodVal');
const periapsisValEl = document.getElementById('periapsisVal');
const apoapsisValEl = document.getElementById('apoapsisVal');
const energyValEl = document.getElementById('energyVal');"""

js = js.replace(dom_old, dom_new)

# Update the dashboard values inside the animate loop
# Inside buildAndSetOrbit, calculate Periapsis, Apoapsis, and Period
# Actually Period is already being updated somewhere? Wait, let me check where periodValEl is used.
