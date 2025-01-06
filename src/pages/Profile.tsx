import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, User } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  
  const { data: authData, isLoading: isAuthLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      console.log("Auth data:", data);
      return data;
    },
  });

  const { data: profile, isLoading: isProfileLoading } = useProfile(authData?.user?.id);

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!authData?.user) {
    navigate("/signin");
    return null;
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p>There was an error loading your profile. Please try signing in again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">User Type</p>
                <p className="font-medium capitalize">{profile.user_type}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{authData.user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Telephone</p>
                <p className="font-medium">{profile.telephone || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{profile.address || 'Not set'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
          <ProfileForm 
            initialData={{
              email: authData.user.email || "",
              address: profile.address || "",
              telephone: profile.telephone || "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;