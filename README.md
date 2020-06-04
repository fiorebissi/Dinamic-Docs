# Template APP

## Run APP DEV

1. Clonar el projecto
2. Ejecutar "npm i"
3. Configurar el archivo orgconfig.json
4. Crear la base de datos (con el nombre que se coloque en el orgconfig.json)
5. ejecutar "npm run dev"
6. Indicara por consola si esta ejecutandose y en cual puerto.

## ESLINT

- Usa el standar de JavaScript

## Jest

- Los "unit test" se ejecutan haciendo referencia al directorio "build/".
- Todos los "unit test" estan en JavaScript.

## src/resource/

- Todo los contenido en este directorio, se debe usar solo en ambiente DEV. Todas estas variables se deben declara como variables de entorno.

## Run APP PROD

1. Luego de validar el correcto funcionamiento en el ambiente DEV, ejecutar "npm run build"
2. Copiar lo siguiente a su ambiente PROD:
    - build/
    - package.json
    - package-lock.json
3. Luego posicionarme por consola en su ambiente PROD y ejecutar "npm i"
4. Configurar los las credenciales de la base de datos en variables de entorno.
5. Ejecutamos "npm run start" para validar el correcto funcionamiento, de ser asi, cancelamos su ejecutacion.
6. Configuramos el servidor para que inicie nuestra APP.

