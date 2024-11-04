"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/config";
import { useToast } from "@/hooks/use-toast";
import type { AuthError } from "@supabase/supabase-js";

type AuthType = "login" | "signup";

export default function AuthPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AuthType>("login");
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (type: AuthType) => {
    try {
      setLoading(true);

      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const { data, error } = type === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (type === "signup" && data?.user?.identities?.length === 0) {
        toast({
          title: "Email already registered",
          description: "Please try logging in instead",
          variant: "destructive",
        });
        setActiveTab("login");
        return;
      }

      if (type === "signup") {
        toast({
          title: "Verification email sent",
          description: "Please check your email to verify your account",
        });
      }

      router.push("/chat");
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAuth(activeTab);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-[380px] cyberpunk-border bg-card/80 backdrop-blur-sm">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageSquare className="h-8 w-8 text-primary text-glow" />
              <h1 className="text-3xl font-bold text-glow">Chattr</h1>
            </div>
            <p className="text-muted-foreground">
              Connect and chat with people around the world
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as AuthType)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:text-glow">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:text-glow">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 border-primary/50 focus:border-primary"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background/50 border-primary/50 focus:border-primary"
                      disabled={loading}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <Button
                  className="w-full mt-6 cyberpunk-border glow bg-primary/20 hover:bg-primary/30"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : activeTab === "login" ? "Login" : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.div className="mt-6" whileHover={{ scale: 1.02 }}>
              <Button
                variant="outline"
                className="w-full cyberpunk-border"
                onClick={handleGithubAuth}
                disabled={loading}
                type="button"
              >
                GitHub
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  );
}