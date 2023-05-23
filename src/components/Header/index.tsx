import { HeaderContainer } from "./styles.ts";
import { Scroll, Timer } from "phosphor-react";
import logo from "../../assets/Logo.svg";
export function Header() {
  return (
    <HeaderContainer>
      <img src={logo} alt="" />
      <nav>
        <a href=""><Timer size={24} /></a>
        <a href=""><Scroll size={24} /></a>
      </nav>
    </HeaderContainer>
  );
}