/**
 * Hello World - Interactive Experience
 * Core Application Logic
 */

// ==========================================================================
// Application State & Configuration
// ==========================================================================
const state = {
  theme: 'dark',
  activeVibe: 'cosmic',
  userName: '',
  audioCtx: null,
  globeRotation: { x: 0, y: 0 },
  globeTargetRotation: { x: 0, y: 0 },
  isDraggingGlobe: false,
  dragStart: { x: 0, y: 0 },
  selectedLang: 'js',
  isCompiling: false,
  languages: {
    js: {
      name: 'JavaScript',
      file: 'hello.js',
      code: 'console.log("Hello, World!");',
      output: 'Hello, World!',
      logs: [
        { type: 'input', text: 'node hello.js' },
        { type: 'output', text: 'Hello, World!' }
      ]
    },
    py: {
      name: 'Python',
      file: 'hello.py',
      code: 'print("Hello, World!")',
      output: 'Hello, World!',
      logs: [
        { type: 'input', text: 'python3 hello.py' },
        { type: 'output', text: 'Hello, World!' }
      ]
    },
    rust: {
      name: 'Rust',
      file: 'main.rs',
      code: 'fn main() {\n    println!("Hello, World!");\n}',
      output: 'Hello, World!',
      logs: [
        { type: 'input', text: 'rustc main.rs && ./main' },
        { type: 'system', text: 'Compiling main.rs...' },
        { type: 'system', text: 'Optimization level: O3' },
        { type: 'output', text: 'Hello, World!' }
      ]
    },
    cpp: {
      name: 'C++',
      file: 'main.cpp',
      code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
      output: 'Hello, World!',
      logs: [
        { type: 'input', text: 'g++ main.cpp -o hello && ./hello' },
        { type: 'system', text: 'Linking objects...' },
        { type: 'output', text: 'Hello, World!' }
      ]
    },
    go: {
      name: 'Go',
      file: 'hello.go',
      code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
      output: 'Hello, World!',
      logs: [
        { type: 'input', text: 'go run hello.go' },
        { type: 'output', text: 'Hello, World!' }
      ]
    },
    asm: {
      name: 'x86 Assembly',
      file: 'hello.asm',
      code: 'section .data\n    msg db "Hello, World!", 0xA\n    len equ $ - msg\n\nsection .text\n    global _start\n\n_start:\n    mov eax, 4\n    mov ebx, 1\n    mov ecx, msg\n    mov edx, len\n    int 0x80\n    mov eax, 1\n    mov ebx, 0\n    int 0x80',
      output: 'Hello, World!',
      logs: [
        { type: 'input', text: 'nasm -f elf64 hello.asm && ld hello.o -o hello && ./hello' },
        { type: 'system', text: 'Assembling x86 ELF format...' },
        { type: 'output', text: 'Hello, World!' }
      ]
    }
  },
  greetings: [
    { id: 'us', name: 'English', greeting: 'Hello World', country: '🇺🇸', label: 'North America', lat: 40.7128, lon: -74.0060, pronounce: 'Heh-low Werld' },
    { id: 'fr', name: 'French', greeting: 'Bonjour le monde', country: '🇫🇷', label: 'Europe', lat: 48.8566, lon: 2.3522, pronounce: 'Bon-zhoor luh mohnd' },
    { id: 'jp', name: 'Japanese', greeting: 'こんにちは世界', country: '🇯🇵', label: 'East Asia', lat: 35.6762, lon: 139.6503, pronounce: 'Kon-nee-chee-wah Seh-kai' },
    { id: 'eg', name: 'Arabic', greeting: 'مرحباً بالعالم', country: '🇪🇬', label: 'Middle East', lat: 30.0444, lon: 31.2357, pronounce: 'Mar-ha-ban Bil-aa-lam' },
    { id: 'br', name: 'Portuguese', greeting: 'Olá Mundo', country: '🇧🇷', label: 'South America', lat: -22.9068, lon: -43.1729, pronounce: 'Oh-la Moon-doh' },
    { id: 'ke', name: 'Swahili', greeting: 'Hujambo Ulimwengu', country: '🇰🇪', label: 'East Africa', lat: -1.2921, lon: 36.8219, pronounce: 'Hoo-jahm-boh Oo-lee-mwen-goo' },
    { id: 'in', name: 'Hindi', greeting: 'नमस्ते दुनिया', country: '🇮🇳', label: 'South Asia', lat: 19.0760, lon: 72.8777, pronounce: 'Nah-mas-tay Duh-nee-yah' },
    { id: 'au', name: 'G\'day World', country: '🇦🇺', label: 'Oceania', lat: -33.8688, lon: 151.2093, pronounce: 'Guh-day Werld' },
    { id: 'is', name: 'Icelandic', greeting: 'Halló heimur', country: '🇮🇸', label: 'Nordic', lat: 64.1466, lon: -21.9426, pronounce: 'Hat-loh Hey-mur' }
  ],
  vibeThemes: {
    cosmic: {
      accent: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
      color: '#a78bfa',
      glow: 'rgba(167, 139, 250, 0.2)',
      hover: '#7c3aed',
      bg: '#05050c'
    },
    cyber: {
      accent: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.2)',
      hover: '#047857',
      bg: '#020b08'
    },
    synth: {
      accent: 'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)',
      color: '#f43f5e',
      glow: 'rgba(244, 63, 94, 0.2)',
      hover: '#be123c',
      bg: '#0a0307'
    },
    zen: {
      accent: 'linear-gradient(135deg, #fb7185 0%, #fed7aa 100%)',
      color: '#fb7185',
      glow: 'rgba(251, 113, 133, 0.2)',
      hover: '#e11d48',
      bg: '#070506'
    }
  }
};

