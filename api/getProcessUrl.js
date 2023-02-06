import request from '@/utils/request'

// 获取用户详细信息
export function getProcessUrl(processInstanceId) {
  return request({
    'url': '/workflow/processInstance/getHistoryProcessImage?processInstanceId='+processInstanceId,
    'method': 'get'
  })
}