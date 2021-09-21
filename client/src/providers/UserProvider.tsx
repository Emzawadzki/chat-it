import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { AuthApi } from "../api/AuthApi";
import { QUERY } from "../config/queries";

interface UserContextValue {
  /**
   * null = settled guest user
   * undefined = not yet settled user
   */
  user: {
    name: string;
    id: number
  } | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserContextValue["user"]>>;
}

const defaultValue: UserContextValue = {
  user: undefined,
  setUser: () => { }
}

const UserContext = createContext(defaultValue);
export const useUserContext = () => useContext(UserContext);

export const UserContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserContextValue["user"]>();
  const { data } = useQuery(QUERY.USER, AuthApi.getUser);

  useEffect(() => {
    console.log("UEff", data);

    if (data) {
      setUser(data.user ?? null);
    }
  }, [data])

  return <UserContext.Provider value={{ user, setUser }}>
    {children}
  </UserContext.Provider>
}