// ==========================================================================
// Web Audio Engine (Synthesizer)
// ==========================================================================
function initAudio() {
  if (state.audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  state.audioCtx = new AudioContext();
}

function playSound(type) {
  initAudio();
  if (!state.audioCtx) return;
  
  // Resume context if suspended
  if (state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }

  const ctx = state.audioCtx;
  const dest = ctx.destination;
  
  if (type === 'cosmic') {
    // Chime sweep chord (major 7th)
    const freqs = [261.63, 329.63, 392.00, 493.88, 523.25]; // C4, E4, G4, B4, C5
    freqs.forEach((f, idx) => {
      setTimeout(() => {
        createSineTone(f, 0.8, 1.5, idx * 0.15);
      }, idx * 100);
    });
  } else if (type === 'cyber') {
    // Retro digital arpeggio
    const freqs = [196.00, 293.66, 392.00, 587.33]; // G3, D4, G4, D5
    freqs.forEach((f, idx) => {
      setTimeout(() => {
        createTriangleTone(f, 0.5, 0.25);
      }, idx * 80);
    });
  } else if (type === 'synth') {
    // Warm synth wave sweep
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, ctx.currentTime); // A2
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4); // A4
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } else if (type === 'zen') {
    // Pure calm wind-chime tone
    createSineTone(659.25, 0.4, 3.0); // E5
    setTimeout(() => {
      createSineTone(880.00, 0.3, 2.5); // A5
    }, 200);
  } else if (type === 'click') {
    // Quick tiny click
    createSineTone(1200, 0.05, 0.05);
  } else if (type === 'compile-success') {
    // Uplifting success double-beep
    createSineTone(523.25, 0.15, 0.1); // C5
    setTimeout(() => {
      createSineTone(659.25, 0.2, 0.2); // E5
    }, 120);
  }
  
  function createSineTone(freq, volume, duration, delay = 0) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    
    osc.connect(gain);
    gain.connect(dest);
    
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.1);
  }
  
  function createTriangleTone(freq, volume, duration) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(dest);
    
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.1);
  }
}

// ==========================================================================
// Canvas Background Engine
// ==========================================================================
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let bgParticles = [];

function initBgCanvas() {
  resizeBgCanvas();
  window.addEventListener('resize', resizeBgCanvas);
  
  // Initialize particles
  bgParticles = [];
  const count = window.innerWidth < 640 ? 40 : 100;
  for (let i = 0; i < count; i++) {
    bgParticles.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      radius: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      grow: Math.random() > 0.5
    });
  }
}

function resizeBgCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function drawBgCanvas() {
  // Clear with subtle overlay to create trails or clean repaint
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  
  const isLight = document.body.classList.contains('light-theme');
  bgCtx.fillStyle = isLight ? 'rgba(243, 244, 246, 0.4)' : 'rgba(5, 5, 12, 0.4)';
  
  // Style dots according to active vibe
  const themeColor = state.vibeThemes[state.activeVibe].color;
  
  bgParticles.forEach(p => {
    // Update positioning
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Bounds wrapping
    if (p.x < 0) p.x = bgCanvas.width;
    if (p.x > bgCanvas.width) p.x = 0;
    if (p.y < 0) p.y = bgCanvas.height;
    if (p.y > bgCanvas.height) p.y = 0;
    
    // Pulse transparency
    if (p.grow) {
      p.alpha += 0.003;
      if (p.alpha >= 0.7) p.grow = false;
    } else {
      p.alpha -= 0.003;
      if (p.alpha <= 0.1) p.grow = true;
    }
    
    // Draw dot
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    
    // Match colors
    if (isLight) {
      bgCtx.fillStyle = hexToRgba(themeColor, p.alpha * 0.6);
    } else {
      bgCtx.fillStyle = hexToRgba(themeColor, p.alpha);
    }
    bgCtx.fill();
  });
  
  // Draw subtle connection lines between close particles
  bgCtx.lineWidth = 0.5;
  for (let i = 0; i < bgParticles.length; i++) {
    for (let j = i + 1; j < bgParticles.length; j++) {
      const dist = Math.hypot(bgParticles[i].x - bgParticles[j].x, bgParticles[i].y - bgParticles[j].y);
      if (dist < 120) {
        const lineAlpha = (1 - dist / 120) * 0.12;
        bgCtx.beginPath();
        bgCtx.moveTo(bgParticles[i].x, bgParticles[i].y);
        bgCtx.lineTo(bgParticles[j].x, bgParticles[j].y);
        bgCtx.strokeStyle = hexToRgba(themeColor, lineAlpha);
        bgCtx.stroke();
      }
    }
  }
  
  requestAnimationFrame(drawBgCanvas);
}

