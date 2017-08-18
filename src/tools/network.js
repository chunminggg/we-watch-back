import AV from 'leancloud-storage';
var APP_ID = '6Wo8sisT5lxskzkRzBiNC1q7-gzGzoHsz';
var APP_KEY = 'pALrNiV11a34GO3pWms6dKnJ';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});
export default {
  uploadImage(file, successCallback) {
    var name = file.name,
      dataFile = new AV.File(name, file);

    dataFile.save().then(function (file) {
      // 文件保存成功
      return successCallback(file)
    }, function (error) {

      // 异常处理
      console.error(error);
    });
  },
  // 产品上传  
  uploadProduct(data, uid) {
    var Product = AV.Object.extend('Product')
    var product = new Product()
    if (uid != undefined && uid != 'new') {

      product = AV.Object.createWithoutData('Product', uid)
    }
    product.set('name', data.name)
    product.set('price', data.price)
    product.set('briefIntro', data.briefIntro)

    product.set('typeSelected', data.typeSelected)
    product.set('type', data.type)
    product.set('imageArray', data.imageArray)
    product.set('detailContent', data.detailContent)
    return product.save()

  },
  //详情获取
  getProductDetail(className,uid){
    var query = new AV.Query(className);
        return query.get(uid)
  },
  // 产品获取
  getProductList() {
    var query = new AV.Query('Product')
    query.select('name', 'price', 'type')
    return query.find()
  },
  // 删除产品
  deleteProductWithId(uid) {
    var todo = AV.Object.createWithoutData('Product', uid)
    return todo.destroy()
  },
  // 品牌上传
  uploadTheme(dict, successCallback, errorCallback) {
        var Theme = AV.Object.extend('Theme')
        var theme = new Theme()
        var themeCount = new AV.Query('Theme')
        let mySign = false
        if (dict.onlyId.length) {
            theme = AV.Object.createWithoutData('Theme', dict.onlyId)
            mySign = true
        }
        theme.set('name', dict.name)
        theme.set('brief', dict.brief)
        theme.set('imageArray', dict.imageArray)
        themeCount.count().then(count => {
            if (!mySign) {
                theme.set('type', count + 1)
            }
            return theme.save()
        }).then((todo) => {
            successCallback()
        }, (error) => {
            errorCallback()
        })

    },
    //获取品牌列表
      getThemelist() {
        var query = new AV.Query('Theme')
        query.ascending('type')
        return query.find()
    },
  // 基类方法
  addCommonTodo(className, obj) {


  },
  updateCommonTodo(className, obj) {

  },
  findCommontTodo(className, obj) {

  },
  deleteCommontTodo(className, obj) {

  },



}