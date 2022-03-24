/** Teste, para testar o useCase CreateCategoryUseCase.ts */
/** describre - serve para agrupar nossos testes
 * colocamos tudo que esta fazendo nosso teste
 * dentro dele colocamos os testes */
/** it - para criar os testes, colocamos dentro do it()
 * 1º param - descrição do que espera que o teste faça
 * 2º oaram - a função com o teste dentro
 */
/** expect()/espero - colocamos o resultado que deu
 * toBe()/seja - colocamos o resultado que esperamos aqui
 * podemos colocar quanto expect quisermos */
/** .not.toBe - não espero que seja tal resultado */
/** beforeEach() - e uma função que executa uma determinada função
 * antes de começar o teste */
/** toHaveProperty() - verifica se o objeto tem uma determinada propriedade
 * no caso o id, assim fica sabendo se realmente foi criado o user */
/** rejects - caso o código seja rejeitado
 * toBeInstanceOf - espera que o erro seja da uma determinada instancia
 * no caso o AppError */

import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let createCategoryUseCase: CreateCategoryUseCase;

describe("Create Category", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it("should be able to create a new category", async () => {
    const category = {
      name: "Category Test",
      description: "Category description Test",
    };
    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description,
    });

    const categoryCreated = await categoriesRepositoryInMemory.findByName(
      category.name
    );

    expect(categoryCreated).toHaveProperty("id");
  });

  it("should not be able to create a new category with name exists", async () => {
    expect(async () => {
      const category = {
        name: "Category Test",
        description: "Category description Test",
      };

      await createCategoryUseCase.execute({
        name: category.name,
        description: category.description,
      });

      await createCategoryUseCase.execute({
        name: category.name,
        description: category.description,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
