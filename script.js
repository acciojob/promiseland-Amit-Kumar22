class CustomPromise {
  constructor() {
    this.status = 'pending';
    this.value = null;
    this.reason = null;
    this.fulfillmentHandlers = [];
    this.rejectionHandlers = [];
    this.finallyHandlers = [];
    
    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.fulfillmentHandlers.forEach(handler => handler(value));
        this.finallyHandlers.forEach(handler => handler());
      }
    };
    
    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.rejectionHandlers.forEach(handler => handler(reason));
        this.finallyHandlers.forEach(handler => handler());
      }
    };

    this.resolve = resolve;
    this.reject = reject;
  }

  then(onFulfilled, onRejected) {
    if (this.status === 'fulfilled') {
      onFulfilled(this.value);
    } else if (this.status === 'rejected') {
      onRejected(this.reason);
    } else {
      this.fulfillmentHandlers.push(onFulfilled);
      this.rejectionHandlers.push(onRejected);
    }
    return this;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    if (this.status !== 'pending') {
      onFinally();
    } else {
      this.finallyHandlers.push(onFinally);
    }
    return this;
  }
}

// Example usage:
const customPromise = new CustomPromise();

customPromise
  .then(value => {
    console.log('Resolved with:', value);
  })
  .catch(reason => {
    console.log('Rejected with:', reason);
  })
  .finally(() => {
    console.log('Finally block executed.');
  });

// Simulating an asynchronous operation that resolves the promise
setTimeout(() => {
  customPromise.resolve('Success!');
}, 1000);

