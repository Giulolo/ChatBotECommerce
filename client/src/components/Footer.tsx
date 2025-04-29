import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-foreground text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-poppins font-semibold text-xl mb-4">e-Commerse</h3>
            <p className="text-gray-300 mb-4">
              Tu tienda online para productos excepcionales con entregas rápidas y servicio de atención al cliente premium.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-pinterest-p"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold mb-4">Compras</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#productos" className="text-gray-300 hover:text-white transition-colors">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link href="/#productos" className="text-gray-300 hover:text-white transition-colors">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/#productos" className="text-gray-300 hover:text-white transition-colors">
                  Nuevos productos
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Envío y entrega
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold mb-4">Mi cuenta</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Mi perfil
                </a>
              </li>
              <li>
                <Link href="/orders" className="text-gray-300 hover:text-white transition-colors">
                  Mis pedidos
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Lista de deseos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Ayuda
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-gray-300"></i>
                <span className="text-gray-300">
                  Calle Comercio, 123<br />28001 Madrid, España
                </span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-gray-300"></i>
                <span className="text-gray-300">+34 912 345 678</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-gray-300"></i>
                <span className="text-gray-300">info@ecommerse.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} e-Commerse. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Términos y condiciones
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Política de privacidad
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
