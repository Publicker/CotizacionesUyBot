import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import cheerio from 'cheerio';

export enum ECurrencies {
  USD = 'Dolar',
  USDBROU = 'Dolar Ebrou',
  EUR = 'Euro',
  ARG = 'Peso argentino',
  UYU = 'Peso uruguayo',
}

function getValueFromSelector(response: AxiosResponse, selector: ISelector): IValuesCurrency {
  const $ = cheerio.load(response.data);
  const values = {
    buy: parseFloat($(selector.buy).text().trim().replace(',', '.')),
    sell: parseFloat($(selector.sell).text().trim().replace(',', '.')),
  } as IValuesCurrency;

  return values;
}

const ApiConfigDefault: AxiosRequestConfig = {
  url:
    'https://www.brou.com.uy/c/portal/render_portlet?p_l_id=20593&p_p_id=cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS&p_p_lifecycle=0&p_t_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_pos=0&p_p_col_count=2&p_p_isolated=1&currentURL=%2Fcotizaciones',
  method: 'GET',
};

export interface ISelector {
  buy: string;
  sell: string;
}

export interface IValuesCurrency {
  buy: number;
  sell: number;
}

export interface ICurrency {
  values?: IValuesCurrency;
  selector: ISelector;
  currency: ECurrencies;
  getValue(): void;
  apiConfig: AxiosRequestConfig;
}

export class Currency implements ICurrency {
  public values!: IValuesCurrency;
  public selector: ISelector;
  public currency: ECurrencies;
  public apiConfig: AxiosRequestConfig;

  constructor(currency: ECurrencies, selector: ISelector) {
    this.currency = currency;
    this.selector = selector;
    this.apiConfig = ApiConfigDefault;
  }

  public async getValue(): Promise<IValuesCurrency> {
    const axiosResponse = await axios.request(this.apiConfig);

    this.values = getValueFromSelector(axiosResponse, this.selector);

    return this.values;
  }
}
