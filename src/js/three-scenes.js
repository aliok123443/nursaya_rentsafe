const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

function createDocument(THREE, scale = 1) {
  const group = new THREE.Group();
  const paper = new THREE.Mesh(
    new THREE.BoxGeometry(0.94 * scale, 1.2 * scale, 0.09 * scale),
    new THREE.MeshStandardMaterial({ color: 0xf7f7ed, roughness: 0.72, metalness: 0 })
  );
  group.add(paper);

  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(paper.geometry),
    new THREE.LineBasicMaterial({ color: 0x53675a, transparent: true, opacity: 0.65 })
  );
  group.add(edge);

  const lineMaterial = new THREE.MeshStandardMaterial({ color: 0x87958a, roughness: 0.8 });
  for (let index = 0; index < 4; index += 1) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry((index === 3 ? 0.43 : 0.62) * scale, 0.025 * scale, 0.018 * scale),
      lineMaterial
    );
    line.position.set(-0.02 * scale, (0.25 - index * 0.19) * scale, 0.06 * scale);
    group.add(line);
  }

  const marker = new THREE.Mesh(
    new THREE.BoxGeometry(0.19 * scale, 0.19 * scale, 0.025 * scale),
    new THREE.MeshStandardMaterial({ color: 0xc3d75e, roughness: 0.65 })
  );
  marker.position.set(0.28 * scale, -0.35 * scale, 0.065 * scale);
  group.add(marker);

  return group;
}

function setupScene(THREE, viewport, kind) {
  const canvas = viewport.querySelector('canvas');
  if (!canvas) return null;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 2.2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(-3, 5, 7);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xd7ea7a, 1.1);
  fillLight.position.set(4, -2, 4);
  scene.add(fillLight);

  const camera = new THREE.OrthographicCamera(-3.5, 3.5, 2, -2, 0.1, 40);
  camera.position.set(0, 0, 8);

  const objects = [];
  const positions = kind === 'scroll' ? [-2, -1, 0, 1, 2] : [-1.75, 0, 1.75];
  positions.forEach((x, index) => {
    const document = createDocument(THREE, kind === 'scroll' ? 0.78 : 1);
    document.position.set(x, kind === 'scroll' ? (index % 2 ? -0.06 : 0.06) : 0, 0);
    document.rotation.z = kind === 'scroll' ? (index % 2 ? -0.05 : 0.05) : 0;
    scene.add(document);
    objects.push(document);
  });

  for (let index = 0; index < positions.length - 1; index += 1) {
    const length = positions[index + 1] - positions[index] - (kind === 'scroll' ? 0.78 : 0.94);
    const connector = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, Math.max(length, 0.12), 10),
      new THREE.MeshStandardMaterial({ color: 0x53675a, roughness: 0.7 })
    );
    connector.rotation.z = Math.PI / 2;
    connector.position.set((positions[index] + positions[index + 1]) / 2, 0, -0.12);
    scene.add(connector);
  }

  const resize = () => {
    const width = Math.max(1, viewport.clientWidth);
    const height = Math.max(1, viewport.clientHeight);
    const viewWidth = kind === 'hero' ? 7 : 6.6;
    const viewHeight = viewWidth / (width / height);
    camera.left = -viewWidth / 2;
    camera.right = viewWidth / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  resize();
  renderer.render(scene, camera);
  viewport.classList.add('three-ready');

  return { renderer, scene, camera, objects, resize, kind };
}

export async function initThreeScenes() {
  const viewports = [...document.querySelectorAll('[data-three-scene]')];
  if (!viewports.length) return;

  let THREE;
  try {
    THREE = await import(THREE_URL);
  } catch (error) {
    console.warn('Three.js could not be loaded; showing the static scene illustrations.', error);
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const instances = viewports.flatMap((viewport) => {
    try {
      const instance = setupScene(THREE, viewport, viewport.dataset.threeScene);
      return instance ? [instance] : [];
    } catch (error) {
      console.warn('Three.js scene could not be initialized; showing its static illustration.', error);
      return [];
    }
  });
  if (!instances.length) return;

  let active = true;
  let frameId = 0;

  const render = (time = 0) => {
    frameId = 0;
    if (!active) return;

    instances.forEach((instance) => {
      if (instance.kind === 'hero' && !reducedMotion.matches) {
        instance.objects.forEach((object, index) => {
          object.rotation.y = Math.sin(time * 0.0007 + index * 0.8) * 0.12;
          object.position.y = Math.sin(time * 0.001 + index) * 0.05;
        });
      } else if (instance.kind === 'scroll' && !reducedMotion.matches) {
        const bounds = instance.renderer.domElement.parentElement.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
        instance.objects.forEach((object, index) => {
          object.rotation.y = (progress - 0.5) * (index % 2 ? 0.34 : -0.34);
          object.position.y = (index % 2 ? -0.06 : 0.06) + Math.sin(progress * Math.PI + index) * 0.08;
        });
      }
      instance.renderer.render(instance.scene, instance.camera);
    });

    if (!reducedMotion.matches) frameId = window.requestAnimationFrame(render);
  };

  const start = () => {
    active = true;
    if (!frameId && !reducedMotion.matches) frameId = window.requestAnimationFrame(render);
    else if (reducedMotion.matches) render();
  };
  const stop = () => {
    active = false;
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const visibleViewports = new Set();
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleViewports.add(entry.target);
        else visibleViewports.delete(entry.target);
      });
      if (visibleViewports.size) start();
      else stop();
    }, { threshold: 0.01 })
    : null;
  if (observer) viewports.forEach((viewport) => observer.observe(viewport));

  const resize = () => instances.forEach((instance) => instance.resize());
  window.addEventListener('resize', resize);
  reducedMotion.addEventListener?.('change', start);
  start();

  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return;
    stop();
    observer?.disconnect();
    window.removeEventListener('resize', resize);
    reducedMotion.removeEventListener?.('change', start);
    instances.forEach(({ renderer, scene }) => {
      scene.traverse((object) => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material?.dispose();
      });
      renderer.dispose();
    });
  }, { once: true });
}
