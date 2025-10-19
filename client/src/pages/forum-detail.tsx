import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, MessageSquare, Send, Trash2, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ForumPost, ForumComment } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PostWithComments extends ForumPost {
  commentCount: number;
}

export default function ForumDetail() {
  const { forumId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: posts, isLoading: postsLoading } = useQuery<PostWithComments[]>({
    queryKey: ["/api/forums", forumId, "posts"],
    enabled: !!forumId,
  });

  const { data: comments } = useQuery<ForumComment[]>({
    queryKey: ["/api/forums/posts", selectedPostId, "comments"],
    enabled: !!selectedPostId,
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const res = await apiRequest("POST", `/api/forums/${forumId}/posts`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forums", forumId, "posts"] });
      setNewPostTitle("");
      setNewPostContent("");
      setIsCreateDialogOpen(false);
      toast({
        title: "Post created",
        description: "Your anonymous post has been published",
      });
    },
    onError: (error: any) => {
      if (error.isFlagged) {
        toast({
          variant: "destructive",
          title: "Content Flagged",
          description: `AI Moderator: ${error.reason}. Please revise your content.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create post",
        });
      }
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await apiRequest("DELETE", `/api/forums/posts/${postId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forums", forumId, "posts"] });
      toast({
        title: "Post deleted",
        description: "Your post has been removed",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post",
      });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: { postId: string; content: string }) => {
      const res = await apiRequest("POST", `/api/forums/posts/${data.postId}/comments`, { content: data.content });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forums/posts", selectedPostId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forums", forumId, "posts"] });
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
    },
    onError: (error: any) => {
      if (error.isFlagged) {
        toast({
          variant: "destructive",
          title: "Content Flagged",
          description: `AI Moderator: ${error.reason}. Please revise your comment.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to post comment",
        });
      }
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await apiRequest("DELETE", `/api/forums/comments/${commentId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forums/posts", selectedPostId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forums", forumId, "posts"] });
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment",
      });
    },
  });

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    createPostMutation.mutate({
      title: newPostTitle,
      content: newPostContent,
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPostId) return;

    createCommentMutation.mutate({
      postId: selectedPostId,
      content: newComment,
    });
  };

  if (postsLoading) {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="h-8 bg-muted rounded w-48 mb-6 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-muted rounded mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/forum")}
            data-testid="button-back-to-forums"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forums
          </Button>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-post">
                <Send className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Anonymous Post</DialogTitle>
                <DialogDescription>
                  Share your thoughts anonymously. AI moderation is active to ensure a respectful community.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Post title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    data-testid="input-post-title"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={6}
                    data-testid="textarea-post-content"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreatePost}
                  disabled={createPostMutation.isPending}
                  data-testid="button-submit-post"
                >
                  {createPostMutation.isPending ? "Creating..." : "Create Post"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {posts?.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Be the first to start a conversation in this forum
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first-post">
              Create First Post
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts?.map((post) => (
              <Card key={post.id} className="p-6" data-testid={`card-post-${post.id}`}>
                {post.isFlagged && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-md">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <p className="text-sm text-destructive">
                      Flagged by moderator: {post.flagReason}
                    </p>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid={`button-delete-post-${post.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your post and all its comments.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletePostMutation.mutate(post.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>Anonymous</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                  <span>•</span>
                  <span>{post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
                </div>

                {selectedPostId === post.id ? (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-4">Comments</h4>
                    <div className="space-y-3 mb-4">
                      {comments?.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-4 bg-muted/50 rounded-md"
                          data-testid={`comment-${comment.id}`}
                        >
                          {comment.isFlagged && (
                            <div className="flex items-center gap-2 p-2 mb-2 bg-destructive/10 border border-destructive/20 rounded-md">
                              <AlertTriangle className="w-3 h-3 text-destructive" />
                              <p className="text-xs text-destructive">
                                Flagged: {comment.flagReason}
                              </p>
                            </div>
                          )}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm mb-2">{comment.content}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Anonymous</span>
                                <span>•</span>
                                <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                              </div>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  data-testid={`button-delete-comment-${comment.id}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteCommentMutation.mutate(comment.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                        data-testid="textarea-comment"
                      />
                      <Button
                        onClick={handleAddComment}
                        disabled={createCommentMutation.isPending}
                        data-testid="button-submit-comment"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedPostId(null)}
                      className="mt-2"
                      data-testid="button-hide-comments"
                    >
                      Hide Comments
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPostId(post.id)}
                    data-testid={`button-view-comments-${post.id}`}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Comments ({post.commentCount})
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
