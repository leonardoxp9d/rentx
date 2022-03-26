import { Router } from "express";

import { CreateRentalController } from "@modules/rentals/useCases/createRental/CreateRentalController";
import { DevolutionRentalController } from "@modules/rentals/useCases/devolutionRental/DevolutionRentalController";
import { ListRentalsByUseController } from "@modules/rentals/useCases/listRentalByUser/ListRentalsByUseController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const rentalsRoutes = Router();

const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const listRentalsByUserController = new ListRentalsByUseController();

/* rota para criar aluguel de carro */
rentalsRoutes.post("/", ensureAuthenticated, createRentalController.handle);

/* rota para fazer devolução do carro */
rentalsRoutes.post(
  "/devolution/:id",
  ensureAuthenticated,
  devolutionRentalController.handle
);

/* rota para listar os alugueis feitos pelo usuario */
rentalsRoutes.get(
  "/user",
  ensureAuthenticated,
  listRentalsByUserController.handle
);

export { rentalsRoutes };
