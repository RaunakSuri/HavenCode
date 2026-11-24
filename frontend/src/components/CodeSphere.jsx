import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ── Premium blue-teal glass palette ───────────────────────────────────────
const PALETTE = {
  shadow: 0x071522, // deep shadow / outer edge
  deep: 0x102a43, // deep blue-teal
  mid: 0x1f5a78, // mid blue
  teal: 0x4fd1c5, // soft teal
  blue: 0x60a5fa, // soft blue
  highlight: 0xd9f7ff, // icy specular highlight
  rim: 0x5eead4, // thin cyan-teal rim
};

// Builds a soft studio environment so the glass has real reflections
// instead of flat, painted-on highlights.
function createStudioEnvironment() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep blue-teal backdrop
  const base = ctx.createLinearGradient(0, 0, 0, 512);
  base.addColorStop(0, '#16324d');
  base.addColorStop(0.45, '#0b2137');
  base.addColorStop(1, '#071522');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 512);

  // Broad soft sky glow along the top so the crown catches light
  const sky = ctx.createLinearGradient(0, 0, 0, 190);
  sky.addColorStop(0, 'rgba(96, 165, 250, 0.18)');
  sky.addColorStop(0.6, 'rgba(79, 209, 197, 0.06)');
  sky.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1024, 190);

  // Primary softbox: large, elongated icy reflection (upper-right).
  // Two layers: a wide soft halo plus a tighter specular core, which is
  // how a real studio softbox reads on polished glass.
  ctx.save();
  ctx.translate(700, 118);
  ctx.scale(2.4, 0.82);
  const key = ctx.createRadialGradient(0, 0, 4, 0, 0, 175);
  key.addColorStop(0, 'rgba(217, 247, 255, 1.0)');
  key.addColorStop(0.28, 'rgba(180, 230, 255, 0.72)');
  key.addColorStop(0.62, 'rgba(96, 165, 250, 0.26)');
  key.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = key;
  ctx.beginPath();
  ctx.arc(0, 0, 175, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tight specular core inside the softbox
  ctx.save();
  ctx.translate(668, 108);
  ctx.scale(1.7, 0.62);
  const core = ctx.createRadialGradient(0, 0, 2, 0, 0, 58);
  core.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  core.addColorStop(0.45, 'rgba(217, 247, 255, 0.7)');
  core.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Secondary reflection: soft teal glow (lower-left)
  ctx.save();
  ctx.translate(285, 356);
  ctx.scale(1.6, 0.66);
  const fill = ctx.createRadialGradient(0, 0, 6, 0, 0, 170);
  fill.addColorStop(0, 'rgba(79, 209, 197, 0.5)');
  fill.addColorStop(0.5, 'rgba(96, 165, 250, 0.16)');
  fill.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(0, 0, 170, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Faint horizon bounce so the lower half is not dead black
  const horizon = ctx.createLinearGradient(0, 220, 0, 320);
  horizon.addColorStop(0, 'rgba(31, 90, 120, 0)');
  horizon.addColorStop(0.5, 'rgba(31, 90, 120, 0.22)');
  horizon.addColorStop(1, 'rgba(31, 90, 120, 0)');
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 220, 1024, 100);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Glowing </> mark that sits inside the glass
function createSymbolTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);

  // Outer glow pass
  ctx.shadowColor = 'rgba(94, 234, 212, 0.65)';
  ctx.shadowBlur = 14;
  ctx.strokeStyle = '#5eead4';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(172, 185); ctx.lineTo(112, 256); ctx.lineTo(172, 327); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(284, 168); ctx.lineTo(228, 344); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(340, 185); ctx.lineTo(400, 256); ctx.lineTo(340, 327); ctx.stroke();

  // Inner bright icy core
  ctx.shadowColor = 'rgba(217, 247, 255, 0.5)';
  ctx.shadowBlur = 6;
  ctx.strokeStyle = '#d9f7ff';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(172, 185); ctx.lineTo(112, 256); ctx.lineTo(172, 327); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(284, 168); ctx.lineTo(228, 344); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(340, 185); ctx.lineTo(400, 256); ctx.lineTo(340, 327); ctx.stroke();

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function CodeSphere() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene / Camera / Renderer ──────────────────────────────────────────
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0.15, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Studio environment (gives the glass genuine reflections) ──────────
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envSource = createStudioEnvironment();
    const envRT = pmrem.fromEquirectangular(envSource);
    envSource.dispose();
    scene.environment = envRT.texture;
    scene.environmentIntensity = 1.0;

    // ── Soft studio lighting ───────────────────────────────────────────────
    // Reflections come from the environment softbox; these lights only add
    // gentle ambient bounce so the glass sits naturally in the dark backdrop.
    scene.add(new THREE.AmbientLight(0x24445e, 0.9));

    // Gentle sky/ground bounce: teal above, deep navy below
    const hemi = new THREE.HemisphereLight(PALETTE.blue, PALETTE.shadow, 1.0);
    hemi.position.set(0, 1, 0);
    scene.add(hemi);

    // ── Root Group ─────────────────────────────────────────────────────────
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ── Ground glow (soft teal reflection under the sphere) ────────────────
    const canvasGlow = document.createElement('canvas');
    canvasGlow.width = canvasGlow.height = 512;
    const ctxGlow = canvasGlow.getContext('2d');
    const radGrad = ctxGlow.createRadialGradient(256, 256, 10, 256, 256, 240);
    radGrad.addColorStop(0, 'rgba(79, 209, 197, 0.18)');
    radGrad.addColorStop(0.3, 'rgba(96, 165, 250, 0.09)');
    radGrad.addColorStop(0.6, 'rgba(31, 90, 120, 0.05)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctxGlow.fillStyle = radGrad;
    ctxGlow.fillRect(0, 0, 512, 512);

    const glowTexture = new THREE.CanvasTexture(canvasGlow);
    glowTexture.colorSpace = THREE.SRGBColorSpace;
    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const groundGlow = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), glowMat);
    groundGlow.rotation.x = -Math.PI / 2;
    groundGlow.position.y = -1.8;
    scene.add(groundGlow);

    // ── Sphere Group ───────────────────────────────────────────────────────
    const sphereGroup = new THREE.Group();
    rootGroup.add(sphereGroup);

    // Inner body: a stable view-space gradient gives real spherical depth.
    // Upper-right is lit blue/teal; lower-left falls into deep navy shadow.
    const innerCore = new THREE.Mesh(
      new THREE.SphereGeometry(1.42, 96, 96),
      new THREE.ShaderMaterial({
        uniforms: {
          uShadow: { value: new THREE.Color(PALETTE.shadow) },
          uDeep: { value: new THREE.Color(PALETTE.deep) },
          uMid: { value: new THREE.Color(PALETTE.mid) },
          uTeal: { value: new THREE.Color(PALETTE.teal) },
          uBlue: { value: new THREE.Color(PALETTE.blue) },
          uLightDir: {
            value: new THREE.Vector3(0.58, 0.66, 0.48).normalize(),
          },
        },
        vertexShader: `
          varying vec3 vNormalV;

          void main() {
            vNormalV = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uShadow;
          uniform vec3 uDeep;
          uniform vec3 uMid;
          uniform vec3 uTeal;
          uniform vec3 uBlue;
          uniform vec3 uLightDir;

          varying vec3 vNormalV;

          void main() {
            vec3 n = normalize(vNormalV);
            float ndl = dot(n, normalize(uLightDir));

            // Smooth light → shadow falloff across the sphere
            float t = smoothstep(-0.55, 1.0, ndl);

            // Blue-teal tonal layers
            vec3 col = mix(uShadow, uDeep, smoothstep(-0.1, 0.5, t));
            col = mix(col, uMid, smoothstep(0.3, 0.82, t));
            col = mix(col, uBlue, smoothstep(0.7, 1.0, t) * 0.42);
            col = mix(col, uTeal, smoothstep(0.82, 1.0, t) * 0.26);

            // Push the lower-left into richer shadow
            float lowerLeft =
              (1.0 - smoothstep(-0.95, 0.15, n.y)) * 0.6 +
              (1.0 - smoothstep(-0.95, 0.05, n.x)) * 0.4;
            col = mix(col, uShadow, lowerLeft * 0.24);

            // Subtle internal scattering toward the center
            float centerGlow =
              smoothstep(0.25, 1.0, n.z) *
              (1.0 - smoothstep(0.1, 0.9, length(n.xy)));
            col += uMid * 0.06 * centerGlow;
            col += uTeal * 0.03 * centerGlow;

            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
      })
    );
    innerCore.renderOrder = 0;
    sphereGroup.add(innerCore);

    // Outer shell: translucent blue-teal glass with soft reflections/refraction
    const outerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.72, 128, 128),
      new THREE.MeshPhysicalMaterial({
        color: 0xe3f6ff,
        metalness: 0.0,
        roughness: 0.12,
        transmission: 1.0,
        thickness: 1.4,
        ior: 1.45,
        reflectivity: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        attenuationColor: new THREE.Color(PALETTE.deep),
        attenuationDistance: 3.0,
        envMapIntensity: 0.6,
        specularIntensity: 1.0,
        transparent: true,
        opacity: 1.0,
      })
    );
    sphereGroup.add(outerSphere);

    // Thin cyan-teal rim that follows the silhouette
    const rimShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(PALETTE.rim) },
        uIntensity: { value: 0.32 },
        uPower: { value: 3.4 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uPower;

        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
          fresnel = pow(fresnel, uPower);

          gl_FragColor = vec4(uColor, fresnel * uIntensity);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    sphereGroup.add(
      new THREE.Mesh(new THREE.SphereGeometry(1.735, 96, 96), rimShaderMat)
    );

    // Soft elongated studio-softbox reflection on the upper-right.
    // A gaussian on the view-space normal keeps it wrapped to the curvature
    // (so it reads as a real reflection rather than a flat sticker).
    const highlightMat = new THREE.ShaderMaterial({
      uniforms: {
        uDir: { value: new THREE.Vector3(0.46, 0.58, 0.72).normalize() },
        uCore: { value: new THREE.Color(0xffffff) },
        uGlow: { value: new THREE.Color(PALETTE.blue) },
        uIntensity: { value: 0.9 },
      },
      vertexShader: `
        varying vec3 vNormalV;

        void main() {
          vNormalV = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uDir;
        uniform vec3 uCore;
        uniform vec3 uGlow;
        uniform float uIntensity;

        varying vec3 vNormalV;

        void main() {
          vec3 n = normalize(vNormalV);
          vec3 L = normalize(uDir);
          float facing = max(dot(n, L), 0.0);

          // Tangent frame around the highlight so it can be elongated
          vec3 up = normalize(vec3(0.35, 1.0, 0.0));
          vec3 T = normalize(cross(up, L));
          vec3 B = normalize(cross(L, T));

          vec3 offset = n - L * facing;
          float u = dot(offset, T) / 0.42;   // wide axis
          float v = dot(offset, B) / 0.27;   // short axis

          float r2 = u * u + v * v;
          float glow = exp(-r2 * 1.4);
          float core = exp(-r2 * 4.5);

          vec3 col = mix(uGlow, uCore, clamp(core, 0.0, 1.0));
          float alpha = (glow * 0.34 + core * 0.7) * uIntensity
                        * smoothstep(0.0, 0.12, facing);

          gl_FragColor = vec4(col, alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    const highlightMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.722, 96, 96),
      highlightMat
    );
    highlightMesh.renderOrder = 6;
    sphereGroup.add(highlightMesh);

    // ── </> symbol (kept facing the viewer, embedded in the glass) ─────────
    const symbolGroup = new THREE.Group();
    symbolGroup.renderOrder = 10;
    rootGroup.add(symbolGroup);

    const symbolTex = createSymbolTexture();
    const symbolMat = new THREE.MeshBasicMaterial({
      map: symbolTex,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    const symbol = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), symbolMat);
    symbol.position.z = 1.45;
    symbol.renderOrder = 10;
    symbolGroup.add(symbol);

    // ── Orbit rings (subtle, elegant, wrapping the sphere) ─────────────────
    const ringCurve = new THREE.EllipseCurve(0, 0, 2.5, 1.15, 0, 2 * Math.PI, false, 0);
    const orbitRing = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        ringCurve.getPoints(140).map((p) => new THREE.Vector3(p.x, 0, p.y))
      ),
      new THREE.LineBasicMaterial({
        color: PALETTE.rim,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    orbitRing.rotation.x = THREE.MathUtils.degToRad(42);
    orbitRing.rotation.z = THREE.MathUtils.degToRad(-16);
    rootGroup.add(orbitRing);

    const ringCurve2 = new THREE.EllipseCurve(0, 0, 2.25, 0.92, 0, 2 * Math.PI, false, 0);
    const orbitRing2 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        ringCurve2.getPoints(140).map((p) => new THREE.Vector3(p.x, 0, p.y))
      ),
      new THREE.LineBasicMaterial({
        color: PALETTE.rim,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    orbitRing2.rotation.x = THREE.MathUtils.degToRad(-30);
    orbitRing2.rotation.z = THREE.MathUtils.degToRad(25);
    rootGroup.add(orbitRing2);

    // ── Initial tilt ───────────────────────────────────────────────────────
    sphereGroup.rotation.x = THREE.MathUtils.degToRad(8);
    sphereGroup.rotation.y = THREE.MathUtils.degToRad(18);

    // ── Animation ──────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Gentle float, slow glass rotation (sphere is featureless, so subtle)
      rootGroup.position.y = Math.sin(t * 0.9) * 0.06;
      sphereGroup.rotation.y = THREE.MathUtils.degToRad(18) + t * 0.06;
      sphereGroup.rotation.x =
        THREE.MathUtils.degToRad(8) + Math.sin(t * 0.35) * 0.02;
      orbitRing.rotation.y = t * 0.05;
      orbitRing2.rotation.y = -t * 0.035;

      renderer.render(scene, camera);
    }
    animate();

    // ── Resize handler ─────────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => {
            if (material.map) material.map.dispose();
            material.dispose();
          });
        }
      });

      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: '240px' }}
    />
  );
}
