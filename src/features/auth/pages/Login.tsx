import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "#f4f7f0",
      }}
    >

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/80 rounded-2xl ">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