function hexToRgba(hex, alpha) {
  // Simple hex converter
  let c = hex.substring(1);
  if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ==========================================================================
// 3D Canvas Globe Engine
// ==========================================================================
const globeCanvas = document.getElementById('globe-canvas');
const globeCtx = globeCanvas.getContext('2d');
let globePoints = [];
let globeNodes = [];
const GLOBE_RADIUS = 135;

function initGlobe() {
  resizeGlobeCanvas();
  window.addEventListener('resize', resizeGlobeCanvas);
  
  // Generate random dots on the sphere surface
  globePoints = [];
  const dotCount = 420;
  for (let i = 0; i < dotCount; i++) {
    // Spherical distribution
    const theta = Math.acos(Math.random() * 2 - 1);
    const phi = Math.random() * Math.PI * 2;
    
    globePoints.push({
      theta,
      phi,
      x: GLOBE_RADIUS * Math.sin(theta) * Math.cos(phi),
      y: GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi),
      z: GLOBE_RADIUS * Math.cos(theta)
    });
  }
  
  // Process real cities/greeting nodes mapping
  // Map Lat/Lon to Spherical coordinates
  // Lat: -90 to +90 (phi-like), Lon: -180 to +180 (theta-like)
  globeNodes = state.greetings.map(g => {
    // Lat to math angle: (90 - Lat) in radians
    const theta = (90 - g.lat) * Math.PI / 180;
    // Lon to math angle: (Lon + 180) in radians
    const phi = (g.lon + 180) * Math.PI / 180;
    
    return {
      ...g,
      theta,
      phi,
      hovered: false
    };
  });
  
  // Set default initial rotation to face Europe/Africa
  state.globeRotation = { x: 0.1, y: -0.5 };
  state.globeTargetRotation = { x: 0.1, y: -0.5 };
  
  // Canvas Mouse interaction
  globeCanvas.addEventListener('mousedown', (e) => {
    state.isDraggingGlobe = true;
    state.dragStart = { x: e.clientX, y: e.clientY };
  });
  
  window.addEventListener('mousemove', (e) => {
    if (state.isDraggingGlobe) {
      const dx = e.clientX - state.dragStart.x;
      const dy = e.clientY - state.dragStart.y;
      state.globeTargetRotation.y += dx * 0.007;
      state.globeTargetRotation.x += dy * 0.007;
      state.dragStart = { x: e.clientX, y: e.clientY };
    } else {
      // Normal hover checks
      checkGlobeNodeHover(e);
    }
  });
  
  window.addEventListener('mouseup', () => {
    state.isDraggingGlobe = false;
  });

  // Touch support for mobiles
  globeCanvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      state.isDraggingGlobe = true;
      state.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  globeCanvas.addEventListener('touchmove', (e) => {
    if (state.isDraggingGlobe && e.touches.length === 1) {
      const dx = e.touches[0].clientX - state.dragStart.x;
      const dy = e.touches[0].clientY - state.dragStart.y;
      state.globeTargetRotation.y += dx * 0.01;
      state.globeTargetRotation.x += dy * 0.01;
      state.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  globeCanvas.addEventListener('touchend', () => {
    state.isDraggingGlobe = false;
  });
  
  globeCanvas.addEventListener('click', handleGlobeClick);
}

function resizeGlobeCanvas() {
  const rect = globeCanvas.parentElement.getBoundingClientRect();
  globeCanvas.width = rect.width || 420;
  globeCanvas.height = rect.height || 420;
}

function checkGlobeNodeHover(e) {
  const rect = globeCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  let isAnyHovered = false;
  
  globeNodes.forEach(node => {
    if (node.screenX !== undefined && node.screenY !== undefined && node.screenZ > 0) {
      const dist = Math.hypot(mouseX - node.screenX, mouseY - node.screenY);
      if (dist < 12) {
        node.hovered = true;
        isAnyHovered = true;
      } else {
        node.hovered = false;
      }
    }
  });
  
  globeCanvas.style.cursor = state.isDraggingGlobe ? 'grabbing' : (isAnyHovered ? 'pointer' : 'grab');
}

function handleGlobeClick(e) {
  const rect = globeCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  const clickedNode = globeNodes.find(node => {
    if (node.screenX !== undefined && node.screenY !== undefined && node.screenZ > 0) {
      return Math.hypot(mouseX - node.screenX, mouseY - node.screenY) < 12;
    }
    return false;
  });
  
  if (clickedNode) {
    selectGreetingNode(clickedNode);
    playSound('click');
  }
}

function selectGreetingNode(node) {
  // Focus overlay info
  document.getElementById('globe-region').textContent = `${node.country} ${node.name}`;
  document.getElementById('globe-greeting').textContent = `"${node.greeting}"`;
  
  // Align globe coordinates to face this node
  // Target rotation to bring node to front center (z-axis pointing out)
  // Theta and Phi are math sphere coords, we need to negate them appropriately
  state.globeTargetRotation.y = -node.phi + Math.PI / 2;
  state.globeTargetRotation.x = node.theta - Math.PI / 2;
  
  // Visual glow highlighting of matched list item
  const card = document.querySelector(`.lang-card[data-id="${node.id}"]`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    card.classList.add('glow-highlight');
    setTimeout(() => card.classList.remove('glow-highlight'), 1200);
  }
}

function drawGlobe() {
  const cx = globeCanvas.width / 2;
  const cy = globeCanvas.height / 2;
  
  globeCtx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);
  
  // Smoothly damp rotation to target
  state.globeRotation.x += (state.globeTargetRotation.x - state.globeRotation.x) * 0.1;
  state.globeRotation.y += (state.globeTargetRotation.y - state.globeRotation.y) * 0.1;
  
  // Auto rotation if not dragging
  if (!state.isDraggingGlobe) {
    state.globeTargetRotation.y += 0.0015;
  }
  
  const rx = state.globeRotation.x;
  const ry = state.globeRotation.y;
  
  const isLight = document.body.classList.contains('light-theme');
  const accentColor = state.vibeThemes[state.activeVibe].color;
  
  // 1. Draw Globe Sphere Shadow Backdrop
  const grad = globeCtx.createRadialGradient(cx, cy, GLOBE_RADIUS * 0.8, cx, cy, GLOBE_RADIUS);
  if (isLight) {
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'rgba(226, 232, 240, 0.4)');
  } else {
    grad.addColorStop(0, 'rgba(10, 10, 20, 0.4)');
    grad.addColorStop(0.8, 'rgba(15, 23, 42, 0.8)');
    grad.addColorStop(1, 'rgba(167, 139, 250, 0.05)');
  }
  globeCtx.beginPath();
  globeCtx.arc(cx, cy, GLOBE_RADIUS, 0, Math.PI * 2);
  globeCtx.fillStyle = grad;
  globeCtx.fill();
  
  // 2. Draw Sphere Outline Ring
  globeCtx.beginPath();
  globeCtx.arc(cx, cy, GLOBE_RADIUS, 0, Math.PI * 2);
  globeCtx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)';
  globeCtx.lineWidth = 1;
  globeCtx.stroke();
  
  // Helper to rotate 3D coords
  function rotate3D(x, y, z) {
    // Rotate Y (longitude-like rotation)
    let cosY = Math.cos(ry);
    let sinY = Math.sin(ry);
    let x1 = x * cosY - z * sinY;
    let z1 = x * sinY + z * cosY;
    
    // Rotate X (latitude-like rotation)
    let cosX = Math.cos(rx);
    let sinX = Math.sin(rx);
    let y2 = y * cosX - z1 * sinX;
    let z2 = y * sinX + z1 * cosX;
    
    return { x: x1, y: y2, z: z2 };
  }
  
  // 3. Render Globe Outline/Background dots
  globePoints.forEach(p => {
    // Calc original x,y,z
    const ox = GLOBE_RADIUS * Math.sin(p.theta) * Math.cos(p.phi);
    const oy = GLOBE_RADIUS * Math.sin(p.theta) * Math.sin(p.phi);
    const oz = GLOBE_RADIUS * Math.cos(p.theta);
    
    const rPoint = rotate3D(ox, oy, oz);
    
    // Project only if visible (front half of sphere, z > -20)
    if (rPoint.z > -10) {
      // Perspective scale factor
      const scale = 1 + (rPoint.z / GLOBE_RADIUS) * 0.15;
      const sx = cx + rPoint.x * scale;
      const sy = cy + rPoint.y * scale;
      const rad = 1.2 * scale;
      
      globeCtx.beginPath();
      globeCtx.arc(sx, sy, rad, 0, Math.PI * 2);
      
      // Far dots are dimmer
      const opacity = Math.max(0.08, (rPoint.z + GLOBE_RADIUS) / (GLOBE_RADIUS * 2));
      globeCtx.fillStyle = isLight 
        ? `rgba(15, 23, 42, ${opacity * 0.25})` 
        : `rgba(255, 255, 255, ${opacity * 0.18})`;
      globeCtx.fill();
    }
  });
  
  // 4. Render Interface Node Cities
  globeNodes.forEach(node => {
    // Core math spherical coord
    const ox = GLOBE_RADIUS * Math.sin(node.theta) * Math.cos(node.phi);
    const oy = GLOBE_RADIUS * Math.sin(node.theta) * Math.sin(node.phi);
    const oz = GLOBE_RADIUS * Math.cos(node.theta);
    
    const rPoint = rotate3D(ox, oy, oz);
    
    // Save screen positions for clicks
    const scale = 1 + (rPoint.z / GLOBE_RADIUS) * 0.15;
    node.screenX = cx + rPoint.x * scale;
    node.screenY = cy + rPoint.y * scale;
    node.screenZ = rPoint.z;
    
    if (rPoint.z > 0) { // Front facing nodes
      const activeOpacity = (rPoint.z / GLOBE_RADIUS); // Fade at sides
      
      // Node Pulse Glow Ring
      globeCtx.beginPath();
      globeCtx.arc(node.screenX, node.screenY, node.hovered ? 12 : 7, 0, Math.PI * 2);
      globeCtx.fillStyle = hexToRgba(accentColor, node.hovered ? 0.35 : 0.15 * activeOpacity);
      globeCtx.fill();
      
      // Node Core Ring Outline
      globeCtx.beginPath();
      globeCtx.arc(node.screenX, node.screenY, node.hovered ? 7 : 4, 0, Math.PI * 2);
      globeCtx.strokeStyle = accentColor;
      globeCtx.lineWidth = 1.5;
      globeCtx.stroke();
      
      // Node Core Dot
      globeCtx.beginPath();
      globeCtx.arc(node.screenX, node.screenY, 2, 0, Math.PI * 2);
      globeCtx.fillStyle = '#fff';
      globeCtx.fill();
      
      // Labels for node name on Hover
      if (node.hovered) {
        globeCtx.font = 'bold 11px Inter, sans-serif';
        globeCtx.fillStyle = isLight ? '#0f172a' : '#ffffff';
        globeCtx.textAlign = 'center';
        
        // Draw small tooltip text above
        globeCtx.fillText(`${node.country} ${node.name}`, node.screenX, node.screenY - 14);
      }
    }
  });
  
  requestAnimationFrame(drawGlobe);
}

