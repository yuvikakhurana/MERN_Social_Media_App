import User from "../models/User.js";

/* READ */

export const getUser = async (req, res) => {
    try {

        //destructuring id from req.params // id put as query string (parameter)
        const {id} = req.params;

        const user = await User.findById(id);

        //sending the user to frontend
        res.status(200).json(user);

    } catch(err) {
        res.status(404).json({message: err.message });
    }
}

export const getUserFriends = async (req, res) => {

    try {
        const {id} = req.params;

        const user = await User.findById(id);

        //friends will be an array of User objects of friends
        const friends = await Promise.all(

            //array of friend ids mapped to return an array of the User objects of all Friends by finding them through their id
            user.friends.map((id) => User.findById(id))
        );

        //want to give only specific information of friends to the front end
        // so destructuring the friends in param brackets and return those values as an object which will be the returned array

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        )

        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({message: err.message });
    }

}

/* UPDATE */

export const addRemoveFriend = async (req, res) => {
    try {

        //destructuring id and friendId from req.params
        const {id, friendId} = req.params;

        const user = await User.findById(id);

        const friend = await User.findById(friendId);

        //Remember: user.friends is an array of all friend's id's
        if(user.friends.includes(friendId)) {
            //removing the friendId selected using filter ; will return an array from the input array of the elements that meet the condition
            user.friends = user.friends.filter((id) => id !== friendId);

            // 2 way: have to remove user also from the friend's friendsList
            friend.friends = friend.friends.filter((id) => id !== id);

        } else {
            //if they are not included we are going to add them
            //adding to array of friends for both : user and the friend
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        //making sure we save the updates
        await user.save();
        await friend.save();


        //----- sending back formatted friends with updates to the frontend ----- //

        //friends will be an array of User objects of friends
        const friends = await Promise.all(

            //array of friend ids mapped to return an array of the User objects of all Friends by finding them through their id
            user.friends.map((id) => User.findById(id))
        );

        //want to give only specific information of friends to the front end
        // so destructuring the friends in param brackets and return those values as an object which will be the returned array

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        )

        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({message: err.message });
    }
}