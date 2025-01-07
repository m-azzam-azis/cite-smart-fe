import { login } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="h-full grid place-items-center">
      <form className="mx-auto w-1/2 my-auto h-1/2 flex flex-col gap-4">
        <label htmlFor="email">Email:</label>
        <Input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <Input id="password" name="password" type="password" required />
        <Button className="w-1/4" formAction={login}>
          Log in
        </Button>
        
      </form>
    </div>
  );
}
