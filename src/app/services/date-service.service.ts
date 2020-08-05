import { GlobalDataSummary, DateWiseData } from './../models/globalData';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DateServiceService {
  // tslint:disable-next-line: max-line-length
  private globalUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-20-2020.csv';
  private dataWiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  data: GlobalDataSummary[] = [];
  raw: any = [];
  mainData: any = [];
  constructor(private http: HttpClient) { }

  getGlobalData() {
    return  this.http.get(this.globalUrl, {responseType : 'text'}).pipe(
      map(result => {
        const rows = result.split('\n');
        const dc = rows.splice(0, 1);
        rows.forEach(row => {
          const cols = row.split(/,(?=\S)/);
          const cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            active: +cols[10],
            recovered: +cols[9],
          };
          const temp: GlobalDataSummary = this.raw[cs.country];
          if (temp) {
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;
            this.raw[cs.country] = temp;
          } else {
            this.raw[cs.country] = cs;
          }
        });
        return Object.values(this.raw) as GlobalDataSummary[];
      })
    );
  }

  getDateWiseData() {
    return this.http.get(this.dataWiseDataUrl, { responseType: 'text' })
    .pipe(map (result => {
      let cols;
      let con;
      const row = result.split('\n');
      const header = row[0];
      const dates =  header.split(/,(?=\S)/);
      dates.splice(0, 4);
      row.splice(0, 1);
      row.forEach( val => {
         cols = val.split(/,(?=\S)/);
         con = cols[1];
         this.mainData[con] = [];
         cols.splice(0, 4);

         cols.forEach((value, index) => {
             const dw: DateWiseData = {
               cases: +value,
               country: con,
               date: new Date(Date.parse(dates[index]))
             };
             this.mainData[con].push(dw);
         });
      });
      return this.mainData;
    }));
  }

}
