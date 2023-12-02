import { format, getTime, formatDistanceToNow } from 'date-fns';
import moment from 'moment';

moment.locale('vi');
// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fTimestamp(date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export function formatDate(d) {
  if (d === null) {
    return '--'; // Nếu giá trị d là null, trả về '--'
  }

  const date = new Date(d);
  if (isValidDate(date)) {
    const now = moment(new Date());
    const dateToFormat = moment(date);
    const diff = now.diff(dateToFormat, 'days');
    if (diff < 1) {
      return dateToFormat.fromNow();
    }
    if (diff < 7) {
      return dateToFormat.format('dddd, h:mm A');
    }
    return dateToFormat.format('MMM D, YYYY, h:mm A');
  }
  return '--';
}

export function formatDateReceipt(d) {
  if (d === null) {
    return '--'; // Nếu giá trị d là null, trả về '--'
  }

  const date = new Date(d);
  if (isValidDate(date)) {
    const dateToFormat = moment(date);
    return dateToFormat.format('DD/MM/YYYY');
  }
  return '--';
}

function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

export function isCurrentDateGreaterThanSevenDays(date) {
  if (date === undefined) return true;
  const currentDate = new Date();
  const comparedDate = new Date(date);

  const diffInMilliseconds = currentDate.getTime() - comparedDate.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  return diffInDays > 7;
}
