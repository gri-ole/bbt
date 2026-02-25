// ThreeScene Component - Three.js scene with liquid waves and glass effects
// Handles background wave shader, liquid glass card, and mouse interactivity

const { useEffect, useRef } = React;

// Background Wave Shader - Inline shaders for browser compatibility
const backgroundWaveVertex = `
  precision mediump float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    // Optional: slight vertex displacement for depth
    vec3 pos = position;
    float wave = sin(pos.x * 0.1 + uTime * 0.5) * 0.02;
    pos.z += wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const backgroundWaveFragment = `
  precision mediump float;
  
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Pastel color palette for Montessori brand
  vec3 color1 = vec3(0.98, 0.82, 0.86); // Soft pink
  vec3 color2 = vec3(0.77, 0.96, 0.85); // Mint green
  vec3 color3 = vec3(0.82, 0.90, 1.0);  // Light blue
  vec3 color4 = vec3(1.0, 0.90, 0.78);  // Peach
  
  // Smooth wave function
  float wave(vec2 p, float frequency, float speed, float phase) {
    return sin(dot(p, vec2(frequency, frequency * 0.7)) + uTime * speed + phase) * 0.5 + 0.5;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 10.0 - 5.0;
    
    // Mouse influence (subtle)
    vec2 mouseInfluence = (uMouse - 0.5) * 0.3;
    p += mouseInfluence;
    
    // Multiple wave layers with different frequencies
    float wave1 = wave(p, 1.0, 0.3, 0.0);
    float wave2 = wave(p, 1.5, 0.4, 1.5);
    float wave3 = wave(p, 2.0, 0.25, 3.0);
    float wave4 = wave(p, 0.8, 0.35, 4.5);
    
    // Combine waves
    float combined = (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.2 + wave4 * 0.1);
    
    // Create depth gradient
    float depth = length(uv - 0.5) * 1.5;
    
    // Mix colors based on wave patterns
    vec3 color = mix(color1, color2, combined);
    color = mix(color, color3, wave2);
    color = mix(color, color4, wave3 * 0.5);
    
    // Add depth variation
    color *= (0.7 + depth * 0.3);
    
    // Soft edges
    float edge = smoothstep(0.0, 0.1, min(uv.x, 1.0 - uv.x)) * 
                 smoothstep(0.0, 0.1, min(uv.y, 1.0 - uv.y));
    
    gl_FragColor = vec4(color * edge, 0.85);
  }
