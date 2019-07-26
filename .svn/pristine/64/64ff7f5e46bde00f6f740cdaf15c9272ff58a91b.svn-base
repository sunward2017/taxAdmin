import moment from 'moment'

import store from '../store';

export function formatterSex(r,c){
   return r.gender ===0?"女":"男";
}

export function formatterSendDay(r,c){
    if(r.sendDay){
        return moment(r.sendDay).format("YYYY-MM-DD");
    }
}

export function formatterSaleTime(r,c){
    if(r.saleTime){
        return moment(r.saleTime).format("YYYY-MM-DD");
    }
}

export function formatterLoanDay(r,c){
    if(r.loanDay){
        return moment(r.loanDay).format("YYYY-MM-DD");
    }
}

export function formatterRebackDay(r,c){
    if(r.rebackDay){
        return moment(r.rebackDay).format("YYYY-MM-DD");
    }
}
export function formatterType(r,c){
	return r.type===1?"超级管理员":"普通管理员";
}

export function formatterCid(r,c){
    let custom= store.getters.clients[r.cId]?store.getters.clients[r.cId]:store.getters.clients[r.customerId];
    return custom;
}

export function formatterStatus(r,c){
    return r.status ===1?"有效":"无效";
}

export function formatterHotBigType(r,c){
    return r.pid ===1?"一般纳税人":((r.pid===2)?"小规模纳税人":'个体工商户'); 
}

export function formatterHotCtime(r,c){
    return moment(r.cTime).format('YYYY-MM-DD hh:mm:ss')
}

export function formatterHotTaxType(r,c){
    return store.getters.hotBigTypes[r.pid]
}
