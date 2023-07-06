// pages/room_l/room_l.js

// 将 table_No不能放onLoad中，否则无法对data中的table_No赋值
const left = 18
const right = 44
function new_table_No(left, right){
  var table_No=[];
  for (var i=left; i<right+1; i++){
    table_No[i-left] = i;
}
  return table_No
}
var table_No = new_table_No(left, right)


Page({
  data: {
    symbol: '', 
    table_No: table_No,
    table_id:'无',
    if_claer: false,
    if_replace: false,
    if_symbol:false,
    replace_table:'', replace_symbol:'',
    dont_replace: true, 
    replace_content:''
  },

  // 显示换座位或退费信息
  showManage(e){
    var current_index = e.currentTarget.id.split('-')[1]
    this.setData({table_id: current_index, current_table: parseInt(current_index)+left})
  },
  // 隐藏换座位信息
  hideManage(){this.setData({table_id: '无'})},

  // 删除座位信息
  clearConfirm(){this.setData({if_claer: true})},
  clearExit(){this.setData({if_claer:false})},
  clearTable(e){
    let that = this 
    var seat_number = parseInt(e.target.id.split('-')[1]) 
    var clear_id = seat_number + left
    that.setData({clear_id: clear_id})
    var seat_info = this.data.table_No[seat_number]
    var delet_date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    // 先将座位信息添入历史记录
    wx.cloud.callFunction({
      name:'addSeatHistory3',
      data:{table_id: that.data.clear_id, symbol: that.data.symbol,
        fee:seat_info.fee, payment: seat_info.payment, 
        original_date: seat_info.original_date,
        arrive_date: seat_info.arrive_date,
        duration_time: seat_info.duration_time, 
        kaoyan:seat_info.kaoyan,
        terminal_date: seat_info.terminal_date,
        fee_history: seat_info.fee_history,
        payment_history: seat_info.payment_history,
        duration_history: seat_info.duration_history,
        delet_date:delet_date}
    })
    .then(res => {
      wx.cloud.callFunction({
        name: 'deleteData3',
        data: {symbol: that.data.symbol,
          clear_id: that.data.clear_id}
      }).then(() => {wx.showToast({title: '删除成功'})
      }).catch(err => {console.log(err)})
    })
    // 将当前座位内容设为空（通过更改table_No的值）
    var table_No = that.data.table_No
    table_No[clear_id-left] = clear_id
    that.setData({table_No:table_No})
    setTimeout(() => {that.clearExit()}, 300)
  },

  // 更换座位信息
  replaceConfirm(){ this.setData({if_replace: true})},
  replaceExit(){this.setData({if_replace:false})},
  getReplaceID(e){this.setData({replace_table:parseInt(e.detail.value)})},
  // 改变座位号时重选前缀
  changeSymbol(){this.setData({if_symbol:false, dont_replace:true})},
  // 选定房间前缀
  radioChange(e) {
    this.setData({replace_symbol:e.detail.value})
    console.log(this.data.replace_symbol, this.data.replace_table);
    wx.cloud.callFunction({
      name:'getSingleData3',
      data: {table_id:this.data.replace_table, symbol:this.data.replace_symbol}
    })
    .then(res => {
      this.setData({
        replace_content:res.result.data[0],
      }) 
    })
    .then(res =>{
      if (this.data.replace_content) {
        wx.showToast({
          title: '目标座位已有人',
          icon:'error'
        })
        this.setData({dont_replace:true})
      }else{
        this.setData({dont_replace:false})
      }
    })
  },
  // 更改座位号
  replaceTable(e){
      wx.cloud.callFunction({
        name: 'replaceData3',
        data: {table_id:this.data.current_table, symbol:this.data.symbol,
              replace_table:this.data.replace_table, replace_symbol:this.data.replace_symbol}
      })
      .then(() => {wx.showToast({title: '修改成功'})
      }).catch(err => {console.log(err)})
  
    // 将座位信息显示到目标座位, 再将当前座位内容设为空（通过更改table_No的值）
    var replace_id= parseInt(e.target.id.split('-')[1]) + 1
    var replace_table = this.data.replace_table
    var table_No = this.data.table_No
    if (left<=replace_table && replace_table<=right) {
      table_No[replace_id-1].table_id = replace_table
      table_No[replace_table-left] = table_No[replace_id-1]
      table_No[replace_id-1] = replace_id-1+left
    }else{table_No[replace_id-1] = replace_id}
    this.setData({table_No:table_No})
    setTimeout(() => {this.replaceExit()}, 300)
  },

  // 向空座位记录信息
  tableAdd(e){
  var current_index = parseInt(e.currentTarget.id.split('-')[1]) 
  // 路由到添加页面
  wx.navigateTo({
    url: '/pages/fill_current3/fill_current3',
    success: res => {res.eventChannel.emit(
      'acceptData', {table_id: current_index+left, symbol: this.data.symbol})}
  })
},
  
  /* 生命周期函数--监听页面加载 */
  onLoad: function (option) {
    // setTimeout(() => {wx.navigateBack({delta: 1})}, 1000)
  },
 
  onShow: function () {
    // 页面加载时显示座位信息，已订座位及空座位
    wx.cloud.callFunction({
      name: 'getData3',
      data: {symbol:this.data.symbol, left:left-1, right:right+1} // left: 大于left; right: 小于right
    }).then(res => { 
      var table_No = new_table_No(left, right)
      for (var i=0; i<res.result.data.length; i++){
        table_No[table_No.indexOf(res.result.data[i].table_id)] = res.result.data[i]
      }
      this.setData({table_No:table_No})
    }).catch(err => {console.log(err);
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})