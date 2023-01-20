import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import { NODE_ENV } from './config';

const app = express();


app.use("/media", express.static("./media"));
app.use(cors({ origin: ['http://localhost:8000'], credentials: true }));
/* Multer Settings */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "media");
  },
  filename: (req, file, callback) => {
    /* Custom UUID file name */
    const { originalname } = file;
    callback(null, `${uuidv4()}-${originalname}`);
  }
})

const upload = multer({ storage });

app.post("/upload", upload.array('file'), (req: any, res) => {
  let names = [];
  req.files.forEach(file => names.push(file.filename));
  res.json({ status: "success", filenames: names });
})

if (NODE_ENV === "production") {
  https
    .createServer(
      {
        key: fs.readFileSync("/etc/ssl/live/firecash.app/privkey.pem"),
        cert: fs.readFileSync("/etc/ssl/live/firecash.app/fullchain.pem"),
      },
      app
    ).listen(4000, () => {
      console.log("Upload server is running at port https://localhost:4000");
    });
} else {
  app.listen(4000, () => {
    console.log("Upload server is running on port http://localhost:4000")
  });
}