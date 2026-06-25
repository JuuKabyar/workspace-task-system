import multer from "multer";

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/avatars"); // upload folder
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName); // unique file name
  }
});

export const upload = multer({
  storage
});