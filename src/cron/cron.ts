import cron, { ScheduledTask } from 'node-cron';

import Cotization, { ICotization } from '../db/models/Cotization';
import { ECurrencies } from '../cotization/CurrencyModel';
import { Dolar, DolarBrou, Euro, PesoArgentino } from '../cotization/Implementation';

let taskCronGetCurrencies: ScheduledTask;

export function startCronGetCurrencies() {
  //
  taskCronGetCurrencies = cron.schedule(
    // `* * * * * *`,
    `0 9-21 * * Mon-Fri`,
    async () => {
      // Get values of Currencies
      const usd = new Dolar();
      const usdBrou = new DolarBrou();
      const euro = new Euro();
      const arg = new PesoArgentino();

      const currencies = [usd, usdBrou, euro, arg];

      for (const currency of currencies) {
        const { buy, sell } = await currency.getValue();

        new Cotization({
          baseCurrency: ECurrencies.UYU,
          time: new Date(),
          currency: currency.currency,
          buy,
          sell,
        }).save();
      }
    },
    {
      timezone: 'America/Montevideo',
    },
  );
}

export function stopCronGetCurrencies() {
  if (taskCronGetCurrencies) {
    taskCronGetCurrencies.stop();
  }
}
