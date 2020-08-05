export interface IMail{
  from : string, // sender address
  to : string, // list of receivers
  subject : string, // Subject line
  html : string // html body
}

export interface IResponseTransporter{
  error : boolean, // sender address
  message : string
}
