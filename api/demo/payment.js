// 付款跟踪
import request from '@/utils/request'

//  查全部
export function listPayment(query) {
    return request({
      url: '/demo/payment/list',
      method: 'get',
      params: query
    })
  }

  // 查询详情
export function getPayment(id) {
    return request({
      url: '/demo/payment/selById/' + id,
      method: 'get'
    })
  }
//   删除
export function delPayment(id) {
    return request({
      url: '/demo/payment/del/' + id,
      method: 'delete'
    })
  }
//   新增 
export function addPayment(data) {
    return request({
      url: '/demo/payment/add',
      method: 'post',
      data: data
    })
  }
  //   修改 
export function updatePayment(data) {
  return request({
    url: '/demo/payment/update',
    method: 'put',
    data: data
  })
}
// 回退
export function fallbackPayment(id) {
  return request({
    url: '/demo/payment/fallback/' + id,
    method: 'put',
  })
}
// 供应商发票数据查询
export function supplierList(query) {
    return request({
      url: '/demo/payment/supplierList',
      method: query
    })
  }

