<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SearchList, QuestionList } from './models'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchList = ref<SearchList[]>([
  { display: '고유번호', value: 'questionSeq' },
  { display: '질문', value: 'question' }
])
const questSearchKeyword = ref()
const questSearch = ref({ display: '고유번호', value: 'questionSeq' })
const questionList = ref<QuestionList[]>([])
const currentPage = ref<number>(0)
const columns = [
  { name: 'questionSeq', label: '고유번호', field: 'questionSeq' },
  { name: 'question', label: '질문', field: 'question' },
  { name: 'difficulty', label: '난이도', field: 'difficulty' },
  { name: 'type', label: '문제유형', field: 'type' },
  { name: 'category', label: '카테고리명', field: 'category' },
  { name: 'isShow', label: '사용 여부', field: 'isShow' }
]
const rows = ref([
  {
    questionSeq: 1,
    question: '질문1',
    difficulty: 1,
    type: 'CHOICE',
    category: 'Oracle',
    isShow: true ? '사용' : '미사용'
  },
  {
    questionSeq: 2,
    question: '질문2',
    difficulty: 2,
    type: 'CHOICE',
    category: '알고리즘',
    isShow: true ? '사용' : '미사용'
  },
  {
    questionSeq: 3,
    question: '질문3',
    difficulty: 3,
    type: 'CHOICE',
    category: '자바',
    isShow: true ? '사용' : '미사용'
  },
  {
    questionSeq: 4,
    question: '질문4',
    difficulty: 1,
    type: 'CHOICE',
    category: '자바스크립트',
    isShow: true ? '사용' : '미사용'
  },
  {
    questionSeq: 5,
    question: '질문5',
    difficulty: 1,
    type: 'CHOICE',
    category: '타입스크립트',
    isShow: true ? '사용' : '미사용'
  },
  {
    questionSeq: 6,
    question: '질문6',
    difficulty: 1,
    type: 'CHOICE',
    category: 'MySql',
    isShow: true ? '사용' : '미사용'
  }
])

const setData = async (isCache = false) => {
  const dto: any = {}
  if (questSearch.value.value === 'question') {
    dto.question = questSearchKeyword.value.trim()
  } else if (questSearch.value.value === 'questionSeq' && questSearchKeyword.value.trim() !== '') {
    const temp = Number(questSearchKeyword.value.trim())
    dto.questionSeq = isNaN(temp) ? 0 : temp
  }
  // console.log('...dto : ', dto)
  // const testing = await axios.get('/api/test')
  // console.log('...testing', testing)
  // // questionList.value = await findQuestionList(dto)
  questionList.value = [
    {
      questionSeq: 5,
      question: '질문5',
      difficulty: 1,
      type: 'CHOICE',
      categoryName: '타입스크립트',
      isShow: true ? '사용' : '미사용'
    },
    {
      questionSeq: 6,
      question: '질문6',
      difficulty: 1,
      type: 'CHOICE',
      categoryName: 'MySql',
      isShow: true ? '사용' : '미사용'
    }
  ]
  await setLowData()
}

const setLowData = async () => {
  rows.value = []

  for (const question of questionList.value) {
    rows.value.push({
      questionSeq: question.questionSeq,
      question: question.question,
      difficulty: question.difficulty,
      type: question.type,
      category: question.categoryName,
      isShow: question.isShow ? '사용' : '미사용'
    })
  }
}

const goDetail = (seq?: number) => {
  router.push({ name: 'QuestionDetail', params: { seq: seq ? seq : 'hi' } })
}
</script>

<template>
  <div class="q-pa-md">
    <q-table flat bordered title="문제" :rows="rows" :columns="columns" row-key="id" binary-state-sort hide-pagination no-data-label="데이터가 없습니다.">
      <template v-slot:body-cell-question="props">
        <q-td :props="props" style="cursor: pointer" class="hover-effect" @click="goDetail(props.row.questionSeq)">{{ props.row.question }}</q-td>
      </template>
      <template v-slot:top-right>
        <q-select v-model="questSearch" square outlined :options="searchList" :option-label="(item:SearchList) => item.display" />
        <q-input v-model="questSearchKeyword" square outlined placeholder="검색어를 입력하시오" />
        <q-btn square outlined color="black" size="lg" @click="setData()" label="검색" />
      </template>
    </q-table>
    <q-btn square outlined color="black" size="lg" @click="router.push({ name: 'QuestionCreate' })" label="생성" />
    <div class="q-pa-lg flex flex-center">
      <q-pagination v-model="currentPage" color="black" :max="10" :max-pages="6" :boundary-numbers="false" />
    </div>
  </div>
</template>
