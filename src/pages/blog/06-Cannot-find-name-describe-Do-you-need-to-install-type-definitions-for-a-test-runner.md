---
---

# Error with JEST and Typescript: Cannot find name 'describe'. Do you need to install type definitions for a test runner?

El objetivo de este articulo es poder tener un tsconfig.json que no transcriba los test al crear el dist con el build del código, pero que a su vez se tenga cobertura para que reconozca los @types/jest y poder trabajar en desarrollo bien.

### ERROR

```
Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.ts
```

## Solution

1. Crea o modifica tu archivo `tsconfig.json` :

```
{
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"],
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist/",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

2. crear un nuevo archivo llamado `tsconfig.build.json`:

```
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts", "dist"]
}
```

Este archivo nos evitará transpilar los test de typescript a JS en nuestro dist

3. Modifica los scripts en tu `package.json`:

```
"scripts": {
    "dev": "ts-node src/app.ts",
    "dev:nodemon": "nodemon",
    "build": "rimraf ./dist && tsc -p tsconfig.build.json",
    "start": "npm run build && node dist/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
```

