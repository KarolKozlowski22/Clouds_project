function fetchUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById('output');
            output.innerHTML = `
                <h2 class="mb-3">Użytkownicy</h2>
                <ul class="list-group">
                    ${data.map(user => `<li class="list-group-item">${user.name} ${user.surname}, wiek: ${user.age}</li>`).join('')}
                </ul>
            `;
        })
        .catch(error => console.error('Błąd:', error));
}

function fetchMovies() {
    fetch('/movies')
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById('output');
            output.innerHTML = `
                <h2 class="mb-3">Filmy</h2>
                <div class="row row-cols-1 row-cols-md-2 g-3">
                    ${data.map(movie => `
                        <div class="col">
                            <div class="card h-100 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${movie.title}</h5>
                                    <p class="card-text">
                                        <strong>Gatunek:</strong> ${movie.genre} <br>
                                        <strong>Data premiery:</strong> ${movie.year} <br>
                                        <strong>Reżyser:</strong> ${movie.director}
                                    </p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        })
        .catch(error => console.error('Błąd:', error));
}

function fetchWatchedMovies() {
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;

    if (!name || !surname) {
        alert('Proszę podać imię i nazwisko.');
        return;
    }

    fetch(`/watched/${name}/${surname}`)
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById('output');
            if (data.length === 0) {
                output.innerHTML = `<p class="text-danger">Brak filmów obejrzanych przez ${name} ${surname}.</p>`;
            } else {
                output.innerHTML = `
                    <h2 class="mb-3">Filmy obejrzane przez ${name} ${surname}</h2>
                    <ul class="list-group">
                        ${data.map(movie => `
                            <li class="list-group-item">
                                <strong>${movie.title}</strong> (${movie.genre}, ${movie.year}) - Reżyser: ${movie.director}
                            </li>
                        `).join('')}
                    </ul>
                `;
            }
        })
        .catch(error => console.error('Błąd:', error));
}

function fetchLikedMovies() {
    const name = document.getElementById('liked-name').value;
    const surname = document.getElementById('liked-surname').value;

    if (!name || !surname) {
        alert('Proszę podać imię i nazwisko.');
        return;
    }

    fetch(`/liked/${name}/${surname}`)
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById('output');
            if (data.length === 0) {
                output.innerHTML = `<p class="text-danger">Brak polubionych filmów dla ${name} ${surname}.</p>`;
            } else {
                output.innerHTML = `
                    <h2 class="mb-3">Filmy polubione przez ${name} ${surname}</h2>
                    <ul class="list-group">
                        ${data.map(movie => `
                            <li class="list-group-item">
                                <strong>${movie.title}</strong> (${movie.genre}, ${movie.year}) - Reżyser: ${movie.director}
                            </li>
                        `).join('')}
                    </ul>
                `;
            }
        })
        .catch(error => console.error('Błąd:', error));
}

function fetchRecommendations() {
    const name = document.getElementById('recommend-name').value;
    const surname = document.getElementById('recommend-surname').value;

    if (!name || !surname) {
        alert('Proszę podać imię i nazwisko.');
        return;
    }

    fetch(`/recommendations/${name}/${surname}`)
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById('output');
            if (data.length === 0) {
                output.innerHTML = `<p class="text-warning">Brak rekomendacji dla ${name} ${surname}.</p>`;
            } else {
                output.innerHTML = `
                    <h2 class="mb-3">Rekomendowane filmy dla ${name} ${surname}</h2>
                    <ul class="list-group">
                        ${data.map(movie => `
                            <li class="list-group-item">
                                <strong>${movie.title}</strong> (${movie.genre}, ${movie.year}) - Reżyser: ${movie.director}
                            </li>
                        `).join('')}
                    </ul>
                `;
            }
        })
        .catch(error => console.error('Błąd:', error));
}

function fetchUsersWhoWatched() {
    const title = document.getElementById('movie-title').value;

    if (!title) {
        alert('Proszę podać tytuł filmu.');
        return;
    }

    fetch(`/watched-by/${encodeURIComponent(title)}`)
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById('output');
            if (data.length === 0) {
                output.innerHTML = `<p class="text-danger">Brak użytkowników, którzy obejrzeli film "${title}".</p>`;
            } else {
                output.innerHTML = `
                    <h2 class="mb-3">Użytkownicy, którzy obejrzeli film "${title}"</h2>
                    <ul class="list-group">
                        ${data.map(user => `
                            <li class="list-group-item">
                                ${user.name} ${user.surname}, wiek: ${user.age}
                            </li>
                        `).join('')}
                    </ul>
                `;
            }
        })
        .catch(error => console.error('Błąd:', error));
}

function fetchMostWatchedMovies() {
    fetch('/most-watched')
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById('output');
            if (data.length === 0) {
                output.innerHTML = `<p class="text-danger">Brak danych o najpopularniejszych filmach.</p>`;
            } else {
                output.innerHTML = `
                    <h2 class="mb-3">Najpopularniejsze Filmy</h2>
                    <ol class="list-group list-group-numbered">
                        ${data.map(movie => `
                            <li class="list-group-item">
                                <strong>${movie.title}</strong> (${movie.genre}, ${movie.year}) - Reżyser: ${movie.director} 
                                <span class="badge bg-primary ms-2">${movie.watch_count} obejrzeń</span>
                            </li>
                        `).join('')}
                    </ol>
                `;
            }
        })
        .catch(error => console.error('Błąd:', error));
}


