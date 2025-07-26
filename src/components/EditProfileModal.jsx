import { useDisclosure, Button, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@nextui-org/react";
import { resolveAvatarUrl } from "@/lib/avatar-utils";

export function EditProfileModal({ supabaseClient, supabaseSession, onProfileUpdate, onClose, onModalClose }) {
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    if (isOpen && supabaseSession?.user) {
      // Reset avatar URL first to ensure fresh loading
      setCurrentAvatarUrl(null);
      setIsProfileLoading(true);
      fetchCurrentProfile();
    }
  }, [isOpen, supabaseSession?.user]);

  // Handle external open/close
  useEffect(() => {
    setIsOpen(!!onClose);
  }, [onClose]);

  const fetchCurrentProfile = async () => {
    if (!supabaseSession?.user) return;
    
    const userId = supabaseSession.user.id;
    
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('name, avatar')
      .eq('user_id', userId)
      .single();
    
    if (!error && data) {
      setName(data.name || "");
      
      // Handle current avatar display using unified utility
      if (data.avatar) {
        const avatarUrl = resolveAvatarUrl(data.avatar, supabaseClient);
        setCurrentAvatarUrl(avatarUrl);
      }
    }
    setIsProfileLoading(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
  
    setIsLoading(true);
    const userId = supabaseSession.user.id;
    let avatarPath = null; // This will hold the path for the database update
  
    try {
      // Upload avatar if a new file was selected
      if (avatarFile) {
        // 1. List and remove any existing avatars for the user
        const { data: fileList, error: listError } = await supabaseClient.storage
          .from('avatars')
          .list(userId, { limit: 1 }); // Check user's folder
  
        if (listError) {
          throw new Error(`Could not check for old avatars: ${listError.message}`);
        }
  
        if (fileList && fileList.length > 0) {
          const filesToRemove = fileList.map((file) => `${userId}/${file.name}`);
          const { error: removeError } = await supabaseClient.storage
            .from('avatars')
            .remove(filesToRemove);
  
          if (removeError) {
            throw new Error(`Could not remove old avatar: ${removeError.message}`);
          }
        }
  
        // 2. Upload the new avatar with its correct extension
        const fileExt = avatarFile.name.split('.').pop();
        const newFileName = `avatar.${fileExt}`;
        const newFilePath = `${userId}/${newFileName}`;
        
        const { error: uploadError } = await supabaseClient.storage
          .from('avatars')
          .upload(newFilePath, avatarFile, {
            upsert: true,
          });
  
        if (uploadError) {
          throw new Error(`Avatar upload failed: ${uploadError.message}`);
        }
        
        avatarPath = newFilePath;
      }
  
            // Update profile in the database
      const updateData = { name: name.trim() };
      if (avatarPath) {
        updateData.avatar = avatarPath;
      }

      const { data: updateResult, error: updateError } = await supabaseClient
        .from('profiles')
        .update(updateData)
        .eq('user_id', userId)
        .select();

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw new Error(`Profile update failed: ${updateError.message}`);
      }

      toast.success("Profile updated successfully!");
      onProfileUpdate?.(); // Callback to refresh parent component
      setIsOpen(false);
      
      // Reset form
      setAvatarFile(null);
      setAvatarPreview(null);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsOpen(false);
    setIsProfileLoading(false);
    // Notify parent to close modal
    if (onModalClose) {
      onModalClose();
    }
  };



  return (
    <>
      <Modal
        backdrop="opaque"
        classNames={{
          body: "py-6",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        isOpen={isOpen}
        radius="lg"
        onOpenChange={handleClose}
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Profile
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6">
                                    {/* Current Avatar Display */}
                  <div className="flex flex-col items-center gap-4">
                    <Label className="text-sm font-medium">Current Avatar</Label>
                    {isProfileLoading ? (
                      <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
                    ) : (
                      <Avatar 
                        src={currentAvatarUrl} 
                        size="md"
                        showFallback
                        className="w-20 h-20"
                        fallback={name ? name.charAt(0).toUpperCase() : "U"}
                      />
                    )}
                  </div>

                  {/* Name Input */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Avatar Upload */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="avatar" className="text-sm font-medium">
                      New Avatar (optional)
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500">
                      Max file size: 5MB. Supported formats: JPG, PNG, GIF
                    </p>
                  </div>

                  {/* Avatar Preview */}
                  {avatarPreview && (
                    <div className="flex flex-col items-center gap-2">
                      <Label className="text-sm font-medium">Preview</Label>
                      <Avatar 
                        src={avatarPreview} 
                        size="md"
                        className="w-16 h-16"
                      />
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleSubmit}
                  isLoading={isLoading}
                  disabled={!name.trim()}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
} 