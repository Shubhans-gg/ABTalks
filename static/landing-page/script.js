
        // ---------- Theme ----------
        const root = document.documentElement;
        const themeToggle = document.getElementById('themeToggle');
        function setTheme(mode) {
            root.classList.toggle('light', mode === 'light');
        }
        // default: dark (matches late-night-phone-use context). No persistence per artifact sandbox rules.
        setTheme('dark');
        themeToggle.addEventListener('click', () => {
            setTheme(root.classList.contains('light') ? 'dark' : 'light');
        });

        // ---------- Streak grid builders ----------
        function buildGrid(containerId, doneCount, todayIndex, missedIndexes = []) {
            const el = document.getElementById(containerId);
            el.innerHTML = '';
            for (let i = 0; i < 60; i++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (missedIndexes.includes(i)) cell.classList.add('missed');
                else if (i === todayIndex) cell.classList.add('today');
                else if (i < doneCount) cell.classList.add('done');
                el.appendChild(cell);
            }
        }
        buildGrid('heroGrid', 0, -1);           // landing: blank slate
        buildGrid('dashGrid', 11, 11);          // dashboard: 11 done, day 12 (index 11) is today

        // ---------- Fake submit flow ----------
        const submitBtn = document.getElementById('submitBtn');
        const submitStatus = document.getElementById('submitStatus');
        submitBtn.addEventListener('click', () => {
            const gh = document.getElementById('ghInput').value.trim();
            const li = document.getElementById('liInput').value.trim();
            if (!gh || !li) {
                document.getElementById('ghInput').style.borderColor = gh ? 'var(--border)' : 'var(--danger)';
                document.getElementById('liInput').style.borderColor = li ? 'var(--border)' : 'var(--danger)';
                return;
            }
            submitBtn.textContent = 'Submitted ✓';
            submitBtn.style.opacity = '.7';
            submitBtn.disabled = true;
            submitStatus.classList.add('show');
        });

        // ---------- Hash router ----------
        const pages = {
            '/': 'page-landing',
            '/dashboard': 'page-dashboard',
            '/day/12': 'page-day'
        };
        function resolveRoute(hash) {
            const clean = hash.replace('#', '') || '/';
            if (clean.startsWith('/day/')) return 'page-day';
            return pages[clean] || 'page-landing';
        }
        function render() {
            const targetId = resolveRoute(location.hash);
            document.querySelectorAll('.app').forEach(el => el.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            window.scrollTo(0, 0);
        }
        window.addEventListener('hashchange', render);
        if (!location.hash) location.hash = '#/';
        render();
