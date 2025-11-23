import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!imagePreview) {
      toast.error("Please select an image");
      return;
    }
    if (!caption.trim()) {
      toast.error("Please add a caption");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Post published successfully!");
      setCaption("");
      setImagePreview(null);
      setLoading(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Post</h2>
          <p className="text-muted-foreground mt-1">
            Upload an image and add a caption to publish to Instagram
          </p>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>
              Add your image and caption for the Instagram post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-96 mx-auto rounded-lg"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setImagePreview(null)}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="Write your caption here... #hashtags"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {caption.length} / 2200 characters
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handlePublish}
                disabled={loading || !imagePreview || !caption.trim()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {loading ? "Publishing..." : "Publish to Instagram"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCaption("");
                  setImagePreview(null);
                }}
                disabled={loading}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Publishing Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Use high-quality images (at least 1080x1080 pixels)</p>
            <p>• Include relevant hashtags to increase reach</p>
            <p>• Post during peak engagement times</p>
            <p>• Keep captions engaging and authentic</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreatePost;
