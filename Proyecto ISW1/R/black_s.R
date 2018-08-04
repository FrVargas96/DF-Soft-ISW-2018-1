library("zoo")
library("xts")
library("quantmod")
library("qrmtools")
library("rjson")

Black_S <- function(AbrevEmpresa,strike,TTM,rf){
  Data<-getSymbols(AbrevEmpresa,
                   src='yahoo',
                   return.class = 'xts',
                   index.class  = 'Date',
                   from = "2013-01-01",
                   to = Sys.Date(),
                   periodicity = "daily",
                   curl.options = list(),
                   auto.assign=FALSE)
  stock=as.integer(Data[,6][length(Data[,6])])
  sigma=(sd(Data[,4]))/stock
  d1<-(log(stock/strike)+(rf+0.5*sigma^2)*TTM)/(sigma*sqrt(TTM))
  d2<-d1-(sigma*sqrt(TTM))
  BS.call<-stock*pnorm(d1,mean=0,sd=1)-strike*exp(-rf*TTM)*pnorm(d2,mean=0,sd=1)
  BS.put<-BS.call-stock+strike*exp(-rf*TTM)
  return(c(BS.call,BS.put,c(Data[,6])))
}

args <- commandArgs(trailingOnly = TRUE)

json <- fromJSON(args)

ret <- Black_S(json$abre,as.numeric(json$strike), as.numeric(json$TTM), as.numeric(json$rf))

output = list(result = ret)

print(toJSON(output))