/** controller - tem toda a responsabilidade que estava dentro da nossa
 * rota
 * controllers - são classes que recebem a requisição e retornam
 * a resposta para quem está chamando elas, ele gerencia as rotas */

import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, driver_license } = request.body;

    /** injeção de dependencia, instancia, singleton */
    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      name,
      email,
      password,
      driver_license,
    });

    return response.status(201).send();
  }
}

export { CreateUserController };
