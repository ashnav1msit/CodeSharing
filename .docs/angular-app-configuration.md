The following documentation describes the customizations done to our applications. These customizations will likely need to be done for new applications when they are created.

# Custom webpack config

In order to support certain functionality such as [Importing SVG's as urls](https://www.npmjs.com/package/svg-url-loader), we need to configure our front end apps to use the [`custom webpack config`] defined in the root of the repo. The purpose of this file is to provide a mechanism for which we can wire in new rules and loaders for our applications.

To configure a frontend app to use this, you will need to do the following configuration changes for your your application in the [`angular.json`].

1. Update the `build` section with the following changes

```patch
        "build": {
-         "builder": "@angular-devkit/build-angular:browser",
+         "builder": "@nrwl/angular:webpack-browser",
          "outputs": ["{options.outputPath}"],
          "options": {
            "outputPath": "dist/apps/payeduc-fls",
            "index": "apps/payeduc-fls/src/index.html",
            "main": "apps/payeduc-fls/src/main.ts",
            "polyfills": "apps/payeduc-fls/src/polyfills.ts",
            "tsConfig": "apps/payeduc-fls/tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "apps/payeduc-fls/src/favicon.ico",
              "apps/payeduc-fls/src/assets"
            ],
            "styles": ["apps/payeduc-fls/src/styles/styles.scss"],
            "scripts": [],
+           "customWebpackConfig": {
+             "path": "./webpack-config.js"
+           }
          },
```

2. Update the `serve` target with the following changes

```patch
        "serve": {
-         "builder": "@angular-devkit/build-angular:dev-server",
+         "builder": "@nrwl/angular:webpack-server",
          "configurations": {
            "production": {
              "browserTarget": "payeduc-fls:build:production",
              "proxyConfig": "./proxy.conf.json"
            },
            "development": {
              "browserTarget": "payeduc-fls:build:development",
              "proxyConfig": "./proxy.conf.json"
            }
          },
          "defaultConfiguration": "development"
        },

```

Which will effectively wire up the custom webpack config for your project. The custom webpack config is currently configured to allow us to `import` SVG's in code as if they were regular `.ts` files like so:

```ts
import logo from './logo.svg';
```

In order to get rid of typescript errors when doing this you will need to add a declaration file to provide support within your application.

Add an `images.d.ts` within the `src` directory of your application with the following contents:

```ts
// Allows for the png files to be imported
declare module '*.png';
declare module '*.svg';
```

Which tells typescript that image files can be imported as modules.

> ### Example
>
> An example component that does this is the [`Header`](../libs/aedigital/ui/src/lib/components/header/header.component.ts)

# Proxy.conf

The frontend apps can be run alongside the backend apis. In order to avoid CORS issues between our frontend dev server and the backend apis, there is a [`proxy.conf.json`] file that needs to be configured once in the `serve` of the frontend app within the [`angular.json`] like so:

```json
    "serve": {
        "builder": "@angular-devkit/build-angular:dev-server",
        "configurations": {
        "production": {
            "browserTarget": "payeduc-fls:build:production",
            "proxyConfig": "./proxy.conf.json"
        },
        "development": {
            "browserTarget": "payeduc-fls:build:development",
            "proxyConfig": "./proxy.conf.json"
        }
        },
        "defaultConfiguration": "development"
    },
```

In order to configure your frontend app to point at your local api instance you will need to add a `config.json` into the `assets` folder of your frontend app like so:

```json
{
  "uri": {
    "provider": "/api"
  }
}
```

This configures the apis in the frontend application to point to `/api` which will then be proxied via the [`proxy.conf.json`]. You can now run your frontend and backend at the same time with no cors issues.

[`proxy.conf.json`]: ../proxy.conf.json
[`angular.json`]: ../angular.json
[`custom webpack config`]: ../webpack-config.js
