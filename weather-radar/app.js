// Core Application State
let map;
let baseLayers = {};
let currentBaseLayerName = 'light';
let activeRadarLayers = [];
let radarTimestamps = [];
let radarPastCount = 0;
let currentIndex = 0;
let animationTimer = null;

// Settings State
let currentOpacity = 0.7;
let currentScheme = 2; // RainViewer Default
let playbackSpeed = 1000; // ms per frame
let isPlaying = false;

// Weather Data State
let hourlyChart = null;
let currentLat = 59.3293;
let currentLon = 18.0686;
let currentWindSpeed = 15;
let currentTrajectoryAngle = 90;

// WMO Weather Code Mapper
function getWeatherInfo(code) {
  const codes = {
    0: { text: "Clear Sky", icon: "sun" },
    1: { text: "Mainly Clear", icon: "cloud-sun" },
    2: { text: "Partly Cloudy", icon: "cloud-sun" },
    3: { text: "Overcast", icon: "cloud" },
    45: { text: "Foggy", icon: "haze" },
    48: { text: "Depositing Rime Fog", icon: "haze" },
    51: { text: "Light Drizzle", icon: "cloud-drizzle" },
    53: { text: "Moderate Drizzle", icon: "cloud-drizzle" },
    55: { text: "Dense Drizzle", icon: "cloud-drizzle" },
    56: { text: "Light Freezing Drizzle", icon: "cloud-snow" },
    57: { text: "Dense Freezing Drizzle", icon: "cloud-snow" },
    61: { text: "Light Rain", icon: "cloud-rain" },
    63: { text: "Moderate Rain", icon: "cloud-rain" },
    65: { text: "Heavy Rain", icon: "cloud-rain" },
    66: { text: "Light Freezing Rain", icon: "cloud-snow" },
    67: { text: "Heavy Freezing Rain", icon: "cloud-snow" },
    71: { text: "Light Snow", icon: "snowflake" },
    73: { text: "Moderate Snow", icon: "snowflake" },
    75: { text: "Heavy Snow", icon: "snowflake" },
    77: { text: "Snow Grains", icon: "snowflake" },
    80: { text: "Light Rain Showers", icon: "cloud-drizzle" },
    81: { text: "Moderate Rain Showers", icon: "cloud-rain" },
    82: { text: "Violent Rain Showers", icon: "cloud-rain" },
    85: { text: "Light Snow Showers", icon: "snowflake" },
    86: { text: "Heavy Snow Showers", icon: "snowflake" },
    95: { text: "Thunderstorm", icon: "cloud-lightning" },
    96: { text: "Thunderstorm with Hail", icon: "cloud-lightning" },
    99: { text: "Heavy Thunderstorm with Hail", icon: "cloud-lightning" }
  };
  return codes[code] || { text: "Unknown Weather", icon: "cloud" };
}

// Destination point bearing/distance flat-earth helper for client-side weather drift simulation
function movePoint(latlng, distanceKm, bearingDegrees) {
  const R = 6371; // Earth radius in km
  const brng = (bearingDegrees * Math.PI) / 180;
  const lat1 = (latlng.lat * Math.PI) / 180;
  const lon1 = (latlng.lng * Math.PI) / 180;
  
  const dDivR = distanceKm / R;
  
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(dDivR) +
    Math.cos(lat1) * Math.sin(dDivR) * Math.cos(brng)
  );
  
  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(dDivR) * Math.cos(lat1),
    Math.cos(dDivR) - Math.sin(lat1) * Math.sin(lat2)
  );
  
  return L.latLng(
    (lat2 * 180) / Math.PI,
    (lon2 * 180) / Math.PI
  );
}

