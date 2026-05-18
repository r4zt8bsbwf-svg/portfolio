// =========================================================
// Portfolio shared JS
// - Lightbox for gallery images
// - STL viewer via Three.js (rotate, zoom, wireframe, auto-rotate)
// - Fade-in on scroll
// =========================================================

// ---------- Fade-in on scroll ----------
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ---------- Lightbox ----------
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lightboxImg = lightbox.querySelector('img');

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item && item.querySelector('img')) {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    }
  });

  lightbox.addEventListener('click', () => lightbox.classList.remove('active'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });
}

// ---------- STL Viewer ----------
class STLViewer {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.currentMesh = null;
    this.wireframe = false;
    this.autoRotate = true;
    this.init();
  }

  init() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 5000);
    this.camera.position.set(150, 120, 200);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(amb);

    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(1, 1.5, 1);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0xd97a52, 0.4);
    rim.position.set(-1, 0.5, -1);
    this.scene.add(rim);

    // Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 1.0;

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  loadSTL(url) {
    const loader = new THREE.STLLoader();
    loader.load(url, (geometry) => this.setGeometry(geometry), undefined, (err) => {
      console.error('STL load error for', url, err);
    });
  }

  setGeometry(geometry) {
    if (this.currentMesh) {
      this.scene.remove(this.currentMesh);
      this.currentMesh.geometry.dispose();
      this.currentMesh.material.dispose();
    }

    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    // Center and scale
    const bbox = geometry.boundingBox;
    const center = bbox.getCenter(new THREE.Vector3());
    geometry.translate(-center.x, -center.y, -center.z);

    const size = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 80 / maxDim;
    geometry.scale(scale, scale, scale);

    const material = new THREE.MeshPhongMaterial({
      color: 0xc8c0b0,
      specular: 0x444444,
      shininess: 40,
      flatShading: false,
      wireframe: this.wireframe
    });

    this.currentMesh = new THREE.Mesh(geometry, material);
    this.currentMesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.currentMesh);
  }

  toggleWireframe() {
    this.wireframe = !this.wireframe;
    if (this.currentMesh) this.currentMesh.material.wireframe = this.wireframe;
  }

  toggleRotate() {
    this.autoRotate = !this.autoRotate;
    this.controls.autoRotate = this.autoRotate;
  }

  resetView() {
    this.camera.position.set(150, 120, 200);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Convert "models/brewbot/V1.stl" → "V1"
function prettyTabName(path) {
  let name = path.split('/').pop().replace(/\.stl$/i, '');
  name = name.replace(/_/g, ' ');
  return name;
}

// ---------- Page setup ----------
document.addEventListener('DOMContentLoaded', () => {
  setupLightbox();

  // STL Viewer setup
  const viewerEl = document.getElementById('stl-viewer');
  if (viewerEl && typeof THREE !== 'undefined') {
    const viewer = new STLViewer(viewerEl);
    window.__viewer = viewer;

    const presets = viewerEl.dataset.models;
    if (presets) {
      const modelList = presets.split(',').map(s => s.trim()).filter(Boolean);
      if (modelList.length) {
        // Build tabs only if more than one model
        const tabsContainer = document.querySelector('.model-list');
        if (modelList.length > 1 && tabsContainer) {
          modelList.forEach((path, idx) => {
            const btn = document.createElement('button');
            btn.className = 'model-tab' + (idx === 0 ? ' active' : '');
            btn.textContent = prettyTabName(path);
            btn.addEventListener('click', () => {
              document.querySelectorAll('.model-tab').forEach(t => t.classList.remove('active'));
              btn.classList.add('active');
              viewer.loadSTL(path);
            });
            tabsContainer.appendChild(btn);
          });
        }
        // Auto-load first model
        viewer.loadSTL(modelList[0]);
      }
    }

    document.getElementById('btn-rotate')?.addEventListener('click', () => viewer.toggleRotate());
    document.getElementById('btn-wireframe')?.addEventListener('click', () => viewer.toggleWireframe());
    document.getElementById('btn-reset')?.addEventListener('click', () => viewer.resetView());
  }
});
