type QeustionType = 'CHOICE' | 'OX'

export interface SearchList {
  display: string
  value: string
}

export interface QuestionList extends Question {
  questionSeq: number
}

export interface QuestionDetail extends Question {
  answer: string
  pQuestionSeq: number
  createdAt: string
  updatedAt: string
}

interface Question {
  questionSeq: number
  question: string
  difficulty: number
  type: QeustionType
  categoryName: string
  isShow: string
}
