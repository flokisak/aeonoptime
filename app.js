class RouteOptimizer {
    constructor() {
        this.stops = [];
        this.startingPoint = null;
        this.roundTrip = false;
        this.optimizedRoute = null;
        this.userId = this.generateUserId();
        this.currentRouteId = null;
        this.currentTracking = null;
        this.trackingData = [];
        this.userSettings = { kmRate: 3.00, currency: 'CZK' };

        // Navigation state
        this.isNavigating = false;

        this.init();
    }

    generateUserId() {
        let id = localStorage.getItem('userId');
        if (!id) {
            id = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', id);
        }
        return id;
    }

    async init() {
        console.log('Initializing RouteOptimizer 2.0.2...');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initAfterDOM());
        } else {
            this.initAfterDOM();
        }
    }

    initAfterDOM() {
        this.initTheme();
        this.bindEvents();
        this.loadFromStorage().then(() => {
            this.registerServiceWorker();
            this.updateUI();
        });
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.setTheme(theme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const icon = document.querySelector('.theme-icon');
        if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    bindEvents() {
        // Core Inputs
        this.bindInput('startPointInput', 'startPoint');
        this.bindInput('stopInput', 'stop');

        // Buttons
        const clickHandlers = {
            'addStopBtn': () => this.addStop(),
            'optimizeBtn': () => this.optimizeRoute(),
            'navigateBtn': () => this.navigateNextPending(),
            'startRouteBtn': () => this.toggleRouteSession(),
            'themeToggle': () => this.toggleTheme(),
            'useCurrentLocationBtn': () => this.useCurrentLocation(),
            'bulkModeBtn': () => this.toggleBulkMode(),
            'parseTextBtn': () => this.parseBulkText(),
            'endRouteBtn': () => this.endRouteSession(),
            'roundTripCheckbox': (e) => { this.roundTrip = e.target.checked; this.saveToStorage(); }
        };

        for (const [id, handler] of Object.entries(clickHandlers)) {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener(id.includes('Checkbox') ? 'change' : 'click', handler);
            }
        }
    }

    bindInput(elementId, type) {
        const input = document.getElementById(elementId);
        if (!input) return;

        let timeout;
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearTimeout(timeout);

            if (query.length >= 2) {
                timeout = setTimeout(() => this.showAutocomplete(type, query), 300);
            } else {
                this.hideAutocomplete(type);
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && type === 'stop') {
                this.addStop();
            }
        });

        // Hide on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.input-group') && !e.target.closest('.autocomplete-dropdown')) {
                this.hideAutocomplete(type);
            }
        });
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        this.setTheme(current === 'dark' ? 'light' : 'dark');
    }

    // --- Core Logic: Stops Management ---

    async addStop() {
        const input = document.getElementById('stopInput');
        const address = input?.value.trim();
        if (!address) return;

        this.showLoading(true);
        try {
            const coords = await this.geocodeAddress(address);
            if (coords) {
                this.stops.push({
                    id: Date.now(),
                    address: address,
                    lat: coords.lat,
                    lng: coords.lng,
                    status: 'pending', // 'pending' | 'completed'
                    priority: false,
                    items: []
                });

                input.value = '';
                this.saveToStorage();
                this.updateUI();
            } else {
                alert('Adresu se nepodařilo najít.');
            }
        } catch (e) {
            console.error(e);
            alert('Chyba při přidávání zastávky.');
        } finally {
            this.showLoading(false);
        }
    }

    markStopAsDone(id) {
        const stop = this.stops.find(s => s.id === id);
        if (stop) {
            stop.status = stop.status === 'completed' ? 'pending' : 'completed';
            this.saveToStorage();
            this.updateUI();
        }
    }

    removeStop(id) {
        this.stops = this.stops.filter(s => s.id !== id);
        this.saveToStorage();
        this.updateUI();
    }

    // --- UI Rendering ---

    updateUI() {
        this.renderStopsList();
        this.updateStats();
        this.updateActionButtons();

        // Restore start point input
        const startInput = document.getElementById('startPointInput');
        if (startInput && this.startingPoint) {
            startInput.value = this.startingPoint.address;
        }

        const roundTripCheck = document.getElementById('roundTripCheckbox');
        if (roundTripCheck) roundTripCheck.checked = this.roundTrip;
    }

    renderStopsList() {
        const container = document.getElementById('stopsList');
        if (!container) return;

        if (this.stops.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    <h3>Vaše trasa je prázdná</h3>
                    <p>Začněte přidáním adresy nebo importujte seznam</p>
                </div>`;
            return;
        }

        container.innerHTML = this.stops.map((stop, index) => {
            const isCompleted = stop.status === 'completed';
            // Render items list if present
            const itemsHtml = stop.items && stop.items.length > 0 ?
                `<div class="stop-items" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--divider); font-size: 0.85rem; color: var(--text-secondary); background: rgba(0,0,0,0.02); padding: 0.5rem; border-radius: 4px;">
                    <strong style="display: block; margin-bottom: 0.25rem; font-size: 0.75rem; text-transform: uppercase;">Položky:</strong>
                    ${stop.items.map(item => `<div style="padding-left: 0.5rem;">• ${item}</div>`).join('')}
                 </div>` : '';

            return `
            <div class="stop-card ${isCompleted ? 'completed' : ''}" data-id="${stop.id}" draggable="true">
                <div class="stop-number">${index + 1}</div>
                <div class="stop-content">
                    <div class="stop-address" title="${stop.address}">${stop.address}</div>
                    <div class="stop-meta">
                        ${isCompleted ? 'Dokončeno' : 'Čeká na doručení'}
                    </div>
                    ${itemsHtml}
                </div>
                <div class="stop-actions" style="align-self: flex-start;">
                    <button onclick="window.routeOptimizer.navigateSingle(${stop.id})" class="context-btn" title="Navigovat sem">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2l7 20-7-4-7 4 7-20z"/>
                        </svg>
                    </button>
                    <button onclick="window.routeOptimizer.removeStop(${stop.id})" class="context-btn danger" title="Odstranit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                             <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <button onclick="window.routeOptimizer.markStopAsDone(${stop.id})" class="check-btn ${isCompleted ? 'completed' : ''}" title="${isCompleted ? 'Označit jako nedokončené' : 'Označit jako hotové'}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>`;
        }).join('');

        this.setupDragAndDrop(container);
    }

    updateStats() {
        const totalDist = this.calculateCompleteRouteDistance();
        const pendingStops = this.stops.filter(s => s.status !== 'completed').length;

        document.getElementById('statsKm').textContent = totalDist.toFixed(1);
        document.getElementById('statsStops').textContent = pendingStops;

        const statsEl = document.getElementById('quickStats');
        if (this.stops.length > 0) statsEl.style.display = 'grid';
        else statsEl.style.display = 'none';
    }

    updateActionButtons() {
        const optBtn = document.getElementById('optimizeBtn');
        if (optBtn) {
            if (this.stops.length >= 2) {
                optBtn.classList.remove('hidden');
                optBtn.style.display = 'flex';
            } else {
                optBtn.classList.add('hidden');
                optBtn.style.display = 'none';
            }
        }
    }

    // --- Navigation & Tracking ---

    navigateSingle(stopId) {
        const stop = this.stops.find(s => s.id === stopId);
        if (!stop) return;

        const url = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=driving`;
        window.open(url, '_blank');
    }

    navigateNextPending() {
        const nextStop = this.stops.find(s => s.status !== 'completed');
        if (nextStop) {
            this.navigateSingle(nextStop.id);
        } else {
            alert('Všechny zastávky jsou dokončeny! 🎉');
        }
    }

    toggleRouteSession() {
        if (this.currentTracking) {
            // Already tracking, just show modal
            document.getElementById('trackingModal').classList.add('active');
        } else {
            this.startRouteTracking();
        }
    }

    startRouteTracking() {
        this.currentTracking = {
            startTime: new Date(),
            positions: [],
            distance: 0,
            watchId: null
        };

        if ('geolocation' in navigator) {
            this.currentTracking.watchId = navigator.geolocation.watchPosition(
                (pos) => this.recordPosition(pos),
                (err) => console.error(err),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }

        document.getElementById('trackingModal').classList.add('active');
        document.getElementById('startRouteBtn').style.display = 'none'; // Hide start button

        // Change nav button to "Navigate Next"
        const navBtn = document.getElementById('navigateBtn');
        navBtn.innerHTML = `
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
             </svg>
            Další zastávka`;
        navBtn.onclick = () => this.navigateNextPending();
    }

    recordPosition(position) {
        if (!this.currentTracking) return;

        const { latitude, longitude, accuracy } = position.coords;
        const currentPos = { lat: latitude, lng: longitude, time: Date.now() };

        // Basic filtering: ignore points with bad accuracy (>50m)
        if (accuracy > 50) return;

        const pLen = this.currentTracking.positions.length;
        if (pLen > 0) {
            const lastPos = this.currentTracking.positions[pLen - 1];
            const dist = this.calculateDistance(lastPos.lat, lastPos.lng, latitude, longitude);

            // Filter unrealistic jumps (GPS drift)
            // Min distance 5 meters
            if (dist > 0.005) {
                this.currentTracking.distance += dist;
                this.currentTracking.positions.push(currentPos);

                // Update UI in real-time
                const distEl = document.getElementById('currentDistance');
                const earnEl = document.getElementById('currentEarnings');
                if (distEl) distEl.textContent = this.currentTracking.distance.toFixed(2);
                if (earnEl) earnEl.textContent = (this.currentTracking.distance * this.userSettings.kmRate).toFixed(0);
            }
        } else {
            this.currentTracking.positions.push(currentPos);
        }
    }

    endRouteSession() {
        if (!this.currentTracking) return;

        if (confirm('Opravdu chcete ukončit jízdu?')) {
            if (this.currentTracking.watchId) navigator.geolocation.clearWatch(this.currentTracking.watchId);

            // Save record
            const record = {
                date: new Date().toISOString(),
                distance: this.currentTracking.distance,
                earnings: this.currentTracking.distance * this.userSettings.kmRate
            };
            this.trackingData.unshift(record);
            localStorage.setItem('trackingData', JSON.stringify(this.trackingData));

            // Reset state
            this.currentTracking = null;
            document.getElementById('trackingModal').classList.remove('active');
            document.getElementById('startRouteBtn').style.display = 'flex';

            // Reset nav button
            const navBtn = document.getElementById('navigateBtn');
            navBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l7 20-7-4-7 4 7-20z"/>
                </svg>
                Navigace`;
            navBtn.onclick = null;

            alert(`Jízda ukončena. Ujeto: ${record.distance.toFixed(1)} km.`);
        }
    }

    // --- Geocoding & Optimization ---

    async geocodeAddress(address) {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=cz&limit=1`);
            const data = await res.json();
            if (data && data.length) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        } catch (e) {
            console.error(e);
        }
        return null;
    }

    async useCurrentLocation() {
        if (!navigator.geolocation) return;
        try {
            const pos = await new Promise((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject)
            );
            const { latitude, longitude } = pos.coords;

            // Reverse geocode
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();

            this.startingPoint = {
                address: data.display_name || `${latitude}, ${longitude}`,
                lat: latitude,
                lng: longitude
            };

            document.getElementById('startPointInput').value = this.startingPoint.address;
            this.saveToStorage();
        } catch (e) {
            alert('Nepodařilo se získat polohu.');
        }
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    calculateCompleteRouteDistance() {
        if (this.stops.length < 1) return 0;
        let dist = 0;
        let prev = this.startingPoint;

        this.stops.forEach(stop => {
            if (prev) dist += this.calculateDistance(prev.lat, prev.lng, stop.lat, stop.lng);
            prev = stop;
        });

        // Return to start
        if (this.roundTrip && this.startingPoint && prev) {
            dist += this.calculateDistance(prev.lat, prev.lng, this.startingPoint.lat, this.startingPoint.lng);
        }
        return dist;
    }

    async optimizeRoute() {
        if (this.stops.length < 2) return;
        this.showLoading(true);

        try {
            let optimizationSuccess = false;

            // 1. Try OSRM Remote Optimization via Vercel proxy
            try {
                const coords = [];
                if (this.startingPoint) coords.push(`${this.startingPoint.lng},${this.startingPoint.lat}`);
                coords.push(...this.stops.map(s => `${s.lng},${s.lat}`));

                const res = await fetch('/api/optimize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ coords, roundtrip: this.roundTrip })
                });

                if (res.ok) {
                    const data = await res.json();

                    // Check for valid response code and data presence
                    if (data.code === 'Ok' && data.waypoints) {
                        const indices = data.waypoints.map(w => w.waypoint_index);
                        const isReordered = indices.some((val, i) => val !== i);

                        if (data.trips && data.trips.length > 0 && indices.length > 0) {
                            const newStops = [];

                            indices.forEach(idx => {
                                if (this.startingPoint) {
                                    if (idx !== 0) {
                                        const stop = this.stops[idx - 1];
                                        if (stop) newStops.push(stop);
                                    }
                                } else {
                                    const stop = this.stops[idx];
                                    if (stop) newStops.push(stop);
                                }
                            });

                            const uniqueStops = [...new Set(newStops)];

                            if (uniqueStops.length === this.stops.length) {
                                this.stops = uniqueStops;
                                optimizationSuccess = true;
                                console.log("OSRM Optimization applied successfully.");
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn("OSRM API check failed, proceeding to fallback");
            }

            // 2. Local Fallback (if OSRM failed or returned no change/invalid data)
            if (!optimizationSuccess) {
                console.log("Using Local NN Fallback...");
                if (this.startingPoint) {
                    let current = this.startingPoint;
                    let unvisited = [...this.stops];
                    const newOrder = [];

                    while (unvisited.length > 0) {
                        let nearest = null;
                        let minInfo = Infinity;
                        let nearestIdx = -1;

                        unvisited.forEach((stop, idx) => {
                            const d = this.calculateDistance(current.lat, current.lng, stop.lat, stop.lng);
                            if (d < minInfo) {
                                minInfo = d;
                                nearest = stop;
                                nearestIdx = idx;
                            }
                        });

                        if (nearest) {
                            newOrder.push(nearest);
                            current = nearest;
                            unvisited.splice(nearestIdx, 1);
                        }
                    }
                    this.stops = newOrder;
                } else {
                    // North-to-South sort for simple cases without start
                    this.stops.sort((a, b) => b.lat - a.lat);
                }

                alert("Použito lokální seřazení (server byl neúspěšný).");
            } else {
                alert("Trasa byla optimalizována! ⚡");
            }

            this.saveToStorage();
            this.updateUI();

        } catch (e) {
            console.error("Optimization fatal error", e);
            alert("Chyba optimalizace.");
        } finally {
            this.showLoading(false);
        }
    }

    // --- Helpers ---

    showLoading(show) {
        const el = document.getElementById('loading');
        if (el) el.classList.toggle('active', show);
    }

    saveToStorage() {
        localStorage.setItem('stops', JSON.stringify(this.stops));
        localStorage.setItem('settings', JSON.stringify(this.userSettings));
        if (this.startingPoint) localStorage.setItem('startingPoint', JSON.stringify(this.startingPoint));
        localStorage.setItem('roundTrip', this.roundTrip);
    }

    async loadFromStorage() {
        const stops = localStorage.getItem('stops');
        if (stops) this.stops = JSON.parse(stops);

        const start = localStorage.getItem('startingPoint');
        if (start) this.startingPoint = JSON.parse(start);

        const round = localStorage.getItem('roundTrip');
        if (round) this.roundTrip = (round === 'true');
    }

    async showAutocomplete(type, query) {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=cz&limit=5`);
            const data = await res.json();

            const dropdown = document.getElementById(`${type}Autocomplete`);
            if (!dropdown) return;

            dropdown.innerHTML = data.map(item => `
                <div class="autocomplete-item" onclick="window.routeOptimizer.selectAutocomplete('${type}', '${item.display_name.replace(/'/g, "\\'")}', ${item.lat}, ${item.lon})">
                    ${item.display_name.split(',')[0]}
                </div>
            `).join('');
            dropdown.style.display = 'block';
        } catch (e) { }
    }

    selectAutocomplete(type, address, lat, lng) {
        const input = document.getElementById(`${type}Input`);
        if (input) input.value = address;

        const dropdown = document.getElementById(`${type}Autocomplete`);
        if (dropdown) dropdown.style.display = 'none';

        if (type === 'startPoint') {
            this.startingPoint = { address, lat, lng };
            this.saveToStorage();
        }
    }

    hideAutocomplete(type) {
        setTimeout(() => {
            const dropdown = document.getElementById(`${type}Autocomplete`);
            if (dropdown) dropdown.style.display = 'none';
        }, 200);
    }

    toggleBulkMode() {
        const bulkDiv = document.getElementById('bulkInput');
        bulkDiv.style.display = bulkDiv.style.display === 'none' ? 'block' : 'none';

        const textarea = document.getElementById('bulkTextarea');
        if (textarea) {
            textarea.placeholder = "Příklad formátu:\nObchodní 123, Praha\n- 2x Balík\n- 1x Obálka\n\nHlavní 45, Brno\n- Lednice";
        }
    }

    parseBulkText() {
        const text = document.getElementById('bulkTextarea').value;
        const lines = text.split('\n').filter(l => l.trim().length > 0);

        if (lines.length === 0) return;

        this.showLoading(true);
        // Process sequentially to be nice to API
        (async () => {
            let addedCount = 0;
            let currentStop = null;

            for (const line of lines) {
                const cleanLine = line.trim();

                // Heuristic: If it starts with - or *, it's likely an item
                // Also check if line is very short or looks like a note
                const isBullet = /^[-\*+]/.test(cleanLine);
                const isNote = cleanLine.length < 5 && !/\d/.test(cleanLine); // Very simple note check

                if ((isBullet || isNote) && currentStop) {
                    if (!currentStop.items) currentStop.items = [];
                    currentStop.items.push(cleanLine.replace(/^[-\*+]\s*/, ''));
                } else {
                    // Try to geocode potential address
                    const coords = await this.geocodeAddress(cleanLine);
                    if (coords) {
                        // New stop found
                        currentStop = {
                            id: Date.now() + Math.random(),
                            address: cleanLine,
                            lat: coords.lat,
                            lng: coords.lng,
                            status: 'pending',
                            priority: false,
                            items: []
                        };
                        this.stops.push(currentStop);
                        addedCount++;
                    } else if (currentStop) {
                        // If geocoding failed but we have a current stop, assume it's a detail/item for that stop
                        if (!currentStop.items) currentStop.items = [];
                        currentStop.items.push(cleanLine);
                    }
                }
            }
            this.saveToStorage();
            this.updateUI();
            this.showLoading(false);

            if (addedCount > 0) {
                alert(`Zpracováno. Přidáno ${addedCount} zastávek.`);
                document.getElementById('bulkInput').style.display = 'none';
                document.getElementById('bulkTextarea').value = '';
            } else {
                alert('Nepodařilo se rozpoznat žádné adresy.');
            }
        })();
    }

    setupDragAndDrop(container) {
        let dragged = null;

        container.querySelectorAll('.stop-card').forEach(card => {
            card.addEventListener('dragstart', (e) => {
                dragged = card;
                e.dataTransfer.effectAllowed = 'move';
                card.classList.add('dragging');
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                dragged = null;
            });

            card.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            card.addEventListener('drop', (e) => {
                e.preventDefault();
                if (dragged && dragged !== card) {
                    const fromId = parseInt(dragged.dataset.id);
                    const toId = parseInt(card.dataset.id);

                    const fromIdx = this.stops.findIndex(s => s.id === fromId);
                    const toIdx = this.stops.findIndex(s => s.id === toId);

                    if (fromIdx > -1 && toIdx > -1) {
                        const item = this.stops.splice(fromIdx, 1)[0];
                        this.stops.splice(toIdx, 0, item);
                        this.saveToStorage();
                        this.updateUI();
                    }
                }
            });
        });
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
    }
}

// Global instance
window.routeOptimizer = new RouteOptimizer();