// ----------------------------------------------------
// 1. Initializing the Map and Base TileLayers
// ----------------------------------------------------
function initMap() {
  // Stockholm default: [59.3293, 18.0686]
  map = L.map('map', { 
    zoomControl: false,
    minZoom: 2,
    maxZoom: 16
  }).setView([currentLat, currentLon], 6);

  // Position Leaflet's zoom controls to top-right to avoid layout overlap
  L.control.zoom({ position: 'topright' }).addTo(map);

  // Define base maps
  baseLayers.dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://carto.com/">CARTO</a>'
  });

  baseLayers.light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://carto.com/">CARTO</a>'
  });

  baseLayers.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  });

  baseLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  // Load dark theme layer by default
  baseLayers[currentBaseLayerName].addTo(map);

}

// Update Map Style from settings
function updateMapStyle(styleName) {
  if (baseLayers[currentBaseLayerName]) {
    map.removeLayer(baseLayers[currentBaseLayerName]);
  }
  
  if (baseLayers[styleName]) {
    baseLayers[styleName].addTo(map);
    currentBaseLayerName = styleName;
  }
}

// ----------------------------------------------------
// 2. Fetching and Setting Up RainViewer Radar Layers
// ----------------------------------------------------
async function fetchRadarConfig() {
  try {
    const response = await fetch("https://api.rainviewer.com/public/weather-maps.json");
    if (!response.ok) throw new Error("Could not fetch RainViewer configuration.");
    const data = await response.json();
    
    const host = data.host;
    const past = data.radar.past || [];
    
    radarPastCount = past.length;
    radarTimestamps = [...past];
    
    setupRadarLayers(host);
  } catch (error) {
    console.error("RainViewer Config Error:", error);
    document.getElementById('radar-status-text').textContent = "Radar Load Error";
    document.getElementById('radar-status-pulse').classList.remove('scanning');
  }
}

