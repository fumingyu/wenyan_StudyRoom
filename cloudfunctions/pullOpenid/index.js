const cloud = require('wx-server-sdk')

exports.main = async (event) => {
  
  var wenyan = new cloud.Cloud({
    // 资源方
    resourceAppid: 'wx439b2a65708f4aba',
    resourceEnv: 'wenyan-public-6gl6om6f3af27a9e',
  })

  await wenyan.init()
  const db = wenyan.database()
  const _ = db.command;
  
  try {
    const table_data = await db.collection('wenyan_request_info').limit(1000).get()
    return await table_data
  } catch(e) {
    console.error(e)
  }  
}