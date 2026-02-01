const initialPlaces = [
    { id: 1, name: "الدرعية التاريخية", city: "الرياض", location: "24.7324,46.5772", description: "موقع سياحي وطبيعي رائع", image: "https://images.unsplash.com/photo-1765303314168-323faf51292b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
    { id: 2, name: "جبل السودة", city: "أبها", location: "18.2749,42.3664", description: "أعلى قمة جبلية في المملكة", image: "https://images.unsplash.com/photo-1660841699513-bd3d3322c17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" }
];

let places = JSON.parse(localStorage.getItem('atharPlaces')) || initialPlaces;
let currentFilter = 'الكل';

function savePlaces() { localStorage.setItem('atharPlaces', JSON.stringify(places)); }

function renderPlaces() {
    const grid = document.getElementById('placesGrid');
    const filtered = currentFilter === 'الكل' ? places : places.filter(p => p.city === currentFilter);
    if (filtered.length === 0) { 
        grid.innerHTML = '<div style="text-align:center;padding:40px;color:#27ae60;"><h3>لا توجد أماكن في هذه المدينة</h3></div>'; 
        return; 
    }
    grid.innerHTML = filtered.map(place => `
        <div class="place-card" onclick="openDetailModal(${place.id})">
            <img src="${place.image}" alt="${place.name}">
            <div class="place-card-content">
                <h3>${place.name}</h3>
                <p class="city">${place.city}</p>
            </div>
        </div>`).join('');
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.city;
        renderPlaces();
    });
});

function openDetailModal(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;
    document.getElementById('modalImage').src = place.image;
    document.getElementById('modalTitle').textContent = place.name;
    document.getElementById('modalCity').textContent = place.city;
    document.getElementById('modalDescription').textContent = place.description;
    document.getElementById('modalMapLink').href = `https://www.google.com/maps?q=${place.location}`;
    document.getElementById('detailModal').classList.add('active');
}

function openAddModal() { document.getElementById('addModal').classList.add('active'); }

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    if (id === 'addModal') document.getElementById('addPlaceForm').reset();
}

document.querySelectorAll('.modal').forEach(mod => {
    mod.addEventListener('click', e => { if (e.target === mod) closeModal(mod.id); });
});

function addPlace(e) {
    e.preventDefault();
    const fileInput = document.getElementById('placeImageFile');
    const reader = new FileReader();
    reader.onload = function (event) {
        const newPlace = {
            id: Date.now(),
            name: document.getElementById('placeName').value,
            city: document.getElementById('placeCity').value,
            location: document.getElementById('placeLocation').value,
            description: document.getElementById('placeDescription').value,
            image: event.target.result
        };
        places.unshift(newPlace);
        savePlaces();
        const existingCities = Array.from(document.querySelectorAll('.filter-btn')).map(b => b.dataset.city);
        if (!existingCities.includes(newPlace.city)) {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.city = newPlace.city;
            btn.textContent = newPlace.city;
            btn.addEventListener('click', function () {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.city;
                renderPlaces();
            });
            document.querySelector('.filter-section').appendChild(btn);
        }
        closeModal('addModal');
        renderPlaces();
        alert('تم إضافة المكان بنجاح! 🎉');
    }
    if (fileInput.files[0]) reader.readAsDataURL(fileInput.files[0]);
}

renderPlaces();
