import request from "@/utils/request";

// 查询涨薪列表
export function listSalary(query) {
  return request({
    url: "/demo/roseMoneyApplication/list",
    method: "get",
    params: query,
  });
}

// 查询涨薪详细
export function getSalary(id) {
  return request({
    url: "/demo/roseMoneyApplication/" + id,
    method: "get",
  });
}

// 新增涨薪
export function addSalary(data) {
  return request({
    url: "/demo/roseMoneyApplication/add",
    method: "post",
    data: data,
  });
}

// 修改涨薪
export function updateSalary(data) {
  return request({
    url: "/demo/roseMoneyApplication/update",
    method: "put",
    data: data,
  });
}

// 删除加班业务
export function delSalary(ids) {
  return request({
    url: "/demo/roseMoneyApplication/" + ids,
    method: "delete",
  });
}

// 用户表薪资的更新
export function successSalary(data) {
  return request({
    url: "/demo/roseMoneyApplication/updateSalary",
    method: "put",
    data: data,
  });
}

