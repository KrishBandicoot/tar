const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">
              © {currentYear} Tienda Virtual. Todos los derechos reservados.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-500">
              Versión 1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;