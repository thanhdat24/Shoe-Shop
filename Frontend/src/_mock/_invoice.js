import { add } from 'date-fns';
import _mock from './_mock';
import { randomInArray, randomNumberRange } from './funcs';

// ----------------------------------------------------------------------

export const _invoices = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  invoiceNumber: `INV-${17048 + index}`,
  taxes: 5,
  discount: 10,
  sent: randomNumberRange(1, 10),
  createDate: add(new Date(), { days: index, hours: index }),
  dueDate: add(new Date(), { days: index + 15, hours: index }),
  status: randomInArray(['paid', 'unpaid', 'overdue', 'draft']),
  invoiceFrom: {
    id: _mock.id(index),
    company: _mock.company(index),
  },
  invoiceTo: {
    id: _mock.id(index + 1),
    company: _mock.company(index + 1),
  },
  items: [...Array(3)].map((_, index) => ({
    id: _mock.id(index),
    title: _mock.text.title(index),
    description: _mock.text.description(index),
    quantity: 5,
    service: randomInArray([
      'full stack development',
      'backend development',
      'ui design',
      'ui/ux design',
      'front end development',
    ]),
  })),
}));

export const _invoiceAddressFrom = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  company: _mock.company(index),
}));

export const _invoiceAddressTo = [...Array(16)].map((_, index) => ({
  id: _mock.id(index + 1),
  company: _mock.company(index + 1),
}));
