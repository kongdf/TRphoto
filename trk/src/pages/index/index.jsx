import { Component } from 'react'
import Taro from '@tarojs/taro'

import { View, Swiper, SwiperItem, Image, Video } from '@tarojs/components'
const qiniuUploader = require("../../utils/qiniuUploader");

import './index.scss'

import { AtIcon, AtModal, } from "taro-ui"

export default class Index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      isDel: false,
      selectId: '',
      showList: [],
      uid: ""
    }


  }
  GetToken() {
    var that = this;

    Taro.request({
      url: 'http://localhost:3000/users/gettoken', //仅为示例，并非真实的接口地址
      method: "get",

      success(res) {

        var options = {
          region: 'SCN',
          uptoken: res.data,
          domain: 'https://love-static.kongdf.com',
          shouldUseQiniuFileName: false
        };
        qiniuUploader.init(options);

      }
    })
  }

  selectPhoto() {
    let that = this
    Taro.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // var tempFilePaths = res.tempFilePaths
        for (const i in res.tempFilePaths) {
          that.qnUp(res.tempFilePaths[i], 1)
        }
      }
    })

  }

  selectVideo() {
    var self = this
    Taro.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        self.qnUp(res.tempFilePath, 2);
      }
    })
  }
  del = id => {
    this.setState({
      isDel: true,
      selectId: id,
    })


  }
  showIMG = val => {

    Taro.previewImage({
      current: val,
      urls: this.state.showList
    })

  }

  getList() {

    let that = this
    Taro.request({
      url: 'http://localhost:3000/photo/List',  
      data: {
        uid: that.state.uid
      },
      method: 'POST',

      success: function (res) {

        console.log(res.data.data)
        let arr = []
        for (const i in res.data.data) {
          if (res.data.data[i].type == 1) {
            arr.push(res.data.data[i].imgurl)
          }
        }
        that.setState({
          list: res.data.data,
          showList: arr
        })
  
      }
    })
  }
  exit(){
 
    Taro.clearStorage()
    Taro.reLaunch({
      url: '/pages/login/index',
    })
  }
  handleClose() {
    this.setState({
      isDel: false
    })
  }
  qnUp = (url, type) => {

    let that = this
    qiniuUploader.upload(url, (res) => {

      Taro.request({
        url: 'http://localhost:3000/photo/addPhoto',
        method: "POST",
        data: {
          imgurl: res.imageURL,
          type,
          uid: that.state.uid
        },
        success(ress) {
          console.log(ress)
          if (ress.data.StatusCode == '000001') {

            Taro.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
            that.getList()
          }
        }
      })

      console.log('file url is: ' + res.fileURL);
    }, (error) => {
      console.error('error: ' + JSON.stringify(error));
    },
      null,
      (progress) => {

        console.log('上传进度', progress.progress);
        console.log('已经上传的数据长度', progress.totalBytesSent);
        console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend);
      }
    );
  }
  handleConfirm() {
    let that = this
    Taro.request({
      url: 'http://localhost:3000/photo/del',  
      data: {
        uid: that.state.uid,
        id: that.state.selectId
      },
      method: 'POST',

      success: function (res) {

        console.log(res.data.data)
        that.setState({
          isDel: false
        })
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
        that.getList() 
      }
    })
  }

  componentWillMount() {
    let that = this
    Taro.getStorage({
      key: 'uid',
      success: function (res) {
        that.setState({
          uid: res.data
        })
        that.getList()
        that.GetToken()
      }, fail: function (data) {
        Taro.navigateTo({
          url: '/pages/login/index',
        })
      }
    })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {





  }

  componentDidHide() { }

  render() {
    return (

      <View className='index'>
        <Swiper
          className='test-h'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          style='height:300px;'
          autoplay>
          {
            this.state.list.map((item, index) => {
              if (index < 5) {
                return <SwiperItem>
                  {item.type == 1 ? <Image

                    mode='aspectFill'
                    style='width: 100%;height: 100%;'

                    src={item.imgurl}
                  /> : <Video
                    style='width: 100%;height:100%;'
                    objectFit='cover'
                    src={item.imgurl}
                    // poster='https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
                    initialTime='0'
                    controls={true}
                    autoplay={false}
                    loop={false}
                    muted={false}
                  />}
                </SwiperItem>
              }


            })
          }
        </Swiper>
        <View className='waterfall'>
          {
            this.state.list.map((item, index) => {
              return <View className='item' style='padding:0 5px;'>

                {item.type == 1 ? <Image

                  onLongPress={this.del.bind(this, item.id)}
                  key={item.id}
                  mode='aspectFill'
                  style='width: 100%;'
                  src={item.imgurl}
                  lazyLoad
                  onClick={this.showIMG.bind(this, item.imgurl,)}

                /> :



                  <View
                    onLongPress={this.del.bind(this, item.id)}
                  >
                    <Video
                      style='width: 100%;'
                      objectFit='cover'
                      src={item.imgurl}
                      initialTime='0'
                      controls={true}
                      autoplay={false}
                      loop={false}
                      muted={false}
                    />

                  </View>

                }
              </View>

            })
          }


        </View>
        <AtIcon className='add' onClick={this.selectPhoto.bind(this)} value='image' size='40' color='#6190e8'></AtIcon>
        <AtIcon className='add2' onClick={this.selectVideo.bind(this)} value='video' size='48' color='#6190e8'></AtIcon>
        <AtIcon className='add3' onClick={this.exit.bind(this)} value='home' size='48' color='#6190e8'></AtIcon>
        <AtModal
          style='height:100px;'
          isOpened={this.state.isDel}
          title='确定删除？'
          cancelText='取消'
          confirmText='确认'
          onClose={this.handleClose.bind(this)}
          onCancel={this.handleClose.bind(this)}
          onConfirm={this.handleConfirm.bind(this)}
          content='删除后不可恢复，确定删除？'
        />
      </View>
    )
  }
}
