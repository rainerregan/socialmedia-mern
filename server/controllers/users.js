import User from "../models/User.js";

/** READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params; // Get the id from query param
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const getUserFriends = async (req, res) => {

  try {
    const { id } = req.params;
    const user = await User.findById(id);
  
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
  
    const formattedFriends = friends.map(
      ({ _id, firstName, lastname, occupation, location, picturePath }) => {
        return { _id, firstName, lastname, occupation, location, picturePath }
      }
    )
  
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }

}

/** UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params; // Get data from query parameter

    const user = await User.findById(id); // Get user data
    const friend = await User.findById(friendId); // Get friend data

    if(user.friends.includes(friendId)){
      user.friends = user.friends.filter((id) => id !== friendId); // Remove friend from friendlist
      friend.friends = friend.friends.filter((id) => id !== id); // Remove user from friend's friendlist
    } else {
      user.friends.push(friendId); // Add friend to user's friendlist
      friend.friends.push(id); // Add user to friend's friendlist
    }

    await user.save(); // Update data
    await friend.save(); // Update data

    // Get new friendlist
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
  
    // Format new friendlist
    const formattedFriends = friends.map(
      ({ _id, firstName, lastname, occupation, location, picturePath }) => {
        return { _id, firstName, lastname, occupation, location, picturePath }
      }
    )

    // Return new friendlist
    res.status(200).json(formattedFriends);

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}