import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TimePeriod, TrendFilter, TrendFilterGroup } from 'src/app/data-access/data-access.model';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-trend-period-filter',
  templateUrl: './trend-period-filter.component.html',
  styleUrls: ['./trend-period-filter.component.css']
})
export class TrendPeriodFilterComponent implements OnInit {

  timePeriods: SelectItem[];
  groupingTypes: SelectItem[];

  private _timePeriod = TimePeriod.YEAR;
  private _groupingType = TrendFilterGroup.Bucket;

  private _startDate: Date = new Date(new Date().getFullYear() - 1, 0, 1);

  @Output() filterChanged = new EventEmitter<TrendFilter>();

  constructor() { }

  ngOnInit() {

    this.timePeriods = [];
    Object.keys(TimePeriod)
      .filter(k => typeof TimePeriod[k as any] === 'number')
      .forEach(v => {
        this.timePeriods.push(
          { label: v, value: TimePeriod[v] }
        );
    });

    this.groupingTypes = [];
    Object.keys(TrendFilterGroup)
      .filter(k => typeof TrendFilterGroup[k as any] === 'number')
      .forEach(v => {
        this.groupingTypes.push(
          { label: v, value: TrendFilterGroup[v] }
        );
    });

    this.setFilter();
  }

  get timePeriod() {
    return this._timePeriod;
  }

  set timePeriod(timePeriod: TimePeriod) {
    this._timePeriod = timePeriod;

    console.log('Setting to ');
    console.log(timePeriod);

    this.setFilter();
  }

  get groupingType() {
    return this._groupingType;
  }

  set groupingType(groupingType: TrendFilterGroup) {
    this._groupingType = groupingType;

    console.log('Setting groupingType to ');
    console.log(groupingType);

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
    trendFilter.timePeriod = this._timePeriod;
    trendFilter.grouping = this._groupingType;

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
