with open("trajectory/trajectory.js", "r") as f:
    js = f.read()

injection = """  // Period (Kepler 3rd law) — only meaningful for ellipse
  if (type === 'ellipse') {
    const T_s = 2 * Math.PI * Math.sqrt(Math.pow(a * 1.496e11, 3) / (G * M0));
    const T_yr = T_s / (60 * 60 * 24 * 365.25);
    periodValEl.textContent = T_yr.toFixed(2) + ' yrs';
  } else {
    periodValEl.textContent = '∞ (unbound)';
  }

  // Calculate new orbital parameters
  const periapsis = a * Math.abs(1 - e);
  periapsisValEl.textContent = periapsis.toFixed(2) + ' AU';
  
  if (type === 'ellipse') {
    const apoapsis = a * (1 + e);
    apoapsisValEl.textContent = apoapsis.toFixed(2) + ' AU';
  } else {
    apoapsisValEl.textContent = '∞ (unbound)';
  }
  
  let energy;
  const a_m = a * 1.496e11;
  if (type === 'ellipse') {
    energy = - (G * M0) / (2 * a_m);
  } else if (type === 'parabola') {
    energy = 0;
  } else {
    energy = (G * M0) / (2 * a_m); // For hyperbola, E is positive
  }
  const energy_mj = energy / 1e6;
  energyValEl.textContent = energy_mj.toFixed(2) + ' MJ/kg';"""

js = js.replace("""  // Period (Kepler 3rd law) — only meaningful for ellipse
  if (type === 'ellipse') {
    const T_s = 2 * Math.PI * Math.sqrt(Math.pow(a * 1.496e11, 3) / (G * M0));
    const T_yr = T_s / (60 * 60 * 24 * 365.25);
    periodValEl.textContent = T_yr.toFixed(2) + ' yrs';
  } else {
    periodValEl.textContent = '∞ (unbound)';
  }""", injection)

with open("trajectory/trajectory.js", "w") as f:
    f.write(js)
