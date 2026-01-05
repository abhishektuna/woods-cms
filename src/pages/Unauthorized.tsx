export default function Unauthorized() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#f4f7f0]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black">403</h1>
        <p className="text-gray-600 mt-2">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}
