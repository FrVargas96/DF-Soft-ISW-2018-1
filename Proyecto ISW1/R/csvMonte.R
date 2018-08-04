library("zoo")
library("xts")
library('quantmod')
library('qrmtools')
library('rjson')

monteCarlo <- function(AbrevEmpresa,strike,TTM,rf){
  Data<-read.csv(file = path, header = TRUE, sep = ',', stringsAsFactors = FALSE)
  stock=as.integer(Data[,6][length(Data[,6])])
  sigma=(sd(Data[,4]))/stock
  num.sim<-100000
  R<-(rf-0.5*sigma^2)*TTM
  SD<-sigma*sqrt(TTM)
  TTM.price<-stock*exp(R+SD*rnorm(num.sim,0,1))
  TTM.call<-pmax(0,TTM.price-strike)
  PV.call<-TTM.call*(exp(-rf*TTM))
  MC.call<-mean(PV.call)
  TTM.put<-pmax(0,strike-TTM.price)
  PV.put<-TTM.put*(exp(-rf*TTM))
  MC.put<-mean(PV.put)
  return(c(MC.call,MC.put,c(Data[,6])))
}

args <- commandArgs(trailingOnly = TRUE)

json <- fromJSON(args)

ret <- monteCarlo(json$abre,as.numeric(json$strike), as.numeric(json$TTM), as.numeric(json$rf))

output = list(result = ret)

print(toJSON(output))
