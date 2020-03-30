import { Document, model, Schema } from 'mongoose';

import { ECurrencies } from '../../cotization/CurrencyModel';

// Schema
const CotizationSchema = new Schema({
  baseCurrency: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  buy: {
    type: Number,
    required: true,
  },
  sell: {
    type: Number,
    required: true,
  },
});

export interface ICotization extends Document {
  baseCurrency: ECurrencies;
  time: Date;
  currency: ECurrencies;
  buy: number;
  sell: number;
}

// Default export
export default model<ICotization>('Cotization', CotizationSchema);
