import axios from "axios";

const handleLikeHelper = async (id, token, setPosts, posts) => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      await axios.post(
        `http://localhost:5000/api/posts/like/${id}`,
        {},
        config
      );
  
      // Fetch the updated post data after the like action
      const updatedPostResponse = await axios.get(
        `http://localhost:5000/api/posts/${id}`,
        config
      );
  
      // Update the like count in the state
      const updatedPosts = posts.map((post) =>
        post._id === id ? updatedPostResponse.data : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  export default handleLikeHelper;