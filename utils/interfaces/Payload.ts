export interface Payload {
  readonly userID: string,
  readonly email: string,
  readonly tokenVersion: number,
  readonly iat: Date,
  readonly exp: Date,
}