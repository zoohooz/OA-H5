import request from '@/utils/request'


export function listLoan(query) {
    return request({
      url: "/demo/loan/list",
      method: "get",
      params: query,
    });
  }
  

export function addLoan(data) {
    return request({
      url: "/demo/loan",
      method: "post",
      data: data,
    });
  }

  export function delLoan(ids) {
    return request({
      url: "/demo/loan/" + ids,
      method: "delete",
    });
  }
  
  export function getLoan(id) {
    return request({
      url: "/demo/loan/" + id,
      method: "get",
    });
  }

  export function updateLoan(data) {
    return request({
      url: "/demo/loan",
      method: "put",
      data: data,
    });
  }