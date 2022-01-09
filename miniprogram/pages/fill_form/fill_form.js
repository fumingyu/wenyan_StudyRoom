// pages/fill_form/fill_form.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    table_id: 20,
    kaoyan: false,
    radio_day: true,
    radio_month: false,
    arrived_date: '请选择',  //日期，如 2022-01-10
    d_or_m: '天',
    seleect_time:false,
    day_index: 0,
    min_day: 1,
    max_day: 31,
    day_array:['选择时长'],
    fee: '',
    fee_array: ['请选择','微信','支付宝','现金'],
    fee_index:0,
    termination: '无',    //日期，如 2022-01-10
    kaoyan_style:'normal'
  },

  // 到店日期
  bindArriveChange: function(e) {
    var arrived_day = new Date(e.detail.value);
    this.setData({
      arrived_date: e.detail.value
    })
    // console.log(this.data.arrived_date);
  },

  // 天或月，每次切换天或月都重新生成时长列表，并将列表索引设为0
  checkDay(e){
    this.setData({d_or_m: e.detail.value, termination: '无' })
    var day_list = ['选择时长'];
    if (this.data.d_or_m=='天'){
      this.setData({max_day: 31, day_index:0})}
    else{
      this.setData({max_day: 12, day_index:0})}
    for(var i=1;i<=this.data.max_day;i++){
      day_list[i] = i + this.data.d_or_m;}
    this.setData({day_array:day_list})
    },
    
  // 租用时长
  bindDurationChange(e) {
    // 判断是否选择了天或月
    if(radio_day || radio_month) {
      // 先设置租用时长
      this.setData({
        day_index: e.detail.value, seleect_time:true
      })
      // 将租用的时长换算成毫秒（以便加上时间戳），一个月统一按31天计算
      var time_add;
      if (this.data.d_or_m == '天'){
        time_add = this.data.day_index * 24 * 60 * 60 * 1000;
      }
      else{
        time_add = this.data.day_index * 31 * 24 * 60 * 60 * 1000;
      }
      // 到期时间 = 到店时间 + 租用时长
      var arrive_day = new Date(this.data.arrived_date); 
      var arrive_stamp = arrive_day.getTime();     //将日期转化成时间戳
      var date_time = arrive_stamp + time_add;
      var end_time = new Date(date_time)          // new Date() 方法将时间戳转换成标准日期
      var end_year = end_time.getFullYear();
      var end_month = end_time.getMonth() + 1 ;
      var end_day = end_time.getDate();
      this.setData({termination: end_year +'-'+ end_month +'-'+ end_day})
    }
    else {
      this.setData({seleect_time:true})
      
    }

   
  },

  // 是否到考研 
  switchChange(e){
    this.setData({kaoyan:e.detail.value});
    if (this.data.kaoyan){
      this.setData({kaoyan_style:'kaoyan', radio_day:false, radio_month:false})}
    else{this.setData({kaoyan_style:'normal', radio_day:false,
                       termination:'无',day_index:0, max_day: 31,})
      this.onLoad()}
    },

  // 支付方式
  bindFeeSelect(e){
    this.setData({fee_index:e.detail.value})
    console.log(e.detail.value);
  },


  // 提交表单后整理数据
  submitForm(e){
    console.log(e);
  },
  // savedata
  saveData(e){
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var day_list = ['选择时长'];
    for(var i=1;i<=this.data.max_day;i++){
      day_list[i] = i + '天';}
    this.setData({day_array:day_list})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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