import React, { useState, useEffect } from 'react';
//import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

import { useParams, Link, useNavigate } from 'react-router-dom'; 


// ... (Supabase initialization)
const supabaseUrl = 'https://ssjhuwebaheofvstxbis.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzamh1d2ViYWhlb2Z2c3R4YmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4ODMwNTAsImV4cCI6MjAxNDQ1OTA1MH0.-Pu3UQRNuENkCiSpJMXMyavD_d9b3CeUtvD3hdPfOMY'; // Replace with your Supabase API key

const supabase = createClient(supabaseUrl, supabaseKey);


// Inside PostPage component


function PostPage({ post }) {
  const postId = post.post_id;
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // To toggle the edit mode
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState('');
  const [editedUpvotes, setEditedUpvotes] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('post_id', postId)
          .single();

        if (postError) {
          console.error('Error fetching post:', postError);
        } else {
          setCurrentPost(postData);
          // Set the initial state for edited fields here
          if (postData) {
            setEditedTitle(postData.title);
            setEditedContent(postData.content);
            setEditedImageUrl(postData.image_url);
            setEditedUpvotes(postData.upvotes);
          }
          // Rest of your code...
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchPost(); // Invoke fetchPost function
  //}, [postId]); // Dependency array

    }, [postId]);

    const handleEdit = () => {
        setIsEditing(true);
      };
    
      const handleSave = async () => {
        // Update post details here
        try {
          const { data, error } = await supabase
            .from('posts')
            .update({
              title: editedTitle,
              content: editedContent,
              image_url: editedImageUrl,
              upvotes: editedUpvotes,
            })
            .eq('post_id', postId);
    
          if (error) {
            console.error('Error updating post:', error);
          } else {
            setIsEditing(false);
            setCurrentPost({
              ...currentPost,
              title: editedTitle,
              content: editedContent,
              image_url: editedImageUrl,
              upvotes: editedUpvotes,
            });
          }
        } catch (error) {
          console.error('Error:', error.message);
        }
      };

  const handleCommentSubmit = async () => {
    try {
      const updatedComments = [...comments, { text: newComment }];
      const serializedComments = updatedComments.map(comment => JSON.stringify(comment));

      const { error } = await supabase
        .from('posts')
        .update({ comments: serializedComments })
        .eq('post_id', postId);

      if (error) {
        console.error('Error adding comment:', error);
      } else {
        setComments(updatedComments);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  

  const handleDeleteComment = async (index) => {
    try {
      const updatedComments = [...comments];
      updatedComments.splice(index, 1); // Remove the comment at the specified index

      const serializedComments = updatedComments.map(comment => JSON.stringify(comment));

      const { error } = await supabase
        .from('posts')
        .update({ comments: serializedComments })
        .eq('post_id', postId);

      if (error) {
        console.error('Error deleting comment:', error);
      } else {
        setComments(updatedComments);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      console.log("post:",postId);
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('post_id', postId);

      if (error) {
        console.error('Error deleting post:', error);
      } else {
        // Redirect back to the main page after deletion
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
        <h1>Post</h1>
        {!isEditing ? (
        <div>
          {/* Display post details */}
          
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          {currentPost && (
            <div>
              <h3>{currentPost.title}</h3>
              <p>{currentPost.content}</p>
              {currentPost.image_url && <img src={currentPost.image_url} alt="IMG" />}
              <h3>
                <p>Upvotes : {currentPost.upvotes}</p>
              </h3>
              <Link to="/" onClick={() => { navigate('/');post(null);  }}>
        Back to App
      </Link>
              
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Input fields to edit post details */}
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          ></textarea>
          <input
            type="text"
            value={editedImageUrl}
            onChange={(e) => setEditedImageUrl(e.target.value)}
          />
          <input
            type="text"
            value={editedUpvotes}
            onChange={(e) => setEditedUpvotes(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      )}
      <div>
        {comments.length > 0 && (
          <div>
            {comments.map((comment, index) => (
              <div key={index}>
                <p>{comment.text}
                <button onClick={() => handleDeleteComment(index)}>Delete</button>
                </p>
              </div>
            ))}
          </div>
        )}

        <div>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={handleCommentSubmit}>Add Comment</button>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
