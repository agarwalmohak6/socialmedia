import axios from "axios";

const handleCommentShowHelper = async (postId, token, showComments, setShowComments) => {
  try {
    const config = {
      headers: {
        Authorization: token,
      },
    };
    const response = await axios.get(
      `http://localhost:5000/api/posts/allReply/${postId}`,
      config
    );
    setShowComments({
      ...showComments,
      [postId]: response.data,
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
  }
};

export default handleCommentShowHelper;