// ==========================================================================
// Vibe Synthesizer (Vibe Mixer Controls)
// ==========================================================================
function setupVibeMixer() {
  const vibeButtons = document.querySelectorAll('.vibe-btn');
  vibeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      vibeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const vibe = btn.dataset.vibe;
      state.activeVibe = vibe;
      
      // Preview theme changes dynamically
      updateThemeVariables(vibe);
      playSound('click');
    });
  });
  
  const synthesizeBtn = document.getElementById('synthesize-btn');
  synthesizeBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('user-name');
    state.userName = nameInput.value.trim();
    
    // Play vibe sweep audio chord
    playSound(state.activeVibe);
    
    // Confetti animation
    triggerConfetti();
    
    // Header text transformation
    const greetingText = document.getElementById('greeting-text');
    greetingText.classList.add('fade');
    
    setTimeout(() => {
      if (state.userName) {
        greetingText.textContent = `Hello, ${state.userName}!`;
      } else {
        greetingText.textContent = `Hello World`;
      }
      greetingText.classList.remove('fade');
    }, 300);
    
    // Show Toast Notification
    const toast = document.getElementById('notification');
    const toastText = document.getElementById('notification-text');
    toastText.textContent = state.userName 
      ? `Welcome, ${state.userName}! ${capitalize(state.activeVibe)} vibe successfully synthesized.`
      : `${capitalize(state.activeVibe)} vibe successfully synthesized!`;
    
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  });
}

