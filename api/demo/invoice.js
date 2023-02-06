import request from "@/utils/request";

// 查询发票管理列表
export function listInvoice(query) {
  return request({
    url: "/demo/invoice/list",
    method: "get",
    params: query,
  });
}
// 新增发票
export function addInvoice(data) {
  return request({
    url: "/demo/invoice/addInvoice",
    method: "post",
    data: data,
  });
}

// 删除发票
// export function delInvoice(data) {
//   return request({
//     url: "/demo/invoice/delInvoice" ,
//     method: "delete",
//     data: data,
//   });
// }
// 业务
export function delInvoice(id) {
  return request({
    url: '/demo/invoice/delInvoice/' + id,
    method: 'delete',
  })
}
// 查询发票详情
export function getInvoice(id) {
  return request({
    url: '/demo/invoice/selById/' + id,
    method: 'get'
  })
}

// 修改发票
export function updateInvoice(data) {
  return request({
    url: '/demo/invoice/updateInvoice',
    method: 'put',
    data: data
  })
}
