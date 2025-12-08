const { SUPPORTED_TICKERS, INITIAL_PRICES } = require("./tickers");

class UserStore {
  constructor() {
    this.users = new Map();
    this.currentPrices = { ...INITIAL_PRICES };
  }

  addUser(user) {
    this.users.set(user.userId, {
      ...user,
      subscriptions: user.subscriptions || new Set(),
    });
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  removeUser(userId) {
    this.users.delete(userId);
  }

  subscribe(userId, ticker) {
    const user = this.getUser(userId);
    if (user && SUPPORTED_TICKERS.includes(ticker)) {
      user.subscriptions.add(ticker);
    }
  }

  unsubscribe(userId, ticker) {
    const user = this.getUser(userId);
    if (user) {
      user.subscriptions.delete(ticker);
    }
  }

  setSubscriptions(userId, subscriptions) {
    const user = this.getUser(userId);
    if (user) {
      user.subscriptions = subscriptions;
    }
  }

  getAllSubscriptions() {
    const allSubs = new Set();
    for (const user of this.users.values()) {
      for (const ticker of user.subscriptions) {
        allSubs.add(ticker);
      }
    }
    return allSubs;
  }

  getUsersSubscribedTo(ticker) {
    const subscribedUsers = [];
    for (const user of this.users.values()) {
      if (user.subscriptions.has(ticker)) {
        subscribedUsers.push(user);
      }
    }
    return subscribedUsers;
  }

  updatePrice(ticker, price) {
    this.currentPrices[ticker] = price;
  }

  getCurrentPrices() {
    return { ...this.currentPrices };
  }
}

function initializeUserStore() {
  return new UserStore();
}

module.exports = { initializeUserStore, UserStore };
