import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './index.css'; // Keep this import for Tailwind's base styles
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';
import EditPost from './components/EditPost';

const API_URL = 'http://localhost:5000/api/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handleViewPost = (id) => {
    setSelectedPostId(id);
    setEditingPostId(null);
  };

  const handleBackToList = () => {
    setSelectedPostId(null);
    setEditingPostId(null);
    fetchPosts();
  };

  const handleEditPost = (id) => {
    setEditingPostId(id);
    setSelectedPostId(null);
  };

  const handlePostUpdated = (updatedId) => {
    setEditingPostId(null);
    setSelectedPostId(updatedId);
    fetchPosts();
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        console.log('Post deleted:', id);
        
        alert('Blog post deleted successfully!');
        setSelectedPostId(null);
        setEditingPostId(null);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete blog post. Please try again.');
      }
    }
  };

  if (loading) return <div className="text-center text-gray-600 text-lg mt-12">Loading...</div>;
  if (error) return <div className="text-center text-red-600 text-lg mt-12 p-4 bg-red-100 border border-red-400 rounded-lg max-w-md mx-auto">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-inter antialiased">
      <header className="bg-gray-800 p-6 text-white shadow-lg rounded-b-xl">
        <h1 className="text-4xl font-bold text-center">Pixel Pages</h1>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {editingPostId ? (
          <EditPost
            postId={editingPostId}
            onPostUpdated={handlePostUpdated}
            onCancelEdit={handleCancelEdit}
          />
        ) : selectedPostId ? (
          <PostDetail
            postId={selectedPostId}
            onBackToList={handleBackToList}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        ) : (
          <>
            <CreatePost onPostCreated={handlePostCreated} />
            <hr className="my-12 border-t-2 border-gray-300" />
            <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">All Blog Posts</h2>
            {posts.length === 0 ? (
              <p className="text-center text-gray-600 text-lg">No posts available yet. Be the first to create one!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                  <div key={post._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between">
                    <h3 className="text-xl font-bold text-blue-600 mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      <strong className="font-semibold">Author:</strong> {post.author}
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4 flex-grow">
                      {post.content.substring(0, 150)}...
                    </p>
                    <p className="text-xs text-gray-500 text-right mt-auto">
                      Published: {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleViewPost(post._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditPost(post._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
