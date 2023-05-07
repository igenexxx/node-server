export class HttpError extends Error {
  constructor(public status: number, public message: string, public context?: string) {
    super(message);
    this.status = status;
  }
}
