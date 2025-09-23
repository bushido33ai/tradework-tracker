import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ImageGallery } from "@/components/landing/ImageGallery";
import { FeaturesSection } from "@/components/landing/FeaturesSection";

const Landing = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/lovable-uploads/136602a8-f1a5-4465-8db7-36485b6fc5ae.png')`
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <LandingNav session={session} />
        <div className="max-w-4xl mx-auto">
          <HeroSection session={session} />
          <ImageGallery />
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
};

export default Landing;