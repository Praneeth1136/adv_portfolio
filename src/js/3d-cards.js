/**
 * 3D Tilt Effect for Project Cards
 * Inspired by Awwwards award-winning portfolios
 */

export class Card3D {
  constructor(element) {
    this.element = element;
    this.container = element;
    this.inner = element.querySelector('.card-inner') || element;
    this.mouse = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };
    this.rotation = { x: 0, y: 0 };
    
    this.isActive = false;
    this.maxRotation = 15;
    
    this.init();
  }
  
  init() {
    // Ensure the element has proper styles
    this.element.style.perspective = '1000px';
    this.element.style.transformStyle = 'preserve-3d';
    this.inner.style.transition = 'transform 0.5s ease-out';
    
    this.element.addEventListener('mouseenter', () => this.onMouseEnter());
    this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.element.addEventListener('mouseleave', () => this.onMouseLeave());
  }
  
  onMouseEnter() {
    this.isActive = true;
    this.inner.style.transition = 'none';
  }
  
  onMouseMove(e) {
    if (!this.isActive) return;
    
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * this.maxRotation;
    const rotateY = -((x - centerX) / centerX) * this.maxRotation;
    
    this.rotation.x = rotateX;
    this.rotation.y = rotateY;
    
    this.updateTransform();
  }
  
  onMouseLeave() {
    this.isActive = false;
    this.inner.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    this.rotation.x = 0;
    this.rotation.y = 0;
    this.updateTransform();
  }
  
  updateTransform() {
    const transform = `rotateX(${this.rotation.x}deg) rotateY(${this.rotation.y}deg) translateZ(20px)`;
    this.inner.style.transform = transform;
  }
}

/**
 * Initialize all 3D cards on the page
 */
export function initCard3D() {
  const cards = document.querySelectorAll('[data-3d-card]');
  const instances = [];
  
  cards.forEach(card => {
    instances.push(new Card3D(card));
  });
  
  return instances;
}

/**
 * Scroll-triggered 3D reveals
 */
export class ScrollReveal3D {
  constructor() {
    this.elements = document.querySelectorAll('[data-scroll-reveal-3d]');
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => this.updateReveals());
    this.updateReveals(); // Initial check
  }
  
  updateReveals() {
    this.elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - (rect.top / window.innerHeight)));
      
      const rotateX = (1 - progress) * 30;
      const opacity = progress;
      const translateZ = progress * 50;
      
      element.style.opacity = opacity;
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) translateZ(${translateZ}px)`;
      element.style.transition = 'none';
    });
  }
}

/**
 * Floating 3D text animation
 */
export class Float3DText {
  constructor(element) {
    this.element = element;
    this.isFloating = false;
    this.floatSpeed = Math.random() * 0.002 + 0.001;
    this.floatRange = 10;
    this.startTime = Date.now();
    
    this.element.style.perspective = '1000px';
    this.element.style.transformStyle = 'preserve-3d';
    
    this.startAnimation();
  }
  
  startAnimation() {
    const animate = () => {
      const elapsed = Date.now() - this.startTime;
      const y = Math.sin(elapsed * this.floatSpeed) * this.floatRange;
      const x = Math.cos(elapsed * this.floatSpeed * 0.5) * (this.floatRange * 0.5);
      
      const transform = `translateY(${y}px) translateX(${x}px) rotateZ(${Math.sin(elapsed * this.floatSpeed * 0.3) * 2}deg)`;
      this.element.style.transform = transform;
      
      requestAnimationFrame(animate);
    };
    animate();
  }
}

/**
 * Parallax 3D effect based on mouse position
 */
export class Parallax3D {
  constructor(element) {
    this.element = element;
    this.layers = element.querySelectorAll('[data-parallax-layer]');
    this.mouse = { x: 0, y: 0 };
    
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }
  
  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    
    this.layers.forEach((layer) => {
      const depth = parseFloat(layer.dataset.parallaxLayer) || 1;
      const x = this.mouse.x * depth * 20;
      const y = this.mouse.y * depth * 20;
      
      layer.style.transform = `translate3d(${x}px, ${y}px, ${depth * 50}px)`;
    });
  }
}

/**
 * Morphing shape effect
 */
export class MorphShape {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.time = 0;
    
    this.animate();
  }
  
  animate() {
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.drawMorphingShape();
    
    this.time += 0.01;
    requestAnimationFrame(() => this.animate());
  }
  
  drawMorphingShape() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const baseRadius = 50;
    const points = 6;
    
    this.ctx.strokeStyle = `rgba(0, 255, 200, ${0.3 + Math.sin(this.time) * 0.2})`;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const radius = baseRadius + Math.sin(this.time + i) * 20;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    
    this.ctx.closePath();
    this.ctx.stroke();
  }
}
