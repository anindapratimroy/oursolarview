<img width="1604" height="895" alt="Screenshot 2026-04-26 144212" src="https://github.com/user-attachments/assets/63c58da3-25b0-4991-ab81-3ea230853473" />

# 🌌 HSPTP — Heliocentric Space & Trajectory Physics Platform

<div align="center">

![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**An interactive 3D space simulation — built from scratch using raw Three.js and WebGL**

[🚀 Live Demo](https://mysolarview.vercel.app) • [🪐 Solar System](https://mysolarview.vercel.app/solarsystem) • [📡 Trajectory Sim](https://mysolarview.vercel.app/trajectory)

</div>

---

## ✨ What Is This?

HSPTP is a browser-based **3D astrophysics visualization platform** with two core modules:

1. **3D Solar System** — An immersive, explorable model of our solar system with realistic textures, orbital mechanics, and smooth interaction.
2. **Trajectory Simulation (Kepler's Laws)** — A physics-based orbital simulation where you can manipulate eccentricity and semi-major axis in real time and visualize gravitational effects.

Built entirely with **vanilla JavaScript + Three.js** — no game engines, no physics libraries, no shortcuts.

---

## 🎯 Key Features

### 🪐 Solar System Module
- Real-time 3D rendering of all 8 planets with high-fidelity textures (`.avif`, `.webp`)
- Accurate **orbital mechanics** — each planet rotates and revolves at scaled speeds
- Smooth **zoom, pan, and rotate** controls for immersive exploration
- Fully responsive — works seamlessly across desktop and mobile devices
- Optimized rendering pipeline for consistent performance

### 📐 Trajectory Simulator
- Live simulation of **Kepler's Laws of Planetary Motion**
- Real-time control over **eccentricity** and **semi-major axis** parameters
- Dynamic **velocity vector** and gravitational field visualization
- Built as an interactive educational tool for physics concepts

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| **Three.js** | 3D scene rendering, geometry, materials, camera |
| **WebGL** | GPU-accelerated graphics pipeline |
| **JavaScript (ES6+)** | Core logic, orbital mechanics algorithms |
| **HTML5 / CSS3** | UI structure and styling |
| **Vercel** | Deployment and hosting |

---

## 🧠 Engineering Highlights

- **Wrote orbital mechanics from scratch** — no physics engine used. Implemented Kepler's equations manually to compute planet positions, velocities, and orbital periods.
- **Performance optimization** — Carefully managed draw calls, texture formats (`.avif` / `.webp` for compression), and render loops to maintain smooth FPS.
- **Real-time parameter binding** — In the trajectory module, UI controls directly mutate orbital parameters and re-render live — no page refresh needed.
- **Responsive 3D viewport** — Handled window resize events and camera aspect ratio recalculations for mobile compatibility.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/manishkumawat14128/HSPTP.git

# Navigate into the project
cd HSPTP

# Open with Live Server or any local HTTP server
# (Required because of ES module imports and texture loading)
npx serve .
```

Then open `http://localhost:3000` in your browser.

> **Note:** Must be served over HTTP (not file://) due to texture asset loading via Three.js.

---

## 📁 Project Structure

```
HSPTP/
├── index.html            # Landing / home page
├── solarsystem/          # 3D Solar System module
│   └── ...
├── planets/              # Planet data, textures, config
│   └── ...
├── trajectory/           # Kepler trajectory simulator
│   └── ...
├── *.avif / *.webp       # Optimized planet texture assets
└── README.md
```

---

## 🌐 Live Demo

> **[mysolarview.vercel.app](https://mysolarview.vercel.app)**

Deployed on Vercel with automatic CI from the `main` branch.

---

## 📸 Preview

<img width="906" height="671" alt="Screenshot 2026-04-26 132818" src="https://github.com/user-attachments/assets/dfa658cb-e44a-49b9-894e-16fb9ede4f3d" />



---

## 👨‍💻 About the Developer

**Manish Kumawat** — B.Tech, Space Science & Engineering, IIT Indore

Combining a passion for astrophysics and frontend engineering to build tools that make science visual and accessible. This project was built to deepen understanding of orbital mechanics while practicing real-time 3D rendering techniques.

- 🔗 [GitHub](https://github.com/manishkumawat14128)
- 📧 manishkumawat14134@gmail.com

---



<div align="center">

*Built with curiosity, caffeine, and Kepler's equations ☕*

</div>
