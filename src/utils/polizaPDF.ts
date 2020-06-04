// eslint-disable-next-line no-unused-vars
import { IDrawText, IDrawImg, IPdfProperty } from '../interface/IPdf'
// eslint-disable-next-line no-unused-vars
import { IPoliza, IPolizaRequest } from '../interface/IPdfPoliza'
import { rgb } from 'pdf-lib'

export const setTextPoliza = async (variables : any) : Promise<Array<any>> => {
  const objPoliza : IPoliza = validPoliza({
    date: variables.date,
    firstName: variables.firstName,
    lastName: variables.lastName,
    phone: variables.phone
  })

  const arrDrawText : Array<IDrawText> = await structPoliza(objPoliza)

  const objProperty : IPdfProperty = {
    title: 'Poliza',
    subject: 'Formulario 23123',
    author: 'Ramon Chozas',
    keywords: ['Formulario', 'info', 'hola'],
    producer: 'No se',
    creator: 'https://www.documentosdinamicos.com.ar'
  }

  return [
    objPoliza, arrDrawText, objProperty
  ]
}

const structPoliza = (objPoliza : IPoliza) : Array<IDrawText> => {
  return [{
    page: 0,
    text: objPoliza.day,
    options: {
      x: 325,
      y: 654,
      size: 12,
      // font: 12,
      color: rgb(0, 0, 0)
    }
  },
  {
    page: 0,
    text: objPoliza.month,
    options: {
      x: 410,
      y: 654,
      size: 12,
      // font: 12,
      color: rgb(0, 0, 0)
    }
  }, {
    page: 0,
    text: objPoliza.year,
    options: {
      x: 505,
      y: 654,
      size: 12,
      // font: 12,
      color: rgb(0, 0, 0)
    }
  },
  {
    page: 0,
    text: `${objPoliza.firstName} ${objPoliza.lastName}`,
    options: {
      x: 125,
      y: 483,
      size: 12,
      // font: 12,
      color: rgb(0, 0, 0)
    }
  },
  {
    page: 7,
    text: `${objPoliza.firstName} ${objPoliza.lastName}`,
    options: {
      x: 340,
      y: 275,
      size: 12,
      // font: 12,
      color: rgb(0, 0, 0)
    }
  },
  {
    page: 0,
    text: objPoliza.phone,
    options: {
      x: 340,
      y: 308,
      size: 12,
      // font: 12,
      color: rgb(0, 0, 0)
    }
  }
  ]
}

const validPoliza = (objPoliza : IPolizaRequest) : IPoliza => {
  if (!objPoliza.date) {
    throw new Error('without date')
  }
  if (!objPoliza.firstName) {
    throw new Error('without firstName')
  }
  if (!objPoliza.lastName) {
    throw new Error('without lastName')
  }
  if (!objPoliza.phone) {
    throw new Error('without phone')
  }

  const arrDate = objPoliza.date.split('-')
  if (arrDate.length !== 3 || arrDate[0].length !== 4 || arrDate[1].length !== 2 || arrDate[2].length !== 2) {
    throw new Error('error in date')
  }

  return {
    year: arrDate[0],
    month: arrDate[1],
    day: arrDate[2],
    firstName: objPoliza.firstName,
    lastName: objPoliza.lastName,
    phone: objPoliza.phone
  }
}

export const setSignPoliza = (sign : any) : Array<IDrawImg> => {
  return [{
    page: 7,
    sign: sign,
    x: 115,
    y: 275,
    width: 175,
    height: 30
  }]
}
