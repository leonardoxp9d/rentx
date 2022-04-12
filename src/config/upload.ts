import crypto from "crypto";
import multer from "multer";
import { resolve } from "path";

const tmpFolder = resolve(__dirname, "..", "..", "tmp");

/* quando estivermos trabalhando em ambiente local salvamos na pasta tmp
quando estiver trabalhando com aws, precisamos ainda salvar no temporario (tmp)
mas depois vamos remover  
porque o multer precisa fazer a leitura do arquivo, para conseguir dps fazer o upload
pra aws */
export default {
  tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(16).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

/** storage: - para usar a função do multer
 * diskStorage() - permite passar algumas informações,
 * como de destino onde vai salvar os arquivos,
 * tbm vamos poder recriar o fileName do nosso arquivo
 * destination - local onde vamos salvar
 * filename: - função que recebe:
 * 1º request - requisição
 * 2º file - arquivo
 * 3º callback - função de callback
 * crypto - função do proprio node, permite a gente trabalhar com criptografia
 * vamos usar para sob-escrever o filename
 * fileHash - hash criado para não ter arquivos com nomes duplicados
 * tostring- transforma em uma string do tipo hex no caso
 * fileName - criamos o nome do arquivo baseado no fileHash junto com o nome original
 * para não ter nomes iguais de arquivos
 * callback -
 * 1º param - recebe e o erro, no caso null
 * 2º param - fileName,
 */
