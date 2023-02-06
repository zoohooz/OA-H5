import request from "@/utils/request";
/**
 * 查询
 * @returns
 */
 export function list() {
  return request({
    url: '/actType/list',
    method: 'get'
  })
}

/**
 * 新增模型类型
 * @param {传输的数据}} data
 * @returns
 */
 export function add(data) {
  return request({
    url: '/actType/insert',
    method: 'post',
    data: data
  })
}

/**
 * 按id删除模型类型
 * @param {模型id} id
 * @returns
 */
 export function del(id) {
  return request({
    url: '/actType/delete?id=' + id,
    method: 'post'
  })
}

/**
 * 修改模型类型
 * @param {传输的数据}} data
 * @returns
 */
 export function update(data) {
  return request({
    url: '/actType/update',
    method: 'post',
    data: data
  })
}