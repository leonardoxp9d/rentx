import fs from "fs";
import { resolve } from "path";

import upload from "@config/upload";

import { IStorageProvider } from "../IStorageProvider";

class LocalStorageProvider implements IStorageProvider {
  /* folder- local(avatar/cars) onde vai ser salvo a imagem */
  async save(file: string, folder: string): Promise<string> {
    /* rename() - pega o que esta dentro de tmp, envia para o folder/pasta (avatar ou cars)
    file - nome do arquivo */
    await fs.promises.rename(
      resolve(upload.tmpFolder, file),
      resolve(`${upload.tmpFolder}/${folder}`, file)
    );

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    /* pegando o nome do arquivo completo */
    const filename = resolve(`${upload.tmpFolder}/${folder}`, file);

    /** stat- função verifica se um arquivo existe, na diretorio que passamos
     * colocamos ele dentro de um try-catch
     * porque se o arquivo que passar pra ele der como n encontrado
     * ele da um erro, ai então cai no try-catch */
    try {
      await fs.promises.stat(filename);
    } catch {
      return;
    }
    /** unlink - método responsavel por remover o nosso arquivo/avatar antigo */
    await fs.promises.unlink(filename);
  }
}

export { LocalStorageProvider };
