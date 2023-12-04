const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const articleSchema = require("./models/articleSchema");
const Article = mongoose.model("Article", articleSchema);

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const main = async () => {
  await mongoose.connect(process.env.DB_URI, { dbName: "imageDB" });
  console.log("database connection established");
};

main();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const filename =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    cb(null, filename + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1mb
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Image type not supported"));
    }
  },
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const imageFile = req.file;
  const title = req.body.title;
  console.log(imageFile.filename);
  const newArticle = new Article({
    title: title,
    image: imageFile.filename,
  });

  await newArticle.save();
  res.status(201).send({ message: "Article saved successfully" });
});
app.listen(port, () => {
  console.log(`express server listening on port ${port}`);
});
