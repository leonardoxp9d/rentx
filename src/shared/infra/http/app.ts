import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

// chama o container para iniciar as instancias do tsyringe
import "@shared/container";

import { AppError } from "@shared/errors/AppError";
// importa a conexão do database/typeorm
import createConnection from "@shared/infra/typeorm";

import swaggerFile from "../../../swagger.json";
import { router } from "./routes";

/** cria conexão com o banco */
createConnection();

const app = express();

app.use(express.json());

/** server para armazenar as informações da
 * url/rota onde nossa documentação irá ficar
 * swaggerUi.serve - chama o servidor
 * .setup() - arquivo json onde vão está a documentação da aplicação */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

/** verifica a instancia do erro */
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    /** Se a instancia for do AppError, executa */
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }
    /** Se nãpo,erro da propria aplicação q n temos o controle */
    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app };
