const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({options: options});
    var title = options.type=="me"?"领取优惠券":"优惠券分享"
    wx.setNavigationBarTitle({
      title: title,
    })
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
    let _this = this;
    App._get('GetUserCouponList', {type:'share'}, result => {
      var list=[];
      result.data.couponList.forEach(function(c,index){
        if(c.cid == _this.data.options.cid)
          list.push(c)
      })
      _this.setData({couponList:list});
    });
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
  onShareAppMessage:function(res){
    if(res.from == "button"){
      var timestamp = (new Date()).valueOf();
      App._post_form('ShareCoupon', {random:timestamp,couponid:res.target.dataset.cid}, function(result) {
        
      }, false, function() {

      });
      var title = '送你一张优惠券：' + res.target.dataset.title;
      return {
        title:title,
        path:'/pages/coupon/get?type=me&random='+timestamp + '&cid='+res.target.dataset.cid
      }
    }
    
  },
  getCoupon:function(e){
    var data = this.data.options;
    App._post_form('GetCoupon', {random:data.random,couponid:data.cid}, function(result) {
        if(result.code == -500)
          App.showError(result.msg);
        else{
          App.showError(result.RetJson);
        }  
    }, false, function() {

    });
  }
})