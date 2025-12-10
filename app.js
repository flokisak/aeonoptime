class RouteOptimizer {
    constructor() {
        this.stops = [];
        this.startingPoint = null;
        this.optimizedRoute = null;
        this.roundTrip = false;
        this.savedRoutes = [];
        this.userId = this.generateUserId(); // Anonymous user ID
        this.isOnline = navigator.onLine;
        
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
            alert(`Odkaz na trasu zkopírován do schránky:\n${shareUrl}`);
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
            alert(`Sdílená trasa "${data.name}" byla načtena.`);
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

            alert(`Trasa "${routeData.name}" byla úspěšně uložena.`);
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
        alert(`Trasa "${route.name}" byla načtena.`);

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

        alert(`Trasa "${route.name}" byla načtena.`);
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
            alert(`Trasa "${route.name}" byla smazána.`);
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

        list.innerHTML = '';

        // Update stop count
        stopCount.textContent = this.stops.length;

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
        }
    }

    updateButtons() {
        const optimizeBtn = document.getElementById('optimizeBtn');
        const saveRouteBtn = document.getElementById('saveRouteBtn');
        const navigateBtn = document.getElementById('navigateBtn');

        optimizeBtn.disabled = this.stops.length < 2;
        saveRouteBtn.disabled = this.stops.length < 2;
        navigateBtn.disabled = !this.optimizedRoute;

        // Update button texts
        optimizeBtn.textContent = 'Optimalizovat trasu';
        saveRouteBtn.textContent = 'Uložit trasu';
        navigateBtn.textContent = 'Zahájit navigaci';
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
            console.log('Starting route calculation...');
            this.optimizedRoute = await this.calculateOptimalRoute();
            console.log('Route calculated successfully');

            console.log('Updating buttons...');
            this.updateButtons();
            
            console.log('Route optimization completed successfully');
        } catch (error) {
            console.error('Route optimization failed:', error);
            alert('Optimalizace trasy selhala. Zkuste to prosím znovu.');
        } finally {
            this.showLoading(false);
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



    startNavigation() {
        if (!this.optimizedRoute || this.stops.length < 2) return;

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
                setTimeout(() => {
                    alert(`Kruhový objezd: Trasa vás zavede zpět na výchozí bod.`);
                }, 1000);
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