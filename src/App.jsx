import { useState, useEffect } from 'react';
//import Feed from './Feed';
import CreatePostForm from './CreatePostForm';
import { createClient } from '@supabase/supabase-js';
import PostPage from './PostPage'; 
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

const supabaseUrl = 'https://ssjhuwebaheofvstxbis.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzamh1d2ViYWhlb2Z2c3R4YmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4ODMwNTAsImV4cCI6MjAxNDQ1OTA1MH0.-Pu3UQRNuENkCiSpJMXMyavD_d9b3CeUtvD3hdPfOMY'; // Replace with your Supabase API key

const supabase = createClient(supabaseUrl, supabaseKey);


const calculateTimeElapsed = (createdAt) => {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate - createdDate);
  const minutes = Math.floor(timeDiff / (1000 * 60));
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  return `${days} days ${hours} hours ago`;
};




function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error);
        } else {
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchPosts();
  }, []);

  const updatePosts = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const [selectedPost, setSelectedPost] = useState(null); // State to store the selected post

  // Rest of your existing code

  // Function to handle clicking on a post
  const handlePostClick = (postId) => {
    const clickedPost = posts.find((post) => post.post_id === postId);
    if (clickedPost) {
      setSelectedPost(clickedPost); // Set the selected post
    }
  };
  const handleUpvote = async (postId) => {
    try {
      // Fetch the current upvotes count of the post
      const { data: postData, error: fetchError } = await supabase
        .from('posts')
        .select('upvotes')
        .eq('post_id', postId)
        .single();
  
      if (fetchError) {
        console.error('Error fetching post data:', fetchError);
        return;
      }
  
      const currentUpvotes = postData.upvotes || 0;
  
      // Update the upvotes count in the database
      const { data, error } = await supabase
        .from('posts')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('post_id', postId);
  
      if (error) {
        console.error('Error upvoting post:', error);
      } else {
        // Update the posts in the state
        const updatedPosts = posts.map((post) => {
          if (post.post_id === postId) {
            return { ...post, upvotes: currentUpvotes + 1 };
          }
          return post;
        });
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleCreatePost = async (newPost) => {
    try {
      const { data, error } = await supabase.from('posts').insert([newPost]);
      if (error) {
        console.error('Error creating post:', error);
      } else {
        console.log('Post created successfully:', data);
        if (data && data.length > 0) {
          setPosts(prevPosts => [data[0], ...prevPosts]); // Update posts using a callback
          setTitle(''); // Clear input fields after successful post creation
          setContent('');
          setImageUrl('');
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  

  const handleDeletePost = async (postId) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) {
        console.error('Error deleting post:', error);
      } else {
        // Update posts after deletion
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  const [searchTerm, setSearchTerm] = useState('');

// Function to handle search input change
const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
};

// Filter posts based on search term
const filteredPosts = posts.filter((post) =>
  post.title.toLowerCase().includes(searchTerm.toLowerCase())
);

const handleSortByUpvotes = () => {
  const sortedPosts = [...posts].sort((a, b) => b.upvotes - a.upvotes);
  setPosts(sortedPosts);
};

  return (
    <div>
      
      
      {/* Conditionally render PostPage or the posts list */}
      {selectedPost ? (
        <Routes>
        <Route path="/"  element={<PostPage post={selectedPost} />}/>
      </Routes>

       //  <PostPage post={selectedPost} /> // Pass the selected post as a prop to PostPage
      ) : (
        <div>
        <h1>HobbyHub</h1>
        <CreatePostForm onCreatePost={handleCreatePost} updatePosts={updatePosts} />



        <input
      type="text"
      placeholder="Search posts..."
      value={searchTerm}
      onChange={handleSearchChange}
    />
  <button onClick={handleSortByUpvotes}>Sort by Upvotes</button>
  {searchTerm ? (
            filteredPosts.map((post) => (
              <div key={post.post_id} onClick={() => handlePostClick(post.post_id)}>
                {/* Render post content */}
                <p>{calculateTimeElapsed(post.created_at)}</p>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.image_url && <img src={post.image_url} alt="IMG" />}
                <p>{post.upvotes}
                  <button onClick={() => handleUpvote(post.post_id)}>Upvote</button>
                </p>
              </div>
            ))
          ) : (
            // Render regular posts
            posts.map((post) => (
              <div key={post.post_id} onClick={() => handlePostClick(post.post_id)}>
                <p>{calculateTimeElapsed(post.created_at)}</p>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.image_url && <img src={post.image_url} alt="IMG" />}
                <p>{post.upvotes}
                  <button onClick={() => handleUpvote(post.post_id)}>Upvote</button>
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;