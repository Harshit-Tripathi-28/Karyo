import multer from "multer";
import { ApiError } from "../utils/ApiError";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback
) => {
  if (file.mimetype !== "application/pdf") {
    callback(
      new ApiError(
        400,
        "Only PDF resumes are supported"
      )
    );

    return;
  }

  callback(null, true);
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});