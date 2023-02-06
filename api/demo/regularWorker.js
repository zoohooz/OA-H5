// 转正申请单接口
import request from '@/utils/request'

// 查询转正申请业务列表
export function listInformation(query) {
  return request({
    url: '/demo/regularWorker/list',
    method: 'get',
    params: query
  })
}
// 根据id查询
export function getInformation(id) {
  return request({
    url: '/demo/regularWorker/' + id,
    method: 'get',
  })
}

// 新增转正申请单
export function addInformation(data) {
  return request({
    url: '/demo/regularWorker/',
    method: 'post',
    data: data
  })
}

//修改转正申请单
export function updateInformation(data) {
  return request({
    url: '/demo/regularWorker/',
    method: 'put',
    data: data
  })
}
// 批量删除供应商业务
export function delInformation(id) {
  return request({
    url: '/demo/regularWorker/' + id,
    method: 'delete',
  })
}
//修改用户表状态
export function editUs(id) {
  return request({
    url: '/demo/regularWorker/'+id,
    method: 'put',
    // data: data
  })
}