// src/components/CommentSection.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

type CommentSectionProps = {
  taskId: string;
  comments: any[];
  createComment: (taskId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
};

const CommentSection: React.FC<CommentSectionProps> = ({ taskId, comments, createComment, deleteComment }) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!content) return;

    try {
      setLoading(true);
      await createComment(taskId, content);
      toast.success("Comment added");
      setNewComment("");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="mt-4">
      {/* New Comment Input */}
      <div className="flex gap-3">
        <Input
          className="w-full p-3 bg-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="ghost"
          onClick={handleAddComment}
          disabled={loading}
          className="text-blue-500 hover:bg-blue-700 p-2 rounded-full transition duration-300"
        >
          {loading ? 'Adding...' : 'Add Comment'}
        </Button>
      </div>

      {/* Render Comments */}
      {comments.map((comment) => (
        <div key={comment.id} className="pl-6 mt-2 text-sm text-gray-300 border-l-2 border-blue-500">
          <p>
            <strong>{comment.author?.name || "User"}:</strong> {comment.content}
          </p>

          {/* Delete Comment Button */}
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteComment(comment.id)}
              className="text-red-500 hover:bg-red-700 p-2 rounded-full transition duration-300"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
