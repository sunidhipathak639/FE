import LoginForm from "../components/forms/LoginForm";
import { DotBackground } from "@/components/DotBackground";

export default function Login() {
  return (
    <DotBackground>
      <div className="">
        <LoginForm />
      </div>
    </DotBackground>
  );
}
