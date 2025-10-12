import { useUser } from "../contexts/UserContext";
import HeroDashboard from "./HeroDashboard";
import HeroLanding from "./HeroLanding";


export default function Hero() {
    const { isAuthenticated } = useUser();
    return isAuthenticated ? <HeroDashboard /> : <HeroLanding />;

}






