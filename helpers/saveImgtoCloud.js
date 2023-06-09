const { Storage } = require('@google-cloud/storage');

const cloudinary = require('cloudinary').v2;

const saveImageToCloudStorage = async (buffer) => {
   cloudinary.config({
    cloud_name: "deyuwpbhc",
    api_key: "225781465317592",
    api_secret: "Ss2UT3se-ZUhe1WkU5JepyP1iIE",
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      })
      .end(buffer);
  });
};

const creatUrl = async (images) => {
  try {
    if (images.length > 1) {
       const urls = images.map(async (img) => await saveImageToCloudStorage(img.data));
       return Promise.all(urls)
    }

    return await saveImageToCloudStorage(images.data);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  creatUrl,
};
