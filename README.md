## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```
Database connection is configured within the `app.module.ts` file

## Description

- **Pipes**: Pipes are applied at the global level, which means they are shared among all modules. To enable global pipes, add the following code to `main.ts`:

    ```typescript
    app.useGlobalPipes(new ValidationPipe());
    ```

- **Interceptors**: Interceptors are employed at the controller level, providing a way to customize data handling and processing during request handling.

- **Guards**: Guards are utilized at the route level to control access and protect specific routes.
