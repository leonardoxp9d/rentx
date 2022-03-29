import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPassordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Mail", () => {
  /* beforeEach() - responsavel por instanciar tudo que precisa */
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send a forgot password mail to user", async () => {
    /* como não conseguimos testar de fato se o email foi enviado
    vamos utilizar uma função(spyOn) do jest, que fica espiando uma classe(mailProvider)
    se algum método foi chamado, ele fica de olho se o método sendMail foi chamado  */
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    /* cria um user, para conseguir fazer a simulação do envio de email */
    await usersRepositoryInMemory.create({
      driver_license: "664168",
      email: "avzonbop@ospo.pr",
      name: "Blanche Curry",
      password: "1234",
    });

    /* envia o email */
    await sendForgotPasswordMailUseCase.execute("avzonbop@ospo.pr");

    /* espero(expect) que sendMail, seja chamado(toHaveBeenCalled) */
    expect(sendMail).toHaveBeenCalled();
  });

  /* não faz o envio de email se o usuario não existir */
  it("should not be able to send an email if user does not exists", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("ka@uj.gr")
    ).rejects.toEqual(new AppError("User does not exists!"));
  });

  /* deve ser capaz de criar um token de usuários */
  it("should be able to create an users token", async () => {
    /* verifica se o metodo create da classe usersTokensRepositoryInMemory, foi chamado */
    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );

    /* cria um usuario */
    usersRepositoryInMemory.create({
      driver_license: "787330",
      email: "abome@regrog.ee",
      name: "Leon Perkins",
      password: "1234",
    });

    /* envia o email de reset password */
    await sendForgotPasswordMailUseCase.execute("abome@regrog.ee");

    /* verifica se foi chamado o método create, se foi chamado significa 
    que esta conseguindo gerar o users_tokens */
    expect(generateTokenMail).toBeCalled();
  });
});
