export interface FormFromJson {
  formName: string
  layout: Layout
  fields: Field[]
  actions: Action[]
}

export interface Layout {
  colSpan: number
  columns: number
}

export interface Field {
  key: string
  label: string
  type: string
  visible: boolean
  required?: boolean
  placeholder?: string
  validators?: Validator[]
  options?: Option[]
}

export interface Validator {
  type: string
  value: any
}

export interface Option {
  label: string
  value: string
  icon: string
  color: string
}

export interface Action {
  type: string
  label: string
  icon: string
  style: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  route?: string
}
