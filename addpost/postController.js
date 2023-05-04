const User = require('../models/user');
const Post = require('../models/post');
const Tags = require('../models/tags');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'itransitionpostimg';

const saveImageToCloudStorage = async (filename, buffer) => {
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

const addPost = async (req, res) => {
  try {
    const { title, text, topic, group, authorRaiting, userId } = req.body;
    const deletePtag = text.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '');

    const urls = creatUrl(req.files['image[]'])

    const user = await User.findById(userId);

    await hasDuplicates(req.body['tags[]']);

    const newPost = new Post({
      author: user.username,
      title,
      text: deletePtag,
      topic,
      image: urls,
      group,
      likes: [],
      tags: req.body['tags[]'],
      authorRaiting,
    });
    if (!image) {
      return res.json({ message: 'Image is required' });
    }

    await newPost.save();

    await user.updateOne({
      $push: { posts: newPost },
    });

    return res.status(200).json({ newPost, message: 'Created successfully' });
  } catch (err) {
    console.log(err);
    return res.json({ message: err.message });
  }
};

const postUpdate = async (req, res) => {
  try {
    const { postId, text, title, topic, authorRaiting } = req.body;

    const deletePtagText = text.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '');

    const post = await Post.findById(postId);

    await post.updateOne({
      text: deletePtagText,
      title,
      topic,
      authorRaiting,
    });
    return res.status(200).json({ message: 'updated' });
  } catch (err) {
    console.log(err);
  }
};

const deletPost = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const user = User.findById(userId);
    await Post.findByIdAndDelete(postId);
    await user.updateOne({
      $pull: { posts: postId },
    });
    return res.status(200).json({ message: 'deleted successfully' });
  } catch (e) {
    console.log(e);
  }
};

const getUserPost = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);
    const listOfPosts = await Promise.all(
      user?.posts.map((post) => {
        return Post.findById(post._id);
      })
    );
    return res.json(listOfPosts);
  } catch (e) {
    console.log(e);
  }
};

const getAllTags = async (_, res) => {
  try {
    const tags = await Tags.find();
    const tagsWithoutID = tags.map((tag) => tag.tags);
    const concataedAllTags = [].concat(...tagsWithoutID);

    return res.json(concataedAllTags);
  } catch (e) {
    console.log(e);
  }
};

const getAllTposts = async (_, res) => {
  const posts = await Post.find();

  return res.json(posts);
};

const getPostById = async (req, res) => {
  const { postID } = req.body;
  const post = await Post.findById(postID);

  return res.json(post);
};

const likePost = async (req, res) => {
  try {
    const { postID } = req.body;
    const post = await Post.findById(postID);
    const isLiked = post.likes.some((like) => like === req.userId);
    if (!isLiked) {
      await post.updateOne({
        $push: { likes: req.userId },
      });
    } else {
      await post.updateOne({
        $pull: { likes: req.userId },
      });
    }

    return res.json({ message: 'ok' });
  } catch (e) {
    console.log(e);
  }
};

const addComment = async (req, res) => {
  try {
    const { postID, text } = req.body;
    const user = await User.findById(req.userId);
    const post = await Post.findById(postID);

    await post.updateOne({
      $push: {
        comments: {
          username: user.username,
          text,
        },
      },
    });
    return res.status(200).json({ message: 'added comment' });
  } catch (e) {
    console.log(e);
  }
};

const addRaiting = async (req, res) => {
  try {
    const { postID, value } = req.body;
    const user = await User.findById(req.userId);
    const post = await Post.findById(postID);
    const isRated = post.raiting.some((like) => like.userId === req.userId);

    if (isRated) {
      await post.updateOne({
        $set: {
          raiting: {
            userId: user._id,
            value,
          },
        },
      });
    } else {
      await post.updateOne({
        $push: {
          raiting: {
            userId: user._id,
            value,
          },
        },
      });
    }
    return res.status(200).json({ message: 'rated' });
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  addPost,
  getUserPost,
  getAllTags,
  deletPost,
  getAllTposts,
  getPostById,
  likePost,
  addComment,
  addRaiting,
  postUpdate,
};
