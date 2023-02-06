import request from '@/utils/request'
import upload from '@/utils/upload'

// 查询请假业务列表
export function listLeave(query) {
  return request({
    url: '/demo/leave/list',
    method: 'get',
    params: query
  })
}

// 查询请假业务详细
export function getLeave(id) {
  return request({
    url: '/demo/leave/' + id,
    method: 'get'
  })
}

// 新增请假业务
export function addLeave(data) {
  return request({
    url: '/demo/leave',
    method: 'post',
    data: data
  })
}

// 修改请假业务
export function updateLeave(data) {
  return request({
    url: '/demo/leave',
    method: 'put',
    data: data
  })
}

// 删除请假业务
export function delLeave(id) {
  return request({
    url: '/demo/leave/' + id,
    method: 'delete'
  })
}


export function uploadfile(data) {
  return request({
    url: '/demo/leave/uploadfile',
    method: 'post',
    data:data,
  })
}

// 用户文件上传
export function uploadfiles(data) {
  return upload({
    url: '/demo/leave/uploadfile',
    name: data.name,
    filePath: data.filePath
  })
}


// 查询年假剩余时间
export function getUserDays(id) {
  return request({
    url: '/demo/leave/annualLeave/' + id,
    method: 'get',
  })
}

export function fallbackUserDays(id) {
  return request({
    url: '/demo/leave/fallback/' + id,
    method: 'get',
  })
}