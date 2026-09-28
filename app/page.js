import HomePage from "./HomePage";
import { dishes } from "./menu/dishes";

export default function Home() {
  return <div className="app-layout"><HomePage dishes={dishes.slice(0, 4)} /></div>;
}
