import { Component, OnInit } from '@angular/core';
import { Input} from '@angular/core';
@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent implements OnInit {
  @Input() totalConfirmed = 0;
  @Input() totalRecovered = 0;
  @Input() totalActive = 0;
  @Input() totalDeath = 0;


  constructor() { }

  ngOnInit() {
  }

}
