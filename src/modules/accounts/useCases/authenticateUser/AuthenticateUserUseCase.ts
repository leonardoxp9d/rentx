import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  email: string;
  password: string;
}
/** interface criada para n retonar a senah tbm */
interface IReponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IReponse> {
    // Verifica se o usuario existe
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect!");
    }

    /** campare - método para verificar se as senhas são iguais */
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect!");
    }

    /** sing - função para gerar nosso token
     * 1º param - email ou name do user, por enquanto vamos deixar {}
     * 2º chave secreta -auxilia na hora criar o jsonwebtoken
     * essa chave tbm vamos usar para verificar o token
     * 3º subject - id do usuario que gerou
     * 4º expireIn - quando vai inspirar o token */
    const token = sign({}, "629154f7128dbc61abbdf5264038e57d", {
      subject: user.id,
      expiresIn: "1d",
    });

    /** tokenReturn - para não enviar a senha/password junto */
    const tokenReturn: IReponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
