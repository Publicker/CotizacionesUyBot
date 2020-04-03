import { DEFAULT_MESSAGE_ERROR } from '../constants';
import Cotization from '../../db/models/Cotization';
import { ECurrencies } from '../../cotization/CurrencyModel';
import { isNullOrUndefined } from 'util';
import {  } from 'express';

export default () => ({
  index: async (req : any, res : any) => {
    const date: Date = new Date(req.query.date);
    const wantHour = Boolean(req.query.wantHour);
    const wantWeek = Boolean(req.query.wantWeek);
    const wantMonth = Boolean(req.query.wantMonth);
    const cotization: String = req.query.cotization;
  
    if (Boolean(date.getTime())) {
      let minDate: Date = new Date(date);
      let maxDate: Date = new Date(date);
  
      if (wantHour) {
        minDate.setMinutes(0);
        minDate.setSeconds(0);
  
        maxDate.setMinutes(59);
        maxDate.setSeconds(59);
      } else if (wantWeek) {
        let day = minDate.getDay();
  
        minDate.setDate(minDate.getDate() - day + (day === 0 ? -6 : 1)); // Set when is Monday
  
        maxDate.setDate(minDate.getDate() + 6); // Set when is Sunday
  
        minDate.setSeconds(0);
        maxDate.setSeconds(59);
  
        minDate.setMinutes(0);
        maxDate.setMinutes(59);
  
        minDate.setHours(0);
        maxDate.setHours(23);
      } else if (wantMonth) {
        minDate.setSeconds(0);
        maxDate.setSeconds(59);
  
        minDate.setMinutes(0);
        maxDate.setMinutes(59);
  
        minDate.setHours(0);
        maxDate.setHours(23);
  
        minDate.setDate(1);
  
        // Get the last day of month
        let nextMonth = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1);
        nextMonth.setDate(nextMonth.getDate() - 1);
  
        // Set the last day
        maxDate.setDate(nextMonth.getDate());
      } else {
        minDate.setSeconds(0);
        maxDate.setSeconds(59);
  
        minDate.setMinutes(0);
        maxDate.setMinutes(59);
  
        minDate.setHours(0);
        maxDate.setHours(23);
      }
  
      let cotizationWanted;
      if (cotization) {
        Object.keys(ECurrencies).forEach(async (keyValue, index) => {
          if (keyValue == cotization.toUpperCase()) {
            cotizationWanted = Object.values(ECurrencies)[index];
          }
        });
      }
  
      let filters: any = {};
  
      filters.time = {
        $lte: maxDate,
        $gte: minDate,
      };
  
      if (!isNullOrUndefined(cotizationWanted)) {
        filters.currency = cotizationWanted;
      }
  
      const cotizations = await Cotization.find(filters).sort({
        time: -1,
      });
  
      res.status(200).json(cotizations);
    } else {
      // Invalid format of date time: MUST TO BE MM/DD/YYYY HH:MM:SS
      try {
        const cotizations = await Cotization.find();
        res.status(200).json(cotizations);
      } catch (e) {
        res.send(500).json(DEFAULT_MESSAGE_ERROR);
      }
    }
  }
});