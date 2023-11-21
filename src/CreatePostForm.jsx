//import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ssjhuwebaheofvstxbis.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzamh1d2ViYWhlb2Z2c3R4YmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4ODMwNTAsImV4cCI6MjAxNDQ1OTA1MH0.-Pu3UQRNuENkCiSpJMXMyavD_d9b3CeUtvD3hdPfOMY'; // Replace with your Supabase API key

const supabase = createClient(supabaseUrl, supabaseKey);


function CreatePostForm({ onCreatePost, updatePosts }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

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

  
  const handleCreatePost = async () => {
    try {
      // Create the post without user authentication
      const newPost = { title, content, image_url: imageUrl };
      console.log('New post data:', newPost);
      const { data, error } = await supabase.from('posts').insert([newPost]);

      if (error) {
        console.error('Error creating post:', error.message);
      } else {
        const { data: insertedData, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('title', title) // Assuming title is unique for each post, replace this with the unique identifier
        .single(); // Fetch only one record

      if (fetchError) {
        console.error('Error fetching inserted post:', fetchError.message);
      } else {
        console.log('Post created successfully:', insertedData);
        if (insertedData) {
            updatePosts(insertedData);
          setPosts(prevPosts => [insertedData, ...prevPosts]);
          setTitle('');
          setContent('');
          setImageUrl('');
        }
      }/*
        console.log('Post created successfully:', data);
        if (data && data.length > 0) {
           // onCreatePost(data[0]);
           
           console.log('here');
           console.log('Received post data:', data[0]); 
           setPosts(prevPosts => [data[0], ...prevPosts]);
            setTitle(''); // Clear input fields after successful post creation
          setContent('');
          setImageUrl('');
          }*/
        //onCreatePost(data[0]);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      ></textarea>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
      />

      <button onClick={handleCreatePost}>Create Post</button>
    </div>
  );
}

export default CreatePostForm;
