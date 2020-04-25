import moment from 'moment';


export default (date: string | Date | moment.Moment) => moment.duration(
  moment(date).diff(moment.now())
).humanize(true);
