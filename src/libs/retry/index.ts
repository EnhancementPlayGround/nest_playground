import { internalServerError } from '../exceptions';

type RetryOptions = {
  maxAttemptNumber: number;
  onError: (err: any) => Promise<any>;
};

export async function retry<T>({ request, options }: { request: () => Promise<T>; options: RetryOptions }) {
  const backOff = new BackOff(request, options);
  return backOff.run();
}

class BackOff<T> {
  private attempt = 0;

  constructor(private request: () => Promise<T>, private options: RetryOptions) {}

  async run() {
    /* eslint-disable no-await-in-loop */
    while (this.attempt <= this.options.maxAttemptNumber) {
      try {
        await this.getJitterDelay(this.attempt);
        return await this.request();
      } catch (err) {
        this.attempt += 1;
        if (this.attempt >= this.options.maxAttemptNumber) {
          await this.options.onError(err);
          throw err;
        }
      }
    }
    /* eslint-enable no-await-in-loop */

    throw internalServerError('Something went wrong. please try again later.');
  }

  private getJitterDelay(attempt: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, Math.random() * 1000 * 2 * attempt);
    });
  }
}
