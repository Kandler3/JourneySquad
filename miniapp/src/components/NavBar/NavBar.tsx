import { Icon28AddCircle } from "@telegram-apps/telegram-ui/dist/icons/28/add_circle";
import { Icon28Home } from "@/icons/Home";
import { Icon28Search } from "@/icons/Search"
import { Icon28Profile } from "@/icons/Profile";
import { NavLink } from "react-router-dom";

import "./NavBar.css"


export function NavBar() {
    return (
      <div className="nav-bar">
        <NavLink className="nav-link" to='/'>
          <Icon28Home />
        </NavLink>
        <NavLink className="nav-link" to='/travel-plans'>
          <Icon28Search />
        </NavLink>
        <NavLink className="nav-link" to='/travel-plans/new'>
          <Icon28AddCircle />
        </NavLink>
        <NavLink className="nav-link" to='/profile/-1'>
          <Icon28Profile />
        </NavLink>
      </div>
    );
  }
  