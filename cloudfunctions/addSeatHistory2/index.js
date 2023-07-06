// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (e, context) => {
  try {
    return await db.collection('history_for_2022_2').add({
      data: {
        table_id: e.table_id, symbol: e.symbol,
        fee:e.fee, payment: e.payment, 
        original_date: e.original_date,
        arrive_date: e.arrive_date,
        duration_time: e.duration_time, 
        kaoyan:e.kaoyan,
        terminal_date: e.terminal_date,
        fee_history: e.fee_history,
        payment_history: e.payment_history,
        duration_history: e.duration_history,
        delet_date: e.delet_date}
    })
  } catch(e) {
    console.error(e)
  }
}

