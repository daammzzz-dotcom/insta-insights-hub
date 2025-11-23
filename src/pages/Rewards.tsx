import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, TrendingUp, DollarSign, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Rewards = () => {
  const navigate = useNavigate();
  const [reelReach, setReelReach] = useState("");
  const [rewardPerView, setRewardPerView] = useState("0.01");
  const [calculatedReward, setCalculatedReward] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleCalculate = () => {
    const reach = parseFloat(reelReach);
    const rate = parseFloat(rewardPerView);

    if (isNaN(reach) || reach <= 0) {
      toast.error("Please enter a valid reach number");
      return;
    }

    if (isNaN(rate) || rate <= 0) {
      toast.error("Please enter a valid reward rate");
      return;
    }

    const reward = reach * rate;
    setCalculatedReward(reward);
    toast.success("Reward calculated successfully!");
  };

  const rewardTiers = [
    { min: 0, max: 10000, rate: 0.005, label: "Starter", color: "text-blue-500" },
    { min: 10001, max: 50000, rate: 0.01, label: "Growing", color: "text-green-500" },
    { min: 50001, max: 100000, rate: 0.015, label: "Popular", color: "text-orange-500" },
    { min: 100001, max: Infinity, rate: 0.02, label: "Viral", color: "text-purple-500" },
  ];

  const getSuggestedRate = (reach: number) => {
    const tier = rewardTiers.find(t => reach >= t.min && reach <= t.max);
    return tier || rewardTiers[0];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rewards Calculator</h2>
          <p className="text-muted-foreground mt-1">
            Calculate rewards based on your reel reach and engagement
          </p>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Calculate Your Reward
            </CardTitle>
            <CardDescription>
              Enter your reel reach to calculate potential rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reach">Reel Reach (Views)</Label>
                <div className="relative">
                  <Eye className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reach"
                    type="number"
                    placeholder="Enter total reach"
                    value={reelReach}
                    onChange={(e) => setReelReach(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Reward Per View ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="rate"
                    type="number"
                    step="0.001"
                    placeholder="Enter reward rate"
                    value={rewardPerView}
                    onChange={(e) => setRewardPerView(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleCalculate} className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Calculate Reward
            </Button>

            {calculatedReward !== null && (
              <div className="p-6 rounded-lg bg-gradient-instagram/10 border-2 border-primary/20">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Estimated Reward</p>
                  <p className="text-4xl font-bold bg-gradient-instagram bg-clip-text text-transparent">
                    ${calculatedReward.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Based on {parseFloat(reelReach).toLocaleString()} views at ${rewardPerView}/view
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Reward Tiers</CardTitle>
            <CardDescription>
              Suggested reward rates based on reach milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {rewardTiers.map((tier) => (
                <div
                  key={tier.label}
                  className="p-4 rounded-lg border border-border bg-background/50 hover:bg-background transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold ${tier.color}`}>{tier.label}</h3>
                    <span className="text-sm font-mono text-muted-foreground">
                      ${tier.rate}/view
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tier.min.toLocaleString()} - {tier.max === Infinity ? "∞" : tier.max.toLocaleString()} views
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Example: 50K views = ${(50000 * tier.rate).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 border-primary/20">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">1. Enter Reel Reach:</strong>
              <p>Input the total number of views your reel has received.</p>
            </div>
            <div>
              <strong className="text-foreground">2. Set Reward Rate:</strong>
              <p>Define how much each view is worth (can vary by campaign or tier).</p>
            </div>
            <div>
              <strong className="text-foreground">3. Calculate:</strong>
              <p>The system will multiply reach by rate to show your total reward.</p>
            </div>
            <div>
              <strong className="text-foreground">4. Track Performance:</strong>
              <p>Use different rates for different content types or sponsorship deals.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Rewards;
