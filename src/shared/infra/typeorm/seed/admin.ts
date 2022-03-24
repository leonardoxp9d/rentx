/** Arquivo para criar o cadastro nosso usuário administrador */

import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";

import createConnection from "../index";

async function create() {
  /** Conexão do banco de dados */
  const connection = await createConnection("localhost");

  const id = uuidV4();
  const password = await hash("admin", 8);

  /** inserindo na mão o usuario no banco de dados com sql puro */
  await connection.query(
    `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license ) 
      values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXX')
    `
  );

  await connection.close();
}

create().then(() => console.log("User admin created!"));
