'use strict';

import { config } from 'dotenv';
import telegraf, { Markup } from 'telegraf';

import { stringReplace } from './text/textUtils';
import {
  showCurrencyValue,
  unknownCommand,
  whichCurrency as whichCurrencyText,
  backToCurrencies as backToCurrenciesText,
} from './text/texts.json';

import { ECurrencies, IValuesCurrency } from './cotization/CurrencyModel';
import { Dolar, Euro, DolarBrou, PesoArgentino } from './cotization/Implementation';
import { help as helpText, developer as developerText } from './text/texts.json';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { checkUserAndMessage } from './middleware/mongoMiddleware';

// START
import { $log } from '@tsed/logger';
$log.level = 'debug';
$log.name = '@CotizacionesUyBot';

// DB
import { connectToDB } from './db/configurationOfDB';

// Server
import { app } from './api/api';
import { startCronGetCurrencies } from './cron/cron';

// Initialize variables of enviroment
config();

// Contect to db
connectToDB(process.env.MONGO_URI || '');

// Start cron
startCronGetCurrencies();

// Start api
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  $log.info(`Server listening on port ${PORT}`);
});

// Get values of Currencies
const usd = new Dolar();
const usdBrou = new DolarBrou();
const euro = new Euro();
const arg = new PesoArgentino();

// Create the bot instance
const bot = new telegraf(process.env.BOT_KEY || '');

// Use the middleware created to save messages and users in DB
bot.use(checkUserAndMessage);

// Start to get the messages
bot.startPolling();

bot.command(['start', 'help', 'ayuda'], ({ replyWithMarkdown }) => {
  return replyWithMarkdown(
    helpText,
    Markup.keyboard([
      ['Dolar', 'Dolar Ebrou'],
      ['Euro', 'Peso argentino'],
    ]).extra(),
  );
});

// TODO: How can I use hears and command like equals - https://github.com/telegraf/telegraf/issues/928
bot.hears(backToCurrenciesText, ({ replyWithMarkdown }) => {
  return replyWithMarkdown(
    whichCurrencyText,
    Markup.keyboard([
      [ECurrencies.USD, ECurrencies.USDBrou],
      [ECurrencies.EUR, ECurrencies.ARG],
    ]).extra(),
  );
});

bot.command(['cotizaciones', 'plata', 'cot'], ({ replyWithMarkdown }) => {
  return replyWithMarkdown(
    whichCurrencyText,
    Markup.keyboard([
      [ECurrencies.USD, ECurrencies.USDBrou],
      [ECurrencies.EUR, ECurrencies.ARG],
    ]).extra(),
  );
});

bot.command(['configuracion', 'conf', 'settings'], ({ replyWithMarkdown }) => {
  return replyWithMarkdown(
    'Configuración',
    Markup.keyboard(
      ['🆗 Enviar análisis los viernes', '👨‍💻 Contactar con el desarrollador', '⭐️ Donar', backToCurrenciesText], // Row3 with 3 buttons
    ).extra(),
  );
});

bot.hears(['⭐️ Donar', 'Donar'], ({ replyWithMarkdown }) => {
  const replyOptions = Markup.inlineKeyboard([Markup.urlButton('❤', 'https://bmc.xyz/l/BotBrou')]).extra();

  replyWithMarkdown('Hacé click en el corazón para empezar el proceso', replyOptions);
});

// When user wants to know information about the developer
bot.hears(
  ['👨‍💻 Contactar con el desarrollador', 'desarrollador', 'dev', 'kpo', 'best', 'tu creador', 'creador', 'info'],
  async ({ replyWithMarkdown }) => {
    const extraReplyMessage: ExtraReplyMessage = {
      disable_web_page_preview: true,
    };

    replyWithMarkdown(developerText, extraReplyMessage);
  },
);

// When user wants to: know the price of any currency
bot.hears(Object.values(ECurrencies), async ({ message, replyWithMarkdown }) => {
  let values: IValuesCurrency = {
    buy: 0,
    sell: 0,
  };
  switch (message?.text) {
    case ECurrencies.USD: {
      values = await usd.getValue();
      break;
    }
    case ECurrencies.USDBrou: {
      values = await usdBrou.getValue();
      break;
    }
    case ECurrencies.EUR: {
      values = await euro.getValue();
      break;
    }
    case ECurrencies.ARG: {
      values = await arg.getValue();
    }
  }

  const valuesString = stringReplace(showCurrencyValue, [
    message?.text || '',
    values.buy.toString(),
    values.sell.toString(),
  ]);
  replyWithMarkdown(valuesString);
});

bot.on('message', async ({ replyWithMarkdown }) => {
  replyWithMarkdown(unknownCommand);
});
