import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    /** colocamos o query ao invez do param,
     * porque o param e obrigatorio ter,
     * ja o query os parametros não são obrigatorios */
    const { brand, name, category_id } = request.query;

    const listAvailableCarsUseCase = container.resolve(
      ListAvailableCarsUseCase
    );

    /** as string, - forçamos que nossos atributos
     * sejam string, porque ele pode vir da requisição como
     * QueryString.ParsedQs, e ai ele n vai reconhecer */
    const cars = await listAvailableCarsUseCase.execute({
      brand: brand as string,
      name: name as string,
      category_id: category_id as string,
    });

    return response.json(cars);
  }
}

export { ListAvailableCarsController };
