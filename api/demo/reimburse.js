import request from '@/utils/request'
import upload from '@/utils/upload'

// 查询商家业务列表
export function listInformation(query) {
  return request({
    url: '/demo/information/list',
    method: 'get',
    params: query
  })
}

// 查询报销业务列表
export function listReimburse(query) {
  return request({
    url: '/demo/reimbursement/list',
    method: 'get',
    params: query
  })
}
// 查询报销业务详细
export function getReimburse(id) {
  return request({
    url: '/demo/reimbursement/' + id,
    method: 'get'
  })
}

//查询报销详情
export function getReimburseAll(id) {
  return request({
    url: '/demo/listReimbusAll/' + id,
    method: 'get'
  })
}
// 新增报销业务
export function addReimburse(data) {
  return request({
    url: '/demo/reimbursement',
    method: 'post',
    data: data,
    /* headers:{
      'Content-Type':'multipart/form-data;charset=UTF-8'
    } */
  })
}
// 上传文件报销业务 单
// export function uploadfile(data) {
//   return request({
//     url: '/demo/reimbursement/uploadfile',
//     method: 'post',
//     data: data,
//   })
// }
// 用户文件上传
export function uploadfile(data) {
  return upload({
    url: '/demo/reimbursement/uploadfile',
    name: data.name,
    filePath: data.filePath
  })
}
// 上传文件报销业务 多
export function filesUpload(data) {
  return request({
    url: '/demo/reimbursement/filesUpload',
    method: 'post',
    data: data,
  })
}
// 下载文件报销业务 
// export function download(avatarFile) {
//   return request({
//     url: '/demo/reimbursement/download?avatarFile='+ avatarFile,
//     method: 'get',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     responseType: 'blob'
//   })
// }
// 修改报销业务
export function updateReimburse(data) {
  return request({
    url: '/demo/reimbursement',
    method: 'put',
    data: data
  })
}

// 删除请假业务
export function delReimburse(id) {
  return request({
    url: '/demo/reimbursement/' + id,
    method: 'delete'
  })
}
// 删除报销子表 
export function delReimContent(id) {
  return request({
    url: '/demo/reimContent/room?ids=' + id,
    method: 'post',
  })
}

// 添加报销子表
export function addReimContent(data) {
  return request({
    url: '/demo/reimContent/add/',
    method: 'post',
    data: data
  })
}