export interface MemberFav {
  id?: number
  name: string
  unit: string
  krUnit: string
  dealBasR: number
  exchangeRate: number
  favorite?: boolean
}

export interface MemberFavResponse {
  code: string
  memberFavDtoList: MemberFav[]
}

export interface Column {
  name: string
  required?: boolean
  label: string
  align?: 'left' | 'center' | 'right'
  field: string | ((row: MemberFav) => any)
}
