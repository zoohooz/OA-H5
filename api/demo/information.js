// 供应商接口
import request from '@/utils/request'

// 查询供应商业务列表
export function listInformation(query) {
  return request({
    url: '/demo/vendor/list',
    method: 'get',
    params: query
  })
}
// 新增供应商业务
export function addInformation(data) {
  return request({
    url: '/demo/vendor/',
    // url: '/demo/vendor/add',
    method: 'post',
    data: data
  })
}
// 查询供应商详情
export function getInformation(id) {
  return request({
    url: '/demo/vendor/' + id,
    method: 'get',
    // params:query

  })
}

// 批量删除供应商业务
export function delInformation(id) {
  return request({
    url: '/demo/vendor/' + id,
    method: 'delete',
  })
}
  //修改供应商业务
  export function updateInformation(data) {
    return request({
      url: '/demo/vendor/',
      method: 'put',
      data: data
    })
  }

