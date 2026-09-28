// ==========================================
// KONFIGURASI SUPABASE
// ==========================================
const SUPABASE_URL = 'https://jspagidgtuvuyjodgnze.supabase.co; // GANTI INI
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzcGFnaWRndHV2dXlqb2RnbnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MTkxNzUsImV4cCI6MjEwNjE5NTE3NX0.HDK5qVb6w6Qq0SiU-613jL740oSImMJsjAysxaLZLtw'; // GANTI INI

const defaultConfig = {
    groom_name: 'Ahmad',
    groom_fullname: 'Ahmad Rizki Pratama',
    groom_parents: 'Bapak Budi & Ibu Siti',
    bride_name: 'Siti',
    bride_fullname: 'Siti Nurhaliza Putri',
    bride_parents: 'Bapak Ahmad & Ibu Fatimah',
    event_date: '2026-12-25',
    event_time: '10:00 WIB',
    venue: 'Gedung Serba Guna Jakarta',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    maps_url: 'https://maps.google.com/maps?q=-6.2088,106.8456',
    music_src: '',
    primary_color: '#d4a574',
    wa_number: '6281234567890'
};

let supabase = null;

if (SUPABASE_URL && SUPABASE_KEY && SUPABASE_KEY !== 'YOUR_ANON_KEY_HERE') {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
        console.warn('Supabase init error:', e);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});

async function initializeApp() {
    let config = null;

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('wedding_config')
                .select('*')
                .eq('id', 1)
                .single();

            if (!error && data) {
                config = data;
                console.log('Data loaded from Supabase');
            } else {
                console.warn('Supabase error:', error);
            }
        } catch (err) {
            console.warn('Fetch error:', err);
        }
    }

    if (!config) {
        config = defaultConfig;
        console.log('Using default config');
    }

    renderContent(config);
    startCountdown(config.event_date);
    setupMusic(config.music_src);
    setupEventListeners();
    hideLoadingScreen();
}

function renderContent(data) {
    const el = (id) => document.getElementById(id);

    el('groom-name').textContent = data.groom_name || 'Mempelai Pria';
    el('bride-name').textContent = data.bride_name || 'Mempelai Wanita';
    el('groom-fullname').textContent = data.groom_fullname || '';
    el('bride-fullname').textContent = data.bride_fullname || '';
    el('groom-parents').textContent = data.groom_parents || '';
    el('bride-parents').textContent = data.bride_parents || '';
    el('footer-groom').textContent = data.groom_name || '';
    el('footer-bride').textContent = data.bride_name || '';

    if (data.event_date) {
        const eventDate = new Date(data.event_date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = eventDate.toLocaleDateString('id-ID', options);
        el('event-date').textContent = dateStr;
        el('event-date-detail').textContent = dateStr;
    }

    el('event-time').textContent = data.event_time || '';
    el('event-venue').textContent = data.venue || '';
    el('event-address').textContent = data.address || '';

    if (data.maps_url) {
        el('maps-link').href = data.maps_url;
        const address = data.address || '';
        el('google-map').src = 'https://www.google.com/maps?q=' + encodeURIComponent(address) + '&output=embed';
    }

    if (data.wa_number) {
        const message = 'Halo, saya ingin mengkonfirmasi kehadiran di pernikahan ' + data.groom_name + ' & ' + data.bride_name;
        el('whatsapp-link').href = 'https://wa.me/' + data.wa_number + '?text=' + encodeURIComponent(message);
    }

    if (data.primary_color) {
        document.documentElement.style.setProperty('--primary-color', data.primary_color);
    }
}

function startCountdown(targetDateString) {
    if (!targetDateString) return;

    const targetDate = new Date(targetDateString).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function setupMusic(src) {
    if (!src) return;

    const audio = document.getElementById('bg-music');
    audio.src = src;
    document.getElementById('music-control').classList.remove('hidden');
}

function setupEventListeners() {
    const openBtn = document.getElementById('open-invitation');
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            document.getElementById('main-content').classList.remove('hidden');
            document.getElementById('hero').style.display = 'none';
            document.getElementById('opening').scrollIntoView({ behavior: 'smooth' });

            const audio = document.getElementById('bg-music');
            if (audio.src && audio.src !== window.location.href) {
                audio.play().catch(function(e) {
                    console.log('Autoplay blocked:', e);
                });
            }
        });
    }

    const playBtn = document.getElementById('play-pause-btn');
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            const audio = document.getElementById('bg-music');
            const icon = this.querySelector('i');

            if (audio.paused) {
                audio.play();
                icon.className = 'fas fa-pause';
            } else {
                audio.pause();
                icon.className = 'fas fa-play';
            }
        });
    }
}

function hideLoadingScreen() {
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1000);
}
