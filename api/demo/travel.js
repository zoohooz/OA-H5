import request from '@/utils/request'
import upload from '@/utils/upload'
// 查询报销业务列表
export function listTravel(query) {
  return request({
    url: '/demo/travel/list',
    method: 'get',
    params: query
  })
}
// 查询报销业务详细
export function getTravel(id) {
  return request({
    url: '/demo/travel/' + id,
    method: 'get'
  })
}

// 新增报销业务
export function addTravel(data) {
  return request({
    url: '/demo/travel',
    method: 'post',
    data: data
  })
}

// 修改报销业务
export function updateTravel(data) {
  return request({
    url: '/demo/travel',
    method: 'put',
    data: data
  })
}

// 删除请假业务
export function delTravel(id) {
  return request({
    url: '/demo/travel/' + id,
    method: 'delete'
  })
}

// 上传文件报销业务 
// export function filesUpload(data) {
//   return request({
//     url: '/filesUpload',
//     method: 'post',
//     data: data,
//   })
// }


// 用户文件上传
export function filesUpload(data) {
  return upload({
    url: '/filesUpload',
    name: data.name,
    filePath: data.filePath
  })
}