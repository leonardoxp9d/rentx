// Essa vai ser minha interface, meu contrato

import { Category } from "../infra/typeorm/entities/Category";

/** DTO - Data transfer object, criar um objeto responsabel pro fazer a tranferencia
 * de dados de uma camada/classe para outra, ele faz essa tipagem de objeto */
interface ICreateCategoryDTO {
  name: string;
  description: string;
}

interface ICategoriesRepository {
  findByName(name: string): Promise<Category>;
  list(): Promise<Category[]>;
  create({ name, description }: ICreateCategoryDTO): Promise<void>;
}

export { ICategoriesRepository, ICreateCategoryDTO };
