import { Currency, ECurrencies } from './CurrencyModel';

export class Dolar extends Currency {
  private static _instance: Dolar = new Dolar();

  constructor() {
    if (Dolar._instance) {
      return Dolar._instance;
    }

    super(ECurrencies.USD, {
      buy:
        '#p_p_id_cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS_ > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > div > p',
      sell:
        '#p_p_id_cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS_ > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(5) > div > p',
    });

    Dolar._instance = this;
  }

  public static getInstance(): Currency {
    return Dolar._instance;
  }
}

export class DolarBrou extends Currency {
  constructor() {
    super(ECurrencies.USDBROU, {
      buy:
        '#p_p_id_cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS_ > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(3) > div > p',
      sell:
        '#p_p_id_cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS_ > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(5) > div > p',
    });
  }
}

export class Euro extends Currency {
  constructor() {
    super(ECurrencies.EUR, {
      buy:
        '#p_p_id_cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS_ > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(3) > div > p',
      sell:
        '#p_p_id_cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS_ > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(5) > div > p',
    });
  }
}

export class PesoArgentino extends Currency {
  constructor() {
    super(ECurrencies.ARG, {
      buy:
        '#p_p_id_cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS_ > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(3) > div > p',
      sell:
        '#p_p_id_cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS_ > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(5) > div > p',
    });
  }
}
