import App from './App';

test('get median value', () => {
    expect(App.prototype.getMedianValue([1, 2, 3])).toEqual(2)
});
