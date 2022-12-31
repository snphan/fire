import express from 'express';
import multer from 'multer';

const app = express();

const upload = multer({ dest: "./files" });

app.post("/upload", upload.array('file'), (req, res) => {
  res.json({ status: "success" });
})

app.listen(4000, () => console.log("listening on port 4000"));