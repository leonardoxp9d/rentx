import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

/** Para converter o formato da hora em formato utc */
dayjs.extend(utc);

class DayJsDateProvider implements IDateProvider {
  compareInHours(start_date: Date, end_date: Date): number {
    const end_date_utc = this.convertToUtc(end_date);
    const start_date_utc = this.convertToUtc(start_date);

    /** dayjs() - conseguimos a diferença entre 2 datas
     * hours - converte toda essa comparação em horas */
    return dayjs(end_date_utc).diff(start_date_utc, "hours");
  }

  /** converte a hora para o foramto utc */
  convertToUtc(date: Date): string {
    return dayjs(date).utc().local().format();
  }
  /** Retorna a data atual */
  dateNow(): Date {
    return dayjs().toDate();
  }
}

export { DayJsDateProvider };
