const saveImageToCloudStorage = async (filename, buffer) => {
  
  const storage = new Storage();
const bucketName = 'itransitionpostimg';
  const bucket = storage.bucket(bucketName);

  const file = await bucket.file(filename);
  await file.save(buffer);

  const url = await file.getSignedUrl({
    action: 'read',
    expires: '2030-01-01',
  });

  return url;
};

 const creatUrl = (images) => {
  const image =
  images.length > 1
    ? await images.map(async (img) => {
        const url = await saveImageToCloudStorage(img.name, img.data).then(
          (url) => String(url)
        );

        return url;
      })
    : await saveImageToCloudStorage(
      images.name,
      images.data
      ).then((url) => String(url));


  return req.files['image[]'].length > 1 ? await Promise.all(image) : image;
}
const hasDuplicates = async (tags) => {
  if (tags.length) {
    const getTagsFromDb = await Tags.find();
    const filteredTags = getTagsFromDb.map((tag) => tag.tags);
    const unWrapp = [].concat(...filteredTags);
    const combineTags = [...unWrapp, req.body['tags[]']];

    if (new Set(combineTags).size !== combineTags.length) {
      return false;
    } else {
      const allTags = new Tags({ tags: req.body['tags[]'] });
      await allTags.save();
    }
  }
};

module.exports = {
  creatUrl,hasDuplicates
};
