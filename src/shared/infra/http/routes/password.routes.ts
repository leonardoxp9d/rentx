import { Router } from "express";

import { SendForgotPassordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPassordMailController";

const passwordRoutes = Router();

const sendForgotPasswordMailController = new SendForgotPassordMailController();

passwordRoutes.post("/forgot", sendForgotPasswordMailController.handle);

export { passwordRoutes };
