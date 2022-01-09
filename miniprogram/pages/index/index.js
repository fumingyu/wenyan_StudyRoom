
const app = getApp()
Page({
    data:{
    sex: [{ id: "0", name: "男", checked:"true" }, { id: "1", name: "女" }],
    name:'',
    sexId:"0",   // 默认是0 => 男
    sex1:'',
    Email:'',
    school:'',
    index:0,
    identity:["请选择","教师","学生","其他"],
    occupation:''
    },
    getForm:function(e){
      console.log(e);
      var formdata = e.detail.value
      this.setData({
      name:formdata.name,
      sex1:this.data.sex[this.data.sexId].name,
      Email:formdata.Email,
      school:formdata.school,
      occupation:this.data.identity[this.data.index],
     })
    },
    radioChange:function(e){
        this.setData({
            sexId:e.detail.value
        })
    },
    bindPickerChange:function(e){
        this.setData({
            index: e.detail.value
        })
    },
    saveData:function(e){
      //提交后的操作，例如将信息写入数据库等
    }
})