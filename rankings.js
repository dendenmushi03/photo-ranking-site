window.onload = function() {
    fetch('http://localhost:3000/get-rankings')
        .then(response => response.json())
        .then(data => {
            const rankingsContainer = document.getElementById('rankings-container');
            const rankings = data.rankings;

            rankings.forEach((photo, index) => {
                const div = document.createElement('div');
                div.innerHTML = `${index + 1}. ${photo.name} - ${photo.votes}票`;
                rankingsContainer.appendChild(div);
            });
        })
        .catch(error => {
            console.error('ランキング取得に失敗しました:', error);
        });
};
