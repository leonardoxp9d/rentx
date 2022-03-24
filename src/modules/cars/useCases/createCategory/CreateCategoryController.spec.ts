/** teste de integração para o controller CreateCategoryController.ts */

import { hash } from "bcrypt";
// eslint-disable-next-line import/no-extraneous-dependencies
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConection from "@shared/infra/typeorm";

let connection: Connection;
/** esse app e do arquivo app.ts
 * quando passamos ele como parametros aqui
 * temos acesso a todas as requisições/rotas da nossa aplicação */
describe("Create Category Controller", () => {
  /** beforeAll - método para fazer o que quisermos
   * antes de iniciar os testes */
  beforeAll(async () => {
    /** pega a conexão com o banco de dados */
    connection = await createConection();

    /** roda as migrations */
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license ) 
      values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXX')
    `
    );
  });

  /** afterAll - roda depois de realizar todos os testes */
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new category ", async () => {
    /** enviando dados user admin para poder criar a categoria do carro */
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;
    console.log(token);

    /** expect(response.status).toBe(201);-
     * espero que meu statusCode seja 201 */
    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest",
        description: "Category Supertest",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });
});
