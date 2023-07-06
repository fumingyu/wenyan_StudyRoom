// pages/fill_form/fill_form.js

Page({
  data: {
    table_id: '',
    arrive_date: '请选择',  //日期，如 2022-01-10
    kaoyan: false, kaoyan_style:'normal',
    day_selected: true, d_or_m: '月', 
    radio_day: false, radio_month: true,
    min_day: 1, max_day: 12,
    day_array:['选择时长'], day_index: 0,
    fee: '', fee_array: ['请选择','微信','支付宝','现金'], fee_index:0,
    termination: '无',    //日期，如 2022-01-10
    checked_arrive_date: '', checked_end_date: '',
  },

  // 到店日期
  bindArriveChange(e) {
    this.setData({
      arrive_date: e.detail.value
    })
  },

  // 是否到考研 
  switchChange(e){
    this.setData({kaoyan:e.detail.value});
    if (this.data.kaoyan){
      this.setData({termination:'到考研', day_array:['到考研'], kaoyan_style:'kaoyan',
                    radio_day:false, radio_month:false, day_selected:false})}
    else{
      this.setData({termination:'无', day_index:0, day_array:['选择时长'], kaoyan_style:'normal',
                    radio_day:false, day_selected:false})}
    },

  // 天或月，每次切换天或月都重新生成时长列表，并将列表索引设为0
  checkDay(e){
    this.setData({d_or_m: e.detail.value, day_selected:true, termination: '无' })
    var day_list = ['选择时长'];
    if (this.data.d_or_m=='天'){
      this.setData({max_day: 60, day_index:0})}
    else{
      this.setData({max_day: 12, day_index:0})}
    for(var i=1;i<=this.data.max_day;i++){
      day_list[i] = i + this.data.d_or_m;}
    this.setData({day_array:day_list})
    },
    
  // 租用时长
  bindDurationChange(e) {
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
    var arrive_day = new Date(this.data.arrive_date); 
    var arrive_stamp = arrive_day.getTime();     //将日期转化成时间戳
    var date_time = arrive_stamp + time_add;
    var end_time = new Date(date_time)          // new Date() 方法将时间戳转换成标准日期
    var end_year = end_time.getFullYear();
    var end_month = (end_time.getMonth()+1 < 10 ? '0'+(end_time.getMonth()+1) : end_time.getMonth()+1)
    var end_day = (end_time.getDate() < 10 ? '0'+(end_time.getDate()) : end_time.getDate())
    this.setData({termination: end_year +'-'+ end_month +'-'+ end_day})
  },

  // 支付方式
  bindFeeSelect(e){
    this.setData({fee_index:e.detail.value})
  },

  // 提交表单后的数据
  submitForm(e){
    // 检查各项是否都填写
    var flag = 0;
    if (this.data.arrive_date=='请选择'){wx.showToast({title: '请选择到店日期',icon: 'error',duration: 800}); flag = 1;}
    else if (this.data.kaoyan){    // 如果到考研
      if (!e.detail.value.fee){wx.showToast({title: '请填写费用',icon: 'error',duration: 800}); flag = 1;}
      else if (!this.data.fee_index){wx.showToast({title: '请选择支付方式',icon: 'error',duration: 800}); flag = 1;}
    }else {                    // 如果不到考研
      if (!e.detail.value.day_or_month){wx.showToast({title: '请选择天或月',icon: 'error',duration: 800}); flag = 1;}
      else if (!this.data.day_index){wx.showToast({title: '请选择时长',icon: 'error',duration: 800}); flag = 1;}
      else if (!e.detail.value.fee){wx.showToast({title: '请填写费用',icon: 'error',duration: 800}); flag = 1;}
      else if (!this.data.fee_index){wx.showToast({title: '请选择支付方式',icon: 'error',duration: 800}); flag = 1;}
    }
    // 检查无误后提交表单

    if (!flag) {
      wx.cloud.callFunction({
        name: 'addData',
        data: {table_id: this.data.table_id, arrive_date: this.data.arrive_date, kaoyan:this.data.kaoyan,
               duration_time: this.data.day_array[this.data.day_index], fee: e.detail.value.fee, symbol:this.data.symbol,
               payment: this.data.fee_array[this.data.fee_index], terminal_date: e.detail.value.end_time}
      }).then(res => {
        console.log('保存成功'); 
        wx.showToast({title: '保存成功',icon:'success'})}
      ).catch(err => {console.log(err);
      })
      setTimeout(() => {wx.navigateBack({delta: 1})}, 1000)
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 生成天数
    var day_list = ['选择时长'];
    for(var i=1;i<=this.data.max_day;i++){
      day_list[i] = i + '个月';}
    this.setData({day_array:day_list})
    // 接收上游数据
    const eventChannel = this.getOpenerEventChannel()
    // 加入Promise机制
    new Promise((resolve, reject) => {
      eventChannel.on('acceptData', function (data) {
        var tmp = data
        resolve(tmp)
      })
    }).then((res) => {
      this.setData({table_id:res.table_id, symbol:res.symbol})
    })
  },

})