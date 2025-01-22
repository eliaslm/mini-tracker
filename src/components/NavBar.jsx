import { Avatar, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { useLocation } from "react-router-dom";

import { LoginModal } from "./LoginModal";
import { useEffect, useState } from "react";

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


function UserDetails({ supabaseClient }) {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    // Get user info
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session.user) {
        supabaseClient
          .from('profiles')
          .select()
          .eq('user_id', session?.user.id)
          .limit(1)
          .single()
          .then(
            ({ data, error }) => {
              const { data: { publicUrl } } = supabaseClient
                .storage
                .from('avatars')
                .getPublicUrl(data.avatar)

              setUserInfo(
                {
                  first_name: data.first_name,
                  avatarUrl: publicUrl,
                }
              )
            }
          )
      } else {
        setUserInfo({})
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="flex gap-4 items-center">
      <p>👋 Hello, {userInfo.first_name}!</p>
      {
        userInfo.avatarUrl && (
          <>
            <Dropdown>
              <DropdownTrigger>
                <Avatar isBordered src={userInfo?.avatarUrl} />
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => { supabaseClient.auth.signOut() }}>
                  Sign out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        )
      }
    </div>
  );
};


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
          <NavbarItem isActive={currentPath === "/dummy"}>
            <Link color="foreground" href="/dummy">
              Dummy
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          {!supabaseSession ? (
            <>
              <NavbarItem className="hidden lg:flex">
                <LoginModal supabaseClient={supabaseClient} />
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="primary" href="#" variant="flat">
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          )
            :
            (
              <UserDetails supabaseClient={supabaseClient} />
            )
          }
        </NavbarContent></NavbarContent>
    </Navbar>
  );
}
