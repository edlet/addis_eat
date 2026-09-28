import MenuSidebar from "./MenuSidebar";

export default function MenuLayout({ children }) {
  return <div className="menu-shell"><aside className="menu-sidebar"><MenuSidebar /></aside><div className="menu-route-content">{children}</div></div>;
}
