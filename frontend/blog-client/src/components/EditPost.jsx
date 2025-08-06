import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts';

function EditPost({ postId, onPostUpdated, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostToEdit = async () => {
      try {
        const response = await axios.get(`${API_URL}/${postId}`);
        const post = response.data;
        setTitle(post.title);
        setAuthor(post.author);
        setContent(post.content);
      } catch (err) {
        console.error("Error fetching post for edit:", err);
        setError("Failed to load post for editing. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostToEdit();
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.put(`${API_URL}/${postId}`, { title, author, content });
      console.log('Post updated:', response.data);
      setMessage('Blog post updated successfully!');

      if (onPostUpdated) {
        onPostUpdated(response.data._id);
      }

    } catch (error) {
      console.error('Error updating post:', error);
      setMessage('Failed to update blog post. Please try again.');
    }
  };

  if (loading) return <div className="text-center text-gray-600 text-lg mt-12">Loading post for editing...</div>;
  if (error) return <div className="text-center text-red-600 text-lg mt-12 p-4 bg-red-100 border border-red-400 rounded-lg max-w-md mx-auto">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-3xl font-semibold text-blue-600 mb-6 text-center">Edit Blog Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="edit-title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter post title"
          />
        </div>
        <div>
          <label htmlFor="edit-author" className="block text-gray-700 text-sm font-bold mb-2">Author:</label>
          <input
            type="text"
            id="edit-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter author name"
          />
        </div>
        <div>
          <label htmlFor="edit-content" className="block text-gray-700 text-sm font-bold mb-2">Content:</label>
          <textarea
            id="edit-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-y"
            placeholder="Write your blog post content here..."
          ></textarea>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 shadow-md flex-grow"
          >
            Update Post
          </button>
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 shadow-md flex-grow"
          >
            Cancel
          </button>
        </div>
      </form>
      {message && (
        <p className={`mt-6 p-3 rounded-lg text-center font-semibold ${
          message.includes('successfully') ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default EditPost;
