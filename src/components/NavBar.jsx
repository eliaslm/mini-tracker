import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import {Image} from "@nextui-org/react";
import { useLocation } from "react-router-dom";

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

export default function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Navbar>
      <NavbarBrand>
        <MiniLogo />
        <p className="font-bold text-inherit pl-2">Mini Tracker</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
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
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
