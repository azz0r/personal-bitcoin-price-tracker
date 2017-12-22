import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import "./index.scss";

// global and convenience
const NOOP = () => {};

const apiUrl = "https://blockchain.info/ticker";

const defaultCurrencies = ["USD", "GBP", "EUR"];

const apiProcessor = data => {
  console.log(data);
  return data;
};

const defaultCurrency = "GBP";

// components
const Loading = () => <h2>Loading please wait</h2>;

const Price = ({ last, symbol, buy, sell }) => (
  <div>
    {symbol}: {last.toLocaleString()}
  </div>
);

const Currencies = ({
  name = "currencies",
  currencies,
  selectedValue = null,
  onChange = NOOP,
}) => (
  <select name={name} value={selectedValue} onChange={onChange}>
    {currencies.map(currency => (
      <option key={currency} value={currency}>
        {currency}
      </option>
    ))}
  </select>
);

const Input = ({
  value = "",
  placeholder = "enter amount",
  onChange = NOOP,
}) => (
  <input
    tabIndex="0"
    defaultValue={value}
    id={name}
    name={name}
    onChange={onChange}
    onKeyDown={onChange}
    onKeyPress={onChange}
    placeholder={placeholder}
    type="text"
  />
);

const Footer = () => <footer>Wuggawoo 2018</footer>;

// main app class
class App extends PureComponent {
  state = {
    amount: 1,
    prices: [],
    result: false,
    currencies: defaultCurrencies,
    currency: defaultCurrency,
  };

  componentDidMount() {
    fetch(apiUrl)
      .then(response => response.json())
      .then(responseData => {
        const prices = apiProcessor(responseData);
        const currencies = Object.keys(prices);

        this.setState({ result: true, prices, currencies });
      })
      .catch(error => {
        console.log("Error fetching data", error);
      });
  }

  onChangeCurrency = event => {
    const currency = event.currentTarget.value;

    this.setState({
      currency,
    });
  };

  onSetAmount = event => {
    const amount = event.currentTarget.selected;

    this.setState({
      amount,
    });
  };

  render() {
    const { amount, prices, result, currency, currencies } = this.state;
    return (
      <section className="app">
        <h1>Personal Bitcoin Price Tracker</h1>
        {result ? (
          <article>
            {Object.keys(prices).map(price => (
              <Price key={prices[price].symbol} {...prices[price]} />
            ))}
          </article>
        ) : (
          <Loading />
        )}
        <Currencies
          currencies={currencies}
          selectedValue={currency}
          onChange={this.onChangeCurrency}
        />
        <Input name="amount" value={amount} onChange={this.onSetAmount} />
        <Footer />
      </section>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
