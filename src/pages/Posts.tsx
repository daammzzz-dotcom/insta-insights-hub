import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Heart, MessageSquare, Calendar } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const mockPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400",
      caption: "Beautiful sunset by the beach 🌅",
      likes: 1234,
      comments: 56,
      date: "2024-01-15",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400",
      caption: "Coffee and code ☕️💻",
      likes: 892,
      comments: 34,
      date: "2024-01-14",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      caption: "Mountain adventures 🏔️",
      likes: 2145,
      comments: 89,
      date: "2024-01-13",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
            <p className="text-muted-foreground mt-1">
              Manage and view all your Instagram posts
            </p>
          </div>
          <Button onClick={() => navigate("/create-post")}>Create New Post</Button>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search posts by caption..."
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockPosts.map((post) => (
            <Card key={post.id} className="bg-gradient-card border-border/50 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <CardHeader>
                <CardDescription className="line-clamp-2">{post.caption}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Posts;
