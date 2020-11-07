import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-timezone';
import 'moment/locale/es';

@Pipe({
  name: 'toLocalScl'
})
export class ToLocalSclPipe implements PipeTransform {

  transform(value: any, utc, format): any {
    
    let dt = moment(value).utcOffset(utc ? utc : -180).format(format);
    return dt;
  }

}
