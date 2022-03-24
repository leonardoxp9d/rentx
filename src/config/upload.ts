/** arquivo - costumizavel para quem quiser upload de arquivos */
/** resolve - para fazer referencia da pasta, onde queremos salvar
 * as informações dos uploads */

/** folder - recebe o local de onde vai ser feito o upload */
/** storare: - para usar a função do multer
 * diskStorage() - permite passar algumas informações,
 * como de destino onde vai salvar os arquivos,
 * tbm vamos poder recriar o fileName do nosso arquivo
 * destination - local onde vamos salvar
 * .. - volta uma pasta, no caso voltamos a pasta config, e src
 * fomos para na raiz, e ae entra no folder
 * filename: - função que recebe:
 * 1º request - requisição
 * 2º file - arquivo
 * 3º callback - função de callback
 * crypto - função do proprio node, permite a gente trabalhar com criptografia
 * vamos usar para sob-escrever o filename
 * fileHash - hash criado para não ter arquivos com nomes duplicados
 * tostring- transforma em uma string do tipo hex no caso
 * fileName - criamos ele baseado no fileHash junto com o nome original
 * para não ter nomes iguais de arquivos
 * callback -
 * 1º param - recebe e o erro, no caso null
 * 2º param - fileName,
 * */

import crypto from "crypto";
import multer from "multer";
import { resolve } from "path";

export default {
  upload(folder: string) {
    return {
      storage: multer.diskStorage({
        destination: resolve(__dirname, "..", "..", folder),
        filename: (request, file, callback) => {
          const fileHash = crypto.randomBytes(16).toString("hex");
          const fileName = `${fileHash}-${file.originalname}`;

          return callback(null, fileName);
        },
      }),
    };
  },
};
