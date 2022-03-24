// Para inicializar/criar a conexão com o banco de dados

import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "database"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === "test" ? "localhost" : host,
      database:
        process.env.NODE_ENV === "test"
          ? "rentx_test"
          : defaultOptions.database,
    })
  );
};
/**
 * process.env.NODE_ENV === "test" ? "localhost" : host,
 * Se o process.env.NODE_ENV for igual a "test" então uso localhost
 * se não utilizo o próprio "host"
 * 
 * database:
        process.env.NODE_ENV === "test" ...
 * se process.env.NODE_ENV for igual a "test"
 * eu quero que vc usa e o banco "rentx_test", que eo banco de teste
 * se não (:), então usa o que vem como default/padrão
 * defaultOptions.database
 * Essa informação do  process.env.NODE_ENV
 * vem do package.json, onde estamos passando
 * o script do jest, conseguimos definir que nossa NODE_ENV e igual a test
 * No caso aqui estamos pegando as variaveis que tem dentro da nossa aplicação
 * exemplo: process.env.NODE_ENV */
