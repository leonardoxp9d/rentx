import crypto from "crypto";
import multer from "multer";
import { resolve } from "path";

const tmpFolder = resolve(__dirname, "..", "..", "tmp");

/* quando estivermos trabalhando em ambiente local salvamos na pasta tmp
quando estiver trabalhando com aws, precisamos ainda salvar no temporario (tmp)
mas depois vamos remover  
porque o multer precisa fazer a leitura do arquivo, para conseguir dpsfazer o upload dps
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
