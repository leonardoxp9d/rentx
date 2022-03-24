import { getRepository, Repository } from "typeorm";

import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from "../../../repositories/ICategoriesRepository";
import { Category } from "../entities/Category";

class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  // Método para criar categoria
  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    // create - criar a entidade para poder salvar no banco
    const category = this.repository.create({
      name,
      description,
    });

    await this.repository.save(category);
  }

  // Método para Retornar/Listar as categorias
  async list(): Promise<Category[]> {
    // find - retorna uma lista, uma promise de category
    const categories = await this.repository.find();
    return categories;
  }

  // Método para verificar se o nome da categoria já existe
  async findByName(name: string): Promise<Category> {
    // findOne - tras 1 registro, que for igual o nome que foi passado
    const category = await this.repository.findOne({ name });
    return category;
  }
}

export { CategoriesRepository };
