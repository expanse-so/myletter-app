export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Welcome to MyLetter</h1>
      <p className="text-xl mb-8">Your easy-to-use newsletter management platform</p>
      
      <div className="flex gap-4">
        <a 
          href="/login" 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Login
        </a>
        <a 
          href="/signup" 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Sign Up
        </a>
      </div>
    </main>
  );
}