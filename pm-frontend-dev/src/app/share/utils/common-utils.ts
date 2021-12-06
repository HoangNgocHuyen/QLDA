import * as moment from 'moment'

export class CommonUtils {
    static asDate(str: string): Date {
        let m = moment(str, 'YYYY-MM-DDTHH:mm:ssZ');
        return m.toDate();
    }

}
