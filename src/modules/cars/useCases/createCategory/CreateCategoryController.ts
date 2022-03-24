/** controller - tem toda a responsabilidade que estava dentro da nossa
 * rota post
 * controllers - são classes que recebem a requisição e retornam
 * a resposta para quem está chamando elas */
import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

class CreateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, description } = request.body;

    /** injeção de dependencia, instancia, singleton */
    const createCategoryUseCase = container.resolve(CreateCategoryUseCase);

    await createCategoryUseCase.execute({ name, description });

    return response.status(201).send();
  }
}

export { CreateCategoryController };
