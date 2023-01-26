import Post from "../models/Post.js";
import User from "../models/User.js";

/** CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    // Save the 
    await newPost.save();

    // Get updated feed
    const post = await Post.find();

    // Return the new feed
    res.status(201).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

/** READ */
export const getFeedPosts = async (req, res) => {
  try {
    // Get updated feed
    const post = await Post.find();

    // Return the new feed
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

/** UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if(isLiked) {
      post.likes.delete(userId); // Remove like
    } else {
      post.likes.set(userId, true); // Like the post
    }

    // Update post with new like data
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}