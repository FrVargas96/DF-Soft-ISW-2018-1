library("datasets")
library("m4fe")
library("zoo")
library("xts")
library("quantmod")
library("qrmtools")
library("rjson")

Black_S <- function(path,strike,TTM,rf){
  Data<-read.csv(file = path, header = TRUE, sep = ',', stringsAsFactors = FALSE)
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

ret <- Black_S(json$path, as.numeric(json$strike), as.numeric(json$TTM), as.numeric(json$rf))

output = list(result = ret)

print(toJSON(output))