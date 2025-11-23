import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Reply, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Comments = () => {
  const navigate = useNavigate();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const mockComments = [
    {
      id: 1,
      username: "john_doe",
      text: "Amazing photo! 🔥",
      timestamp: "2 hours ago",
      postCaption: "Beautiful sunset by the beach 🌅",
    },
    {
      id: 2,
      username: "jane_smith",
      text: "Love this! Where was this taken?",
      timestamp: "4 hours ago",
      postCaption: "Beautiful sunset by the beach 🌅",
    },
    {
      id: 3,
      username: "mike_wilson",
      text: "Great content! Keep it up 👏",
      timestamp: "1 day ago",
      postCaption: "Coffee and code ☕️💻",
    },
  ];

  const handleReply = (commentId: number) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    toast.success("Reply sent successfully!");
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comments</h2>
          <p className="text-muted-foreground mt-1">
            View and reply to comments on your posts
          </p>
        </div>

        <div className="space-y-4">
          {mockComments.map((comment) => (
            <Card key={comment.id} className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{comment.username}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      on: {comment.postCaption}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <p className="flex-1">{comment.text}</p>
                </div>

                {replyingTo === comment.id ? (
                  <div className="space-y-3 pl-8">
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReply(comment.id)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-8"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {mockComments.length === 0 && (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="py-12 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comments to display</p>
              <p className="text-sm mt-1">Comments will appear here once people start engaging with your posts</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Comments;