function updateThemeVariables(vibe) {
  const theme = state.vibeThemes[vibe];
  const root = document.documentElement;
  
  root.style.setProperty('--active-accent', theme.accent);
  root.style.setProperty('--accent-color', theme.color);
  root.style.setProperty('--accent-glow', theme.glow);
  root.style.setProperty('--btn-primary-bg', theme.color);
  root.style.setProperty('--btn-primary-hover', theme.hover);
  
  // Apply a subtle change to body background to reflect the theme mood in dark mode
  if (!document.body.classList.contains('light-theme')) {
    document.body.style.backgroundColor = theme.bg;
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Particle explosion (Confetti) trigger
let activeConfetti = [];
function triggerConfetti() {
  const theme = state.vibeThemes[state.activeVibe];
  const color = theme.color;
  
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight * 0.65;
  
  for (let i = 0; i < 60; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 4;
    
    activeConfetti.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 3, // slightly upward bias
      radius: Math.random() * 4 + 2,
      color: color,
      alpha: 1.0,
      gravity: 0.22,
      friction: 0.96
    });
  }
  
  // Single animation loop inside background draw or separate drawer
  // We'll hook it into our background canvas drawing so we don't duplicate loops.
}

// Draw hook for confetti (called in bgCanvas render)
function drawConfetti() {
  for (let i = activeConfetti.length - 1; i >= 0; i--) {
    const c = activeConfetti[i];
    
    c.vx *= c.friction;
    c.vy *= c.friction;
    c.vy += c.gravity;
    
    c.x += c.vx;
    c.y += c.vy;
    c.alpha -= 0.016;
    
    if (c.alpha <= 0) {
      activeConfetti.splice(i, 1);
      continue;
    }
    
    bgCtx.beginPath();
    bgCtx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    bgCtx.fillStyle = hexToRgba(c.color, c.alpha);
    bgCtx.fill();
  }
}

// Hook drawConfetti into main loop
const originalDrawBg = drawBgCanvas;
drawBgCanvas = function() {
  originalDrawBg();
  drawConfetti();
};

// ==========================================================================
// Compiler Showroom (Terminal Simulator)
// ==========================================================================
function setupCompilerShowroom() {
  const langItems = document.querySelectorAll('.lang-item');
  const codeDisplay = document.getElementById('code-display');
  const filename = document.getElementById('terminal-filename');
  
  langItems.forEach(item => {
    item.addEventListener('click', () => {
      if (state.isCompiling) return;
      
      langItems.forEach(l => l.classList.remove('active'));
      item.classList.add('active');
      
      const lang = item.dataset.lang;
      state.selectedLang = lang;
      
      // Update terminal view
      const selected = state.languages[lang];
      filename.textContent = selected.file;
      codeDisplay.textContent = selected.code;
      
      // Reset console logs
      const consoleLogs = document.getElementById('console-logs');
      consoleLogs.innerHTML = '';
      
      const setupLine = document.createElement('div');
      setupLine.className = 'console-line system-msg';
      setupLine.textContent = `Compiler initialized. Switched to ${selected.name}.`;
      consoleLogs.appendChild(setupLine);
      
      playSound('click');
    });
  });
  
  const runBtn = document.getElementById('run-btn');
  runBtn.addEventListener('click', runCompilerSimulation);
  
  const copyBtn = document.getElementById('copy-btn');
  copyBtn.addEventListener('click', () => {
    const code = state.languages[state.selectedLang].code;
    navigator.clipboard.writeText(code).then(() => {
      // Toast notification
      const toast = document.getElementById('notification');
      document.getElementById('notification-text').textContent = 'Code copied to clipboard!';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
      playSound('click');
    });
  });
}

