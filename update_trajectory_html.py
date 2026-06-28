with open("trajectory/index.html", "r") as f:
    content = f.read()

import re

# Update CSS for control panel
css_update = """
    /* Make control panel scrollable if it gets too tall */
    .control-panel {
      max-height: 85vh;
      overflow-y: auto;
    }
    .control-panel::-webkit-scrollbar { width: 6px; }
    .control-panel::-webkit-scrollbar-thumb { background: rgba(197,160,72,0.4); border-radius: 4px; }
    
    .panel-subtitle { font-size: 0.8rem; color: var(--gold); margin-bottom: 6px; font-weight: bold; border-bottom: 1px solid rgba(197,160,72,0.2); padding-bottom: 3px; margin-top: 10px; }
    
    select {
      width: 100%; background: rgba(0,8,20,0.8); color: var(--text);
      border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 8px;
      font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif; outline: none; margin-bottom: 8px;
    }
"""
content = content.replace("    .control-panel.open ~ #dashboard {", css_update + "\n    .control-panel.open ~ #dashboard {")

# Update Control Panel HTML
new_panel = """  <aside class="control-panel">
    <div class="panel-title">Orbital Mechanics</div>
    
    <div class="panel-subtitle">Environment</div>
    <div class="control-group">
      <label>Central Mass System</label>
      <select id="centralMass">
        <option value="1">The Sun (1 Solar Mass)</option>
        <option value="0.000003">Earth (Low Mass)</option>
        <option value="4000000">Sagittarius A* (Supermassive Black Hole)</option>
      </select>
    </div>

    <div class="panel-subtitle">Shape (2D)</div>
    <div class="control-group">
      <label>Eccentricity (e) <span id="eVal">0.600</span></label>
      <input type="range" id="eccentricity" min="0" max="1.5" step="0.005" value="0.6">
    </div>
    
    <div class="control-group">
      <label>Semi-Major Axis (a) <span id="aVal">15.0</span> AU</label>
      <input type="range" id="semiMajor" min="1" max="50" step="0.1" value="15">
    </div>
    
    <div class="panel-subtitle">Orientation (3D)</div>
    <div class="control-group">
      <label>Inclination (i) <span id="iVal">0</span>°</label>
      <input type="range" id="inclination" min="0" max="180" step="1" value="0">
    </div>
    
    <div class="control-group">
      <label>Long. of Ascending Node (Ω) <span id="nodeVal">0</span>°</label>
      <input type="range" id="ascendingNode" min="0" max="360" step="1" value="0">
    </div>
    
    <div class="control-group">
      <label>Arg. of Periapsis (ω) <span id="argVal">0</span>°</label>
      <input type="range" id="argPeriapsis" min="0" max="360" step="1" value="0">
    </div>
    
    <div class="panel-subtitle">Time & Position</div>
    <div class="control-group">
      <label>God's Fast-Forward <span id="speedVal">1x</span></label>
      <input type="range" id="simSpeed" min="0" max="5" step="0.1" value="1">
    </div>
    
    <div class="control-group" id="anomalyGroup">
      <label>True Anomaly (Scrub Orbit) <span id="thetaVal">0</span>°</label>
      <input type="range" id="trueAnomaly" min="0" max="360" step="1" value="0">
    </div>

    <div class="panel-title" style="margin-top:15px;">Presets</div>
    <div class="btn-group" style="flex-wrap: wrap;">
      <button class="btn" id="preEarth">Earth</button>
      <button class="btn" id="preHalley">Halley's</button>
      <button class="btn" id="preISS">ISS (LEO)</button>
      <button class="btn" id="preMolniya">Molniya</button>
      <button class="btn" id="preHyper">Hyperbolic</button>
    </div>

    <div class="panel-title" style="margin-top:15px;">Visualization</div>
    <div class="control-group" style="flex-direction:row; align-items:center; gap:10px; margin-bottom:6px;">
      <input type="checkbox" id="showVectors" checked style="accent-color:var(--gold); transform:scale(1.2);">
      <label for="showVectors" style="margin:0;">Velocity Vectors</label>
    </div>
    <div class="control-group" style="flex-direction:row; align-items:center; gap:10px; margin-bottom:6px;">
      <input type="checkbox" id="showPlane" style="accent-color:var(--gold); transform:scale(1.2);">
      <label for="showPlane" style="margin:0;">Orbital Plane (3D)</label>
    </div>
    <div class="control-group" style="flex-direction:row; align-items:center; gap:10px;">
      <input type="checkbox" id="showTrail" checked style="accent-color:var(--gold); transform:scale(1.2);">
      <label for="showTrail" style="margin:0;">Planet Trail</label>
    </div>
  </aside>"""

content = re.sub(r'<aside class="control-panel">.*?</aside>', new_panel, content, flags=re.DOTALL)

with open("trajectory/index.html", "w") as f:
    f.write(content)
