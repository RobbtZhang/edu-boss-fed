export function formatTime (list: any): void {
  list.forEach((item: any) => {
    item.createdTime = item.createdTime.replace('T', ' ')
    const index = item.createdTime.indexOf('.')
    item.createdTime = item.createdTime.substring(0, index)
  })
}

export function formatUserTime (list: any) {
  list.forEach((item: any) => {
    item.createTime = item.createTime.replace('T', ' ')
    const index = item.createTime.indexOf('.')
    item.createTime = item.createTime.substring(0, index)
  })
}