function setupRadarLayers(host) {
  // Clear any existing radar layers
  activeRadarLayers.forEach(layer => {
    if (layer && map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  });
  activeRadarLayers = [];

  if (radarTimestamps.length === 0) return;

  // Build tile layer instances for past frames
  radarTimestamps.forEach((frame) => {
    const tileUrl = `${host}${frame.path}/256/{z}/{x}/{y}/${currentScheme}/1_1.png`;
    const layer = L.tileLayer(tileUrl, {
      attribution: '© <a href="https://www.rainviewer.com/">RainViewer</a>',
      opacity: 0,
      zIndex: 200,
      tileSize: 256
    });
    
    layer.addTo(map);
    activeRadarLayers.push(layer);
  });

  const slider = document.getElementById('timeline-slider');
  if (slider) {
    slider.min = 0;
    slider.max = radarTimestamps.length - 1;
    slider.value = radarTimestamps.length - 1;
    currentIndex = radarTimestamps.length - 1;
  }

  updateTimelineTicks();
  showFrame(currentIndex);
}

function updateTimelineTicks() {
  const ticksContainer = document.getElementById('timeline-ticks');
  if (!ticksContainer) return;
  ticksContainer.innerHTML = '';
  
  if (radarTimestamps.length === 0) return;
  
  const total = radarTimestamps.length;
  
  const startIdx = 0;
  const midIdx = Math.floor(total / 2);
  const endIdx = total - 1;
  
  const tickIndices = [
    { index: startIdx, label: 'Start' },
    { index: midIdx, label: 'Mid' },
    { index: endIdx, label: 'NOW', isNow: true }
  ];
  
  const uniqueTicks = [];
  const seenIndices = new Set();
  
  tickIndices.forEach(item => {
    if (item.index >= 0 && item.index < total && !seenIndices.has(item.index)) {
      seenIndices.add(item.index);
      
      const frame = radarTimestamps[item.index];
      const date = new Date(frame.time * 1000);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      
      uniqueTicks.push({
        index: item.index,
        labelText: item.isNow ? `NOW (${timeStr})` : timeStr,
        isNow: !!item.isNow
      });
    }
  });
  
  uniqueTicks.sort((a, b) => a.index - b.index);
  
  uniqueTicks.forEach(tick => {
    const pct = (tick.index / (total - 1)) * 100;
    const span = document.createElement('span');
    span.className = 'tick-label';
    span.style.position = 'absolute';
    span.style.left = `${pct}%`;
    span.style.transform = 'translateX(-50%)';
    span.style.whiteSpace = 'nowrap';
    span.textContent = tick.labelText;
    
    if (tick.isNow) {
      span.style.fontWeight = '700';
      span.style.color = 'var(--accent)';
    }
    
    ticksContainer.appendChild(span);
  });
}

// ----------------------------------------------------
// 3. Managing Radar Timeline Animation
// ----------------------------------------------------
function showFrame(index) {
  if (activeRadarLayers.length === 0) return;

  if (index < 0) index = 0;
  if (index >= activeRadarLayers.length) index = activeRadarLayers.length - 1;

  currentIndex = index;

  // Control opacity of RainViewer tile layers
  activeRadarLayers.forEach((layer, i) => {
    if (!layer) return;
    
    if (i === index) {
      layer.setOpacity(currentOpacity);
    } else {
      layer.setOpacity(0);
    }
  });

  // Update slider input value
  document.getElementById('timeline-slider').value = index;

  // Update time display
  const currentFrame = radarTimestamps[index];
  if (!currentFrame) return;
  
  const date = new Date(currentFrame.time * 1000);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  document.getElementById('radar-time').textContent = `${hours}:${minutes}`;
  
  const statusPulse = document.getElementById('radar-status-pulse');
  const statusText = document.getElementById('radar-status-text');
  
  if (index === radarTimestamps.length - 1) {
    statusText.textContent = "LIVE WEATHER RADAR";
  } else {
    statusText.textContent = "RADAR HISTORY";
  }
  statusPulse.style.backgroundColor = "var(--success)";
}

function nextFrame() {
  const max = activeRadarLayers.length - 1;

  let nextIdx = currentIndex + 1;
  if (nextIdx > max) {
    nextIdx = 0; // Loop back to start
  }
  showFrame(nextIdx);
}

function startAnimation() {
  if (isPlaying) return;
  isPlaying = true;
  document.getElementById('play-icon').setAttribute('data-lucide', 'pause');
  // Re-create icons to apply the changes
  lucide.createIcons();
  
  animationTimer = setInterval(nextFrame, playbackSpeed);
}

function stopAnimation() {
  if (!isPlaying) return;
  isPlaying = false;
  document.getElementById('play-icon').setAttribute('data-lucide', 'play');
  lucide.createIcons();
  
  clearInterval(animationTimer);
  animationTimer = null;
}

function toggleAnimation() {
  if (isPlaying) {
    stopAnimation();
  } else {
    startAnimation();
  }
}

// ----------------------------------------------------
// 4. Geocoding Search (OSM Nominatim API)
// ----------------------------------------------------
let searchDebounceTimer;

async function searchLocation(query) {
  const spinner = document.getElementById('search-spinner');
  const resultsDropdown = document.getElementById('search-results');
  
  if (!query || query.trim().length < 3) {
    resultsDropdown.innerHTML = '';
    resultsDropdown.classList.remove('active');
    return;
  }

  spinner.style.display = 'block';

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Search API failed");
    
    const results = await response.json();
    displaySearchResults(results);
  } catch (error) {
    console.error("Geocoding Error:", error);
  } finally {
    spinner.style.display = 'none';
  }
}

