import App from './App';
import {render} from '@testing-library/react'

test('odd numbers', () => {
  expect(App.prototype.getMedianValue([1,2,3])).toEqual(2)
});

test('even numbers', () => {
  expect(App.prototype.getMedianValue([1,2,3,4])).toEqual(2.5)
});
test('empty array', () => {
  expect(App.prototype.getMedianValue([])).toEqual(0)
});
