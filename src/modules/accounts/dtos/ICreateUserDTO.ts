/** avatar ?
 * id? - colocamos como opcional porque agora também vamos utilizar
 * o método create como forma de atualizar os dados do banco
 * no caso no momento a foto de avatar */
interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  driver_license: string;
  avatar?: string;
  id?: string;
}

export { ICreateUserDTO };
