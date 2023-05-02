import _mock from './_mock';
import { randomInArray } from './funcs';

// ----------------------------------------------------------------------

export const _carouselsExample = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.text.title(index),
  image: _mock.image.feed(index),
  description: _mock.text.description(index),
}));

export const _carouselsMembers = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  role: _mock.role(index),
  avatar: `https://minimal-assets-api.vercel.app/assets/images/members/member-${index + 1}.jpg`,
}));

// ----------------------------------------------------------------------

export const _faqs = [...Array(8)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Questions ${index + 1}`,
  detail: _mock.text.description(index),
}));

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export const _skills = [...Array(3)].map((_, index) => ({
  label: ['Development', 'Design', 'Marketing'][index],
}));

// ----------------------------------------------------------------------

export const _accordions = [...Array(4)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Accordion ${index + 1}`,
  subHeading: _mock.text.title(index),
  detail: _mock.text.description(index),
}));

// ----------------------------------------------------------------------

export const _dataGrid = [...Array(36)].map((_, index) => ({
  id: _mock.id(index),
  lastLogin: _mock.time(index),
  status: randomInArray(['online', 'away', 'busy']),
  isAdmin: _mock.boolean(index),
}));

// ----------------------------------------------------------------------

export const _megaMenuProducts = [...Array(10)].map((_, index) => ({
  name: _mock.text.title(index),
  image: _mock.image.feed(index),
  path: '#',
}));

// ----------------------------------------------------------------------

export const _mapContact = [
  {
    latlng: [33, 65],
    phoneNumber: _mock.phoneNumber(1),
  },
  {
    latlng: [-12.5, 18.5],
    phoneNumber: _mock.phoneNumber(2),
  },
];
