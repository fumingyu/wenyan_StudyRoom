// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try { 
    return await db.collection('wenyan_seat_record_2').where({
      table_id: event.table_id, symbol: event.symbol}).update({
      data: {
        table_id: event.replace_table,
        symbol: event.replace_symbol
      },
    })
  } catch(e) {
    console.error(e)
  }
}