`;

// Note: Liquid glass shader removed - using CSS glassmorphism for card instead
// This provides better performance and keeps content accessible

function ThreeScene({ containerRef }) {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const clockRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.warn("ThreeScene: container ref not available");
      return;
    }

    // Wait for THREE to be available
    if (!window.THREE) {
      console.warn("ThreeScene: THREE.js not loaded, retrying...");
      const checkThree = setInterval(() => {
        if (window.THREE) {
          clearInterval(checkThree);
          // Retry initialization
          setTimeout(() => {
            if (containerRef.current) {
              initializeScene();
            }
          }, 100);
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkThree);
        if (!window.THREE) {
          console.error("ThreeScene: THREE.js failed to load");
          // Show fallback
          const fallback = document.querySelector(".bb-bg-fallback");
          if (fallback) {
            fallback.style.display = "block";
          }
        }
      }, 5000);
      
      return () => clearInterval(checkThree);
    }

    let cleanupFunctions = [];
    let scene, camera, renderer, clock, backgroundMaterial, backgroundMesh;
    let animationId = null;
    let mouseUpdateTimeout = null;

    function initializeScene() {
      const THREE = window.THREE;
      const container = containerRef.current;
      
      if (!THREE || !container) {
        console.warn("ThreeScene: THREE or container not available");
        return;
      }

      // Check WebGL support
      let webglSupported = false;
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl2") ||
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl");
        webglSupported = !!gl;
      } catch (e) {
        webglSupported = false;
      }

      if (!webglSupported) {
        console.warn("ThreeScene: WebGL not supported, falling back to CSS");
        // Show fallback background
        const fallback = document.querySelector(".bb-bg-fallback");
        if (fallback) {
          fallback.style.display = "block";
        }
        return;
      }

      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.style.position = "fixed";
      renderer.domElement.style.top = "0";
      renderer.domElement.style.left = "0";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.zIndex = "0";
      container.appendChild(renderer.domElement);

      // Clock for time-based animations
      clock = new THREE.Clock();

      // Background wave shader material
      // Optimized geometry: fewer segments for better performance
      const segments = Math.min(64, Math.floor(window.innerWidth / 20));
      const backgroundGeometry = new THREE.PlaneGeometry(20, 20, segments, segments);
      backgroundMaterial = new THREE.ShaderMaterial({
        vertexShader: backgroundWaveVertex,
        fragmentShader: backgroundWaveFragment,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uResolution: { value: new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
          ) },
        },
        transparent: true,
        side: THREE.DoubleSide,
      });
      backgroundMesh = new THREE.Mesh(
        backgroundGeometry,
        backgroundMaterial
      );
      backgroundMesh.position.z = -5;
      scene.add(backgroundMesh);

    // Note: HTML card with CSS glassmorphism is used instead of Three.js card
    // This provides better performance and keeps content accessible
    // The Three.js scene is used only for the animated background

      // Mouse interaction with throttling for performance
      const handleMouseMove = (event) => {
      // Throttle mouse updates
      if (mouseUpdateTimeout) return;
      mouseUpdateTimeout = setTimeout(() => {
        targetMouseRef.current.x = event.clientX / window.innerWidth;
        targetMouseRef.current.y = 1.0 - event.clientY / window.innerHeight;
        mouseUpdateTimeout = null;
      }, 16); // ~60fps
    };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      cleanupFunctions.push(() => {
        window.removeEventListener("mousemove", handleMouseMove);
      });

      // Smooth mouse interpolation
      const lerp = (a, b, t) => a + (b - a) * t;

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        animationFrameRef.current = animationId;

        const elapsedTime = clock.getElapsedTime();

      // Smooth mouse movement
      mouseRef.current.x = lerp(
        mouseRef.current.x,
        targetMouseRef.current.x,
        0.05
      );
      mouseRef.current.y = lerp(
        mouseRef.current.y,
        targetMouseRef.current.y,
        0.05
      );

      // Update uniforms
      backgroundMaterial.uniforms.uTime.value = elapsedTime;
      backgroundMaterial.uniforms.uMouse.value.set(
        mouseRef.current.x,
        mouseRef.current.y
      );


      // Camera parallax (subtle)
      camera.position.x = (mouseRef.current.x - 0.5) * 0.3;
      camera.position.y = (mouseRef.current.y - 0.5) * 0.3;
      camera.lookAt(0, 0, 0);

      // Render
      renderer.render(scene, camera);
    };

      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        backgroundMaterial.uniforms.uResolution.value.set(
          window.innerWidth,
          window.innerHeight
        );
      };

      window.addEventListener("resize", handleResize);
      cleanupFunctions.push(() => {
        window.removeEventListener("resize", handleResize);
      });

      // Store refs for cleanup
      sceneRef.current = scene;
      rendererRef.current = renderer;
      cameraRef.current = camera;
      clockRef.current = clock;

      console.log("ThreeScene: Initialized successfully");
    }

    // Initialize scene
    initializeScene();

    // Cleanup function
    return () => {
      // Run all cleanup functions
      cleanupFunctions.forEach((fn) => {
        try {
          fn();
        } catch (e) {
          console.error("ThreeScene cleanup error:", e);
        }
      });
      
      if (mouseUpdateTimeout) {
        clearTimeout(mouseUpdateTimeout);
      }
      
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Dispose resources
      if (backgroundMaterial) {
        backgroundMaterial.dispose();
      }
      if (backgroundMesh && backgroundMesh.geometry) {
        backgroundMesh.geometry.dispose();
      }
      if (renderer) {
        renderer.dispose();
        const container = containerRef.current;
        if (container && renderer.domElement) {
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      }
    };
  }, [containerRef]);

  return null; // This component doesn't render anything directly
}

// Expose globally for Babel
window.ThreeScene = ThreeScene;
