import { GlobalDataSummary, DateWiseData } from './../models/globalData';
import { Component, OnInit } from '@angular/core';
import { DateServiceService } from '../services/date-service.service';
import { GoogleChartInterface } from 'ng2-google-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string [] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeath = 0;
  totalRecovered = 0;
  dateWiseData: any;
  selectedDateWiseData: DateWiseData[];
  dataTable: any = [];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  };
  constructor(private service: DateServiceService) { }

  ngOnInit() {

    merge(
      this.service.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map(result => {
          this.data = result;
          this.data.forEach(cs => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe (
      {
        complete: () => {
          this.selectedDateWiseData = this.dateWiseData('India');
          this.updateCart();
        }
      }
    );
  }

  updateCart() {
    this.dataTable = [];
    this.dataTable.push(['Cases' , 'Date']);
    this.selectedDateWiseData.forEach(cs => {
      this.dataTable.push([cs.cases, cs.date]);
    });

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: this.dataTable,
      options: {
        height: 500
      },
    };
  }

  public dropdownOptionChange(event): void {
    const country = event.target.value;
    this.data.forEach(cs => {
      if ( cs.country === country) {
        this.totalConfirmed = cs.confirmed;
        this.totalActive = cs.active;
        this.totalDeath = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    });
    this.selectedDateWiseData = this.dateWiseData[country];
    console.log(this.selectedDateWiseData);
    this.updateCart();
  }

}
