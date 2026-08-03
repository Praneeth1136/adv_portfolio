import * as THREE from 'three';

export class Scene3D {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = [];
    this.orbitingObjects = [];
    
    this.init();
    this.createParticles();
    this.createOrbitingGeometry();
    this.animate();
    window.addEventListener('resize', () => this.onWindowResize());
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    
    // Camera
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 30;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x7800ff, 0.8, 100);
    pointLight.position.set(20, 20, 20);
    this.scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff6400, 0.6, 80);
    pointLight2.position.set(-20, -15, 15);
    this.scene.add(pointLight2);
  }

  createParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x7800ff,
      size: 0.3,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6
    });

    const points = new THREE.Points(geometry, material);
    this.scene.add(points);
    this.particles.push({
      mesh: points,
      velocity: new Float32Array(particleCount * 3)
    });

    // Initialize velocities
    for (let i = 0; i < particleCount * 3; i += 3) {
      this.particles[0].velocity[i] = (Math.random() - 0.5) * 0.02;
      this.particles[0].velocity[i + 1] = (Math.random() - 0.5) * 0.02;
      this.particles[0].velocity[i + 2] = (Math.random() - 0.5) * 0.02;
    }
  }

  createOrbitingGeometry() {
    // Central cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x7800ff,
      emissive: 0x7800ff,
      emissiveIntensity: 0.3,
      wireframe: false
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;
    this.scene.add(cube);

    this.orbitingObjects.push({
      mesh: cube,
      rotationSpeed: { x: 0.005, y: 0.008, z: 0.003 }
    });

    // Orbiting spheres
    const sphereGeometry = new THREE.IcosahedronGeometry(0.8, 3);
    const colors = [0x7800ff, 0xff6400, 0x00d9ff];

    for (let i = 0; i < 3; i++) {
      const material = new THREE.MeshPhongMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.2
      });
      const sphere = new THREE.Mesh(sphereGeometry, material);
      this.scene.add(sphere);

      this.orbitingObjects.push({
        mesh: sphere,
        orbitRadius: 8 + i * 4,
        orbitSpeed: 0.001 + i * 0.0005,
        angle: (i / 3) * Math.PI * 2,
        tiltAxis: new THREE.Vector3(
          Math.sin(i),
          Math.cos(i),
          Math.sin(i + 1)
        ).normalize(),
        rotationSpeed: { x: 0.01, y: 0.015, z: 0.007 }
      });
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    // Animate particles
    this.particles.forEach(particle => {
      const positions = particle.mesh.geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Update position
        positions[i] += particle.velocity[i];
        positions[i + 1] += particle.velocity[i + 1];
        positions[i + 2] += particle.velocity[i + 2];

        // Bounce at boundaries
        if (Math.abs(positions[i]) > 50) particle.velocity[i] *= -1;
        if (Math.abs(positions[i + 1]) > 50) particle.velocity[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 50) particle.velocity[i + 2] *= -1;
      }

      particle.mesh.geometry.attributes.position.needsUpdate = true;
    });

    // Animate orbiting objects
    this.orbitingObjects.forEach((obj, index) => {
      if (index === 0) {
        // Central cube rotation
        obj.mesh.rotation.x += obj.rotationSpeed.x;
        obj.mesh.rotation.y += obj.rotationSpeed.y;
        obj.mesh.rotation.z += obj.rotationSpeed.z;
      } else {
        // Orbiting spheres
        obj.angle += obj.orbitSpeed;
        
        // Calculate position with elliptical orbit
        const x = Math.cos(obj.angle) * obj.orbitRadius;
        const z = Math.sin(obj.angle) * obj.orbitRadius * 0.6;
        const y = Math.sin(obj.angle * 0.5) * obj.orbitRadius * 0.3;
        
        obj.mesh.position.set(x, y, z);

        // Rotation
        obj.mesh.rotation.x += obj.rotationSpeed.x;
        obj.mesh.rotation.y += obj.rotationSpeed.y;
        obj.mesh.rotation.z += obj.rotationSpeed.z;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}

export function init3D() {
  const container = document.getElementById('three-container');
  if (container) {
    return new Scene3D(container);
  }
}
