var yangdate = require("../../utils/sign_in_ss.js");
const App = getApp();
// pages/sign_in/sign_in.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signDay:[
      {"signDay":"9"},
      {"signDay":"11"},
      {"signDay":"12"},
      {"signDay":"15"}
    ],
    signs:[1,2,3,5,6,7],
    signtype:"2",
    signDays:[],
    todayDate:"1",
    todayMonth:"",
    todayYear:"",
    nextMonth:"",
    nextYear:"",
    prevYear:"",
    prevMonth:"",
    seriesCount:"99",
    series_gos:"15",
    for_signs:"none",
    powerData:"0",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    var getToday = new Date();
    var todayDate =getToday.getDate();
    var todayMonths =getToday.getMonth();
    var todayMonth=(todayMonths+1);
    var todayYear =getToday.getFullYear();
    var todayss =getToday.getDate();
    if(todayMonth<10){
      var todayMonthss="0"+todayMonth;
    }else{
      var todayMonthss=todayMonth;
    }
    var godates = todayYear + "-" + todayMonthss + "-01";
    console.log(todayss);
    App._get('WxMiniAppGetUserSignRecord', {datestr:godates}, result => {
      
      var data = {
        signDays: result.data.record
      };
      var $datas =data;
      var signDate_arr =new Array();
      var anns = $datas.signDays;
      that.setData({
        seriesCount:result.data.continuedays,
        series_gos:result.data.moredays,
      });
      for(var p in anns){//遍历json对象的每个key/value对,p为key
        var newdats =anns[p];
        signDate_arr.push(newdats);
      }
      if(signDate_arr.indexOf(todayss)>-1){
        console.log("当前已签到");
        that.setData({
            signtype:"2",
        });
      }else{
        console.log("当前未签到");
        that.setData({
            signtype:"1",
        });
      }
      console.log(signDate_arr[0]);
      yangdate.yang_date.bulidCal(todayYear,todayMonth,that,signDate_arr);
      //初始化加载日历
      this.setData({
        todayDate:todayDate,
        todayMonth:todayMonth,
        todayYear:todayYear,
        prevYear:todayYear,
        nextYear:todayYear,
        prevMonth:todayMonth,
        nextMonth:todayMonth,
        showYear:todayYear,
        showMonth:todayMonth,
      });
    });
    
  },
  sign_start: function () {
    var that = this;
    //签到成功后重新调用后台接口加载新的签到数据
    App._post_form('WxMiniAppUserSignIn', {}, function(result) {
      if(result.data.code == 0){
        App.showSuccess(result.data.msg,function(){that.onLoad()})
        
      }else{
        wx.showToast({
          title: result.data.msg,
          icon: 'success',
          duration: 1500
        });
      }
      
    }, false, function() {
    });
    
  },

  close_qdbox: function () {
    var seriesCount = this.data.seriesCount;
    // var seriesCount = seriesCount+1;
    if(seriesCount<10){
      var series_gos=10-seriesCount;
    }else{
      var series_gos="0";
    }
    this.setData({
      seriesCount:seriesCount,
      series_gos:series_gos,
      for_signs:"none",
    });
  },
  sign_end: function () {
    wx.showToast({
      title: '今日已经签到',
      icon: 'success',
      duration: 1500
    });
  },
  sign_prev: function () {
    console.log("上一月");
    var showMonth=this.data.showMonth;
    var todayMonth =this.data.todayMonth;
    if(showMonth=="1"){
      var showMonth="12";
      var showYear=parseInt(this.data.showYear)-1;
    }else{
      var showMonth=parseInt(this.data.showMonth)-1;
      var showYear=this.data.showYear;
    }
    
    var that =this;
    if(showMonth<10){
      var showMonths="0"+showMonth;
    }else{
      var showMonths=todayMonth;
    }
    var godates = showYear + "-" + showMonths + "-01";
    App._get('WxMiniAppGetUserSignRecord', {datestr:godates}, result => {
      var $datas = {
        seriesCount: result.data.continuedays, 
        signDays: result.data.record
      };
      var anns = $datas.signDays;
      var signDate_arr=[];
      for(var p in anns){//遍历json对象的每个key/value对,p为key
        var newdats =anns[p];
        signDate_arr.push(newdats);
      }
      console.log(signDate_arr[0]);
      yangdate.yang_date.bulidCal(showYear,showMonth,that,signDate_arr);
      //初始化加载日历
  
      that.setData({
        showYear:showYear,
        showMonth:showMonth,
      });
    });
    
  },
  sign_next: function () {
    console.log("下一月");
    var showMonth=this.data.showMonth;
    var todayMonth =this.data.todayMonth;
    if(todayMonth==showMonth){
      wx.showToast({
        title: '未签到不能查看',
        icon: 'loading',
        duration: 1500
      });
      return;
    }
    if(showMonth=="12"){
      var showMonth="1";
      var showYear=parseInt(this.data.showYear)+1;
    }else{
      var showMonth=parseInt(this.data.showMonth)+1;
      var showYear=this.data.showYear;
    }

    var that =this;

    if(showMonth<10){
      var showMonths="0"+showMonth;
    }else{
      var showMonths=todayMonth;
    }
    var godates = showYear + "-" + showMonths + "-01";

    App._get('WxMiniAppGetUserSignRecord', {datestr:godates}, result => {
      var $datas = {
        seriesCount: result.data.continuedays, 
        signDays: result.data.record
      };
      var anns = $datas.signDays;
      var signDate_arr=[];
      for(var p in anns){//遍历json对象的每个key/value对,p为key
        var newdats =anns[p];
        signDate_arr.push(newdats);
      }
      console.log(signDate_arr[0]);
      yangdate.yang_date.bulidCal(showYear,showMonth,that,signDate_arr);
      //初始化加载日历
  
      that.setData({
        showYear:showYear,
        showMonth:showMonth,
      });
    });

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