# Full Stack Angular Server
 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
 [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
 [![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://GitHub.com/Naereen/ama)
 [![GitHub contributors](https://img.shields.io/github/contributors/Naereen/StrapDown.js.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/contributors/)
 [![GitHub issues](https://img.shields.io/github/issues/Naereen/StrapDown.js.svg)](https://GitHub.com/Naereen/StrapDown.js/issues/)
 [![GitHub version](https://badge.fury.io/gh/Naereen%2FStrapDown.js.svg)](https://github.com/Naereen/StrapDown.js)
[![Open Source Love](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
Author: Ruslan Gonzalez

## Español

### Introducción
Este es un proyecto Full Stack con Angular... la idea de éste proyecto es tener todo centralizado en un mismo lugar, aunque no es requisito.

En el root del repositorio existe una carpeta con el nombre "angular-src" donde se supone que debe ir el proyecto angular de desarrollo, de tal manera solo es necesario hacer un `ng new angular-src` y para utilizarlo en modo desarrollo un `npm run front-dev` el cual seria un equivalente al `ng serve`, en el archivo "package.json" está la configuración del script para personalizarlo y utilizar un puerto diferente al 4200 con la bandera `--port=`.

### Requisitos
Para poder hacer uso de este proyecto es importante tener desde antes instalado de forma global npm, node y mongodb.

* Angular

```bash
$ ng --version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 7.3.6
Node: 10.15.3
OS: win32 x64
Angular: 7.2.10
... animations, common, compiler, compiler-cli, core, forms
... language-service, platform-browser, platform-browser-dynamic
... router

Package                           Version
-----------------------------------------------------------
@angular-devkit/architect         0.13.6
@angular-devkit/build-angular     0.13.6
@angular-devkit/build-optimizer   0.13.6
@angular-devkit/build-webpack     0.13.6
@angular-devkit/core              7.3.6
@angular-devkit/schematics        7.3.6
@angular/cli                      7.3.6
@ngtools/webpack                  7.3.6
@schematics/angular               7.3.6
@schematics/update                0.13.6
rxjs                              6.3.3
typescript                        3.2.4
webpack                           4.29.0


```

* Node & NPM
```bash
$ node --version
v10.15.3

$ npm --version
6.4.1

```

### Modo de uso
#### Instalacición

Copiarse el repositorio y hacer un git clone e instalarlo con un npm-i

``` bash
$ git clone <url-de-github-del-proyecto>
$ cd <al-proyecto>
$ npm run setup #instalamos las dependencias
```

#### Proyecto de Angular

Tener en cuenta que existe un archivo llamado ".env.example", que habrá que renombrarlo a ".env", también tendrán que rellenarlo con los datos correctos.

Para utilizar un proyecto de Angular basta con crear un nuevo proyecto de Angular con el nombre que querramos.

IMPORTANTE: Debemos estar seguros de esta en el root del repositorio.

OPCIONAL Podemos renombrar la carpeta a "angular-src" para una fácil ubicación.

```bash
$ ng new mi-nueva-app
```

Dentro de la carpeta del proyecto nuevo de angular tenemos que buscar el archivo "angular.json" y cambiamos el "out-dir" del script "build" para que compile en la carpeta "../public".

```json
"build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
              "outputPath": "../public",
```
De esta forma cuando nosotros ejecutemos el `npm run build` nos va a compilar en la carpeta del root de nuestro repositorio "public".

#### Modo de compilación

Para compilar el proyecto de Angular, podemos ejecutar desde el root del repositorio la siguiente sentencia desde nuestra terminal shell:

```bash
$ npm run build # equivalente a $ ng build --prod --base-href "./"
```
Para cambiar el --base-href, debemos modificar la configuración en el "package.json"

#### Iniciar el servidor

Para iniciar el servidor solamente corremos el comando siguiente:

```bash
$ npm run start # equivalente a $ nodemon ./dist/index"
```

Podemos ir al nuestro navegador y teclear http://localhost:3000 para ver el contenido compilado de la carpeta public.

![Start](https://rusgunx.tk/public/angular.jpg)

Cabe mencionar que este comando también inicia el servidor en modo desarrollo para la escucha de todos los cambios que suceden dentro del root del proyecto, ésta característica es gracias a que estamos corriendo la dependencia de nodemon, así que todos los cambios que realicem	os estarán siendo aplicados sobre la marcha y los reflejará de manera instantanea al momento del post-guardado.

En caso que no querramos esta función, basta con ejecutar la siguiente sentencia en nuestra terminal shell:

``` bash
$ npm run start-prod # equivalente a $ node ./dist/index

```

### Modo de desarrollo

Es indispensable iniciar typescript para compilar lo que escribimos en este lenguaje por ello podemos ejecutar el siguiente comando para que se ponga a la escucha de los cambios que guardamos:

``` bash
$ npm run watch # equivalente a $ tsc -w
```

### Para trabajar con Angular en Desarrollo
Es importante hacer un CD a la carpeta angular-src y desde ahi poder ejecutar el Angular CLI.



### Tareas pendientes
* Documentar el proyecto
* Aplicación de ejemplo para LOGIN
* Documentación de la API
* Actualizar README
