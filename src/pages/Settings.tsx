import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    app_id: "",
    app_secret: "",
    business_account_id: "",
    access_token: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      loadSettings(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const loadSettings = async (userId: string) => {
    const { data, error } = await supabase
      .from("instagram_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data && !error) {
      setSettings({
        app_id: data.app_id || "",
        app_secret: data.app_secret || "",
        business_account_id: data.business_account_id || "",
        access_token: data.access_token || "",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast.error("You must be logged in");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("instagram_settings")
      .upsert({
        user_id: session.user.id,
        ...settings,
      });

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved successfully!");
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground mt-1">
            Configure your Instagram API credentials
          </p>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Instagram API Configuration</CardTitle>
            <CardDescription>
              Enter your Facebook App credentials and Instagram Business Account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app_id">Facebook App ID</Label>
              <Input
                id="app_id"
                type="text"
                placeholder="Enter your Facebook App ID"
                value={settings.app_id}
                onChange={(e) => setSettings({ ...settings, app_id: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="app_secret">Facebook App Secret</Label>
              <Input
                id="app_secret"
                type="password"
                placeholder="Enter your Facebook App Secret"
                value={settings.app_secret}
                onChange={(e) => setSettings({ ...settings, app_secret: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_account_id">Instagram Business Account ID</Label>
              <Input
                id="business_account_id"
                type="text"
                placeholder="Enter your Instagram Business Account ID"
                value={settings.business_account_id}
                onChange={(e) => setSettings({ ...settings, business_account_id: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="access_token">Long-Lived Access Token</Label>
              <Input
                id="access_token"
                type="password"
                placeholder="Enter your Long-Lived Access Token"
                value={settings.access_token}
                onChange={(e) => setSettings({ ...settings, access_token: e.target.value })}
              />
            </div>

            <Button onClick={handleSave} disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 border-primary/20">
          <CardHeader>
            <CardTitle>How to Get Your Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">1. Facebook App ID & Secret:</strong>
              <p>Create a Facebook App at developers.facebook.com and get your credentials from the app settings.</p>
            </div>
            <div>
              <strong className="text-foreground">2. Instagram Business Account ID:</strong>
              <p>You can find this in your Facebook Business Manager under Instagram accounts.</p>
            </div>
            <div>
              <strong className="text-foreground">3. Long-Lived Access Token:</strong>
              <p>Generate this using Facebook's Graph API Explorer with the required permissions for Instagram Business.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
