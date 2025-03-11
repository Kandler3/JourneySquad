import {createContext} from "react";
import {User} from "@/models/User.ts";

export const UserContext = createContext<User | undefined>(undefined);