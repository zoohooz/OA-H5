import request from "@/utils/request";

// 查询加班业务列表
export function listOvertime(query) {
  return request({
    url: "/demo/overtimeApplicatlon/list",
    method: "get",
    params: query,
  });
}

// 查询加班业务详细
export function getOvertime(id) {
  return request({
    url: "/demo/overtimeApplicatlon/" + id,
    method: "get",
  });
}

// 新增加班业务
export function addOvertime(data) {
  return request({
    url: "/demo/overtimeApplicatlon",
    method: "post",
    data: data,
  });
}

// 修改加班业务
export function updateOvertime(data) {
  return request({
    url: "/demo/overtimeApplicatlon",
    method: "put",
    data: data,
  });
}

// 删除加班业务
export function delOvertime(ids) {
  return request({
    url: "/demo/overtimeApplicatlon/" + ids,
    method: "delete",
  });
}

// 根据前端对象修改用户表加班时长
export function updateUserOvertime(data) {
  return request({
    url: "/demo/overtimeApplicatlon/update",
    method: "put",
    data: data,
  });
}

