// ==========================================
// KONFIGURASI SUPABASE
// ==========================================
const SUPABASE_URL = 'https://XYZ.supabase.co'; // GANTI INI
const SUPABASE_KEY = 'YOUR_ANON_KEY_HERE'; // GANTI INI

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});

async function initializeApp() {
    hideLoadingScreen();
    const config = await fetchConfigFromDB();
    if (config) {
        renderContent(config);
        startCountdown(config.event_date);
        setupMusic(config.music_src);
    } else {
        console.error("Gagal mengambil data dari database");
    }
}

async function fetchConfigFromDB() {
    try {
        const { data, error } = await supabase
            .from('wedding_config')
            .select('*')
            .eq('id', 1)
            .single();
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Error fetching config:", err);
        return null;
    }
}

function renderContent(data) {
    document.getElementById('groom-name').textContent = data.groom_name;
    document.getElementById('bride-name').textContent = data.bride_name;
    document.getElementById('groom-fullname').textContent = data.groom_fullname;
    document.getElementById('bride-fullname').textContent = data.bride_fullname;
    document.getElementById('groom-parents').textContent = data.groom_parents;
    document.getElementById('bride-parents').textContent = data.bride_parents;
    document.getElementById('footer-groom').textContent = data.groom_name;
    document.getElementById('footer-bride').textContent = data.bride_name;

    const eventDate = new Date(data.event_date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('event-date').textContent = eventDate.toLocaleDateString('id-ID', options);
    document.getElementById('event-date-detail').textContent = eventDate.toLocaleDateString('id-ID', options);
    document.getElementById('event-time').textContent = data.event_time;
    document.getElementById('event-venue').textContent = data.venue;
    document.getElementById('event-address').textContent = data.address;

    if (data.maps_url) {
        document.getElementById('maps-link').href = data.maps_url;
        document.getElementById('google-map').src = `https://www.google.com/maps?q=${encodeURIComponent(data.address)}&output=embed`;
    }

    if (data.wa_number) {
        const message = `Halo, saya ingin mengkonfirmasi kehadiran di pernikahan ${data.groom_name} & ${data.bride_name}`;
        document.getElementById('whatsapp-link').href = `https://wa.me/${data.wa_number}?text=${encodeURIComponent(message)}`;
    }

    if (data.primary_color) {
        document.documentElement.style.setProperty('--primary-color', data.primary_color);
    }
}

function startCountdown(targetDateString) {
    const targetDate = new Date(targetDateString).getTime();
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        if (distance < 0) return;
        
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
    if (src) {
        const audio = document.getElementById('bg-music');
        audio.src = src;
        document.getElementById('music-control').classList.remove('hidden');
        
        document.getElementById('play-pause-btn').addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                document.querySelector('#play-pause-btn i').className = 'fas fa-pause';
            } else {
                audio.pause();
                document.querySelector('#play-pause-btn i').className = 'fas fa-play';
            }
        });
    }
}

document.getElementById('open-invitation').addEventListener('click', function() {
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('hero').style.display = 'none';
    document.getElementById('opening').scrollIntoView({ behavior: 'smooth' });
});

function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 500);
    }, 1500);
}