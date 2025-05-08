<<<<<<< HEAD
# ChatBotECommerce
Tarea de desarrollo de software 9

Los codigos estan en el sub-branches
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
>>>>>>> master
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
Dependiendo de la version de la base de datos pedir a los encargado el nuevo url de la base de datos

No servira la aplicacion si la url IMPORTATE!!
Ya esta configurada de tal forma q se te creara la base de datos de forma automatica si
le das la url da base de datos local
pero pueden usar https://console.neon.tech/app


3. Comandos principales
Comando	Descripción
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