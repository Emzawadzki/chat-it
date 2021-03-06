import { FormEventHandler, useState } from "react"
import { useMutation } from "react-query";

import { AuthApi } from "../api/AuthApi"
import { useUserContext } from "../providers/UserProvider";

export const Login: React.FC = () => {
  const { setUser } = useUserContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate } = useMutation(AuthApi.login);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    mutate({ username, password }, {
      onSuccess: (data) => {
        setUser(data.user)
      }
    });
  }

  return <form onSubmit={handleSubmit}>
    <input type="text" name="name" id="name" onChange={e => { setUsername(e.target.value) }} value={username} required />
    <input type="password" name="password" id="password" onChange={e => { setPassword(e.target.value) }} value={password} required />
    <input type="submit" value="Submit" />
  </form>
}