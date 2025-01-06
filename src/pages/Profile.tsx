import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  telephone: z.string().min(10, "Phone number must be at least 10 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.confirmNewPassword) {
    return data.newPassword === data.confirmNewPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "",
      address: "",
      telephone: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/signin");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          form.reset({
            email: user.email || "",
            address: profile.address || "",
            telephone: profile.telephone || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [form, navigate]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update profile data
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          address: values.address,
          telephone: values.telephone,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update email if changed
      if (values.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: values.email,
        });
        if (emailError) throw emailError;
      }

      // Update password if provided
      if (values.newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: values.newPassword,
        });
        if (passwordError) throw passwordError;
      }

      toast.success("Profile updated successfully");
      form.reset({
        ...values,
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telephone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Profile;