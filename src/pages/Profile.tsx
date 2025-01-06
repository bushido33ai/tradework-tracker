import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { ProfileForm } from "@/components/profile/ProfileForm";

const Profile = () => {
  const navigate = useNavigate();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile, isLoading } = useProfile(user?.id);

  if (!user) {
    navigate("/signin");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      <ProfileForm 
        initialData={{
          email: user.email || "",
          address: profile.address,
          telephone: profile.telephone,
        }}
      />
    </div>
  );
};

export default Profile;