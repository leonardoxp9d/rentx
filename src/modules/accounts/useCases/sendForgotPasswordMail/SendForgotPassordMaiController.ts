import { Request, Response } from "express";
// import { container } from 'tsyringe';
// import { SendForgotPassordMailUseCase } from './SendForgotPassordMailUseCase';


class SendForgotPassordMaiController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    // const sendforgotpassordmaiUseCase = container.resolve(SendForgotPassordMailUseCase);
    // await sendforgotpassordmaiUseCase.execute(email);

    return response.send();
  }
}

export { SendForgotPassordMaiController };
