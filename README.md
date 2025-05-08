ChatBotECommerce - Proyecto de E-commerce con ChatBot
Descripción:
Proyecto de comercio electrónico con ChatBot, desarrollado con React, Vite, TailwindCSS y TypeScript.

🚀 Instalación y Uso
1. Instalar dependencias
bash
npm install
npm install dotenv 
npm install -g cross-env

2. Configurar variables de entorno
.env Se usa el URL de la base de datos si no existe aca pide la url.

3. Comandos principales
Comando	Descripción
Principal
npm run dev	Inicia el servidor de desarrollo (Frontend + Backend)


npm run build	Compila para producción (optimizado)
npm test	Ejecuta pruebas unitarias
npm run eject	¡Cuidado! Expone configs internas (irreversible)



📂 Estructura del proyecto
├── client/       # Frontend (React + Vite)
├── server/       # Backend (Node.js/Express)
├── shared/       # Código compartido (tipos, utilidades)
├── public/       # Assets estáticos (imágenes, favicon)
└── src/          # Fuentes principales


⚠️ Notas importantes
Requisitos: Node.js ≥16 y npm/yarn instalados.

Si falla la instalación, prueba borrando node_modules/ y ejecutando npm install nuevamente.

El proyecto usa TypeScript, por lo que los errores de tipos aparecerán durante el desarrollo.

📌 Documentación adicional:

Configuración de Vite: vite.config.ts

TailwindCSS: tailwind.config.ts

TypeScript: tsconfig.json

✨ ¡Listo para empezar! Ejecuta npm run dev y abre http://localhost:5000.
