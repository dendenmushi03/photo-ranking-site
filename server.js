const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// アップロード先のディレクトリを指定（存在しない場合は作成）
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multerの設定（保存場所とファイル名の設定）
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // uploadsフォルダに保存
    },
    filename: (req, file, cb) => {
        // ファイル名は元の名前にタイムスタンプを加えて一意にする
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// JSONを受け取る設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 写真アップロード用のエンドポイント
app.post('/upload-photo', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'ファイルがアップロードされていません' });
    }
    res.json({
        message: 'ファイルがアップロードされました',
        file: req.file
    });
});

// 投票機能のエンドポイント
let photoRankings = [];

app.post('/vote-photo', (req, res) => {
    const { photoId } = req.body;

    if (!photoId) {
        return res.status(400).send({ message: '無効な投票' });
    }

    // 投票結果の更新
    const photo = photoRankings.find(p => p.id === photoId);
    if (photo) {
        photo.votes += 1;
    } else {
        photoRankings.push({ id: photoId, votes: 1 });
    }

    res.json({ message: '投票が完了しました', rankings: photoRankings });
});

// ランダムで表示する写真を返すエンドポイント
app.get('/random-photos', (req, res) => {
    const photoFiles = fs.readdirSync(uploadDir);
    const randomPhotos = [];

    // ランダムに3枚選ぶ
    while (randomPhotos.length < 3) {
        const randomIndex = Math.floor(Math.random() * photoFiles.length);
        const photoFile = photoFiles[randomIndex];
        if (!randomPhotos.includes(photoFile)) {
            randomPhotos.push(photoFile);
        }
    }

    res.json(randomPhotos);
});

// サーバーを起動
app.listen(3000, () => {
    console.log('サーバーがポート3000で起動しました');
});