function runCompilerSimulation() {
  if (state.isCompiling) return;
  state.isCompiling = true;
  
  initAudio();
  playSound('click');
  
  const runBtn = document.getElementById('run-btn');
  runBtn.style.opacity = 0.5;
  runBtn.style.cursor = 'not-allowed';
  
  const consoleLogs = document.getElementById('console-logs');
  consoleLogs.innerHTML = '';
  
  const selected = state.languages[state.selectedLang];
  let logsQueue = [...selected.logs];
  let logIdx = 0;
  
  function executeNextLog() {
    if (logIdx >= logsQueue.length) {
      // Completed compilation
      runBtn.style.opacity = 1;
      runBtn.style.cursor = 'pointer';
      state.isCompiling = false;
      
      // Play compile success sound
      playSound('compile-success');
      return;
    }
    
    const log = logsQueue[logIdx];
    const logEl = document.createElement('div');
    logEl.className = `console-line ${log.type === 'input' ? 'input-cmd' : log.type === 'system' ? 'system-msg' : 'output'}`;
    
    consoleLogs.appendChild(logEl);
    
    // Simulated line typing for console commands
    if (log.type === 'input') {
      let charIdx = 0;
      const cmdText = log.text;
      
      function typeChar() {
        if (charIdx <= cmdText.length) {
          logEl.textContent = cmdText.substring(0, charIdx);
          charIdx++;
          setTimeout(typeChar, 40);
        } else {
          logIdx++;
          setTimeout(executeNextLog, 400);
        }
      }
      typeChar();
    } else {
      // Instant display for system output
      logEl.textContent = log.text;
      logIdx++;
      setTimeout(executeNextLog, 600);
    }
    
    // Auto-scroll console body
    const terminalBody = document.querySelector('.terminal-body');
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
  
  executeNextLog();
}

// ==========================================================================
// World Tour Greeting Explorer Grid
// ==========================================================================
function populateGreetingsGrid() {
  const container = document.getElementById('languages-grid');
  container.innerHTML = '';
  
  state.greetings.forEach(g => {
    const card = document.createElement('div');
    card.className = 'card lang-card';
    card.dataset.id = g.id;
    
    card.innerHTML = `
      <div class="lang-card-header">
        <span class="lang-card-country" aria-hidden="true">${g.country}</span>
        <span class="lang-card-code">${g.id}</span>
      </div>
      <div class="lang-card-name">${g.name}</div>
      <div class="lang-card-greeting">${g.greeting}</div>
      <div class="lang-card-pronounce">"${g.pronounce}"</div>
    `;
    
    card.addEventListener('click', () => {
      // Find matches in globe array
      const node = globeNodes.find(n => n.id === g.id);
      if (node) {
        selectGreetingNode(node);
        playSound('zen');
      }
    });
    
    container.appendChild(card);
  });
}

// ==========================================================================
// Theme Control Panel (Dark / Light toggle)
// ==========================================================================
function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  
  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    playSound('click');
    
    if (isLight) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      state.theme = 'dark';
      
      // Revert base backcolor to theme color
      document.body.style.backgroundColor = state.vibeThemes[state.activeVibe].bg;
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      state.theme = 'light';
      
      // Override background to slate-50
      document.body.style.backgroundColor = '#f3f4f6';
    }
  });
}

// Set dynamic footer year
document.getElementById('current-year').textContent = new Date().getFullYear();

// ==========================================================================
// Initialize App on DOM Loaded
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initBgCanvas();
  drawBgCanvas();
  
  initGlobe();
  drawGlobe();
  
  setupVibeMixer();
  setupCompilerShowroom();
  populateGreetingsGrid();
  setupThemeToggle();
});
