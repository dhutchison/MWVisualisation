import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TimePeriod, TrendFilter, TrendFilterGroup } from 'src/app/data-access/data-access.model';

@Component({
  selector: 'app-trend-period-filter',
  templateUrl: './trend-period-filter.component.html',
  styleUrls: ['./trend-period-filter.component.css']
})
export class TrendPeriodFilterComponent implements OnInit {

  private _timePeriod = 'YEAR';
  private _groupingType = 'Bucket';
  private _startDate: Date = new Date(new Date().getFullYear() - 1, 0, 1);

  @Output() filterChanged = new EventEmitter<TrendFilter>();

  constructor() { }

  ngOnInit() {
    this.setFilter();
  }

  getTimePeriods(): string[] {
    return Object.keys(TimePeriod).filter(k => typeof TimePeriod[k as any] === 'number');
  }

  getGroupingTypes(): string[] {
    return Object.keys(TrendFilterGroup).filter(k => typeof TrendFilterGroup[k as any] === 'number');
  }

  get timePeriod() {
    return this._timePeriod;
  }

  set timePeriod(timePeriod: string) {
    this._timePeriod = timePeriod;

    console.log('Setting to ');
    console.log(timePeriod);
    console.log(TimePeriod[timePeriod]);

    this.setFilter();
  }

  get groupingType() {
    return this._groupingType;
  }

  set groupingType(groupingType: string) {
    this._groupingType = groupingType;

    console.log('Setting groupingType to ');
    console.log(groupingType);
    console.log(TrendFilterGroup[groupingType]);

    this.setFilter();
  }

  get startDate() {
    return this._startDate;
  }

  set startDate(startDate: any) {
    console.log(startDate);
    this._startDate = startDate;

    this.setFilter();
  }

  private setFilter() {
    const trendFilter = new TrendFilter();
    trendFilter.startDate = this.getDateString(this._startDate);
    trendFilter.timePeriod = TimePeriod[this._timePeriod];
    trendFilter.grouping = TrendFilterGroup[this._groupingType];

    this.filterChanged.emit(trendFilter);
  }

  private getDateString(input: Date): string {
    /* Need to handle timezones too.
    * Based on answer and comments to
    * https://stackoverflow.com/a/16714931/230449 */
    const workingDate = new Date(input);
    workingDate.setMinutes(workingDate.getMinutes() - workingDate.getTimezoneOffset());
    return workingDate.toISOString().slice(0, 10).replace(/-/g, '');
  }

}
