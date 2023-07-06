// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('wenyan_seat_record_3').where({
      symbol:event.symbol,
      table_id: event.clear_id
    }).remove()
  } catch(e) {
    console.error(e)
  }
}