function displaySearchResults(results) {
  const resultsDropdown = document.getElementById('search-results');
  resultsDropdown.innerHTML = '';

  if (results.length === 0) {
    resultsDropdown.innerHTML = `
      <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 14px;">
        No results found
      </div>
    `;
    resultsDropdown.classList.add('active');
    return;
  }

  results.forEach(item => {
    const displayName = item.display_name;
    const parts = displayName.split(',');
    const title = parts[0].trim();
    const subtitle = parts.slice(1).join(',').trim();

    const div = document.createElement('div');
    div.className = 'search-result-item';
    div.innerHTML = `
      <span class="search-result-title">${title}</span>
      <span class="search-result-subtitle">${subtitle}</span>
    `;

    div.addEventListener('click', () => {
      // Pan map with flying animation
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);
      map.flyTo([lat, lon], 8, { duration: 1.5 });

      // Update weather search coordinates
      currentLat = lat;
      currentLon = lon;
      
      const city = item.address.city || item.address.town || item.address.village || title;
      const country = item.address.country || '';
      
      document.getElementById('weather-location').textContent = city;
      document.getElementById('weather-country').textContent = country;

      // Close dropdown & input
      resultsDropdown.classList.remove('active');
      document.getElementById('search-input').value = city;

      // Fetch new weather details
      fetchWeatherForecast(lat, lon);
    });

    resultsDropdown.appendChild(div);
  });

  resultsDropdown.classList.add('active');
}

// ----------------------------------------------------
// 5. Weather Forecast Fetching (Open-Meteo API)
// ----------------------------------------------------
async function fetchWeatherForecast(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not fetch forecast.");
    const data = await response.json();
    
    updateWeatherUI(data);
  } catch (error) {
    console.error("Open-Meteo Fetch Error:", error);
    document.getElementById('weather-desc').innerHTML = `
      <i data-lucide="alert-circle" style="width: 14px; height: 14px;"></i>
      <span>Failed to load forecast data</span>
    `;
    lucide.createIcons();
  }
}


function updateWeatherUI(data) {
  const current = data.current;
  const wInfo = getWeatherInfo(current.weather_code);
  
  // Current values
  document.getElementById('weather-temp').textContent = Math.round(current.temperature_2m);
  document.getElementById('weather-desc').innerHTML = `
    <i data-lucide="${wInfo.icon}" style="width: 14px; height: 14px;"></i>
    <span>${wInfo.text}</span>
  `;
  document.getElementById('weather-icon-main').innerHTML = `
    <i data-lucide="${wInfo.icon}" style="width: 64px; height: 64px; color: var(--accent);"></i>
  `;

  document.getElementById('detail-wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  document.getElementById('detail-humidity').textContent = `${current.relative_humidity_2m}%`;
  document.getElementById('detail-pressure').textContent = `${Math.round(current.surface_pressure)} hPa`;
  
  // Calculate predicted weather trajectory based on current wind vectors
  const windDir = current.wind_direction_10m || 0;
  const windSpd = Math.round(current.wind_speed_10m || 0);
  
  // Weather systems blow *with* the wind, which is 180 degrees opposite to where the wind blows *from*
  const trajectoryAngle = (windDir + 180) % 360;

  // Store globally for radar forecast simulation
  currentWindSpeed = windSpd;
  currentTrajectoryAngle = trajectoryAngle;
  
  function getWindDirectionName(degree) {
    const directions = [
      { name: "North", min: 337.5, max: 360 },
      { name: "North", min: 0, max: 22.5 },
      { name: "Northeast", min: 22.5, max: 67.5 },
      { name: "East", min: 67.5, max: 112.5 },
      { name: "Southeast", min: 112.5, max: 157.5 },
      { name: "South", min: 157.5, max: 202.5 },
      { name: "Southwest", min: 202.5, max: 247.5 },
      { name: "West", min: 247.5, max: 292.5 },
      { name: "Northwest", min: 292.5, max: 337.5 }
    ];
    const matched = directions.find(d => degree >= d.min && degree < d.max);
    return matched ? matched.name : "North";
  }
  
  const moveDirection = getWindDirectionName(trajectoryAngle);
  document.getElementById('trajectory-text').textContent = `Moving ${moveDirection} at ${windSpd} km/h`;
  document.getElementById('trajectory-arrow').style.transform = `rotate(${trajectoryAngle}deg)`;
  
  // Estimate precipitation likelihood from the next hour's forecast
  const nextHourPrecip = data.hourly.precipitation_probability[0] || 0;
  document.getElementById('detail-precipitation').textContent = `${nextHourPrecip}%`;

  // Draw Hourly Chart (Chart.js)
  renderHourlyChart(data.hourly);

  // Render 7-Day Forecast
  render7DayForecast(data.daily);

  // Apply Lucide icons to all newly injected elements
  lucide.createIcons();
}

function renderHourlyChart(hourly) {
  const ctx = document.getElementById('hourly-chart').getContext('2d');
  
  // Extract next 24 hours of data
  const labels = [];
  const temps = [];
  const rainChances = [];
  
  const now = new Date();
  const currentHour = now.getHours();

  for (let i = 0; i < 24; i++) {
    const timeVal = new Date(hourly.time[i]);
    const hr = String(timeVal.getHours()).padStart(2, '0');
    labels.push(`${hr}:00`);
    temps.push(hourly.temperature_2m[i]);
    rainChances.push(hourly.precipitation_probability[i]);
  }

  if (hourlyChart) {
    hourlyChart.destroy();
  }

  // Get active CSS themes variables
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  hourlyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temp (°C)',
          data: temps,
          borderColor: '#38bdf8',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: '#38bdf8',
          tension: 0.4,
          yAxisID: 'yTemp'
        },
        {
          label: 'Rain %',
          data: rainChances,
          backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.25)',
          borderColor: '#6366f1',
          borderWidth: 1,
          type: 'bar',
          barPercentage: 0.6,
          yAxisID: 'yRain'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#cbd5e1' : '#334155',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          borderWidth: 1,
          titleFont: { family: 'Outfit' },
          bodyFont: { family: 'Outfit' }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: textColor,
            font: { size: 9, family: 'Outfit' },
            maxTicksLimit: 6
          }
        },
        yTemp: {
          type: 'linear',
          position: 'left',
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor,
            font: { size: 9, family: 'Outfit' },
            callback: (val) => `${val}°`
          }
        },
        yRain: {
          type: 'linear',
          position: 'right',
          grid: {
            display: false
          },
          min: 0,
          max: 100,
          ticks: {
            color: '#6366f1',
            font: { size: 9, family: 'Outfit' },
            callback: (val) => `${val}%`,
            maxTicksLimit: 5
          }
        }
      }
    }
  });
}

