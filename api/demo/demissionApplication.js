// 离职接口
import request from '@/utils/request'

// 查询离职业务列表
export function listDimission(query) {
  return request({
    url: '/demo/dimissionApplication/list',
    method: 'get',
    params: query
  })
}
// 查询离职表详细
export function listId(id) {
  return request({
    url: '/demo/dimissionApplication/' + id,
    method: 'get'
  })
}
// 查询是否有报销未完成
// export function userId(id) {
//   return request({
//     url: '/demo/dimissionApplication/userId/' + id,
//     method: 'get'
//   })
// }
// 新增离职单
export function addDimission(data) {
  return request({
    url: '/demo/dimissionApplication/',
    method: 'post',
    data: data
  })
}

//修改离职单
export function updateDimission(data) {
  return request({
    url: '/demo/dimissionApplication/',
    method: 'put',
    data: data
  })
}
// 批量删除离职业务
export function delDimission(id) {
  return request({
    url: '/demo/dimissionApplication/' + id,
    method: 'delete',
  })
}
// 修改用户表状态
export function editUs(id) {
  return request({
    url: '/demo/dimissionApplication/'+id,
    method: 'put',
    // data: data
  })
}
