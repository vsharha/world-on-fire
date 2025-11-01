import Logo from "@/components/Logo";
import {ModeToggle} from "@/components/ui/mode-toggle";

function Header() {
    return (
        <header>
            <Logo/>
            <ModeToggle/>
        </header>
    );
}

export default Header;