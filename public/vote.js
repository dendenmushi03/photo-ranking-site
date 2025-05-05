window.onload = function() {
    fetch('http://localhost:3000/get-random-photos')
        .then(response => response.json())
        .then(data => {
            const photos = data.photos;
            const photoContainer = document.getElementById('photo-container');
            const voteContainer = document.getElementById('vote-container');
            voteContainer.style.display = 'block';

            photoContainer.innerHTML = '';

            photos.forEach((photo, index) => {
                const imgElement = document.createElement('img');
                imgElement.src = photo;
                imgElement.alt = `photo${index + 1}`;
                imgElement.style.width = '200px';
                imgElement.style.margin = '10px';
                imgElement.style.borderRadius = '8px';
                imgElement.setAttribute('data-index', index);
                photoContainer.appendChild(imgElement);
            });

            document.getElementById('vote-button').addEventListener('click', function() {
                const selectedPhotoIndex = document.querySelector('img.selected')?.getAttribute('data-index');
                if (selectedPhotoIndex !== null) {
                    fetch('http://localhost:3000/vote', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ photoIndex: selectedPhotoIndex })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('投票が完了しました');
                        console.log(data);
                    })
                    .catch(error => {
                        console.error('投票エラー:', error);
                    });
                } else {
                    alert('画像を選んでください');
                }
            });

            photoContainer.addEventListener('click', function(event) {
                if (event.target.tagName === 'IMG') {
                    const allImages = photoContainer.querySelectorAll('img');
                    allImages.forEach(img => img.classList.remove('selected'));
                    event.target.classList.add('selected');
                }
            });
        })
        .catch(error => {
            console.error('写真の取得に失敗しました:', error);
        });
};
