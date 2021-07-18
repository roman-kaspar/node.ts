/* eslint-disable max-classes-per-file */

export function formatError<T extends Error>(err: T): string {
  let message = 'SERVER ERROR';
  if (err.name) {
    message += ` [${err.name}]`;
  }
  message += `:
    * message: ${err.message || '<not provided>'}
    * stack: `;
  if (err.stack) {
    err.stack.split('\n').forEach((frame, idx) => {
      if (idx) { message += `\n        + ${frame.trim()}`; }
    });
  } else {
    message += '<not provided>';
  }
  return message;
}

export class CustomError extends Error {
  public name: string;
  public status: number;
  protected static label = 'Custom';

  constructor(param: string, code?: number) {
    super(param);
    this.name = CustomError.label;
    this.status = code ?? 500;
    Error.captureStackTrace(this);
  }
}

export class HttpError extends CustomError {
  protected static label = 'HTTP';

  constructor(param: string, code?: number) {
    super(param, code);
    this.name = HttpError.label;
  }
}
