export interface ITokenFull extends IToken{
  sub : String;
  aud : String;
  id: number;
  role: string;
  usn: string;
}

export interface IToken {
  id: number;
  role: string;
  usn: string;
}
