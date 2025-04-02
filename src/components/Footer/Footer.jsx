export default function Footer() {
  return (
    <footer className="bg-transparent flex justify-center relative text-white py-6 px-4 mt-8 text-center md:text-left">
      <div className="text-sm text-center  text-gray-400">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a
            className="text-gray-400 hover:text-gray-400"
            href="https://portfolio-jonatan-barrios.vercel.app/"
          >
            Jonatan Barrios
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
