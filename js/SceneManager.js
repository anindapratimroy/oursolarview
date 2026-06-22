/**
 * SceneManager.js
 * Tracks all active Three.js and Canvas animation loops to prevent memory leaks.
 */

class SceneManager {
  constructor() {
    this.animationFrames = new Set();
    this.scenes = new Set();
    this.renderers = new Set();
    
    // Listen for tab visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAll();
      } else {
        this.resumeAll();
      }
    });

    window.addEventListener('beforeunload', () => {
      this.disposeAll();
    });
  }

  registerFrame(id) {
    this.animationFrames.add(id);
  }

  cancelFrame(id) {
    this.animationFrames.delete(id);
    cancelAnimationFrame(id);
  }

  registerScene(scene) {
    this.scenes.add(scene);
  }

  registerRenderer(renderer) {
    this.renderers.add(renderer);
  }

  pauseAll() {
    // This will be implemented by setting a global pause flag that the individual
    // requestAnimationFrame loops will check, or by canceling them and storing the callbacks.
    window.APP_PAUSED = true;
  }

  resumeAll() {
    window.APP_PAUSED = false;
  }

  disposeAll() {
    this.animationFrames.forEach(id => cancelAnimationFrame(id));
    this.animationFrames.clear();

    this.scenes.forEach(scene => {
      scene.traverse(object => {
        if (!object.isMesh) return;
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    });
    this.scenes.clear();

    this.renderers.forEach(renderer => {
      renderer.dispose();
    });
    this.renderers.clear();
  }
}

export const sceneManager = new SceneManager();
