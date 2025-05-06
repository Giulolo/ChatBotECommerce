import logo from "../../assets/img/cutecat_logo.gif"

export function PageHeader() {
  return (
    <header 
      className="bg-transparent text-primary p-3 transition-all flex gap-6" 
    >
      <img src={logo} alt="Logo" className="w-20 h-16 hover:opacity-50"  loading="lazy"  />
      <nav className="w-screen flex items-center justify-center">
        <ul className="flex flex-row items-center gap-12 text-lg">
            <li><a href="/" className="hover:text-secondary">Home</a></li>
            <li><a href="/product" className="hover:text-secondary">Productos</a></li>
            <li><a href="/services" className="hover:text-secondary">Servicios</a></li>
            <li><a href="/contact" className="hover:text-secondary">Contactos</a></li>
        </ul>
      </nav>

      <img src="" alt="" className="w-0" loading="lazy" />
    </header>
  );
}