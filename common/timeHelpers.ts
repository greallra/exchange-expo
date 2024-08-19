// import { format, isSameDay, addDays, formatISO, formatDistance, getDate, getUnixTime } from 'date-fns'

// export let nextTenDays = [];
// let today = Date.now();

// function addDaysCustom(days){
//     var date = new Date();
//     return date.setDate(date.getDate() + days);
//   }

// for(let x = 0; x <=10; x++){
// 	let item = {};
//   // const fmt =
// 	if(x === 0){
//   	item.name = 'Today'
//     item.date = today
//     item.hideDate = true
//     item.datePretty = format(today, 'MM/dd/yyyy')
//   } else if(x === 1) {
//   	item.name = 'Tomorrow'
//     item.date = addDaysCustom(x)
//     item.datePretty = format(addDaysCustom(x), 'MM/dd/yyyy')
//   } else {
//   	item.name = `In ${formatDistance(today, addDaysCustom(x))}`
//     item.date = addDaysCustom(x)
//     item.datePretty = format(addDaysCustom(x), 'MM/dd/yyyy')
//   }
//   nextTenDays.push(item)
// }

// export function timeFilterExchanges(exchanges, day){
// 	return exchanges.filter((exch) => {
//         // console.log(day.date, exch.time.seconds * 1000);
//         try {
     
//         } catch (error) {
          
//         }
//         return isSameDay(day.date, exch.time.seconds * 1000)
//     })
// }