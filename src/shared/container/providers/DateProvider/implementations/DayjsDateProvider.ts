import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

/** Para converter o formato da hora em formato utc */
dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
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

  /* compara as datas e retorna a comparação em dias */
  compareInDays(start_date: Date, end_date: Date): number {
    const end_date_utc = this.convertToUtc(end_date);
    const start_date_utc = this.convertToUtc(start_date);

    return dayjs(end_date_utc).diff(start_date_utc, "days");
  }

  /* add dias a data atual, e retonar esse novo dia */
  addDays(days: number): Date {
    return dayjs().add(days, "days").toDate();
  }

  /* add horas na hora atual e retorna essa nova data 
  toDate() - converte em data */
  addHours(hours: number): Date {
    return dayjs().add(hours, "hour").toDate();
  }
}

export { DayjsDateProvider };
