# base-Chozas

Whenever I start a new project, I don't know what to write for the first commit. After doing a “git init” there is technically nothing there...

# Usage
En FormContainer.jsx y en la linea 49 esta el history push a la pagina que debe ir una vez este logueado, cambiar ahí la ruta a la cual se quiera ir cuando el logeo sea exitoso.

# Information

## webpack.dev.config.js
Es la que ejecutamos para nuestro entorno de desarrollo con "npm run dev"

## webpack.dll.config.js
Se construye con "npm run build:dll" sirve para preconstruir todas las librerias que estamos usando (Como por ejemplo react) para no tener que hacerlo cada vez que usabamos el "npm run build".

### Librerias que usa:
- terser-webpack-plugin
- optimize-css-assets-webpack-plugin
Son para optimizar el codigo.

## webpack.config.js
Es para construir nuestra app en el entorno de produccion con "npm run build".

### Librarias que usa:
- mini-css-extract-plugin *Extrae el estilo en un archivo css*.
- add-asset-html-webpack-plugin *Agrega el dll*.
- purgecss-webpack-plugin *Limpia todo el css que no usemos*.
- clean-webpack-plugin *Limpia el lugar donde se va a poner los archivos de produccion*.
- html-critical-webpack-plugin *Pone el css de lo primero que se ve primero y el resto del css al final, para optimizar la carga de la pagina*.

# Contributing
If someone wants to add or improve something, I invite you to collaborate directly in this repository: [Base-Chozas](https://github.com/arielskap/Base-Chozas)

# License
random-msg is released under the [MIT License](https://opensource.org/licenses/MIT).