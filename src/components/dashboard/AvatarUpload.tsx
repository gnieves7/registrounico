import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { validateAvatarFile } from "@/lib/validateAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AvatarUpload() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Resolve signed URL from stored file path on mount
  useEffect(() => {
    const resolveAvatar = async () => {
      const storedPath = profile?.avatar_url;
      if (!storedPath) return;
      // If it's already a full URL (legacy), use as-is
      if (storedPath.startsWith("http")) {
        setAvatarUrl(storedPath);
        return;
      }
      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(storedPath, 3600);
      if (data?.signedUrl) setAvatarUrl(data.signedUrl);
    };
    resolveAvatar();
  }, [profile?.avatar_url]);

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const error = validateAvatarFile(file);
    if (error) {
      toast({ title: "Archivo inválido", description: error, variant: "destructive" });
      return;
    }

    try {
      setUploading(true);
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Store file path (not public URL) since bucket is private
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // Get signed URL for display
      const { data: signedData } = await supabase.storage
        .from("avatars")
        .createSignedUrl(filePath, 3600);

      setAvatarUrl(signedData?.signedUrl || null);
      toast({ title: "Foto actualizada", description: "Tu foto de perfil se actualizó correctamente." });
    } catch (err: any) {
      console.error("Error uploading avatar:", err);
      toast({ title: "Error", description: "No se pudo subir la foto. Intenta de nuevo.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          variant="secondary"
          className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
        </Button>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{profile?.full_name || "Tu perfil"}</p>
        <p className="text-xs text-muted-foreground">JPG, PNG o WEBP · Máx 2 MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
