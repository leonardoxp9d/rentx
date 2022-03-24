import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  name: string;
  description: string;
}

/** injectable -transforma em uma classe que pode injetavel por outra
 * que no caso vai ser nosso controller */
@injectable()
class CreateCategoryUseCase {
  constructor(
    /** cria a instancia, singleton */
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  // método responsável por fazer tudo que nossa create precisa fazer
  async execute({ name, description }: IRequest): Promise<void> {
    const categoryAlreadyExists = await this.categoriesRepository.findByName(
      name
    );

    if (categoryAlreadyExists) {
      throw new AppError("Category already exists!");
    }

    await this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };
