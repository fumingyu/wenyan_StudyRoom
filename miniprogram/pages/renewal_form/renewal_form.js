// pages/fill_form/fill_form.js

Page({
  data: {
    table_id: '',
    table_key:'',
    table_data :'',
    arrive_date: '请选择',  //日期，如 2022-01-10
    kaoyan: false, kaoyan_style:'normal',
    day_selected: true, d_or_m: '月', 
    radio_day: false, radio_month: true,
    min_day: 1, max_day: 12,
    day_array:['选择时长'], day_index: 0,
    fee: '', fee_array: ['请选择','微信','支付宝','现金'], fee_index:0,
    ex_duration_time:'', renew_date:'',
    termination: '', terminal_date:'无',  //日期，如 2022-01-10
    checked_arrive_date: '', checked_end_date: '',
  },

  // 到店日期
  bindArriveChange(e) {
    this.setData({
      renew_date: e.detail.value
    })
  },

  // 是否到考研 
  switchChange(e){
    this.setData({kaoyan:e.detail.value});
    if (this.data.kaoyan){
      this.setData({terminal_date:'到考研', day_array:['到考研'], kaoyan_style:'kaoyan',
                    radio_day:false, radio_month:false, day_selected:false})}
    else{
      this.setData({terminal_date:'无', day_index:0, day_array:['选择时长'], kaoyan_style:'normal',
                    radio_day:false, day_selected:false})}
    },

  // 天或月，每次切换天或月都重新生成时长列表，并将列表索引设为0
  checkDay(e){
    this.setData({d_or_m: e.detail.value, day_selected:true})
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
    //续费后的到期时间 = 原到期时间 + 租用时长
    var renew_day = new Date(this.data.renew_date); 
    var renew_stamp = renew_day.getTime();     //将日期转化成时间戳
    var date_time = renew_stamp + time_add;
    var end_time = new Date(date_time)          // new Date() 方法将时间戳转换成标准日期
    var end_year = end_time.getFullYear();
    var end_month = (end_time.getMonth()+1 < 10 ? '0'+(end_time.getMonth()+1) : end_time.getMonth()+1)
    var end_day = (end_time.getDate() < 10 ? '0'+(end_time.getDate()) : end_time.getDate())
    this.setData({terminal_date: end_year +'-'+ end_month +'-'+ end_day})
  },

  // 支付方式
  bindFeeSelect(e){
    this.setData({fee_index:e.detail.value})
  },

  // 提交表单后的数据
  submitForm(e){
    // 检查各项是否都填写
    var flag = 0
    var store_place = this.data.store_place
    var symbol = this.data.table_data.symbol
    var table_id = this.data.table_data.table_id
    var kaoyan = this.data.table_data.kaoyan
    if (this.data.kaoyan){    // 如果到考研
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
      if (store_place==0) {
        // 学院西路续费
        wx.cloud.callFunction({
          name: 'renewData',
          data: {symbol:symbol, 
                table_id:table_id, 
                kaoyan:kaoyan, 
                fee: e.detail.value.fee,   
                payment:this.data.fee_array[this.data.fee_index], 
                duration_time: this.data.day_array[this.data.day_index], 
                arrive_date: this.data.renew_date,
                terminal_date: this.data.terminal_date
                } 
        }).then(res => {
          console.log('续费成功'); 
          wx.showToast({title: '续费成功',icon:'success'})}
        ).catch(err => {console.log(err);
        })
        setTimeout(() => {wx.navigateBack({delta: 1})}, 1000)
      } else {
        // 健康路续费
        wx.cloud.callFunction({
          name: 'renewData2',
          data: {symbol:symbol, 
                table_id:table_id, 
                kaoyan:kaoyan, 
                fee: e.detail.value.fee,   
                payment:this.data.fee_array[this.data.fee_index], 
                duration_time: this.data.day_array[this.data.day_index], 
                arrive_date: this.data.renew_date,
                terminal_date: this.data.terminal_date
                } 
        }).then(res => {
          console.log('续费成功'); 
          wx.showToast({title: '续费成功',icon:'success'})}
        ).catch(err => {console.log(err);
        })
        setTimeout(() => {wx.navigateBack({delta: 1})}, 1000)
      }
     
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
    })
    .then(res => {
      this.setData({table_key:res.table_key, store_place:res.store_place})
    })
    .then(res => {
      var _id = this.data.table_key
      var store_place = this.data.store_place
      // 学院西路
      if (store_place == 0) {
        wx.cloud.callFunction({
          name:'getSingleID',
          data:{_id:_id}
        })
        .then(res => {
          this.setData({table_data: res.result.data[0],
                        renew_date: res.result.data[0].terminal_date
          })
        })
      } else {
        wx.cloud.callFunction({
          name:'getSingleID2',
          data:{_id:_id}
        })
        .then(res => {
          this.setData({table_data: res.result.data[0],
                        renew_date: res.result.data[0].terminal_date
           })
        })
      }
    })
  },

})
