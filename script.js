// Inicializa o mapa com uma posição padrão
var map = L.map('map').setView([-23.55052, -46.633308], 13);

// Camadas do mapa
var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
});
streetMap.addTo(map);

// Botão para atualizar localização
document.getElementById("update-location").addEventListener("click", getUserLocation);

// Função para capturar a localização do usuário
function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;

                // Adiciona um marcador e centraliza o mapa na nova posição
                L.marker([userLat, userLng]).addTo(map)
                    .bindPopup("<b>Você está aqui!</b>").openPopup();
                map.setView([userLat, userLng], 15);
            },
            function (error) {
                console.error("Erro ao obter localização:", error.message);
                alert("Não foi possível obter sua localização.");
            }
        );
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
    }
}

// Captura a localização inicial ao carregar a página
getUserLocation();

// Função para buscar endereços
document.getElementById("search-button").addEventListener("click", function() {
    var query = document.getElementById("search-input").value;
    
    if (query.trim() === "") {
        alert("Digite um endereço ou nome de lugar para buscar.");
        return;
    }

    // Chamada para a API Nominatim (OpenStreetMap)
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var result = data[0]; // Pega o primeiro resultado da pesquisa
                var lat = result.lat;
                var lon = result.lon;

                // Adiciona um marcador no local encontrado
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`<b>${query}</b><br>Latitude: ${lat}<br>Longitude: ${lon}`)
                    .openPopup();

                // Centraliza o mapa no local encontrado
                map.setView([lat, lon], 15);
            } else {
                alert("Local não encontrado. Tente novamente.");
            }
        })
        .catch(error => console.error("Erro na busca:", error));
});
