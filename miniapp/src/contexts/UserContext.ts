import {createContext} from "react";
import {User} from "@/models/User.ts";

export const UserContext = createContext<{ currentUser: User | undefined, setCurrentUser: (user: User) => void }>({
    currentUser: undefined,
    setCurrentUser: (user) => {}
});