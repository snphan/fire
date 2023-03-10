import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import { NODE_ENV } from './config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import convert from 'heic-convert';
import { promisify } from 'util';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
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
  },
  limits: {
    fieldSize: 8 * 1024 * 1024,
    fileSize: 8 * 1024 * 1024
  }
})

const upload = multer({ storage });

app.post("/upload", upload.array('file'), async (req: any, res) => {
  let names = [];
  const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

  if (Authorization) {
    for (const file of req.files) {
      if (file.filename.toLowerCase().match(/(.heic)$/)) {
        // Convert .heic file
        const inputBuffer = await promisify(fs.readFile)(`media/${file.filename}`);
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 0.5
        })
        const newFilename = file.filename.replace(/.heic/i, '.jpeg');
        fs.createWriteStream(`media/${newFilename}`).write(Buffer.from(outputBuffer));
        // Cleanup the .heic file
        await promisify(fs.unlink)(`media/${file.filename}`);
        names.push(newFilename);
      } else {
        names.push(file.filename);
      }
    };
    res.json({ status: "success", filenames: names });
  } else {
    res.json({ status: "error", message: "no authorization", filenames: [] });
  }
})

app.post("/media/delete", (req: any, res) => {
  const data = req.body;
  const { fileName } = data;
  const filePath = `./media/${fileName}`;
  console.log("Received a request to delete file", data);
  fs.unlink(filePath, (err) => {
    if (err) {
      res.json({ status: "error", message: err, deleteFileName: fileName });
    } else {
      res.json({ status: "success", deleteFileName: fileName })
    }
  });
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