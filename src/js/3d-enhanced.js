import * as THREE from 'three';

export class EnhancedScene3D {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);
    this.scene.fog = new THREE.Fog(0x0a0a0a, 100, 1000);
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 30;
    
    // Renderer setup with optimizations
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    container.appendChild(this.renderer.domElement);
    
    // Groups for different 3D elements
    this.particleGroup = new THREE.Group();
    this.geometryGroup = new THREE.Group();
    this.scene.add(this.particleGroup);
    this.scene.add(this.geometryGroup);
    
    // Mouse position for interactions
    this.mouse = { x: 0, y: 0 };
    this.raycaster = new THREE.Raycaster();
    
    this.init();
    this.setupEventListeners();
    this.animate();
  }
  
  init() {
    // Create advanced particle system with morphing
    this.createAdvancedParticles();
    
    // Create central morphing cube with better materials
    this.createCentralCube();
    
    // Create orbiting elements
    this.createOrbitingSpheres();
    
    // Create floating geometric shapes
    this.createFloatingGeometry();
    
    // Add advanced lighting
    this.setupLighting();
  }
  
  createAdvancedParticles() {
    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 200;
      
      colors[i] = Math.random() * 0.5 + 0.5;
      colors[i + 1] = Math.random() * 0.3 + 0.2;
      colors[i + 2] = Math.random() * 0.8 + 0.2;
      
      sizes[i / 3] = Math.random() * 2 + 0.5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 0.5,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.particleGroup.add(this.particles);
    
    // Store initial positions for animation
    this.particlePositions = new Float32Array(positions);
    this.particleVelocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      this.particleVelocities[i] = (Math.random() - 0.5) * 0.5;
    }
  }
  
  createCentralCube() {
    const geometry = new THREE.IcosahedronGeometry(8, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x0088ff,
      wireframe: true,
      shininess: 100,
      fog: true
    });
    
    this.centralCube = new THREE.Mesh(geometry, material);
    this.geometryGroup.add(this.centralCube);
  }
  
  createOrbitingSpheres() {
    const orbits = [
      { radius: 15, speed: 0.001, color: 0xff0080, size: 2 },
      { radius: 25, speed: 0.0005, color: 0x00ff88, size: 1.5 },
      { radius: 35, speed: 0.0003, color: 0xffaa00, size: 1 }
    ];
    
    this.orbitingData = orbits.map((orbit, idx) => {
      const geometry = new THREE.SphereGeometry(orbit.size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: orbit.color,
        emissive: orbit.color,
        shininess: 100
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      this.geometryGroup.add(sphere);
      
      return {
        mesh: sphere,
        radius: orbit.radius,
        speed: orbit.speed,
        angle: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 0.5
      };
    });
  }
  
  createFloatingGeometry() {
    const geometries = [
      new THREE.TetrahedronGeometry(3),
      new THREE.OctahedronGeometry(3),
      new THREE.DodecahedronGeometry(2.5)
    ];
    
    const colors = [0xff1493, 0x1e90ff, 0x00ff7f];
    this.floatingShapes = [];
    
    geometries.forEach((geom, idx) => {
      const material = new THREE.MeshPhongMaterial({
        color: colors[idx],
        emissive: colors[idx],
        transparent: true,
        opacity: 0.7,
        shininess: 100
      });
      
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      
      this.geometryGroup.add(mesh);
      this.floatingShapes.push({
        mesh,
        basePos: mesh.position.clone(),
        speed: Math.random() * 0.003 + 0.001,
        rotSpeed: (Math.random() - 0.5) * 0.01
      });
    });
  }
  
  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    // Key light (Purple)
    const keyLight = new THREE.PointLight(0xff00ff, 2, 100);
    keyLight.position.set(20, 20, 20);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    this.scene.add(keyLight);
    
    // Fill light (Cyan)
    const fillLight = new THREE.PointLight(0x00ffff, 1.5, 100);
    fillLight.position.set(-20, -20, 20);
    this.scene.add(fillLight);
    
    // Back light (Orange)
    const backLight = new THREE.PointLight(0xff8800, 1, 100);
    backLight.position.set(0, -30, -30);
    this.scene.add(backLight);
  }
  
  updateParticles() {
    const positions = this.particles.geometry.attributes.position.array;
    const positionAttribute = this.particles.geometry.getAttribute('position');
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += this.particleVelocities[i];
      positions[i + 1] += this.particleVelocities[i + 1];
      positions[i + 2] += this.particleVelocities[i + 2];
      
      // Boundary conditions
      if (Math.abs(positions[i]) > 100) this.particleVelocities[i] *= -1;
      if (Math.abs(positions[i + 1]) > 100) this.particleVelocities[i + 1] *= -1;
      if (Math.abs(positions[i + 2]) > 100) this.particleVelocities[i + 2] *= -1;
    }
    
    positionAttribute.needsUpdate = true;
  }
  
  updateGeometry() {
    // Rotate central cube
    this.centralCube.rotation.x += 0.001;
    this.centralCube.rotation.y += 0.002;
    this.centralCube.rotation.z += 0.0005;
    
    // Update orbiting spheres
    this.orbitingData.forEach(orbit => {
      orbit.angle += orbit.speed;
      orbit.mesh.position.x = Math.cos(orbit.angle) * orbit.radius;
      orbit.mesh.position.y = Math.sin(orbit.angle * 0.5) * 5;
      orbit.mesh.position.z = Math.sin(orbit.angle) * orbit.radius * 0.5;
      orbit.mesh.rotation.x += 0.005;
      orbit.mesh.rotation.y += 0.008;
    });
    
    // Update floating shapes
    this.floatingShapes.forEach((shape, idx) => {
      const time = Date.now() * 0.001;
      shape.mesh.position.x = shape.basePos.x + Math.sin(time * shape.speed) * 5;
      shape.mesh.position.y = shape.basePos.y + Math.cos(time * shape.speed * 0.7) * 5;
      shape.mesh.position.z = shape.basePos.z + Math.sin(time * shape.speed * 1.3) * 5;
      
      shape.mesh.rotation.x += shape.rotSpeed;
      shape.mesh.rotation.y += shape.rotSpeed * 1.5;
      shape.mesh.rotation.z += shape.rotSpeed * 0.7;
    });
  }
  
  setupEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    window.addEventListener('resize', () => this.onWindowResize());
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  animate = () => {
    requestAnimationFrame(this.animate);
    
    // Update animations
    this.updateParticles();
    this.updateGeometry();
    
    // Mouse interaction - subtle camera movement
    this.camera.position.x += (this.mouse.x * 3 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouse.y * 3 - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);
    
    this.renderer.render(this.scene, this.camera);
  }
  
  dispose() {
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
