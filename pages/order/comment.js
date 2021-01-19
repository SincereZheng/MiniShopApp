let App = getApp();
// pages/order/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    texts: "",
    min: 5,//最少字数
    max: 200, //最多字数 (根据自己需求改变)
    tempFilePaths: [],
    imgurl:[],//'../Files/20202124235423.jpg'
    ServerFileHost:'',
    ServerNoFileHost:App.ServerNoFileHost,
    inputtext:'',
    skuid:0,
    orderdetailid:0,
    type:''
  },
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最少字数限制
    if (len <this.data.min){
      this.setData({
        texts: "加油，至少要输入5个字哦"
      })
    }else if (len >= this.data.min){
      this.setData({
        texts: " "
      })
    }
    
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len, //当前字数  
      inputtext:value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ServerFileHost:App.ServerFileHost,
      ServerNoFileHost:App.ServerNoFileHost,
      skuid:options.skuid,
      orderdetailid:options.orderdetailid,
      type:options.type
    })
    wx.setNavigationBarTitle({
      title: options.goodsname,
    })
    var _this=this;
    if(options.type == "view"){
      _this.setData({showupload:"c-hide"});
      App._get('GetUserOrderGoodsComment', { orderdetailid:options.orderdetailid }, function (result) {
        if(result.data && result.data.tempFilePaths && result.data.tempFilePaths.length > 0){
          var urls=[];
          result.data.tempFilePaths.forEach(function(url,item){
            urls.push(App.ServerFileHost + url);
          })
          result.data.tempFilePaths = urls;
        }
        _this.setData(result.data);
      });
    }
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

  },
  upload: function () {
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;

        // that.setData({
        //   tempFilePaths: tempFilePaths
        // })
        /**
         * 上传完成后把文件上传到服务器
         */
        var count = 0;
        var path = [];
        var urls = [];
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          //上传文件
          wx.uploadFile({
              url: App.api_root + 'UploadFile',
              filePath: tempFilePaths[i],
              name: 'uploadfile_ant',
              header: {
                "Content-Type": "multipart/form-data"
              },
              success: function (res) {
                count++;
                urls.push(JSON.parse(JSON.parse(res.data).RetJson)[0])
                path.push(App.ServerFileHost + JSON.parse(JSON.parse(res.data).RetJson)[0])
                //如果是最后一张,则隐藏等待中  
                if (count == tempFilePaths.length) {
                  that.setData({
                    tempFilePaths: path,
                    imgurl:urls
                  })
                  wx.hideToast();
                }
              },
              fail: function (res) {
                wx.hideToast();
                wx.showModal({
                  title: '错误提示',
                  content: '上传图片失败',
                  showCancel: false,
                  success: function (res) { }
                })
              }
          });
        }

      }
    })
  },
  /**
   * 预览图片方法
   */
  listenerButtonPreviewImage: function (e) {
    let index = e.target.dataset.index;
    let that = this;
    console.log(that.data.tempFilePaths[index]);
    console.log(that.data.tempFilePaths);
    wx.previewImage({
      current: that.data.tempFilePaths[index],
      urls: that.data.tempFilePaths,
      //这根本就不走
      success: function (res) {
        //console.log(res);
      },
      //也根本不走
      fail: function () {
        //console.log('fail')
      }
    })
  },
  /**
   * 长按删除图片
   */
  deleteImage: function (e) {
    var that = this;
    var tempFilePaths = that.data.tempFilePaths;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          tempFilePaths.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          tempFilePaths
        });
      }
    })
  },
  changeColor1: function () {
    var that = this;
    that.setData({
      flag: 1
    });
  },
  changeColor2: function () {
    var that = this;
    that.setData({
      flag: 2
    });
  },
  changeColor3: function () {
    var that = this;
    that.setData({
      flag: 3
    });
  },
  changeColor4: function () {
    var that = this;
    that.setData({
      flag: 4
    });
  },
  changeColor5: function () {
    var that = this;
    that.setData({
      flag: 5
    });
  },

  bindSubmit:function(){
    var data = this.data;
    if(data.inputtext == null || data.inputtext == "")
      return;
    if(data.flag == 0)
      return;
    App._post_form('AddComment', { comment:data.inputtext,orderdetailid:data.orderdetailid,skuid:data.skuid,star:data.flag,filePath:data.imgurl }, 
      function (result) {
        if(result.code == -500){
          App.showError(result.msg)
          return
        }
        wx.showToast({
          title: '提交成功',
          success:function(res){
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          }
        })
    });
  }
})