function render7DayForecast(daily) {
  const container = document.getElementById('forecast-list');
  container.innerHTML = '';

  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(daily.time[i]);
    
    let dayName = weekday[date.getDay()];
    if (i === 0) dayName = "Tod";

    const wInfo = getWeatherInfo(daily.weather_code[i]);
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);

    const div = document.createElement('div');
    div.className = 'forecast-item';
    div.innerHTML = `
      <span class="forecast-day">${dayName}</span>
      <div class="forecast-icon" title="${wInfo.text}">
        <i data-lucide="${wInfo.icon}" style="width: 14px; height: 14px; color: var(--accent);"></i>
      </div>
      <div class="forecast-temps">
        <span class="temp-max">${maxTemp}°</span>
        <span class="temp-min">${minTemp}°</span>
      </div>
    `;

    container.appendChild(div);
  }
}

// ----------------------------------------------------
// 6. User Geolocation (Locate Me)
// ----------------------------------------------------
function fetchUserLocation() {
  if (!navigator.geolocation) {
    console.warn("Geolocation not supported by browser.");
    // Fall back to default location
    fetchWeatherForecast(currentLat, currentLon);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      currentLat = position.coords.latitude;
      currentLon = position.coords.longitude;
      
      map.flyTo([currentLat, currentLon], 8, { duration: 1.5 });

      // reverse geocode coordinates using OSM Nominatim
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLat}&lon=${currentLon}`);
        if (!res.ok) throw new Error("Reverse geocoding failed");
        const addressData = await res.json();
        
        const city = addressData.address.city || addressData.address.town || addressData.address.village || "Your Location";
        const country = addressData.address.country || '';
        
        document.getElementById('weather-location').textContent = city;
        document.getElementById('weather-country').textContent = country;
        document.getElementById('search-input').value = city;
      } catch (e) {
        document.getElementById('weather-location').textContent = "My Location";
        document.getElementById('weather-country').textContent = '';
      }

      fetchWeatherForecast(currentLat, currentLon);
    },
    (error) => {
      console.warn("Geolocation error:", error.message);
      // Fallback
      fetchWeatherForecast(currentLat, currentLon);
    }
  );
}

// ----------------------------------------------------
// 7. Wiring Up Page UI Event Listeners
// ----------------------------------------------------
function setupEventListeners() {
  // Sidebar Toggle
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarClose = document.getElementById('sidebar-close');

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    sidebarToggle.style.display = 'none';
  });

  sidebarClose.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
    sidebarToggle.style.display = 'flex';
  });

  // Settings Panel flyout toggle
  const settingsPanel = document.getElementById('settings-flyout');
  const settingsButton = document.getElementById('btn-settings');

  settingsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsPanel.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsButton) {
      settingsPanel.classList.remove('active');
    }
  });

  // Radar opacity control slider
  document.getElementById('radar-opacity').addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    currentOpacity = val / 100;
    document.getElementById('opacity-val').textContent = `${val}%`;
    showFrame(currentIndex);
  });

  document.getElementById('radar-scheme').addEventListener('change', (e) => {
    currentScheme = parseInt(e.target.value, 10);
    // Re-initialize layers with the new scheme
    fetchRadarConfig();
  });

  document.getElementById('map-style').addEventListener('change', (e) => {
    updateMapStyle(e.target.value);
  });

  document.getElementById('radar-speed').addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    playbackSpeed = val;
    
    const secStr = (val / 1000).toFixed(1);
    document.getElementById('speed-val').textContent = `${secStr}s`;
    
    if (isPlaying) {
      stopAnimation();
      startAnimation();
    }
  });

  // Timeline Slider actions
  document.getElementById('timeline-slider').addEventListener('input', (e) => {
    stopAnimation();
    showFrame(parseInt(e.target.value, 10));
  });

  // Play / Pause button click
  document.getElementById('btn-play-pause').addEventListener('click', toggleAnimation);

  // Search input actions
  const searchInput = document.getElementById('search-input');
  const resultsDropdown = document.getElementById('search-results');

  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounceTimer);
    const query = e.target.value;
    searchDebounceTimer = setTimeout(() => {
      searchLocation(query);
    }, 450);
  });

  // Close search dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
      resultsDropdown.classList.remove('active');
    }
  });

  // Geolocation button
  document.getElementById('btn-locate').addEventListener('click', fetchUserLocation);

  // Light/Dark Theme toggle
  const themeToggle = document.getElementById('btn-theme');
  const themeIcon = document.getElementById('theme-icon');

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Toggle base tile layer selection
    const selectStyle = document.getElementById('map-style');
    if (newTheme === 'dark') {
      themeIcon.setAttribute('data-lucide', 'sun');
      updateMapStyle('dark');
      selectStyle.value = 'dark';
    } else {
      themeIcon.setAttribute('data-lucide', 'moon');
      updateMapStyle('light');
      selectStyle.value = 'light';
    }

    // Refresh icons and regenerate chart with appropriate axis colors
    lucide.createIcons();
    fetchWeatherForecast(currentLat, currentLon);
  });
}

// ----------------------------------------------------
// 8. Application Initialisation
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Leaflet Map
  initMap();
  
  // Set up event handlers
  setupEventListeners();
  
  // Render Lucide SVG Icons initially
  lucide.createIcons();

  // Try fetching user location & weather data, otherwise fall back to Stockholm
  fetchUserLocation();

  // Load RainViewer config and add overlays
  fetchRadarConfig();
});
