import App from './App';
import {render} from '@testing-library/react'

describe(function() {
  it('renders without crashing', () => {
    render(<App />)
  });

})
