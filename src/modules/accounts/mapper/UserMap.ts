import { classToPlain } from "class-transformer";

import { IUserResponseDTO } from "../dtos/IUserReponseDTO";
import { User } from "../infra/typeorm/entities/User";

class UserMap {
  /* Método estatico para quando chamar o toDO, n precise fazer new UserMap */
  static toDTO({
    email,
    name,
    id,
    avatar,
    driver_license,
    avatar_url,
  }: User): IUserResponseDTO {
    const user = classToPlain({
      email,
      name,
      id,
      avatar,
      driver_license,
      avatar_url,
    });

    return user;
  }
}

export { UserMap };
