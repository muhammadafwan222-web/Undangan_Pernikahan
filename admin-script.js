const SUPABASE_URL = 'https://jspagidgtuvuyjodgnze.supabase.co'; // GANTI INI (SAMA DENGAN SCRIPT.JS)
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzcGFnaWRndHV2dXlqb2RnbnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MTkxNzUsImV4cCI6MjEwNjE5NTE3NX0.HDK5qVb6w6Qq0SiU-613jL740oSImMJsjAysxaLZLtw'; // GANTI INI (SAMA DENGAN SCRIPT.JS)
const ADMIN_PASSWORD = "admin123";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function checkPassword() {
    const input = document.getElementById('admin-password').value;
    if (input === ADMIN_PASSWORD) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('admin-dashboard').classList.remove('hidden');
        loadFormValues();
    } else {
        document.getElementById('login-error').textContent = "Password salah!";
    }
}

async function loadFormValues() {
    const { data, error } = await supabase.from('wedding_config').select('*').eq('id', 1).single();
    
    if (data) {
        document.getElementById('adm-groom-name').value = data.groom_name || '';
        document.getElementById('adm-groom-fullname').value = data.groom_fullname || '';
        document.getElementById('adm-groom-parents').value = data.groom_parents || '';
        document.getElementById('adm-bride-name').value = data.bride_name || '';
        document.getElementById('adm-bride-fullname').value = data.bride_fullname || '';
        document.getElementById('adm-bride-parents').value = data.bride_parents || '';
        document.getElementById('adm-event-date').value = data.event_date || '';
        document.getElementById('adm-event-time').value = data.event_time || '';
        document.getElementById('adm-venue').value = data.venue || '';
        document.getElementById('adm-address').value = data.address || '';
        document.getElementById('adm-maps-url').value = data.maps_url || '';
        document.getElementById('adm-music-src').value = data.music_src || '';
        document.getElementById('adm-primary-color').value = data.primary_color || '#d4a574';
        document.getElementById('adm-wa-number').value = data.wa_number || '';
    }
}

async function saveConfig() {
    const updates = {
        groom_name: document.getElementById('adm-groom-name').value,
        groom_fullname: document.getElementById('adm-groom-fullname').value,
        groom_parents: document.getElementById('adm-groom-parents').value,
        bride_name: document.getElementById('adm-bride-name').value,
        bride_fullname: document.getElementById('adm-bride-fullname').value,
        bride_parents: document.getElementById('adm-bride-parents').value,
        event_date: document.getElementById('adm-event-date').value,
        event_time: document.getElementById('adm-event-time').value,
        venue: document.getElementById('adm-venue').value,
        address: document.getElementById('adm-address').value,
        maps_url: document.getElementById('adm-maps-url').value,
        music_src: document.getElementById('adm-music-src').value,
        primary_color: document.getElementById('adm-primary-color').value,
        wa_number: document.getElementById('adm-wa-number').value
    };

    const { error } = await supabase.from('wedding_config').update(updates).eq('id', 1);

    if (error) {
        alert('Gagal menyimpan: ' + error.message);
    } else {
        alert('Berhasil disimpan! Data akan langsung terupdate di website.');
    }
}

function previewInvitation() {
    window.open('index.html', '_blank');
}

function logout() {
    location.reload();
}
