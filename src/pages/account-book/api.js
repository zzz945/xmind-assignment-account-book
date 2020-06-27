import request from '@/utils/request'

const baseUrl = 'http://localhost:8108/account-book'

export default {
  getBillList: params => request.get(`${baseUrl}/get-bill-list`, params),
  insertBill: params => request.get(`${baseUrl}/insert-bill`, params),
  getCategories: params => request.get(`${baseUrl}/get-categories`, params),
}