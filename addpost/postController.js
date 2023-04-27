const User = require('../models/user');
const Post = require('../models/post');
const Tags = require('../models/tags');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'itransitionpostimg';

const saveImageToCloudStorage = async (filename, buffer) => {
  const bucket = storage.bucket(bucketName);

  const file = bucket.file(filename);
  await file.save(buffer);

  const url = await file.getSignedUrl({
    action: 'read',
    expires: '2030-01-01',
  });

  return url;
};

const addPost = async (req, res) => {
  try {
    const { title, text, topic, group, authorRaiting, userId } = req.body;
    const image = await saveImageToCloudStorage(
      req.files.image.name,
      req.files.image.data
    )
      .then((url) => {
        return String(url);
      })
      .catch((err) => {
        console.error('Error:', err);
      });
    const user = await User.findById(userId);

    const newPost = new Post({
      author: user.username,
      title,
      text,
      topic,
      image,
      group,
      likes: [],
      tags: req.body['tags[]'],
      authorRaiting,
    });
    if (!image) {
      return res.json({ message: 'Image is required' });
    }

    if (req.body['tags[]']) {
      const allTags = new Tags({ tags: req.body['tags[]'] });
      await allTags.save();
    }
    await newPost.save();

    await user.updateOne({
      $push: { posts: newPost },
    });

    return res.status(200).json({ newPost, message: 'Created successfully' });
  } catch (err) {
    return res.json({ message: 'fill all required fields' });
  }
};

const postUpdate = async (req, res) => {
  try {
    const { postID, text, title, topic, authorRaiting } = req.body;

    const post = await Post.findById(postID);

    await post.updateOne({
      text,
      title,
      topic,
      authorRaiting,
    });
    return res.status(200).json({ message: 'updated' });
  } catch (err) {
    console.error(err);
  }
};

const deletPost = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const user = User.findById(userId);
    console.log(user);
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
    console.log(value)
    return res.status(200).json({message:'rated'});
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
