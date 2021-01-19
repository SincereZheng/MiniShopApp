let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false, // 快捷导航
    options: {}, // 当前页面参数

    address: null, // 默认收货地址
    exist_address: false, // 是否存在收货地址
    goods: {}, // 商品信息

    disabled: false,

    hasError: false,
    error: '',
    ServerFileHost:'',
    ucid:0,
    order_couponindex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ServerFileHost:App.ServerFileHost
    })
    // 当前页面参数
    this.data.options = options;
    console.log(options);
    this.setData({ucid:0})
  },
  bindPickerChange:function(e){
    
    this.setData({
      order_couponindex: e.detail.value,
      ucid : this.data.order_coupon[e.detail.value].ucid
    });
    this.getOrderData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取当前订单信息
    this.getOrderData();
  },

  /**
   * 获取当前订单信息
   */
  getOrderData: function() {
    let _this = this,
      options = _this.data.options;

    // 获取订单信息回调方法
    let callback = function(result) {
      if (result.RetCode < 0) {
        App.showError(result.RetMsg);
        return false;
      }
      // 显示错误信息
      if (result.data.has_error) {
        _this.data.hasError = true;
        _this.data.error = result.data.error_msg;
        App.showError(_this.data.error);
      } else {
        _this.data.hasError = false;
        _this.data.error = '';
      }
      _this.setData(result.data);
      if(_this.data.order_coupon.length>0){
        _this.setData({
          ucid:_this.data.order_coupon[0].ucid
        });
      }
    };

    // 立即购买
    if (options.order_type === 'buyNow') {
      App._get('OrderBuyNow', {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
        ucid: _this.data.ucid,
      }, function(result) {
        callback(result);
      });
    }

    // 购物车结算
    else if (options.order_type === 'cart') {
      App._get('OrderCart', {ucid: _this.data.ucid}, function(result) {
        callback(result);
      });
    }

  },

  /**
   * 选择收货地址
   */
  selectAddress: function() {
    wx.navigateTo({
      url: '../address/' + (this.data.exist_address ? 'index?from=flow' : 'create'),
      events:null,
      success:function(res){
        console.log(res)
      }
    });
  },

  /**
   * 订单提交
   */
  submitOrder: function() {
    let _this = this,
      options = _this.data.options;

    if (_this.data.disabled) {
      return false;
    }

    if (_this.data.hasError) {
      App.showError(_this.data.error);
      return false;
    }

    // 订单创建成功后回调--微信支付
    let callback = function(result) {
      if (result.RetCode === -10) {
        App.showError(result.RetMsg, function() {
          // 跳转到未付款订单
          wx.redirectTo({
            url: '../order/index?type=payment',
          });
        });
        return false;
      }
      if (result.RetCode === -20) {
        App.showError(result.RetMsg, function() {

        });
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.payment.timeStamp,
        nonceStr: result.data.payment.nonceStr,
        package: 'prepay_id=' + result.data.payment.prepay_id,
        signType: 'MD5',
        paySign: result.data.payment.paySign,
        success: function(res) {
          // 跳转到订单详情
          App._post_form('CheckPayResult', {order_id:result.data.order_id},function(r){
            wx.redirectTo({
              url: '../order/detail?order_id=' + result.data.order_id,
            });
          });
        },
        fail: function() {
          App.showError('订单未支付', function() {
            // 跳转到未付款订单
            wx.redirectTo({
              url: '../order/index?type=payment',
            });
          });
        },
      });
    };

    // 按钮禁用, 防止二次提交
    _this.data.disabled = true;

    // 显示loading
    wx.showLoading({
      title: '正在处理...'
    });

    // 创建订单-立即购买
    if (options.order_type === 'buyNow') {
      App._post_form('SubmitOrderBuyNow', {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
        ucid : _this.data.ucid
      }, function(result) {
        // success
        console.log('success');
        callback(result);
      }, function(result) {
        // fail
        console.log('fail');
      }, function() {
        // complete
        console.log('complete');
        // 解除按钮禁用
        _this.data.disabled = false;
      },true);
    }

    // 创建订单-购物车结算
    else if (options.order_type === 'cart') {
      App._post_form('SubmitOrderCart', {ucid : _this.data.ucid}, function(result) {
        // success
        console.log('success');
        callback(result);
      }, function(result) {
        // fail
        console.log('fail');
      }, function() {
        // complete
        console.log('complete');
        // 解除按钮禁用
        _this.data.disabled = false;
      });
    }

  },


});