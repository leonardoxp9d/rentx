/* arquivo para salvar ou deletar arquivo/imagem do bucket na aws */

import { S3 } from "aws-sdk";
import fs from "fs";
import mime from "mime";
import { resolve } from "path";

import upload from "@config/upload";

import { IStorageProvider } from "../IStorageProvider";

class S3StorageProvider implements IStorageProvider {
  /* cliente - para utilizar em nossos uploads e td que precisar */
  private client: S3;

  constructor() {
    /* instaciamos o S3 
    region: process.env.AWS_BUCKET_REGION, - região que vamos utilizar nele */
    this.client = new S3({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  async save(file: string, folder: string): Promise<string> {
    /* pega o nome do arquivo que foi passado na pasta tmp */
    const originalName = resolve(upload.tmpFolder, file);

    /* faz uma leitura do arquivo, porque quando formos enviar 
    para o bucket, precisamos ter o arquivo para fazer upload  */
    const fileContent = await fs.promises.readFile(originalName);

    /* getType - método para pegar o ContentType pelo originalName */
    const ContentType = mime.getType(originalName);

    /* putObject - para inserir o objeto dentro do S3 
    Bucket - e qual e o bucket / e qual e o folder(avatar ou cars)
    Key - file - que o nome do arquivo
    ACL - tipo de permissão 
    Body - e o arquivo 
    ContentType - para conseguir quando clicar no arquivo,o user possa visualizar
    dentro do browser, para isso tbm instalando a lib mime 
    .promise(); - tranforma em uma promise, para aguardar o objeto/arquivo ser
    inserido dentro do S3 */
    await this.client
      .putObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
        ACL: "public-read",
        Body: fileContent,
        ContentType,
      })
      .promise();

    /* remove o arquivo/foto da pasta tmp  */
    await fs.promises.unlink(originalName);

    return file;
  }

  /* método para remover arquivo/foto de dentro do S3 
  Bucket - passamos o bucket que é o nome da pasta/banco criada no aws
  para armazenar arquivos/fotos 
  keyt - arquivo que quero excluir */
  async delete(file: string, folder: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
      })
      .promise();
  }
}

export { S3StorageProvider };
