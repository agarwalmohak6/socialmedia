import axios from "axios";

const fetchCommentsCountHelper = async (posts, token, setCommentsCount) => {
  try {
    const config = {
      headers: {
        Authorization: token,
      },
    };
    const commentsCounts = {};
    await Promise.all(
      posts.map(async (post) => {
        const response = await axios.get(
          `http://localhost:5000/api/posts/allReply/${post._id}`,
          config
        );
        commentsCounts[post._id] = response.data.length;
      })
    );
    setCommentsCount(commentsCounts);
  } catch (error) {
    console.error("Error fetching comments count:", error);
  }
};

export default fetchCommentsCountHelper;
