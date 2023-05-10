
const { Storage } = require('@google-cloud/storage');

const saveImageToCloudStorage = async (filename, buffer) => {
  const storage = new Storage();
  const bucketName = 'itransitionpostimg';
  const bucket = storage.bucket(bucketName);

  const file = bucket.file(filename);
  await file.save(buffer);

  const url = await file.getSignedUrl({
    action: 'read',
    expires: '2030-01-01',
  });

  return url;
};


const creatUrl = async (images) => {
  if (images.length > 1) {
    const url = images.map((img) => {
      return saveImageToCloudStorage(img.name, img.data).then((url) =>
        String(url)
      );
    });

    return Promise.all(url);
  }

  const url = await saveImageToCloudStorage(images.name, images.data).then(
    (url) => String(url)
  );
  return url;
};


module.exports = {
  creatUrl,

};
