import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ssjhuwebaheofvstxbis.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzamh1d2ViYWhlb2Z2c3R4YmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4ODMwNTAsImV4cCI6MjAxNDQ1OTA1MH0.-Pu3UQRNuENkCiSpJMXMyavD_d9b3CeUtvD3hdPfOMY'; // Replace with your Supabase API key

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from Supabase when the component mounts
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error);
        } else {
          setPosts(data);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures this effect runs once on mount

  const handleCreatePost = async () => {
    // Implement the logic to create a new post
    // This involves making a POST request to your Supabase 'posts' table
    // Remember to refresh the posts after creating a new one
  };

  // Other functions for handling post updates, deletion, upvotes, etc.

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>HobbyHub</h1>
      <div className="card">
        <button onClick={handleCreatePost}>Create Post</button>
        {posts.map((post) => (
          <div key={post.post_id}>
            <h3>{post.title}</h3>
            <p>{post.created_at}</p>
            {/* Render other post details */}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
