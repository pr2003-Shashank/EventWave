const NotFoundPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center
      bg-gradient-to-br from-[#f3d1ff] via-[#e9cbf0] to-[#ffffff] p-6
      font-RobotoSlab"
    >
      {/* Animated 404 */}
      <h1 className="text-[10rem] font-extrabold text-[#712681] mb-4 animate-bounce drop-shadow-lg">
        404
      </h1>

      {/* Subheading with pulse animation */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-pulse">
        Page Not Found
      </h2>

      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Oops! We can’t seem to find the page you’re looking for.
      </p>
      <a
        href="/"
        className="bg-[#712681] text-white px-6 py-3 rounded-lg shadow-md 
        hover:bg-[#5e1c6a] transition transform hover:scale-110 hover:animate-pulse"
      >
        Return Home
      </a>
    </div>
  );
};

export default NotFoundPage;
