import express from 'express';
import bodyParser from 'body-parser'; // For processing request body
import mongoose from 'mongoose'; // For MongoDB access
import cors from 'cors'; // for CORS
import dotenv from 'dotenv'; // For managing environtment variables
import multer from 'multer';
import helmet from 'helmet'; // For request security
import morgan from 'morgan'; // For login
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import { register } from './controllers/auth.js';

/** CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url); // Using data from 'import' to get the directory
const __dirname = path.dirname(__filename);
dotenv.config(); // Start dotenv
const app = express(); // Define Express.js for using middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets'))); // Set the directory of where we keep our assets e.g: images

/** FILE STORAGE */
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/assets'); // Every upload will be saved here
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

/** ROUTES WITH FILES */
app.post('/auth/register', upload.single('picture'), register); // Upload.single is a middleware. register is a controller

/** ROUTES */
app.use('/auth', authRoutes);

/** MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`Server port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));
