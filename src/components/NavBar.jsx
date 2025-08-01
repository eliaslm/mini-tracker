import { Avatar, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { useLocation } from "react-router-dom";

import { LoginModal } from "./LoginModal";
import { EditProfileModal } from "./EditProfileModal";
import { useEffect, useState } from "react";
import { resolveAvatarUrl } from "@/lib/avatar-utils";

export const MiniLogo = () => {
  return (
    <Image
      isZoomed
      alt="Mini Logo"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/The_New_York_Times_Mini_Crossword.svg/1024px-The_New_York_Times_Mini_Crossword.svg.png?20240613152513"
      width={32}
      height={32}
    />
  );
};


function UserDetails({ supabaseClient, supabaseSession }) {
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProfile = async () => {
    if (!supabaseSession?.user) return;
    const userId = supabaseSession.user.id;
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('name, avatar')
      .eq('user_id', userId)
      .single();
    if (error) {
      setProfile(null);
      setAvatarUrl(null);
      return;
    }
    setProfile(data);
    // Handle avatar using unified utility
    if (data?.avatar) {
      const avatarUrl = resolveAvatarUrl(data.avatar, supabaseClient);
      setAvatarUrl(avatarUrl);
    } else {
      setAvatarUrl(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [supabaseSession?.user?.id]);

  if (!profile) return null;
  const displayName = profile.name || "User";

  return (
    <div className="flex gap-4 items-center">
      <p>👋 Hello, {displayName}!</p>
      {avatarUrl && (
        <Dropdown>
          <DropdownTrigger>
            <Avatar isBordered src={avatarUrl} />
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="edit-profile" onPress={() => setShowEditModal(true)}>
              Edit Profile
            </DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => { supabaseClient.auth.signOut() }}>
              Sign out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      
      {/* Edit Profile Modal */}
      <EditProfileModal 
        supabaseClient={supabaseClient} 
        supabaseSession={supabaseSession}
        onProfileUpdate={() => {
          fetchProfile();
          setShowEditModal(false);
        }}
        onClose={showEditModal}
        onModalClose={() => setShowEditModal(false)}
      />
    </div>
  );
}


export default function NavBar({ supabaseClient, supabaseSession }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Navbar maxWidth="full">
      <NavbarContent className="justify-betw">
        <NavbarContent className="hidden sm:flex gap-4 justify-between" justify="start">
          <NavbarBrand>
            <MiniLogo />
            <p className="font-bold text-inherit pl-2">Mini Tracker</p>
          </NavbarBrand>
          <NavbarItem isActive={currentPath === "/"}>
            <Link color="foreground" href="/">
              Home
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          {!supabaseSession ? (
            <NavbarItem className="hidden lg:flex">
              <LoginModal supabaseClient={supabaseClient} />
            </NavbarItem>
          ) : (
            <UserDetails supabaseClient={supabaseClient} supabaseSession={supabaseSession} />
          )}
        </NavbarContent></NavbarContent>
    </Navbar>
  );
}
