// eslint-disable-next-line no-unused-vars
import { RGB } from 'pdf-lib'

export interface IOptionsDrawText {
  x: number,
  y: number,
  size: number,
 // font: any,
  color: RGB,
}

export interface IDrawText {
  page : number,
  text: string,
  options : IOptionsDrawText
}

export interface IDrawImg {
  page : number,
  sign : any
  x : number,
  y: number,
  width : any
  height : any
}

export interface IPdfProperty{
  title?: string;
  subject?: string;
  author?: string;
  keywords?: Array<string>;
  producer?: string;
  creator?: string
}
