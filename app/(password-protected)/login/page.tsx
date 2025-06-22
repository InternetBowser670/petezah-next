import { login, signup } from "./actions";
import MarqueeBg from "@/ui/backgrounds/marquee-bg";

export default function LoginPage() {
  return (
    <div className="flex items-center relative justify-center h-[100%]">
      <MarqueeBg />
      <div>
        <form className="text-center px-[50px]! py-[25px]! rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37]">
          <h1 className="text-3xl mb-3!">Authenticate</h1>
          <label htmlFor="email">Email:</label>
          <input className="px-2! py-1! bg-black border-2 border-white rounded-2xl transition-colors duration-500 w-200 mx-2!" id="email" name="email" type="email" required />
          <br />
          <br />
          <label htmlFor="password">Password:</label>
          <input className="px-2! py-1! bg-black border-2 border-white rounded-2xl transition-colors duration-500 w-200 mx-2!" id="password" name="password" type="password" required />
          <br />
          <br />
          <div>
            <button className="px-2! py-1! bg-black border-2 border-white rounded-2xl hover:bg-gray-800 transition-colors duration-500" formAction={login}>Log in</button>
            <span> or </span>
            <button className="px-2! py-1! bg-black border-2 border-white rounded-2xl hover:bg-gray-800 transition-colors duration-500" formAction={signup}>Sign up</button>
          </div>
          <br />
          <p className="text-gray-500">You will have to verify your email address before you can log in.</p>
        </form>
      </div>
    </div>
  );
}
