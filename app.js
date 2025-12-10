class RouteOptimizer {
    constructor() {
        this.stops = [];
        this.startingPoint = null;
        this.roundTrip = false;
        this.optimizedRoute = null;
        this.savedRoutes = [];
        this.userId = this.generateUserId();
        this.currentRouteId = null; // Track current loaded route
        this.currentTracking = null; // Track current navigation session
        this.trackingData = []; // Store tracking history
        this.userSettings = { kmRate: 3.00, currency: 'CZK' }; // Default settings

        this.init();
    }

    async init() {
        console.log('Initializing RouteOptimizer...');

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initAfterDOM();
            });
        } else {
            this.initAfterDOM();
        }
    }

    initAfterDOM() {
        console.log('DOM ready, starting initialization...');
        
        this.initTheme();
        this.bindEvents();
        this.loadFromStorage().then(() => {
            this.checkForSharedRoute();
            this.registerServiceWorker();
            console.log('RouteOptimizer initialization complete');
        }).catch(error => {
            console.error('Error during initialization:', error);
        });
    }

    initTheme() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.setTheme(theme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                // Only auto-switch if user hasn't manually set a preference
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }


    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    initMap() {
        // Initialize map immediately
        this.mapInitialized = false;
    }



    bindEvents() {
        console.log('Binding events...');

        // Start point input with autocomplete
        const startPointInput = document.getElementById('startPointInput');
        if (startPointInput) {
            let autocompleteTimeout;
            startPointInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                clearTimeout(autocompleteTimeout);

                if (query.length >= 2) {
                    autocompleteTimeout = setTimeout(() => {
                        this.showAutocomplete('startPoint', query);
                    }, 300);
                } else {
                    this.hideAutocomplete('startPoint');
                }

                // Clear starting point if input is empty
                if (!query) {
                    this.startingPoint = null;
                    this.saveToStorage();
                }
            });

            startPointInput.addEventListener('keydown', (e) => {
                this.handleAutocompleteKeydown(e, 'startPoint');
            });

            startPointInput.addEventListener('blur', () => {
                // Delay hiding to allow click on suggestions
                setTimeout(() => {
                    this.hideAutocomplete('startPoint');
                }, 150);
            });
        }

        // Round trip checkbox
        const roundTripCheckbox = document.getElementById('roundTripCheckbox');
        if (roundTripCheckbox) {
            roundTripCheckbox.addEventListener('change', (e) => {
                this.roundTrip = e.target.checked;
                this.saveToStorage();
                this.updateButtons();
                console.log('Round trip:', this.roundTrip);
            });
        }

        // Save route button
        const saveRouteBtn = document.getElementById('saveRouteBtn');
        if (saveRouteBtn) {
            saveRouteBtn.addEventListener('click', () => {
                this.saveCurrentRoute();
            });
        }

        // Toggle saved routes
        const toggleSavedRoutesBtn = document.getElementById('toggleSavedRoutesBtn');
        if (toggleSavedRoutesBtn) {
            toggleSavedRoutesBtn.addEventListener('click', () => {
                this.toggleSavedRoutes();
            });
        }

        // Use current location button
        const useCurrentLocationBtn = document.getElementById('useCurrentLocationBtn');
        if (useCurrentLocationBtn) {
            useCurrentLocationBtn.addEventListener('click', () => {
                this.useCurrentLocation();
            });
        }

        // Add stop button
        const addStopBtn = document.getElementById('addStopBtn');
        if (addStopBtn) {
            addStopBtn.addEventListener('click', () => {
                console.log('Add stop button clicked');
                this.addStop();
            });
        } else {
            console.error('addStopBtn not found');
        }

        // Stop input with autocomplete
        const stopInput = document.getElementById('stopInput');
        if (stopInput) {
            let stopAutocompleteTimeout;
            stopInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                clearTimeout(stopAutocompleteTimeout);

                if (query.length >= 2) {
                    stopAutocompleteTimeout = setTimeout(() => {
                        this.showAutocomplete('stop', query);
                    }, 300);
                } else {
                    this.hideAutocomplete('stop');
                }
            });

            stopInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !this.isAutocompleteVisible('stop')) {
                    console.log('Enter key pressed in stop input');
                    this.addStop();
                } else {
                    this.handleAutocompleteKeydown(e, 'stop');
                }
            });

            stopInput.addEventListener('blur', () => {
                // Delay hiding to allow click on suggestions
                setTimeout(() => {
                    this.hideAutocomplete('stop');
                }, 150);
            });
        } else {
            console.error('stopInput not found');
        }

        // Optimize button
        const optimizeBtn = document.getElementById('optimizeBtn');
        if (optimizeBtn) {
            optimizeBtn.addEventListener('click', () => {
                console.log('Optimize button clicked');
                this.optimizeRoute();
            });
        } else {
            console.error('optimizeBtn not found');
        }

        // Reverse route button
        const reverseRouteBtn = document.getElementById('reverseRouteBtn');
        if (reverseRouteBtn) {
            reverseRouteBtn.addEventListener('click', () => {
                console.log('Reverse route button clicked');
                this.reverseRoute();
            });
        } else {
            console.error('reverseRouteBtn not found');
        }

        // Navigate button
        const navigateBtn = document.getElementById('navigateBtn');
        if (navigateBtn) {
            navigateBtn.addEventListener('click', () => {
                console.log('Navigate button clicked');
                this.startNavigation();
            });
        } else {
            console.error('navigateBtn not found');
        }

        // Tracking section
        const toggleTrackingBtn = document.getElementById('toggleTrackingBtn');
        if (toggleTrackingBtn) {
            toggleTrackingBtn.addEventListener('click', () => {
                this.toggleTrackingSection();
            });
        }

        const kmRateInput = document.getElementById('kmRateInput');
        if (kmRateInput) {
            kmRateInput.value = this.userSettings.kmRate;
            kmRateInput.addEventListener('change', (e) => {
                this.userSettings.kmRate = parseFloat(e.target.value) || 3.00;
                localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
                this.saveUserSettings();
                this.updateTrackingStats();
            });
        }

        // Month selector
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        if (monthSelect && yearSelect) {
            const now = new Date();
            monthSelect.value = now.getMonth();
            yearSelect.value = now.getFullYear();

            const updateMonthView = () => {
                this.updateTrackingStats();
                this.updateTrackingHistory();
            };

            monthSelect.addEventListener('change', updateMonthView);
            yearSelect.addEventListener('change', updateMonthView);
        }

        const endRouteBtn = document.getElementById('endRouteBtn');
        if (endRouteBtn) {
            endRouteBtn.addEventListener('click', () => {
                const record = this.stopRouteTracking();
                if (record) {
                    alert(`Trasa ukončena!\nUjeté km: ${record.distanceDriven.toFixed(1)}\nVýdělek: ${record.earnings.toFixed(0)} CZK`);
                }
                this.updateTrackingUI();
            });
        }
        
        // Mode toggle buttons
        const singleModeBtn = document.getElementById('singleModeBtn');
        if (singleModeBtn) {
            singleModeBtn.addEventListener('click', () => {
                console.log('Single mode button clicked');
                this.switchMode('single');
            });
        } else {
            console.error('singleModeBtn not found');
        }

        const bulkModeBtn = document.getElementById('bulkModeBtn');
        if (bulkModeBtn) {
            bulkModeBtn.addEventListener('click', () => {
                console.log('Bulk mode button clicked');
                this.switchMode('bulk');
            });
        } else {
            console.error('bulkModeBtn not found');
        }

        // Parse button
        const parseTextBtn = document.getElementById('parseTextBtn');
        if (parseTextBtn) {
            parseTextBtn.addEventListener('click', () => {
                console.log('Parse text button clicked');
                this.parseBulkText();
            });
        } else {
            console.error('parseTextBtn not found');
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                console.log('Theme toggle clicked');
                this.toggleTheme();
            });
        } else {
            console.error('themeToggle not found');
        }



        console.log('All events bound successfully');
    }

    switchMode(mode) {
        console.log('Switching to mode:', mode);
        
        const singleBtn = document.getElementById('singleModeBtn');
        const bulkBtn = document.getElementById('bulkModeBtn');
        const singleInput = document.getElementById('singleInput');
        const bulkInput = document.getElementById('bulkInput');
        
        if (!singleBtn || !bulkBtn || !singleInput || !bulkInput) {
            console.error('Mode switch elements not found:', {
                singleBtn: !!singleBtn,
                bulkBtn: !!bulkBtn,
                singleInput: !!singleInput,
                bulkInput: !!bulkInput
            });
            return;
        }
        
        if (mode === 'single') {
            console.log('Switching to single mode');
            singleBtn.classList.add('active');
            bulkBtn.classList.remove('active');
            singleInput.style.display = 'flex';
            bulkInput.style.display = 'none';
        } else {
            console.log('Switching to bulk mode');
            singleBtn.classList.remove('active');
            bulkBtn.classList.add('active');
            singleInput.style.display = 'none';
            bulkInput.style.display = 'flex';
        }
        
        console.log('Mode switch completed');
    }



    async addStop() {
        console.log('addStop called');
        
        const input = document.getElementById('stopInput');
        if (!input) {
            console.error('stopInput element not found');
            return;
        }
        
        const address = input.value.trim();
        console.log('Address to add:', address);
        
        if (!address) {
            console.log('Empty address, returning');
            return;
        }

        try {
            console.log('Geocoding address...');
            const coords = await this.geocodeAddress(address);
            console.log('Geocoding result:', coords);
            
            if (coords) {
                const stop = {
                    id: Date.now(),
                    address: address,
                    lat: coords.lat,
                    lng: coords.lng,
                    priority: false,
                    timeLimit: null
                };
                
                console.log('Adding stop:', stop);
                this.stops.push(stop);
                this.updateStopsList();

                this.saveToStorage();
                this.updateButtons();
                
                input.value = '';
                console.log('Stop added successfully');
            } else {
                console.error('No coordinates found for address');
                alert('Adresu se nepodařilo najít. Zkuste to prosím znovu.');
            }
        } catch (error) {
            console.error('Error in addStop:', error);
            alert('Adresu se nepodařilo najít. Zkuste to prosím znovu.');
        }
    }

    async geocodeAddress(address) {
        try {
            // Try with Czech Republic bias first
            let response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=cz&limit=3&bounded=1&viewbox=12.09,51.06,18.87,48.55`
            );
            let data = await response.json();

            if (data && data.length > 0) {
                // Return the first result
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }

            // If no results in Czech Republic, try worldwide search
            console.log('No Czech results, trying worldwide search for:', address);
            response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=3`
            );
            data = await response.json();

            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }

            console.warn('No geocoding results found for address:', address);
            return null;
        } catch (error) {
            console.error('Geocoding error for address:', address, error);
            return null;
        }
    }

    async setStartingPoint(address) {
        console.log('Setting starting point:', address);
        try {
            const coords = await this.geocodeAddress(address);
            if (coords) {
                this.startingPoint = {
                    address: address,
                    lat: coords.lat,
                    lng: coords.lng
                };
                this.saveToStorage();
                console.log('Starting point set successfully');
            } else {
                console.error('Could not geocode starting point address');
                // Don't show alert - user can select from suggestions
            }
        } catch (error) {
            console.error('Error setting starting point:', error);
            // Don't show alert - user can select from suggestions
        }
    }

    async useCurrentLocation() {
        console.log('Requesting current location...');

        if (!navigator.geolocation) {
            alert('Geolokace není podporována ve vašem prohlížeči.');
            return;
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                });
            });

            const { latitude, longitude } = position.coords;
            console.log('Current position:', latitude, longitude);

            // Reverse geocode to get address
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            const address = data.display_name || `Pozice: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

            this.startingPoint = {
                address: address,
                lat: latitude,
                lng: longitude
            };

            // Update the input field
            const startPointInput = document.getElementById('startPointInput');
            if (startPointInput) {
                startPointInput.value = address;
            }

            this.saveToStorage();
            console.log('Current location set as starting point');

        } catch (error) {
            console.error('Error getting current location:', error);
            if (error.code === 1) {
                alert('Přístup k poloze byl zamítnut. Povolte přístup k poloze v nastavení prohlížeče.');
            } else if (error.code === 2) {
                alert('Pozici se nepodařilo získat. Zkontrolujte připojení k internetu.');
            } else {
                alert('Chyba při získávání aktuální pozice.');
            }
        }
    }

    async showAutocomplete(type, query) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=cz&limit=5&dedupe=1`
            );
            const results = await response.json();

            const dropdown = document.getElementById(`${type}Autocomplete`);
            if (!dropdown) return;

            dropdown.innerHTML = '';

            if (results.length > 0) {
                results.forEach((result, index) => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.textContent = result.display_name;
                    item.dataset.lat = result.lat;
                    item.dataset.lng = result.lon;
                    item.dataset.address = result.display_name;

                    item.addEventListener('click', () => {
                        this.selectAutocompleteItem(type, result.display_name, result.lat, result.lon);
                    });

                    dropdown.appendChild(item);
                });

                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
        } catch (error) {
            console.error('Autocomplete search failed:', error);
        }
    }

    hideAutocomplete(type) {
        const dropdown = document.getElementById(`${type}Autocomplete`);
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    isAutocompleteVisible(type) {
        const dropdown = document.getElementById(`${type}Autocomplete`);
        return dropdown && dropdown.style.display === 'block';
    }

    truncateAddress(address, maxLength = 45) {
        if (address.length <= maxLength) return address;

        // Try to truncate at word boundary
        const truncated = address.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');

        if (lastSpace > maxLength * 0.7) {
            return address.substring(0, lastSpace) + '...';
        }

        return truncated + '...';
    }

    // Test method for SMS parsing (can be called from console for testing)
    testSmsParsing() {
        const testTexts = [
            "Doručit na Václavské náměstí 123, Praha 1",
            "Zákazník: Nové Město 45, Brno, 602 00",
            "Adresa: Hlavní třída 67, Ostrava, 701 00",
            "Doručení: Masarykova 12/34, Plzeň",
            "Klient žádá doručení na adresu: Náměstí Míru 5, Liberec, 460 01"
        ];

        console.log('Testing SMS parsing with sample Czech addresses:');
        testTexts.forEach((text, index) => {
            console.log(`\nTest ${index + 1}: "${text}"`);
            const addresses = this.extractAddresses(text);
            console.log('Extracted addresses:', addresses);
        });
    }

    // Test method for route optimization with Czech cities (can be called from console)
    async testCzechCitiesOptimization() {
        console.log('Testing route optimization with Czech cities...');

        // Czech cities with their approximate coordinates
        const testCities = [
            { address: 'Zlín', lat: 49.2265, lng: 17.6707 },
            { address: 'Bzenec', lat: 48.9736, lng: 17.2669 },
            { address: 'Vsetín', lat: 49.3389, lng: 17.9962 },
            { address: 'Uherský Brod', lat: 49.0251, lng: 17.6472 },
            { address: 'Hodonín', lat: 48.8489, lng: 17.1324 }
        ];

        // Create test stops
        const testStops = testCities.map((city, index) => ({
            id: index + 1,
            address: city.address,
            lat: city.lat,
            lng: city.lng,
            priority: false,
            timeLimit: null
        }));

        console.log('Test cities:', testStops.map(s => s.address));

        // Test original order
        const originalDistance = this.calculateTotalRouteDistance(testStops);
        console.log('Original order distance:', originalDistance.toFixed(2), 'km');

        // Create a temporary instance for testing nearest neighbor
        const tempInstance = { stops: testStops, calculateDistance: this.calculateDistance };
        const nnRoute = this.nearestNeighborRoute.call(tempInstance);
        const nnDistance = this.calculateTotalRouteDistance(nnRoute);
        console.log('Nearest neighbor route:', nnRoute.map(s => s.address));
        console.log('Nearest neighbor distance:', nnDistance.toFixed(2), 'km');

        // Test 2-opt optimization
        const optRoute = this.twoOptOptimization([...nnRoute]);
        const optDistance = this.calculateTotalRouteDistance(optRoute);
        console.log('2-opt optimized route:', optRoute.map(s => s.address));
        console.log('2-opt distance:', optDistance.toFixed(2), 'km');

        const improvement = originalDistance - optDistance;
        console.log('Total improvement:', improvement.toFixed(2), 'km (', ((improvement / originalDistance) * 100).toFixed(1), '%)');

        return {
            original: { route: testStops.map(s => s.address), distance: originalDistance },
            nearestNeighbor: { route: nnRoute.map(s => s.address), distance: nnDistance },
            optimized: { route: optRoute.map(s => s.address), distance: optDistance }
        };
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in km
    }

    calculateTotalRouteDistance(route) {
        if (!route || route.length < 2) return 0;

        let totalDistance = 0;
        for (let i = 0; i < route.length - 1; i++) {
            totalDistance += this.calculateDistance(
                route[i].lat, route[i].lng,
                route[i + 1].lat, route[i + 1].lng
            );
        }

        // For round trips, add distance back to start
        if (this.roundTrip && route.length > 2) {
            totalDistance += this.calculateDistance(
                route[route.length - 1].lat, route[route.length - 1].lng,
                route[0].lat, route[0].lng
            );
        }

        return totalDistance;
    }

    fallbackOptimizeStops() {
        console.log('Using fallback optimization: 2-opt algorithm with full route consideration');

        if (this.stops.length < 2) {
            console.log('Not enough stops for optimization');
            return;
        }

        const originalOrder = [...this.stops];
        const originalDistance = this.calculateCompleteRouteDistance();
        console.log('Original order:', originalOrder.map(s => s.address));
        console.log('Original total distance:', originalDistance.toFixed(2), 'km');

        // Start with nearest neighbor as initial solution
        const initialRoute = this.nearestNeighborRoute();
        // Temporarily set stops to initial route to calculate complete distance
        const originalStops = this.stops;
        this.stops = initialRoute;
        const initialDistance = this.calculateCompleteRouteDistance();
        this.stops = originalStops;
        console.log('Initial route from nearest neighbor:', initialRoute.map(s => s.address));
        console.log('Initial distance:', initialDistance.toFixed(2), 'km');

        // Apply 2-opt improvement
        const optimizedRoute = this.twoOptOptimization(initialRoute);
        // Temporarily set stops to optimized route to calculate complete distance
        this.stops = optimizedRoute;
        const optimizedDistance = this.calculateCompleteRouteDistance();
        this.stops = originalStops;
        console.log('Optimized route from full route optimization:', optimizedRoute.map(s => s.address));
        console.log('Optimized distance:', optimizedDistance.toFixed(2), 'km');

        const improvement = originalDistance - optimizedDistance;
        console.log('Total improvement:', improvement.toFixed(2), 'km (', ((improvement / originalDistance) * 100).toFixed(1), '%)');

        this.stops = optimizedRoute;

        // Update the UI to reflect the new order
        this.updateStopsList();

        // Check if the order actually changed
        const orderChanged = !originalOrder.every((stop, index) => stop.id === optimizedRoute[index].id);
        console.log('Order was changed:', orderChanged);
        console.log('Final stops order:', this.stops.map(s => s.address));
    }

    optimizeFullRoute() {
        // Create a full route array including starting point for optimization
        const fullRoute = this.startingPoint ? [this.startingPoint, ...this.stops] : [...this.stops];

        if (fullRoute.length < 3) {
            return this.stops; // Not enough points for meaningful optimization
        }

        console.log('Optimizing full route:', fullRoute.map(p => p.address || 'Starting Point'));

        // Start with nearest neighbor from starting point
        const initialRoute = this.nearestNeighborFromStart(fullRoute);
        console.log('Initial full route:', initialRoute.map(p => p.address || 'Starting Point'));

        // Apply 2-opt to the stops only (keep starting point fixed)
        const stopsOnly = initialRoute.slice(this.startingPoint ? 1 : 0);
        const optimizedStops = this.twoOptOptimization([...stopsOnly]);

        return optimizedStops;
    }

    nearestNeighborFromStart(fullRoute) {
        if (!this.startingPoint) {
            return this.nearestNeighborRoute();
        }

        // Start from the warehouse (first point)
        const startPoint = fullRoute[0];
        const stopsOnly = fullRoute.slice(1);

        const optimizedRoute = [startPoint];
        const remainingStops = [...stopsOnly];

        // Nearest neighbor algorithm starting from warehouse with priority consideration
        while (remainingStops.length > 0) {
            const currentPoint = optimizedRoute[optimizedRoute.length - 1];
            let nearestIndex = 0;
            let nearestWeightedDistance = this.calculateWeightedDistance(
                currentPoint, remainingStops[0]
            );

            // Find the nearest remaining stop (considering priority)
            for (let i = 1; i < remainingStops.length; i++) {
                const weightedDistance = this.calculateWeightedDistance(
                    currentPoint, remainingStops[i]
                );
                if (weightedDistance < nearestWeightedDistance) {
                    nearestWeightedDistance = weightedDistance;
                    nearestIndex = i;
                }
            }

            // Add the nearest stop to the route
            optimizedRoute.push(remainingStops[nearestIndex]);
            remainingStops.splice(nearestIndex, 1);
        }

        // Return only the stops part (without the starting point)
        return optimizedRoute.slice(1);
    }

    nearestNeighborRoute() {
        // Start from the first stop
        const optimizedStops = [this.stops[0]];
        const remainingStops = [...this.stops.slice(1)];

        // Nearest neighbor algorithm with priority consideration
        while (remainingStops.length > 0) {
            const currentStop = optimizedStops[optimizedStops.length - 1];
            let nearestIndex = 0;
            let nearestWeightedDistance = this.calculateWeightedDistance(
                currentStop, remainingStops[0]
            );

            // Find the nearest remaining stop (considering priority)
            for (let i = 1; i < remainingStops.length; i++) {
                const weightedDistance = this.calculateWeightedDistance(
                    currentStop, remainingStops[i]
                );
                if (weightedDistance < nearestWeightedDistance) {
                    nearestWeightedDistance = weightedDistance;
                    nearestIndex = i;
                }
            }

            // Add the nearest stop to the optimized route
            optimizedStops.push(remainingStops[nearestIndex]);
            remainingStops.splice(nearestIndex, 1);
        }

        return optimizedStops;
    }

    calculateWeightedDistance(fromStop, toStop) {
        const baseDistance = this.calculateDistance(
            fromStop.lat, fromStop.lng,
            toStop.lat, toStop.lng
        );

        // Priority stops get a bonus (negative weight) to appear earlier
        // This effectively reduces their distance by 20% making them more likely to be chosen
        const priorityBonus = toStop.priority ? -0.2 : 0;

        return baseDistance * (1 + priorityBonus);
    }

    twoOptOptimization(route) {
        let improved = true;
        let iterations = 0;
        const maxIterations = 1000; // Prevent infinite loops

        while (improved && iterations < maxIterations) {
            improved = false;
            iterations++;

            // Try all possible 2-opt swaps
            for (let i = 1; i < route.length - 1; i++) {
                for (let j = i + 1; j < route.length; j++) {
                    // Calculate current complete route distance and priority score
                    const originalStops = this.stops;
                    this.stops = route;
                    const currentTotalDistance = this.calculateCompleteRouteDistance();
                    const currentPriorityScore = this.calculatePriorityScore(route);
                    this.stops = originalStops;

                    // Create a copy of the route and apply the 2-opt swap
                    const testRoute = [...route];
                    const reversedSegment = testRoute.slice(i, j + 1).reverse();
                    testRoute.splice(i, j - i + 1, ...reversedSegment);

                    // Calculate new complete route distance and priority score
                    this.stops = testRoute;
                    const newTotalDistance = this.calculateCompleteRouteDistance();
                    const newPriorityScore = this.calculatePriorityScore(testRoute);
                    this.stops = originalStops;

                    // Prefer routes that either:
                    // 1. Have better distance, or
                    // 2. Have same distance but better priority score
                    const distanceImproved = newTotalDistance < currentTotalDistance;
                    const priorityImproved = (Math.abs(newTotalDistance - currentTotalDistance) < 0.1) &&
                                           (newPriorityScore > currentPriorityScore);

                    if (distanceImproved || priorityImproved) {
                        route.splice(i, j - i + 1, ...reversedSegment);
                        improved = true;
                        const reason = distanceImproved ?
                            `saved ${(currentTotalDistance - newTotalDistance).toFixed(2)} km` :
                            `improved priority score by ${newPriorityScore - currentPriorityScore}`;
                        console.log(`2-opt improvement at iteration ${iterations}: swapped ${i} to ${j}, ${reason}`);
                        break;
                    }
                }
                if (improved) break;
            }
        }

        console.log(`2-opt completed after ${iterations} iterations`);
        return route;
    }

    calculatePriorityScore(route) {
        // Calculate a score based on how early priority stops appear
        // Higher score = better (priority stops appear earlier)
        let score = 0;
        for (let i = 0; i < route.length; i++) {
            if (route[i].priority) {
                // Priority stops get higher score for appearing earlier
                score += (route.length - i) * 10;
            }
        }
        return score;
    }

    async optimizeRegularRouteOrder() {
        try {
            // Prepare coordinates for trip optimization (without roundtrip)
            let coordinates = [];

            if (this.startingPoint) {
                coordinates.push(`${this.startingPoint.lng},${this.startingPoint.lat}`);
            }

            // Add all stops
            coordinates.push(...this.stops.map(stop => `${stop.lng},${stop.lat}`));

            // Remove duplicates
            coordinates = this.removeDuplicateCoordinates(coordinates);

            if (coordinates.length < 2) {
                console.log('Not enough coordinates for optimization');
                return;
            }

            // Use OSRM trip service for optimization - allow full reordering
            const url = `https://router.project-osrm.org/trip/v1/driving/${coordinates.join(';')}?overview=full&geometries=geojson&steps=true`;

            console.log('Requesting route optimization from:', url);

            const response = await fetch(url);
            if (!response.ok) {
                console.error('OSRM optimization failed');
                return;
            }

            const data = await response.json();
            console.log('Optimization response:', data);
            console.log('Request URL:', url);
            console.log('Coordinates sent:', coordinates);

            if (data.trips && data.trips.length > 0 && data.trips[0].waypoints) {
                console.log('Original stops order:', this.stops.map(s => s.address));
                console.log('OSRM waypoints:', data.trips[0].waypoints);

                // Check if waypoints are actually reordered
                const waypointOrder = data.trips[0].waypoints.map(wp => wp.waypoint_index);
                console.log('Waypoint order from OSRM:', waypointOrder);
                console.log('Original coordinates sent:', coordinates);

                // If waypoints are in original order (0,1,2,3...), OSRM didn't optimize
                const isOptimized = !waypointOrder.every((index, i) => index === i);
                console.log('Route was optimized by OSRM:', isOptimized);

                // Always apply our optimization as final step to ensure best result
                console.log('Applying final optimization to ensure best route...');
                this.fallbackOptimizeStops();

                // Reorder stops based on optimized waypoints
                const optimizedStops = [];
                const usedStopIds = new Set();

                // Process all waypoints (OSRM can now reorder everything)
                const waypointsToProcess = data.trips[0].waypoints;

                for (const waypoint of waypointsToProcess) {
                    const wpCoord = {
                        lat: waypoint.location[1],
                        lng: waypoint.location[0]
                    };

                    let closestStop = null;
                    let minDistance = Infinity;

                    for (const stop of this.stops) {
                        if (usedStopIds.has(stop.id)) continue;

                        const distance = this.calculateDistance(
                            stop.lat, stop.lng,
                            wpCoord.lat, wpCoord.lng
                        );

                        if (distance < minDistance && distance < 1.0) { // Within 1 km
                            minDistance = distance;
                            closestStop = stop;
                        }
                    }

                    if (closestStop) {
                        optimizedStops.push(closestStop);
                        usedStopIds.add(closestStop.id);
                        console.log(`Mapped waypoint ${waypoint.waypoint_index} to stop: ${closestStop.address}`);
                    } else {
                        console.warn(`Could not map waypoint ${waypoint.waypoint_index} to any stop`);
                    }
                }

                // Add any remaining stops that weren't matched
                for (const stop of this.stops) {
                    if (!usedStopIds.has(stop.id)) {
                        optimizedStops.push(stop);
                        console.log(`Added unmapped stop: ${stop.address}`);
                    }
                }

                if (optimizedStops.length === this.stops.length) {
                    this.stops = optimizedStops;
                    console.log('Stops reordered for regular route optimization:', this.stops.map(s => s.address));
                } else {
                    console.warn('Stop count mismatch, keeping original order');
                }
            } else {
                console.warn('No waypoints returned from OSRM trip service');
                // Fallback: implement simple nearest neighbor optimization
                this.fallbackOptimizeStops();
            }

        } catch (error) {
            console.error('Error optimizing regular route:', error);
        }
    }

    async reorderStopsByOptimizedRoute() {
        if (!this.optimizedRoute) return;

        try {
            // First, try to reorder based on OSRM result if available
            if (this.roundTrip && this.optimizedRoute.waypoints) {
                // For round trips, OSRM trip service returns waypoints in optimized order
                // Map the optimized waypoints back to our stops
                const waypointCoords = this.optimizedRoute.waypoints.map(wp => ({
                    lat: wp.location[1],
                    lng: wp.location[0]
                }));

                // Create a new stops array in the optimized order
                const optimizedStops = [];
                const usedStopIds = new Set();

                for (const wpCoord of waypointCoords) {
                    // Find the closest unused stop to this waypoint
                    let closestStop = null;
                    let minDistance = Infinity;

                    for (const stop of this.stops) {
                        if (usedStopIds.has(stop.id)) continue;

                        const distance = this.calculateDistance(
                            stop.lat, stop.lng,
                            wpCoord.lat, wpCoord.lng
                        );

                        if (distance < minDistance && distance < 0.1) { // Within 100 meters
                            minDistance = distance;
                            closestStop = stop;
                        }
                    }

                    if (closestStop) {
                        optimizedStops.push(closestStop);
                        usedStopIds.add(closestStop.id);
                    }
                }

                // If we couldn't map all waypoints, keep remaining stops in original order
                for (const stop of this.stops) {
                    if (!usedStopIds.has(stop.id)) {
                        optimizedStops.push(stop);
                    }
                }

                this.stops = optimizedStops;
                console.log('Stops reordered based on OSRM round trip result:', this.stops.map(s => s.address));
            }

            // Always apply our optimization as final step to ensure best result
            console.log('Applying final optimization to ensure best route...');
            this.fallbackOptimizeStops();

            // UI is already updated by fallbackOptimizeStops()

        } catch (error) {
            console.error('Error reordering stops:', error);
        }
    }

    generateUserId() {
        // Generate a consistent anonymous user ID based on browser fingerprint
        let userId = localStorage.getItem('routeOptimizerUserId');
        if (!userId) {
            userId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('routeOptimizerUserId', userId);
        }
        return userId;
    }

    // Supabase integration methods
    async saveRouteToSupabase(routeData) {
        if (!window.supabaseReady || !window.supabaseClient) {
            throw new Error('Supabase not ready');
        }

        try {
            console.log('Saving route to Supabase:', routeData.name, 'User ID:', this.userId);

            const { data, error } = await window.supabaseClient
                .from('routes')
                .insert([{
                    user_id: this.userId,
                    name: routeData.name,
                    stops: routeData.stops,
                    starting_point: routeData.startingPoint,
                    round_trip: routeData.roundTrip,
                    share_token: this.generateShareToken()
                }])
                .select()
                .single();

            if (error) {
                console.error('Supabase insert error:', error);
                throw error;
            }

            console.log('Route saved successfully:', data);
            return data;
        } catch (error) {
            console.error('Error saving route to Supabase:', error);
            throw error;
        }
    }

    async loadRoutesFromSupabase() {
        if (!window.supabaseReady || !window.supabaseClient) {
            console.warn('Supabase not ready, skipping cloud load');
            return [];
        }

        try {
            console.log('Loading routes from Supabase for user:', this.userId);

            const { data: userRoutes, error: userError } = await window.supabaseClient
                .from('routes')
                .select('*')
                .eq('user_id', this.userId)
                .order('created_at', { ascending: false });

            if (userError) {
                console.error('Supabase user routes error:', userError);
                throw userError;
            }

            // Load public routes
            const { data: publicRoutes, error: publicError } = await window.supabaseClient
                .from('routes')
                .select('*')
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (publicError) {
                console.error('Supabase public routes error:', publicError);
                // Don't throw for public routes error
            }

            const allRoutes = [...(userRoutes || []), ...(publicRoutes || [])];

            // Remove duplicates (user's own public routes)
            const uniqueRoutes = allRoutes.filter((route, index, self) =>
                index === self.findIndex(r => r.id === route.id)
            );

            console.log('Loaded routes from Supabase:', uniqueRoutes.length, 'routes');
            return uniqueRoutes;
        } catch (error) {
            console.error('Error loading routes from Supabase:', error);
            return [];
        }
    }

    async deleteRouteFromSupabase(routeId) {
        if (!window.supabaseReady || !window.supabaseClient) {
            throw new Error('Supabase not ready');
        }

        try {
            console.log('Deleting route from Supabase:', routeId, 'User ID:', this.userId);

            const { error } = await window.supabaseClient
                .from('routes')
                .delete()
                .eq('id', routeId)
                .eq('user_id', this.userId); // Ensure user can only delete their own routes

            if (error) {
                console.error('Supabase delete error:', error);
                throw error;
            }

            console.log('Route deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting route from Supabase:', error);
            throw error;
        }
    }

    async shareRoute(routeId) {
        try {
            const route = this.savedRoutes.find(r => r.id === routeId);
            if (!route) throw new Error('Route not found');

            // Generate shareable URL
            const shareUrl = `${window.location.origin}?route=${route.share_token || routeId}`;
            await navigator.clipboard.writeText(shareUrl);
            // Share URL copied to clipboard
        } catch (error) {
            console.error('Error sharing route:', error);
            alert('Chyba při sdílení trasy');
        }
    }

    async loadSharedRoute(shareToken) {
        if (!window.supabaseReady || !window.supabaseClient) {
            alert('Supabase není k dispozici');
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('routes')
                .select('*')
                .eq('share_token', shareToken)
                .single();

            if (error) throw error;

            // Load the shared route
            this.loadRouteFromData(data);
            // Shared route loaded successfully
        } catch (error) {
            console.error('Error loading shared route:', error);
            alert('Chyba při načítání sdílené trasy');
        }
    }

    loadRouteFromData(routeData) {
        this.stops = routeData.stops || [];
        this.startingPoint = routeData.starting_point;
        this.roundTrip = routeData.round_trip || false;
        this.optimizedRoute = null;

        // Update UI
        this.updateStopsList();
        this.updateButtons();

        // Update form inputs
        const startPointInput = document.getElementById('startPointInput');
        if (startPointInput && this.startingPoint) {
            startPointInput.value = this.startingPoint.address;
        }

        const roundTripCheckbox = document.getElementById('roundTripCheckbox');
        if (roundTripCheckbox) {
            roundTripCheckbox.checked = this.roundTrip;
        }
    }

    generateShareToken() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    async trackRouteUsage(routeId, action) {
        if (!window.supabaseReady || !window.supabaseClient) {
            return; // Silently skip if Supabase not available
        }

        try {
            await window.supabaseClient.from('route_usage').insert([{
                route_id: routeId,
                user_id: this.userId,
                action: action
            }]);
        } catch (error) {
            console.error('Error tracking route usage:', error);
            // Don't show error to user - tracking is not critical
        }
    }

    async checkForSharedRoute() {
        const urlParams = new URLSearchParams(window.location.search);
        const shareToken = urlParams.get('route');

        if (shareToken) {
            try {
                await this.loadSharedRoute(shareToken);
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                alert('Chyba při načítání sdílené trasy');
            }
        }
    }



    // Offline support methods
    async syncRoutes() {
        if (!this.isOnline) return;

        try {
            // Load routes from Supabase
            const remoteRoutes = await this.loadRoutesFromSupabase();

            // Merge with local routes (remote takes precedence for conflicts)
            const mergedRoutes = this.mergeRoutes(this.savedRoutes, remoteRoutes);
            this.savedRoutes = mergedRoutes;
            this.updateSavedRoutesList();

            // Save merged routes to localStorage as backup
            localStorage.setItem('routeOptimizerSavedRoutes', JSON.stringify(this.savedRoutes));
        } catch (error) {
            console.error('Error syncing routes:', error);
        }
    }

    mergeRoutes(localRoutes, remoteRoutes) {
        const merged = [...remoteRoutes];
        const remoteIds = new Set(remoteRoutes.map(r => r.id));

        // Add local routes that don't exist remotely
        localRoutes.forEach(localRoute => {
            if (!remoteIds.has(localRoute.id)) {
                merged.push(localRoute);
            }
        });

        return merged;
    }

    async saveCurrentRoute() {
        if (this.stops.length < 2) {
            alert('Pro uložení trasy potřebujete alespoň 2 zastávky.');
            return;
        }

        const routeName = prompt('Zadejte název trasy:', `Trasa ${this.savedRoutes.length + 1}`);
        if (!routeName || routeName.trim() === '') {
            return;
        }

        try {
            const routeData = {
                name: routeName.trim(),
                stops: [...this.stops],
                startingPoint: this.startingPoint,
                roundTrip: this.roundTrip
            };

            // Check for duplicate names locally
            const existingRoute = this.savedRoutes.find(route => route.name === routeData.name);
            if (existingRoute) {
                if (!confirm(`Trasa s názvem "${routeData.name}" již existuje. Chcete ji přepsat?`)) {
                    return;
                }
                // Delete existing route first
                await this.deleteRouteFromSupabase(existingRoute.id);
                this.savedRoutes = this.savedRoutes.filter(route => route.id !== existingRoute.id);
            }

            // Save to Supabase
            const savedRoute = await this.saveRouteToSupabase(routeData);

            // Add to local array
            this.savedRoutes.unshift(savedRoute); // Add to beginning
            this.updateSavedRoutesList();

            // Route saved successfully - visible in saved routes list
        } catch (error) {
            console.error('Error saving route:', error);
            alert('Chyba při ukládání trasy. Zkuste to znovu.');
        }
    }

    toggleSavedRoutes() {
        const savedRoutesList = document.getElementById('savedRoutesList');
        const toggleBtn = document.getElementById('toggleSavedRoutesBtn');

        if (savedRoutesList.style.display === 'none') {
            savedRoutesList.style.display = 'block';
            toggleBtn.textContent = '▲';
        } else {
            savedRoutesList.style.display = 'none';
            toggleBtn.textContent = '▼';
        }
    }

    updateSavedRoutesList() {
        const savedRoutesList = document.getElementById('savedRoutesList');
        savedRoutesList.innerHTML = '';

        if (this.savedRoutes.length === 0) {
            savedRoutesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: var(--spacing-md);">Žádné uložené trasy</p>';
            return;
        }

        // Routes are already sorted by Supabase (newest first)
        this.savedRoutes.forEach(route => {
            const routeItem = document.createElement('div');
            routeItem.className = 'saved-route-item';

            const createdDate = new Date(route.created_at).toLocaleDateString('cs-CZ');
            const stopCount = route.stops?.length || 0;
            const isPublic = route.is_public;

            routeItem.innerHTML = `
                <div class="saved-route-info">
                    <div class="saved-route-name">${route.name} ${isPublic ? '🌐' : ''}</div>
                    <div class="saved-route-details">${stopCount} zastávek • Vytvořeno: ${createdDate}</div>
                </div>
                <div class="saved-route-actions">
                    <button class="load-route-btn" data-id="${route.id}">Načíst</button>
                    <button class="share-route-btn" data-id="${route.id}" title="Sdílet trasu">📤</button>
                    <button class="delete-route-btn" data-id="${route.id}">✕</button>
                </div>
            `;

            savedRoutesList.appendChild(routeItem);
        });

        // Add event listeners
        savedRoutesList.querySelectorAll('.load-route-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.loadSavedRoute(e.target.dataset.id);
            });
        });

        savedRoutesList.querySelectorAll('.share-route-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.shareRoute(e.target.dataset.id);
            });
        });

        savedRoutesList.querySelectorAll('.delete-route-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.deleteSavedRoute(e.target.dataset.id);
            });
        });
    }

    updateSavedRoutesList() {
        const savedRoutesList = document.getElementById('savedRoutesList');
        savedRoutesList.innerHTML = '';

        if (this.savedRoutes.length === 0) {
            savedRoutesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: var(--spacing-md);">Žádné uložené trasy</p>';
            return;
        }

        // Routes are already sorted by Supabase (newest first)
        this.savedRoutes.forEach(route => {
            const routeItem = document.createElement('div');
            routeItem.className = 'saved-route-item';

            const createdDate = new Date(route.created_at).toLocaleDateString('cs-CZ');
            const stopCount = route.stops?.length || 0;
            const isPublic = route.is_public;

            routeItem.innerHTML = `
                <div class="saved-route-info">
                    <div class="saved-route-name">${route.name} ${isPublic ? '🌐' : ''}</div>
                    <div class="saved-route-details">${stopCount} zastávek • Vytvořeno: ${createdDate}</div>
                </div>
                <div class="saved-route-actions">
                    <button class="load-route-btn" data-id="${route.id}">Načíst</button>
                    <button class="share-route-btn" data-id="${route.id}" title="Sdílet trasu">📤</button>
                    <button class="delete-route-btn" data-id="${route.id}">✕</button>
                </div>
            `;

            savedRoutesList.appendChild(routeItem);
        });

        // Add event listeners
        savedRoutesList.querySelectorAll('.load-route-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.loadSavedRoute(e.target.dataset.id);
            });
        });

        savedRoutesList.querySelectorAll('.share-route-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.shareRoute(e.target.dataset.id);
            });
        });

        savedRoutesList.querySelectorAll('.delete-route-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.deleteSavedRoute(e.target.dataset.id);
            });
        });
    }

    loadSavedRoute(routeId) {
        const route = this.savedRoutes.find(r => r.id === routeId);
        if (!route) return;

        if (this.stops.length > 0) {
            if (!confirm('Načtením trasy přepíšete aktuální zastávky. Pokračovat?')) {
                return;
            }
        }

        this.loadRouteFromData(route);
        // Route loaded successfully - visible in UI

        // Track usage
        this.trackRouteUsage(routeId, 'load');
    }

    loadRouteFromData(routeData) {
        this.stops = routeData.stops || [];
        this.startingPoint = routeData.starting_point;
        this.roundTrip = routeData.round_trip || false;
        this.optimizedRoute = null; // Clear optimized route

        // Update UI
        this.updateStopsList();
        this.updateButtons();

        // Update form inputs
        const startPointInput = document.getElementById('startPointInput');
        if (startPointInput && this.startingPoint) {
            startPointInput.value = this.startingPoint.address;
        }

        const roundTripCheckbox = document.getElementById('roundTripCheckbox');
        if (roundTripCheckbox) {
            roundTripCheckbox.checked = this.roundTrip;
        }
    }

    async deleteSavedRoute(routeId) {
        const route = this.savedRoutes.find(r => r.id === routeId);
        if (!route) return;

        if (!confirm(`Opravdu chcete smazat trasu "${route.name}"?`)) {
            return;
        }

        try {
            await this.deleteRouteFromSupabase(routeId);
            this.savedRoutes = this.savedRoutes.filter(r => r.id !== routeId);
            this.updateSavedRoutesList();
            // Route deleted successfully - removed from saved routes list
        } catch (error) {
            alert('Chyba při mazání trasy. Zkuste to znovu.');
        }
    }

    selectAutocompleteItem(type, address, lat, lng) {
        const input = document.getElementById(`${type}Input`);
        if (input) {
            input.value = address;
        }

        this.hideAutocomplete(type);

        if (type === 'startPoint') {
            this.startingPoint = {
                address: address,
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            };
            this.saveToStorage();
        } else if (type === 'stop') {
            // For stop input, we'll handle this in the addStop method
            // The input event will trigger geocoding
        }
    }

    handleAutocompleteKeydown(e, type) {
        const dropdown = document.getElementById(`${type}Autocomplete`);
        if (!dropdown || dropdown.style.display === 'none') return;

        const items = dropdown.querySelectorAll('.autocomplete-item');
        let highlightedIndex = -1;

        // Find currently highlighted item
        items.forEach((item, index) => {
            if (item.classList.contains('highlighted')) {
                highlightedIndex = index;
                item.classList.remove('highlighted');
            }
        });

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
            if (items[highlightedIndex]) {
                items[highlightedIndex].classList.add('highlighted');
                items[highlightedIndex].scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlightedIndex = Math.max(highlightedIndex - 1, -1);
            if (highlightedIndex >= 0 && items[highlightedIndex]) {
                items[highlightedIndex].classList.add('highlighted');
            }
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            const item = items[highlightedIndex];
            if (item) {
                const address = item.dataset.address;
                const lat = item.dataset.lat;
                const lng = item.dataset.lng;
                this.selectAutocompleteItem(type, address, lat, lng);
            }
        } else if (e.key === 'Escape') {
            this.hideAutocomplete(type);
        }
    }



    removeStop(id) {
        this.stops = this.stops.filter(stop => stop.id !== id);
        this.updateStopsList();
        this.saveToStorage();
        this.updateButtons();

        // Load tracking data and settings
        this.loadTrackingData();
    }

    togglePriority(id) {
        const stop = this.stops.find(s => s.id === id);
        if (stop) {
            stop.priority = !stop.priority;
            if (!stop.priority) {
                stop.timeLimit = null; // Clear time limit when removing priority
            }
            this.updateStopsList();
            this.saveToStorage();
        }
    }

    updateStopsList() {
        const list = document.getElementById('stopsList');
        const emptyState = document.getElementById('emptyState');
        const stopCount = document.getElementById('stopCount');

        console.log('updateStopsList called with stops:', this.stops.map(s => s.address));
        console.log('DOM elements found - list:', !!list, 'emptyState:', !!document.getElementById('emptyState'), 'stopCount:', !!document.getElementById('stopCount'));

        if (!list) {
            console.error('stopsList element not found!');
            return;
        }

        // Add visual feedback that update is happening
        list.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        list.style.transform = 'scale(1.01)';
        setTimeout(() => {
            list.style.backgroundColor = '';
            list.style.transform = '';
        }, 300);

        list.innerHTML = '';

        // Update stop count
        if (stopCount) {
            stopCount.textContent = this.stops.length;
        }



        // Show/hide empty state
        if (this.stops.length === 0) {
            emptyState.style.display = 'block';
            list.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            list.style.display = 'block';

            this.stops.forEach((stop, index) => {
                const item = document.createElement('div');
                item.className = `stop-item ${stop.priority ? 'priority' : ''}`;
                // Drag and drop disabled for now
                // item.draggable = true;
                // item.setAttribute('data-stop-index', index);

                const leftSection = document.createElement('div');
                leftSection.className = 'stop-left';

                const priorityBtn = document.createElement('button');
                priorityBtn.className = `priority-btn ${stop.priority ? 'active' : ''}`;
                priorityBtn.setAttribute('data-id', stop.id);
                priorityBtn.title = 'Označit jako prioritu';
                priorityBtn.textContent = '⚡';

                const numberDiv = document.createElement('div');
                numberDiv.className = 'stop-number';
                numberDiv.textContent = index + 1;

                const contentDiv = document.createElement('div');
                contentDiv.className = 'stop-content';

                const addressDiv = document.createElement('div');
                addressDiv.className = 'stop-address';
                addressDiv.textContent = this.truncateAddress(stop.address);
                addressDiv.title = stop.address; // Show full address on hover

                const metaDiv = document.createElement('div');
                metaDiv.className = 'stop-meta';

                const indexSpan = document.createElement('span');
                indexSpan.className = 'stop-index';
                indexSpan.textContent = `Zastávka ${index + 1} z ${this.stops.length}`;

                metaDiv.appendChild(indexSpan);

                if (stop.priority) {
                    const priorityBadge = document.createElement('span');
                    priorityBadge.className = 'priority-badge';
                    priorityBadge.textContent = '⚡ PRIORITA';
                    metaDiv.appendChild(priorityBadge);
                }

                if (stop.timeLimit) {
                    const timeLimitSpan = document.createElement('span');
                    timeLimitSpan.className = 'time-limit';
                    timeLimitSpan.textContent = `⏰ ${stop.timeLimit}`;
                    metaDiv.appendChild(timeLimitSpan);
                }

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.setAttribute('data-id', stop.id);
                removeBtn.title = 'Odstranit zastávku';
                removeBtn.textContent = '✕';

                contentDiv.appendChild(addressDiv);
                contentDiv.appendChild(metaDiv);

                leftSection.appendChild(priorityBtn);
                leftSection.appendChild(numberDiv);

                item.appendChild(leftSection);
                item.appendChild(contentDiv);
                item.appendChild(removeBtn);

                list.appendChild(item);
            });

            list.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.removeStop(parseInt(e.target.dataset.id));
                });
            });

            list.querySelectorAll('.priority-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.togglePriority(parseInt(e.target.dataset.id));
                });
            });

            // Add drag and drop functionality
            // this.setupDragAndDrop(list); // Completely disabled for now
        }
    }



    calculateCompleteRouteDistance() {
        if (!this.stops || this.stops.length < 2) return 0;

        let totalDistance = 0;

        // Add distance from warehouse to first stop (if warehouse is set)
        if (this.startingPoint) {
            totalDistance += this.calculateDistance(
                this.startingPoint.lat, this.startingPoint.lng,
                this.stops[0].lat, this.stops[0].lng
            );
        }

        // Add distances between all stops
        for (let i = 0; i < this.stops.length - 1; i++) {
            totalDistance += this.calculateDistance(
                this.stops[i].lat, this.stops[i].lng,
                this.stops[i + 1].lat, this.stops[i + 1].lng
            );
        }

        // Add distance from last stop back to warehouse (for round trips)
        if (this.roundTrip && this.startingPoint) {
            totalDistance += this.calculateDistance(
                this.stops[this.stops.length - 1].lat, this.stops[this.stops.length - 1].lng,
                this.startingPoint.lat, this.startingPoint.lng
            );
        }

        return totalDistance;
    }

    updateButtons() {
        const optimizeBtn = document.getElementById('optimizeBtn');
        const saveRouteBtn = document.getElementById('saveRouteBtn');
        const reverseRouteBtn = document.getElementById('reverseRouteBtn');
        const navigateBtn = document.getElementById('navigateBtn');

        optimizeBtn.disabled = this.stops.length < 2;
        saveRouteBtn.disabled = this.stops.length < 2;
        reverseRouteBtn.disabled = this.stops.length < 2;
        navigateBtn.disabled = !this.optimizedRoute;

        // Show/hide reverse button after optimization
        if (this.optimizedRoute && this.stops.length >= 2) {
            reverseRouteBtn.style.display = 'flex';
        } else {
            reverseRouteBtn.style.display = 'none';
        }

        // Update button icons (keep existing HTML icons)
    }

    async parseBulkText() {
        const textInput = document.getElementById('bulkTextInput');
        const text = textInput.value.trim();
        
        if (!text) {
            this.showParseResults('Prosím zadejte nějaký text ke zpracování.', 'error');
            return;
        }

        this.showLoading(true);
        
        try {
            const addresses = this.extractAddresses(text);
            
            if (addresses.length === 0) {
                this.showParseResults('V textu nebyly nalezeny žádné adresy.', 'error');
                return;
            }

            let addedCount = 0;
            let failedCount = 0;
            
            for (const address of addresses) {
                try {
                    console.log('Geocoding extracted address:', address);
                    const coords = await this.geocodeAddress(address);
                    if (coords) {
                        const stop = {
                            id: Date.now() + Math.random(),
                            address: address,
                            lat: coords.lat,
                            lng: coords.lng,
                            priority: false,
                            timeLimit: null
                        };

                        this.stops.push(stop);
                        addedCount++;
                        console.log('Successfully added stop:', address);
                    } else {
                        console.warn('Failed to geocode address:', address);
                        failedCount++;
                    }
                } catch (error) {
                    console.error('Error processing address:', address, error);
                    failedCount++;
                }
            }

            this.updateStopsList();
            this.saveToStorage();
            this.updateButtons();
            
            textInput.value = '';
            
            let message = `Úspěšně přidáno ${addedCount} zastávek`;
            if (failedCount > 0) {
                message += `, ${failedCount} se nepodařilo zpracovat`;
            }
            message += '.';

            if (addedCount === 0) {
                message = `Žádná adresa se nepodařila zpracovat. Zkontrolujte formát adres.`;
            }

            this.showParseResults(message, addedCount > 0 ? 'success' : 'error');
            
        } catch (error) {
            this.showParseResults('Nepodařilo se zpracovat text. Zkuste to prosím znovu.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    extractAddresses(text) {
        const addressPatterns = [
            // Czech street addresses with numbers
            /\b\d+\s+[\w\s]+\s+(ulice|ul|třída|tř|náměstí|nám|nám\.|aleje|alej|silnice|sil|cesta|cest|družstevní|druž|sady|sad|park|parková|lázek|láz|vrch|vrchu|návrší|návrší|zahrada|zah|dolina|dol|údolí|údolí|kameny|kamen|skály|skály|hráz|hráz|přehrada|přehrada|nábřeží|nábřeží|kolem|kolem|pod|pod|nad|nad|u|u|č|č|čp|čp|ev|ev)\b[\w\s]*/gi,
            /\b\d+\s+[\w\s]+\s+(ulice|ul|třída|tř|náměstí|nám|nám\.|aleje|alej|silnice|sil|cesta|cest|družstevní|druž|sady|sad|park|parková|lázek|láz|vrch|vrchu|návrší|návrší|zahrada|zah|dolina|dol|údolí|údolí|kameny|kamen|skály|skály|hráz|hráz|přehrada|přehrada|nábřeží|nábřeží|kolem|kolem|pod|pod|nad|nad|u|u|č|č|čp|čp|ev|ev)\b/gi,

            // Czech addresses with postal codes
            /\b\d+\s+[\w\s]+,\s*[\w\s]+,\s*\d{3}\s*\d{2}\b/gi,
            /\b\d+\s+[\w\s]+,\s*[\w\s]+,\s*\d{5}\b/gi,

            // General address patterns
            /\b\d+\s+[\w\s]+,\s*[\w\s]+\b/gi,
            /\b[\w\s]+\s+\d+,\s*[\w\s]+\b/gi,
            /\b\d+\s+[\w\s]+\b/gi,

            // English street addresses
            /\b\d+\s+[\w\s]+\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Court|Ct|Way|Place|Pl|Square|Sq|Terrace|Ter|Circle|Cir|Highway|Hw)\b[\w\s]*/gi,
            /\b\d+\s+[\w\s]+\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Court|Ct|Way|Place|Pl|Square|Sq|Terrace|Ter|Circle|Cir|Highway|Hw)\b/gi,

            // US-style addresses with ZIP
            /\b\d+\s+[\w\s]+,\s*[\w\s]+,\s*\w{2}\s*\d{5}\b/gi,

            // Additional Czech patterns
            /\b[\w\s]+ \d+,\s*[\w\s]+\b/gi,
            /\b\d+\/\d+\s+[\w\s]+\b/gi,
            /\b[\w\s]+\s+\d+\/\d+\b/gi
        ];

        const addresses = new Set();
        
        const lines = text.split(/[\n,;]+/).map(line => line.trim()).filter(line => line.length > 5);
        
        for (const line of lines) {
            let found = false;
            
            for (const pattern of addressPatterns) {
                const matches = line.match(pattern);
                if (matches) {
                    matches.forEach(match => {
                        const cleanAddress = match.trim()
                            .replace(/[^\w\s,.-/]/g, '') // Keep slashes for addresses like "123/45"
                            .replace(/\s+/g, ' ')
                            .trim();

                        // Validate address has both numbers and letters
                        if (cleanAddress.length > 8 && /\d/.test(cleanAddress) && /[a-zA-Z]/.test(cleanAddress)) {
                            addresses.add(cleanAddress);
                            found = true;
                        }
                    });
                }
            }
            
            if (!found && line.length > 8 && /\d/.test(line) && /[a-zA-Z]/.test(line)) {
                const cleanLine = line.replace(/[^\w\s,.-/]/g, '').replace(/\s+/g, ' ').trim();
                if (cleanLine.length > 8 && cleanLine.split(' ').length >= 2) {
                    addresses.add(cleanLine);
                }
            }
        }

        return Array.from(addresses).slice(0, 20);
    }

    showParseResults(message, type) {
        const existingResults = document.querySelector('.parse-results');
        if (existingResults) {
            existingResults.remove();
        }

        const resultsDiv = document.createElement('div');
        resultsDiv.className = `parse-results ${type}`;
        resultsDiv.textContent = message;
        
        const bulkInput = document.getElementById('bulkInput');
        bulkInput.appendChild(resultsDiv);
        
        setTimeout(() => {
            resultsDiv.remove();
        }, 5000);
    }

    async optimizeRoute() {
        console.log('optimizeRoute called with stops:', this.stops.length);
        console.log('Stops:', this.stops);

        if (this.stops.length < 2) {
            console.log('Not enough stops for optimization');
            alert('Pro optimalizaci trasy potřebujete alespoň 2 zastávky.');
            return;
        }

        this.showLoading(true);

        try {
            // Calculate original route distance before optimization
            const originalDistance = this.calculateCompleteRouteDistance();
            console.log('Original route distance:', originalDistance.toFixed(2), 'km');

            console.log('Starting route calculation...');
            this.optimizedRoute = await this.calculateOptimalRoute();
            console.log('Route calculated successfully');

            // Reorder stops based on optimized route
            if (this.optimizedRoute) {
                await this.reorderStopsByOptimizedRoute();
                console.log('Stops reordered based on optimization');

                // Calculate optimized route distance
                const optimizedDistance = this.calculateCompleteRouteDistance();
                const savings = originalDistance - optimizedDistance;
                const savingsPercent = originalDistance > 0 ? (savings / originalDistance) * 100 : 0;

                console.log('Optimized route distance:', optimizedDistance.toFixed(2), 'km');
                console.log('Distance savings:', savings.toFixed(2), 'km (', savingsPercent.toFixed(1), '%)');

                // Estimate time savings (assuming 50 km/h average speed)
                const timeSavings = savings / 50 * 60; // in minutes
                const timeSavingsText = timeSavings > 60 ?
                    `${Math.floor(timeSavings / 60)}h ${Math.floor(timeSavings % 60)}min` :
                    `${Math.floor(timeSavings)}min`;

                // Optimization completed successfully - results visible in UI and console
            }

            console.log('Updating buttons...');
            this.updateButtons();

            console.log('Route optimization completed successfully');
        } catch (error) {
            console.error('Route optimization failed:', error);
            alert('Optimalizace trasy selhala. Zkuste to prosím znovu.');
        } finally {
            this.showLoading(false);
            // Ensure UI is updated after loading is hidden
            this.updateStopsList();
        }
    }

    async calculateOptimalRoute() {
        if (this.stops.length < 2) return null;

        try {
            // Prepare coordinates for routing
            let coordinates = [];

            if (this.startingPoint) {
                // If starting point is set, include it
                coordinates.push(`${this.startingPoint.lng},${this.startingPoint.lat}`);
            }

            // Add all stops
            coordinates.push(...this.stops.map(stop => `${stop.lng},${stop.lat}`));

            // Remove duplicates based on proximity
            coordinates = this.removeDuplicateCoordinates(coordinates);

            if (coordinates.length < 2) {
                throw new Error('Nedostatek unikátních bodů pro výpočet trasy');
            }

            let url;
            if (this.roundTrip && coordinates.length > 2) {
                // Use OSRM trip service for round trip optimization
                url = `https://router.project-osrm.org/trip/v1/driving/${coordinates.join(';')}?roundtrip=true&source=first&overview=full&geometries=geojson&steps=true`;
                console.log('Requesting round trip from:', url);
            } else {
                // Use regular route service
                const startCoord = coordinates[0];
                const endCoord = coordinates[coordinates.length - 1];
                const waypoints = coordinates.length > 2 ? coordinates.slice(1, -1).join(';') : '';

                url = `https://router.project-osrm.org/route/v1/driving/${startCoord}${waypoints ? ';' + waypoints : ''};${endCoord}?overview=full&geometries=geojson&steps=true&alternatives=true`;
                console.log('Requesting route from:', url);
            }

            const response = await fetch(url);

            if (!response.ok) {
                console.error('OSRM API error:', response.status, response.statusText);
                throw new Error(`Chyba serveru: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('OSRM response:', data);

            if (data.error) {
                console.error('OSRM routing error:', data.error);
                throw new Error(`Chyba trasy: ${data.error.message || data.error}`);
            }

            if (this.roundTrip && data.trips && data.trips.length > 0) {
                // Handle trip response
                console.log('Round trip successful');
                return data.trips[0];
            } else if (!this.roundTrip && data.routes && data.routes.length > 0) {
                // Handle route response
                const truckRoute = this.selectTruckFriendlyRoute(data.routes);
                console.log('Selected route:', truckRoute);
                return truckRoute;
            }

            throw new Error('Nebyla nalezena žádná trasa');

        } catch (error) {
            console.error('Route calculation error:', error);

            // Fallback: try simple route without waypoints
            if (this.stops.length === 2) {
                try {
                    const startPoint = this.startingPoint || this.stops[0];
                    const endPoint = this.stops[this.stops.length - 1];
                    const fallbackUrl = `https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`;

                    console.log('Trying fallback route:', fallbackUrl);

                    const fallbackResponse = await fetch(fallbackUrl);
                    if (fallbackResponse.ok) {
                        const fallbackData = await fallbackResponse.json();
                        if (fallbackData.routes && fallbackData.routes.length > 0) {
                            console.log('Fallback route successful');
                            return fallbackData.routes[0];
                        }
                    }
                } catch (fallbackError) {
                    console.error('Fallback route failed:', fallbackError);
                }
            }

            throw error;
        }
    }

    removeDuplicateCoordinates(coordinates) {
        const uniqueCoords = [];
        const seen = new Set();

        for (const coord of coordinates) {
            // Simple deduplication based on exact string match
            if (!seen.has(coord)) {
                seen.add(coord);
                uniqueCoords.push(coord);
            }
        }

        return uniqueCoords;
    }

    selectTruckFriendlyRoute(routes) {
        if (!routes || routes.length === 0) {
            throw new Error('Žádné dostupné trasy');
        }
        
        // For now, return the first route. In a real implementation, 
        // you could analyze routes for truck-friendliness
        // (avoiding sharp turns, low bridges, etc.)
        console.log(`Selecting best route from ${routes.length} options`);
        return routes[0];
    }



    reverseRoute() {
        if (this.stops.length < 2) {
            alert('Pro obrácení trasy potřebujete alespoň 2 zastávky.');
            return;
        }

        console.log('Reversing route order...');
        console.log('Original order:', this.stops.map(s => s.address));

        // Reverse the stops array
        this.stops.reverse();

        console.log('Reversed order:', this.stops.map(s => s.address));

        // Update the UI
        this.updateStopsList();

        // Show updated distance in console
        const reversedDistance = this.calculateCompleteRouteDistance();
        console.log('Reversed route distance:', reversedDistance.toFixed(2), 'km');

        console.log('Route reversed successfully');
    }

    startNavigation() {
        if (!this.optimizedRoute || this.stops.length < 2) return;

        // Start tracking this route
        this.startRouteTracking(this.currentRouteId);
        this.updateTrackingUI(); // Update UI to show end route button

        // For round trips, use the optimized waypoint order from OSRM trip service
        let routeStops = [];

        // Build route stops based on round trip setting
        if (this.roundTrip) {
            // For round trips, include starting point and all stops, ensuring return to start
            routeStops = [...this.stops];
            if (this.startingPoint) {
                // Add starting point at the beginning if not already there
                const isDuplicate = routeStops.some(stop =>
                    this.calculateDistance(stop.lat, stop.lng, this.startingPoint.lat, this.startingPoint.lng) < 0.01
                );
                if (!isDuplicate) {
                    routeStops = [this.startingPoint, ...routeStops];
                }
                // For round trips, add starting point at the end to ensure return
                routeStops = [...routeStops, { ...this.startingPoint }];
            }
        } else {
            // Regular route - include starting point at beginning if set
            routeStops = [...this.stops];
            if (this.startingPoint) {
                const isDuplicate = routeStops.some(stop =>
                    this.calculateDistance(stop.lat, stop.lng, this.startingPoint.lat, this.startingPoint.lng) < 0.01
                );
                if (!isDuplicate) {
                    routeStops = [this.startingPoint, ...routeStops];
                }
            }
        }

        // Google Maps supports max 10 waypoints total (including origin/destination)
        // So we split into batches of 8 waypoints (origin + 8 waypoints + destination = 10 total)
        const MAX_WAYPOINTS = 8;

        if (routeStops.length <= 10) {
            // Single navigation session
            this.navigateBatch(routeStops, 0);
        } else {
            // Multiple navigation sessions - split into chunks
            const batches = [];
            for (let i = 0; i < routeStops.length; i += MAX_WAYPOINTS) {
                const batch = routeStops.slice(i, i + MAX_WAYPOINTS + 1);
                if (batch.length >= 2) { // Ensure batch has at least start and end
                    batches.push(batch);
                }
            }

            // Navigate batches sequentially with delay
            batches.forEach((batch, index) => {
                setTimeout(() => {
                    this.navigateBatch(batch, index);
                }, index * 3000); // 3 second delay between batches
            });
        }
    }



    navigateBatch(stops, batchIndex) {
        // For navigation, all stops in the batch are waypoints, with first as origin and last as destination
        const start = stops[0];
        const end = stops[stops.length - 1];

        // Check if this is a round trip (last stop same as first)
        const isRoundTripBatch = this.roundTrip && stops.length > 1 &&
            this.calculateDistance(start.lat, start.lng, end.lat, end.lng) < 0.01;

        let waypoints = '';
        let destination = `${end.lat},${end.lng}`;

        if (isRoundTripBatch) {
            // For round trip batches, don't include the return point as a waypoint
            // Use all points except the last (which is the return point) as waypoints
            waypoints = stops.length > 2 ? stops.slice(1, -1).map(stop => `${stop.lat},${stop.lng}`).join('|') : '';
        } else {
            // Regular navigation
            waypoints = stops.length > 2 ? stops.slice(1, -1).map(stop => `${stop.lat},${stop.lng}`).join('|') : '';
        }

        // Use coordinates for better Google Maps compatibility
        const origin = `${start.lat},${start.lng}`;

        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? '&waypoints=' + waypoints : ''}&travelmode=driving`;

        const windowName = batchIndex === 0 ? '_blank' : `navigation_batch_${batchIndex}`;
        window.open(url, windowName);

        if (batchIndex === 0) {
            if (this.roundTrip) {
                // Round trip navigation started - no alert needed
            } else if (this.stops.length > 10) {
                const totalStops = this.startingPoint ? this.stops.length + 1 : this.stops.length;
                const batchCount = Math.ceil(totalStops / 8);
                setTimeout(() => {
                    alert(`Trasa je rozdělena do ${batchCount} částí kvůli limitu Google Maps. Každá část se otevře v novém okně postupně.`);
                }, 1000);
            }
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        loading.classList.toggle('active', show);
    }





    saveToStorage() {
        localStorage.setItem('routeOptimizerStops', JSON.stringify(this.stops));
        localStorage.setItem('routeOptimizerStartingPoint', JSON.stringify(this.startingPoint));
        localStorage.setItem('routeOptimizerRoundTrip', this.roundTrip);
        // Keep savedRoutes in localStorage as backup for offline use
        localStorage.setItem('routeOptimizerSavedRoutes', JSON.stringify(this.savedRoutes));
    }

    loadRoutesFromLocalStorage() {
        const savedRoutesData = localStorage.getItem('routeOptimizerSavedRoutes');
        if (savedRoutesData) {
            this.savedRoutes = JSON.parse(savedRoutesData);
            this.updateSavedRoutesList();
        }
    }

    async loadFromStorage() {
        const savedStops = localStorage.getItem('routeOptimizerStops');
        if (savedStops) {
            this.stops = JSON.parse(savedStops);
            // Ensure backward compatibility - add priority and timeLimit if missing
            this.stops.forEach(stop => {
                if (stop.priority === undefined) stop.priority = false;
                if (stop.timeLimit === undefined) stop.timeLimit = null;
            });
            this.updateStopsList();
            this.updateButtons();
        }

        const savedStartingPoint = localStorage.getItem('routeOptimizerStartingPoint');
        if (savedStartingPoint) {
            this.startingPoint = JSON.parse(savedStartingPoint);
            const startPointInput = document.getElementById('startPointInput');
            if (startPointInput && this.startingPoint) {
                startPointInput.value = this.startingPoint.address;
            }
        }

        const savedRoundTrip = localStorage.getItem('routeOptimizerRoundTrip');
        if (savedRoundTrip !== null) {
            this.roundTrip = savedRoundTrip === 'true';
            const roundTripCheckbox = document.getElementById('roundTripCheckbox');
            if (roundTripCheckbox) {
                roundTripCheckbox.checked = this.roundTrip;
            }
        }

        // Load routes from Supabase or localStorage
        if (window.supabaseReady && window.supabaseClient) {
            try {
                this.savedRoutes = await this.loadRoutesFromSupabase();
                this.updateSavedRoutesList();
            } catch (error) {
                console.error('Failed to load routes from Supabase, using localStorage');
                this.loadRoutesFromLocalStorage();
            }
        } else {
            console.log('Supabase not ready, loading from localStorage');
            this.loadRoutesFromLocalStorage();
        }

        this.updateButtons();

        // Fix mobile button positioning after everything is loaded
        setTimeout(() => {
            this.fixMobileButtonPositioning();
        }, 100);
    }

    fixMobileButtonPositioning() {
        // Fix button positioning on mobile devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const actionButtons = document.querySelector('.action-buttons');

        if (isMobile && actionButtons) {
            // Add extra padding for Android navigation bar
            actionButtons.style.paddingBottom = 'calc(var(--spacing-sm) + 32px)';
            actionButtons.style.marginBottom = '16px';

            console.log('Applied mobile button positioning fixes');
        }
    }

    // Tracking functionality
    startRouteTracking(routeId) {
        this.currentTracking = {
            routeId: routeId,
            startTime: new Date(),
            positions: [],
            distance: 0,
            watchId: null
        };

        // Start GPS tracking if available
        if ('geolocation' in navigator) {
            this.currentTracking.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    this.recordPosition(position);
                },
                (error) => {
                    console.log('GPS tracking error:', error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 30000,
                    timeout: 27000
                }
            );
        }

        console.log('Started tracking route:', routeId);
    }

    recordPosition(position) {
        if (!this.currentTracking) return;

        const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date(),
            accuracy: position.coords.accuracy
        };

        // Calculate distance from last position
        const lastPos = this.currentTracking.positions[this.currentTracking.positions.length - 1];
        if (lastPos) {
            const distance = this.calculateDistance(
                lastPos.lat, lastPos.lng,
                currentPos.lat, currentPos.lng
            );
            this.currentTracking.distance += distance;
        }

        this.currentTracking.positions.push(currentPos);
    }

    stopRouteTracking() {
        if (!this.currentTracking) return;

        // Stop GPS tracking
        if (this.currentTracking.watchId) {
            navigator.geolocation.clearWatch(this.currentTracking.watchId);
        }

        // Calculate final tracking data
        const endTime = new Date();
        const duration = (endTime - this.currentTracking.startTime) / 1000 / 60; // minutes
        const plannedDistance = this.calculateCompleteRouteDistance();

        const trackingRecord = {
            routeId: this.currentTracking.routeId,
            distanceDriven: this.currentTracking.distance,
            distancePlanned: plannedDistance,
            startTime: this.currentTracking.startTime,
            endTime: endTime,
            duration: duration,
            dateDriven: this.currentTracking.startTime.toISOString().split('T')[0],
            earnings: this.currentTracking.distance * this.userSettings.kmRate
        };

        // Save tracking data
        this.saveTrackingRecord(trackingRecord);

        console.log('Stopped tracking route, distance driven:', this.currentTracking.distance.toFixed(2), 'km');

        this.currentTracking = null;
        return trackingRecord;
    }

    async saveTrackingRecord(record) {
        // Save to localStorage for now
        this.trackingData.unshift(record);
        localStorage.setItem('routeTrackingData', JSON.stringify(this.trackingData));

        // Also save to Supabase if available
        if (window.supabaseReady && window.supabaseClient) {
            try {
                const { data, error } = await window.supabaseClient
                    .from('route_tracking')
                    .insert([{
                        route_id: record.routeId,
                        user_id: this.userId,
                        distance_driven: record.distanceDriven,
                        distance_planned: record.distancePlanned,
                        start_time: record.startTime.toISOString(),
                        end_time: record.endTime.toISOString(),
                        date_driven: record.dateDriven,
                        earnings: record.earnings,
                        km_rate: this.userSettings.kmRate
                    }]);

                if (error) throw error;
                console.log('Tracking record saved to Supabase');
            } catch (error) {
                console.error('Failed to save tracking to Supabase:', error);
            }
        }
    }

    loadTrackingData() {
        const saved = localStorage.getItem('routeTrackingData');
        if (saved) {
            this.trackingData = JSON.parse(saved);
        }

        // Load user settings
        const settings = localStorage.getItem('userSettings');
        if (settings) {
            this.userSettings = JSON.parse(settings);
        }
    }

    async saveUserSettings() {
        // Save to Supabase if available
        if (window.supabaseReady && window.supabaseClient) {
            try {
                const { data, error } = await window.supabaseClient
                    .from('user_settings')
                    .upsert({
                        user_id: this.userId,
                        km_rate: this.userSettings.kmRate,
                        currency: this.userSettings.currency
                    });

                if (error) throw error;
                console.log('User settings saved to Supabase');
            } catch (error) {
                console.error('Failed to save user settings to Supabase:', error);
            }
        }
    }

    getMonthlyEarnings(month, year) {
        const filtered = this.trackingData.filter(record => {
            const date = new Date(record.dateDriven);
            return date.getMonth() === month - 1 && date.getFullYear() === year;
        });

        return filtered.reduce((total, record) => total + record.earnings, 0);
    }

    setupDragAndDrop(list) {
        let draggedElement = null;

        const stopItems = list.querySelectorAll('.stop-item');

        stopItems.forEach(item => {
            // Only enable drag and drop on desktop (touch devices have issues)
            if (!('ontouchstart' in window)) {
                // Drag start
                item.addEventListener('dragstart', (e) => {
                    // Don't start drag if clicking on buttons
                    if (e.target.closest('.priority-btn') || e.target.closest('.remove-btn')) {
                        e.preventDefault();
                        return;
                    }

                    draggedElement = item;
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });

                // Drag end
                item.addEventListener('dragend', (e) => {
                    item.classList.remove('dragging');
                    draggedElement = null;
                });

                // Drag over
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                });

                // Drop
                item.addEventListener('drop', (e) => {
                    e.preventDefault();

                    if (draggedElement && draggedElement !== item) {
                        const draggedIndex = parseInt(draggedElement.getAttribute('data-stop-index'));
                        const targetIndex = parseInt(item.getAttribute('data-stop-index'));

                        // Simple reordering logic
                        const draggedStop = this.stops[draggedIndex];
                        this.stops.splice(draggedIndex, 1);

                        // Insert at target position
                        const insertIndex = targetIndex > draggedIndex ? targetIndex : targetIndex + 1;
                        this.stops.splice(insertIndex, 0, draggedStop);

                        // Update UI
                        this.updateStopsList();

                        // Re-optimize the route after manual reordering
                        console.log('Route manually reordered, triggering re-optimization...');
                        setTimeout(() => {
                            this.optimizeRoute();
                        }, 100);
                    }
                });
            }
        });
    }

    getMonthlyDistance(month, year) {
        const filtered = this.trackingData.filter(record => {
            const date = new Date(record.dateDriven);
            return date.getMonth() === month - 1 && date.getFullYear() === year;
        });

        return filtered.reduce((total, record) => total + record.distanceDriven, 0);
    }

    toggleTrackingSection() {
        const content = document.getElementById('trackingContent');
        const button = document.getElementById('toggleTrackingBtn');

        if (content.style.display === 'none') {
            content.style.display = 'block';
            button.textContent = '▲';
            this.updateTrackingUI();
        } else {
            content.style.display = 'none';
            button.textContent = '▼';
        }
    }

    updateTrackingUI() {
        // Initialize month selector with current date
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        if (monthSelect && yearSelect) {
            const now = new Date();
            monthSelect.value = now.getMonth();
            yearSelect.value = now.getFullYear();
        }

        this.updateTrackingStats();
        this.updateTrackingHistory();

        // Show/hide end route button
        const endRouteBtn = document.getElementById('endRouteBtn');
        if (endRouteBtn) {
            endRouteBtn.style.display = this.currentTracking ? 'block' : 'none';
        }
    }

    updateTrackingStats() {
        const statsDiv = document.getElementById('trackingStats');
        if (!statsDiv) return;

        // Get selected month/year
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        const selectedMonth = monthSelect ? parseInt(monthSelect.value) : new Date().getMonth();
        const selectedYear = yearSelect ? parseInt(yearSelect.value) : new Date().getFullYear();

        const monthlyKm = this.getMonthlyDistance(selectedMonth + 1, selectedYear);
        const monthlyEarnings = this.getMonthlyEarnings(selectedMonth + 1, selectedYear);
        const totalKm = this.trackingData.reduce((sum, record) => sum + record.distanceDriven, 0);
        const totalEarnings = this.trackingData.reduce((sum, record) => sum + record.earnings, 0);

        const monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
                           'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
        const selectedMonthName = monthNames[selectedMonth];

        statsDiv.innerHTML = `
            <h4>Vybraný měsíc (${selectedMonthName} ${selectedYear})</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                <span>Ujeté km:</span>
                <strong>${monthlyKm.toFixed(1)} km</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-md);">
                <span>Výdělek:</span>
                <strong style="color: var(--success);">${monthlyEarnings.toFixed(0)} CZK</strong>
            </div>

            <h4>Celkem</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                <span>Celkové km:</span>
                <strong>${totalKm.toFixed(1)} km</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Celkový výdělek:</span>
                <strong style="color: var(--success);">${totalEarnings.toFixed(0)} CZK</strong>
            </div>
        `;
    }

    updateTrackingHistory() {
        const historyDiv = document.getElementById('trackingHistory');
        if (!historyDiv) return;

        // Get selected month/year
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        const selectedMonth = monthSelect ? parseInt(monthSelect.value) : new Date().getMonth();
        const selectedYear = yearSelect ? parseInt(yearSelect.value) : new Date().getFullYear();

        // Filter tracking data for selected month
        const monthData = this.trackingData.filter(record => {
            const recordDate = new Date(record.dateDriven);
            return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
        });

        if (monthData.length === 0) {
            const monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
                               'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
            const selectedMonthName = monthNames[selectedMonth];
            historyDiv.innerHTML = `<p style="text-align: center; color: var(--text-secondary); margin: var(--spacing-md) 0;">Žádné trasy v ${selectedMonthName} ${selectedYear}</p>`;
            return;
        }

        historyDiv.innerHTML = monthData.slice(0, 10).map(record => {
            const routeName = this.savedRoutes.find(r => r.id === record.routeId)?.name || 'Neznámá trasa';
            const date = new Date(record.dateDriven).toLocaleDateString('cs-CZ');

            return `
                <div class="tracking-entry">
                    <div>
                        <div class="tracking-route-name">${routeName}</div>
                        <div class="tracking-details">${date} • ${record.distanceDriven.toFixed(1)} km</div>
                    </div>
                    <div class="tracking-earnings">${record.earnings.toFixed(0)} CZK</div>
                </div>
            `;
        }).join('');
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered');
            } catch (error) {
                console.log('Service Worker registration failed');
            }
        }
    }
}

// Initialize immediately
console.log('Script loaded, creating RouteOptimizer...');
try {
    window.routeOptimizer = new RouteOptimizer();
    window.app = window.routeOptimizer; // For onclick handlers
    console.log('RouteOptimizer created successfully');
} catch (error) {
    console.error('Error creating RouteOptimizer:', error);
}