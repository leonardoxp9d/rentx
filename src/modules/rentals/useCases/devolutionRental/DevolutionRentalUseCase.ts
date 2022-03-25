import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);

    const minimum_daily = 1;

    if (!rental) {
      throw new AppError("Rental does not exists!");
    }

    /* pega a data atual */
    const dateNow = this.dateProvider.dateNow();

    /* compara a data inicial com data atual, 
    para pegar os dias em que o cliente ficou com o carro */
    let daily = this.dateProvider.compareInDays(
      rental.start_date,
      this.dateProvider.dateNow()
    );

    /* se não tiver nenhum dia, então a diaria recebe 1 
    porque tem que ter pelo menos 1 dia de diaria */
    if (daily <= 0) {
      daily = minimum_daily;
    }

    /* compara a data atual com a data de entrega esperada,
    para poder pegar os dias que o cliente ficou a mais do esperado */
    const delay = this.dateProvider.compareInDays(
      dateNow,
      rental.expected_return_date
    );

    let total = 0;

    /* se o delay maio que 0, ou seja se teve atraso, calcula a multa */
    if (delay > 0) {
      /* calcula o valor da multa */
      const calculate_fine = delay * car.fine_amount;
      total = calculate_fine;
    }

    /* total a ser pago, soma as multas ali encima +
    o calculo da diaria do carro, 
    que e quantos dias o cliente ficou com o carro + o preço da diaria */
    total += daily * car.daily_rate;

    /* atualiza a data de entrega do carro */
    rental.end_date = this.dateProvider.dateNow();
    /* atualiza o total do alguel */
    rental.total = total;

    /** aqui damos um update nesse rental */
    await this.rentalsRepository.create(rental);

    /* atualizamos a disponibilidade/available desse carro, como disponivel/true */
    await this.carsRepository.updateAvailable(car.id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };
