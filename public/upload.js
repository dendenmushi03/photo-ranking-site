document.getElementById('upload-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('photo', document.querySelector('input[type="file"]').files[0]);

    fetch('http://localhost:3000/upload-photo', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('写真がアップロードされました！');
    })
    .catch(error => {
        console.error('アップロードに失敗しました:', error);
        alert('アップロードに失敗しました。');
    });
});
