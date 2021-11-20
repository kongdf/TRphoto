import { Component } from 'react'
import Taro from '@tarojs/taro'

import { View, Swiper, SwiperItem, Image, Video } from '@tarojs/components'

const md5 = require('../../utils/md5');
import './index.scss'

import {AtInput, AtButton } from "taro-ui"

export default class login extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      user: 'kong51812',
      pwd: 'bin51812'
    }


  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {

  }

  componentDidHide() { }
  changeUser(user) {
    this.setState({
      user
    })
  }
  changePwd(pwd) {
    this.setState({
      pwd
    })
  }
  login(){
    console.log(this.state.user)

    Taro.request({
      url: 'http://localhost:3000/photo/login', //仅为示例，并非真实的接口地址
      method:'POST',
      data: {
        user: this.state.user,
        pwd: md5.hex_md5(this.state.pwd) 
      }, 
      success: function (res) {
        if(res.data.StatusCode=='000000'){
   
        Taro.showToast({
          title: '登陆成功',
          icon: 'success',
          duration: 2000
        })
        Taro.setStorage({
          key:"uid",
          data:res.data.uid,
          success:function(){
            Taro.navigateTo({
              url: '/pages/index/index', 
              
            })
          }
        })
   
        }else if(res.data.StatusCode=='000001'){
          Taro.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          })
          Taro.setStorage({
            key:"uid",
            data:res.data.uid,
            success:function(){
              Taro.navigateTo({
                url: '/pages/index/index', 
                success: function (res) {
           
                }
              })
            }
          })
        }else {
          Taro.showToast({
            title: res.data.StatusMsg,
            icon: 'none',
            duration: 2000
          })
        }
        console.log(res.data)
      }
    }) 
  }
 
  render() {
    return (
      < View>
        <AtInput
          name='user'
          title='用户名'
          type='text'
          placeholder='请输入用户名'
          value={this.state.user}
          onChange={this.changeUser.bind(this)}
        />
        <AtInput
          name='value'
          title='密码'
          type='password'
          placeholder='请输入密码'
          value={this.state.pwd}
          onChange={this.changePwd.bind(this)}
        />

        <AtButton onClick={this.login.bind(this)}>登陆/注册</AtButton> 
      
      </View>

    )
  }
}
