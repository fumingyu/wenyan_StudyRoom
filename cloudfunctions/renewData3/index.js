// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const table_data = await db.collection('wenyan_seat_record_3').where({
      symbol: event.symbol,
      table_id: event.table_id})
      .update({
        data:{
          fee:event.fee, payment: event.payment, 
          arrive_date: event.arrive_date,
          duration_time: event.duration_time, 
          kaoyan:event.kaoyan,
          terminal_date: event.terminal_date,
        }
      }) 
    return await table_data
  } catch(e) {
    console.error(e)
  }  
}

