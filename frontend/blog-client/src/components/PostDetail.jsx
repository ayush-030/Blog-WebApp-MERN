import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://my-mern-blog-backend.onrender.com/api/posts';

function PostDetail({ postId, onBackToList, onEditPost, onDeletePost }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError("No post ID provided.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/${postId}`);
        setPost(response.data);
      } catch (err) {
        console.error("Error fetching single post:", err);
        setError("Failed to load post details. It might not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <div className="text-center text-gray-600 text-lg mt-12">Loading post...</div>;
  if (error) return <div className="text-center text-red-600 text-lg mt-12 p-4 bg-red-100 border border-red-400 rounded-lg max-w-md mx-auto">{error}</div>;
  if (!post) return <div className="text-center text-red-600 text-lg mt-12 p-4 bg-red-100 border border-red-400 rounded-lg max-w-md mx-auto">Post not found.</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <button
        onClick={onBackToList}
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md mb-6"
      >
        ← Back to All Posts
      </button>
      <h2 className="text-4xl font-bold text-blue-700 mb-4 text-center">{post.title}</h2>
      <p className="text-lg text-gray-600 font-medium mb-6 text-center">
        By <span className="italic">{post.author}</span>
      </p>
      <div className="prose max-w-none text-gray-800 leading-relaxed text-lg mb-8">
        <p>{post.content}</p>
      </div>
      <p className="text-sm text-gray-500 text-right border-t border-gray-200 pt-4">
        Published: {new Date(post.createdAt).toLocaleDateString()}
        {post.createdAt !== post.updatedAt && ` (Last updated: ${new Date(post.updatedAt).toLocaleDateString()})`}
      </p>
      <div className="flex justify-center gap-6 mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEditPost(post._id)}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md"
        >
          Edit Post
        </button>
        <button
          onClick={() => onDeletePost(post._id)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md"
        >
          Delete Post
        </button>
      </div>
    </div>
  );
}

export default PostDetail;
