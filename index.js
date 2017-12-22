import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import "./index.scss";

const NOOP = () => {};

const REFRESH_PERIOD = 3000;

const apiUrl = "https://blockchain.info/ticker";

const defaultCurrencies = ["USD", "GBP", "EUR"];

const apiProcessor = data => data;

const defaultCurrency = "GBP";

// components
const Price = ({ last, symbol, buy, sell, amount = 1 }) => (
  <div>
    <p>
      <label>Buy price</label> {symbol}
      {(sell * amount).toLocaleString()}
    </p>{" "}
    <p>
      <label>Sell price</label> {symbol}
      {(sell * amount).toLocaleString()}
    </p>
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

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = Object.assign(
      {},
      {
        amount: 1,
        prices: [],
        result: false,
        currencies: defaultCurrencies,
        currency: defaultCurrency,
      },
      localStorage,
    );
  }

  fetch = () => {
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
  };

  componentDidMount() {
    this._interval = setInterval(this.fetch, REFRESH_PERIOD);
  }

  componentWillUnMount() {
    clearInterval(this._interval);
  }

  onChangeCurrency = event => {
    const currency = event.currentTarget.value;
    localStorage.setItem("currency", currency);

    this.setState({
      currency,
    });
  };

  onSetAmount = event => {
    const amount = event.currentTarget.value;
    localStorage.setItem("amount", amount);

    this.setState({
      amount,
    });
  };

  render() {
    const { amount, prices, result, currency, currencies } = this.state;
    return (
      <section className="app">
        <h1>Personal Bitcoin Price Tracker</h1>
        <article>
          {result ? (
            [
              <h3>{amount} BTC</h3>,
              <Price
                key={prices[currency].symbol}
                {...prices[currency]}
                amount={amount}
              />,
            ]
          ) : (
            <h2>Loading please wait</h2>
          )}
          <Currencies
            currencies={currencies}
            selectedValue={currency}
            onChange={this.onChangeCurrency}
          />
          <Input name="amount" value={amount} onChange={this.onSetAmount} />
        </article>
      </section>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
