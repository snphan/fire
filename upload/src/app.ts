import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const app = express();


app.use("/media", express.static("./media"));

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

app.listen(4000, () => console.log("listening on port 4000"));