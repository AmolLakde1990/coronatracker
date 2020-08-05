import { GlobalDataSummary } from './../models/globalData';
import { Component, OnInit } from '@angular/core';
import { DateServiceService } from '../services/date-service.service';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeath = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  dataTable: any = [];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  };

  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  };
  constructor(private dataService: DateServiceService) { }

  ngOnInit() {
    this.dataService.getGlobalData().subscribe(
      {
        next: (result) => {
          this.globalData = result;
          result.forEach(cs => {
           if (!Number.isNaN(cs.confirmed)) {
            this.totalActive += cs.active;
            this.totalDeath += cs.deaths;
            this.totalConfirmed += cs.confirmed;
            this.totalRecovered += cs.recovered;
           }
          });
          this.initChart('r');
        }
      }
    );
  }

  initChart(casetype: string) {
    this.dataTable.push(['Country', 'Cases']);
    this.globalData.forEach(cs => {
      let value: number;


      if (casetype === 'c') {
        if (cs.confirmed > 2000) {
          value = cs.confirmed;
        }
      }

      if (casetype === 'a') {
        if (cs.active > 2000) {
          value = cs.active;
        }
      }

      if (casetype === 'd') {
        if (cs.deaths > 1000) {
          value =  cs.deaths;
        }
      }

      if (casetype === 'r') {
        if (cs.recovered > 2000) {
          value = cs.recovered;
        }
      }

      this.dataTable.push([
        cs.country, value
      ]);
    });

    this.pieChart = {
    chartType: 'PieChart',
    dataTable: this.dataTable,
    options: {
      height: 500
    },
  };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: this.dataTable,
      options: {
        height: 500
      },
    };

  }
  updateChart(input: HTMLInputElement) {
    this.initChart(input.value);
  }
}
