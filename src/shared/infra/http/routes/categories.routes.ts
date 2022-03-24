import { Router } from "express";
// multer - lib para fazer leitura de arquivos na nossa aplicação
import multer from "multer";

import { CreateCategoryController } from "@modules/cars/useCases/createCategory/CreateCategoryController";
import { ImportCategoryController } from "@modules/cars/useCases/importCategoy/ImportCategoryController";
import { ListCategoriesController } from "@modules/cars/useCases/listCategories/ListCategoriesController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const categoriesRoutes = Router();

/** configurações do multer
 * dest - local/pasta onde vai salvar o arquivo */
const upload = multer({
  dest: "./tmp",
});

const createCategoryController = new CreateCategoryController();
const importCategoryController = new ImportCategoryController();
const listCategoriesController = new ListCategoriesController();

// Rota para criar categorias
categoriesRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createCategoryController.handle
);

// Rota para listar todas categorias
categoriesRoutes.get("/", listCategoriesController.handle);

/** Rota para receber o arquivo, atráves do multer - ele e tipo um middleware
 * sigle - função para fazer o upload de 1 arquivo só
 * file - nome que será reconhecido pelo nosso insomnia */
categoriesRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  importCategoryController.handle
);

export { categoriesRoutes };
