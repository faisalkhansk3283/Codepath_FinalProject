import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
//import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

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
function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
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

  return (
    <div>
      {posts.map((post) => (
 //       <Link key={post.id} to={`/post/${post.id}`}>
        <div key={post.post_id}>
            <p>{calculateTimeElapsed(post.created_at)}</p>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
         
          {post.image_url && <img src={post.image_url} alt="IMG" />}
          <p>{post.upvotes}</p>
          {/* Other post details */}
        </div>
 //       </Link>
      ))}
    </div>
  );
}

export default Feed;
