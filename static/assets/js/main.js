class App {
    constructor() {
        this.currentUser = null;
        this.currentView = 'landing-page';
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupForms();
        this.checkAuthStatus();
    }

    setupNavigation() {
        document.getElementById('nav-home').addEventListener('click', (e) => {
            e.preventDefault();
            this.showView(this.currentUser ? 'dashboard-page' : 'landing-page');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        document.querySelectorAll('.nav-scroll').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // If not on landing page, go to landing page first
                if (this.currentView !== 'landing-page') {
                    this.showView('landing-page');
                }
                const targetId = e.target.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    setTimeout(() => {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }, 100); // Wait for view to activate
                }
            });
        });
        
        document.getElementById('nav-login-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showView('login-page');
        });
        
        document.getElementById('nav-register-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showView('register-page');
        });
        
        document.getElementById('nav-dashboard-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showView('dashboard-page');
        });
        
        document.getElementById('nav-logout-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await window.api.logout();
                this.currentUser = null;
                this.updateNavUI();
                this.showView('landing-page');
                this.showToast('Logged out successfully', 'success');
            } catch (err) {
                this.showToast(err.message, 'error');
            }
        });
    }

    setupForms() {
        // Login
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const ogText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Logging in...';
            btn.disabled = true;

            try {
                const res = await window.api.login(
                    document.getElementById('login-email').value,
                    document.getElementById('login-password').value
                );
                this.currentUser = res.data.user;
                this.updateNavUI();
                this.showToast('Welcome back!', 'success');
                this.showView('dashboard-page');
                this.loadDashboardData();
            } catch (err) {
                this.showToast(err.message, 'error');
            } finally {
                btn.innerHTML = ogText;
                btn.disabled = false;
            }
        });

        // Register
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const ogText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating...';
            btn.disabled = true;

            try {
                const res = await window.api.register(
                    document.getElementById('reg-username').value,
                    document.getElementById('reg-email').value,
                    document.getElementById('reg-password').value
                );
                this.currentUser = res.data.user;
                this.updateNavUI();
                this.showToast('Account created successfully!', 'success');
                this.showView('dashboard-page');
                this.loadDashboardData();
            } catch (err) {
                this.showToast(err.message, 'error');
            } finally {
                btn.innerHTML = ogText;
                btn.disabled = false;
            }
        });

        // Calculate Footprint
        document.getElementById('calc-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const ogText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Calculating...';
            btn.disabled = true;

            const payload = {
                transport: parseFloat(document.getElementById('calc-transport').value) * 0.2, // Rough estimate kg CO2
                energy: parseFloat(document.getElementById('calc-energy').value) * 0.5,
                food: parseFloat(document.getElementById('calc-food').value) * 2.5,
                waste: parseFloat(document.getElementById('calc-waste').value) * 1.5,
                water: parseFloat(document.getElementById('calc-water').value) * 0.01
            };

            try {
                await window.api.calculateFootprint(payload);
                this.showToast('Footprint calculated and saved!', 'success');
                this.showView('dashboard-page');
                this.loadDashboardData();
                e.target.reset();
            } catch (err) {
                this.showToast(err.message, 'error');
            } finally {
                btn.innerHTML = ogText;
                btn.disabled = false;
            }
        });
    }

    async checkAuthStatus() {
        try {
            const res = await window.api.getCurrentUser();
            this.currentUser = res.data.user;
            this.updateNavUI();
            
            // If on root, go to dashboard
            if (this.currentView === 'landing-page') {
                this.showView('dashboard-page');
                this.loadDashboardData();
            }
        } catch (err) {
            // Not authenticated, stay on landing
            this.updateNavUI();
        }
    }

    updateNavUI() {
        const loginBtn = document.getElementById('nav-login-btn');
        const regBtn = document.getElementById('nav-register-btn');
        const dashBtn = document.getElementById('nav-dashboard-btn');
        const logoutBtn = document.getElementById('nav-logout-btn');

        if (this.currentUser) {
            loginBtn.classList.add('hidden');
            regBtn.classList.add('hidden');
            dashBtn.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');
        } else {
            loginBtn.classList.remove('hidden');
            regBtn.classList.remove('hidden');
            dashBtn.classList.add('hidden');
            logoutBtn.classList.add('hidden');
        }
    }

    showView(viewId) {
        document.querySelectorAll('.view').forEach(v => {
            v.classList.add('hidden');
            v.classList.remove('active');
        });
        
        const view = document.getElementById(viewId);
        if(view) {
            view.classList.remove('hidden');
            // small delay to trigger animation
            setTimeout(() => view.classList.add('active'), 10);
            this.currentView = viewId;
        }
    }

    async loadDashboardData() {
        try {
            const res = await window.api.getDashboard();
            const { user, recent_records, latest_total } = res.data;
            
            this.currentUser = user; // update user data (points, score)
            
            // Update DOM
            document.getElementById('dash-username').textContent = user.username;
            
            this.animateValue('dash-latest-total', 0, latest_total, 1000);
            this.animateValue('dash-score', 0, user.sustainability_score, 1000);
            this.animateValue('dash-points', 0, user.points, 1000);
            
            document.getElementById('dash-level').textContent = user.level;

            if (recent_records.length > 0) {
                this.renderCharts(recent_records);
                this.loadRecommendations();
            } else {
                document.getElementById('ai-recommendations').innerHTML = '<p class="text-light">Add your first record to get AI recommendations.</p>';
            }

        } catch (err) {
            console.error(err);
            this.showToast('Failed to load dashboard data', 'error');
        }
    }

    async loadRecommendations() {
        const container = document.getElementById('ai-recommendations');
        container.innerHTML = `
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        `;

        try {
            const res = await window.api.getRecommendations();
            const recs = res.data.recommendations || [];
            
            container.innerHTML = '';
            recs.forEach((rec, idx) => {
                const div = document.createElement('div');
                div.className = 'rec-item';
                div.style.animationDelay = `${idx * 0.2}s`;
                div.textContent = rec;
                container.appendChild(div);
            });
        } catch (err) {
            container.innerHTML = '<p class="text-danger">Failed to load recommendations.</p>';
        }
    }

    renderCharts(records) {
        const latest = records[0];
        
        // --- PIE CHART (Emission Distribution) ---
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        if(this.charts.pie) this.charts.pie.destroy();
        
        this.charts.pie = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Transport', 'Energy', 'Food', 'Waste', 'Water'],
                datasets: [{
                    data: [
                        latest.transport_emissions, 
                        latest.energy_emissions, 
                        latest.food_emissions, 
                        latest.waste_emissions, 
                        latest.water_emissions
                    ],
                    backgroundColor: ['#22C55E', '#F59E0B', '#EF4444', '#84CC16', '#3B82F6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });

        // --- LINE CHART (Monthly Trend) ---
        // Reverse to show chronological left to right
        const chronoRecords = [...records].reverse();
        
        const lineCtx = document.getElementById('lineChart').getContext('2d');
        if(this.charts.line) this.charts.line.destroy();

        this.charts.line = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: chronoRecords.map(r => new Date(r.created_at).toLocaleDateString()),
                datasets: [{
                    label: 'Total Emissions (kg CO₂)',
                    data: chronoRecords.map(r => r.total),
                    borderColor: '#22C55E',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // UTILS
    animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if(!obj) return;
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'fa-info-circle';
        if(type === 'success') icon = 'fa-check-circle';
        if(type === 'error') icon = 'fa-exclamation-circle';

        toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
