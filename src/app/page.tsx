"use client";
import {useState} from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

import { Input } from "@/components/ui/input";

export default function Home() {
  const { 
        data: session, 

    } = authClient.useSession() 
  
  const [name, setName] = useState("");  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  

  const onSubmit =() => {
    authClient.signUp.email({
      email,
      password,
      name
    },{
        onRequest: (ctx) => {
            //show loading
        },
        onSuccess: (ctx) => {
          alert("User created successfully");      },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        }
      });
    }

    if(session){
      return (
        <div>
          <h1>Welcome, {session.user.name}</h1>
          <Button onClick={() => authClient.signOut()}>Sign Out</Button>
        </div>
      )
    }


  return (
    <div>
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
