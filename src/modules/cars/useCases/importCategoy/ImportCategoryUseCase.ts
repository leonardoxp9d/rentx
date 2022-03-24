import { parse as csvParse } from "csv-parse";
/** fs (file system)- módulo nativo do node, permite que a gente
 * excecute algumas funções atraves desse modulo */
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

interface IImportCategory {
  name: string;
  description: string;
}

@injectable()
class ImportCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  /** Reponsavel por fazer a leitura das cateogorias */
  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    /** Promise((resolve, reject) - transformamos esse processo em uma promise
     * para que antes de retorna o resultado, ele espere o processo terminar */
    return new Promise((resolve, reject) => {
      /** criamos uma stream de leitura desse arquivo
       * fs.createReadStream()- essa função permite com que faça a
       * leitura do nosso arquivo em partes,
       * file.path - caminho do arquivo, que queremos ler */
      const stream = fs.createReadStream(file.path);
      const categories: IImportCategory[] = [];

      const parseFile = csvParse();

      /** pipe - função que pega o que ta sendo lido no nosso stream
       * e dentro dele, ele joga o que foi lido, para um local que determinamos
       * no caso o parseFile
       * como por exemplo: uma função, ou outro arquivo
       * csv parse - lib que permite que faça a leitura do arquivo */
      stream.pipe(parseFile);

      /** on - função recebe as linhas que esta sendo lida */
      parseFile
        .on("data", async (line) => {
          const [name, description] = line;
          categories.push({
            name,
            description,
          });
        })
        // e como um retorno, espera e depois envia cateogies
        .on("end", () => {
          fs.promises.unlink(file.path); // para excluir o arquivo e n salvar na pasta tmp
          resolve(categories);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }

  // Método para salvar no banco de dado as categorias vinda pelo arquivo
  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);
    // map() - método percorrer nosso array, e nele podemos fazer algumas manipulações
    categories.map(async (category) => {
      const { name, description } = category;

      const existCategory = await this.categoriesRepository.findByName(name);

      if (!existCategory) {
        await this.categoriesRepository.create({
          name,
          description,
        });
      }
    });
  }
}

export { ImportCategoryUseCase };
