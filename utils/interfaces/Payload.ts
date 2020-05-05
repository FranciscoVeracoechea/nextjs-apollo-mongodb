export interface Payload {
  readonly userID: string,
  readonly email: string,
  readonly tokenVersion: number,
  readonly iat: number,
  readonly exp: number,
}