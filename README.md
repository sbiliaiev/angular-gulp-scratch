# angular-gulp-scratch
Blank AngularJS app, based on Gulp streaming build system.

### Requirements
You need to have [Node.js](https://nodejs.org/) installed on your machine.
Also you need [bower](https://bower.io/) and and [Gulp](http://gulpjs.com/), to install it type in terminal:
```
$ sudo npm install -g bower gulp-cli
```
### Installation
```
$ git clone https://github.com/sbiliaiev/angular-gulp-scratch.git
$ cd angular-gulp-scratch
$ npm install
```
It will install all the needed packages and vendor scripts/styles.

### Tasks
#### Development
- clean-dev - delete development directory
- build-vendor-scripts-dev - prepare vendor scripts for development 
- build-app-scripts-dev - prepare application scripts for development
- build-vendor-styles-dev - prepare vendor styles for development
- build-app-styles-dev - prepare application styles for development
- build-index-dev - prepare index.html file by injecting all dependencies above
- build-partials-dev - prepare templates html files for development
- build-images-dev - prepare images for development
- build-dev - build application for development
- watch-dev - run watcher to track and rebuild certain part of application
- serve-dev - run livereload server
- dev - rebuild application for development, run watcher and server

#### Production
- clean-prod - delete production directory
- build-vendor-scripts-prod - prepare vendor scripts for production 
- build-app-scripts-prod - prepare application scripts for production
- build-vendor-styles-prod - prepare vendor styles for production
- build-app-styles-prod - prepare application styles for production
- build-index-prod - prepare index.html file by injecting all dependencies above
- build-partials-prod - prepare templates html files for production
- build-images-prod - prepare images for production
- build-prod - build application for production
- watch-prod - run watcher to track and rebuild certain part of application
- serve-prod - run livereload server
- prod - rebuild application for production, run watcher and server
