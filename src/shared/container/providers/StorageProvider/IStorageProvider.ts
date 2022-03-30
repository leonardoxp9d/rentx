/* interface para informar os métodos relacionado a salvar arquivos de imagem */

interface IStorageProvider {
  save(file: string, folder: string): Promise<string>;
  delete(file: string, folder: string): Promise<void>;
}

export { IStorageProvider };
