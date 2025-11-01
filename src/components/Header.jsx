import Logo from "@/components/Logo";
import {ModeToggle} from "@/components/ui/mode-toggle";

function Header() {
    return (
        <header className="flex items-center justify-between w-full sticky top-0 bg-sidebar backdrop-blur z-50 px-6 py-3">
            <Logo/>
            <ModeToggle/>
        </header>
    );
}

export default Header;