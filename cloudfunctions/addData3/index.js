// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数 
exports.main = async (e, context) => {
  try {
    return await db.collection('wenyan_seat_record_3').add({
      data: {table_id: e.table_id, arrive_date: e.arrive_date, kaoyan:e.kaoyan,
      duration_time: e.duration_time, fee: e.fee, symbol: e.symbol,
      payment: e.payment, terminal_date: e.terminal_date}
    })
  } catch(e) { 
    console.error(e)
  }
}

