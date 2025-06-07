import {v2 as cloudinary} from 'cloudinary';

export const uploadImageToCloudinary = async (fileBuffer: Buffer): Promise<string> => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {resource_type: 'image'},
      (error, result) => {
        if (error) {
          return reject(new Error(error.message));
        }
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Cloudinary did not return a result."));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};
