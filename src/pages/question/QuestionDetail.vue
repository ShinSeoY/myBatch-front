<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { onBeforeMount, onMounted, ref } from 'vue'
import axios from 'axios'
import { QuestionDetail } from './models'
import { useQuasar } from 'quasar'

const [router, route] = [useRouter(), useRoute()]
const $q = useQuasar()

const questionSeq = route.params?.seq
const questionDetail = ref<QuestionDetail>()
const question = ref<string>()
const answer = ref<string>()
const questionType = ref<any>({ display: '선다형', value: 'CHOICE' })

const questionTypeList = [
  { display: '선다형', value: 'CHOICE' },
  { display: 'OX', value: 'OX' }
]

const goListPage = () => {
  //   if (meta.value.dirty) {
  //     $q.dialog({ title: '알림', message: '현재까지 작성한 내용을 취소하고 목록으로 돌아가시겠습니까?', ok: '예', cancel: '아니오' }).onOk(() => {
  //       router.push({ name: 'ContentManageResources' })
  //     })
  //   } else {
  router.push({ name: 'QuestionList' })
  //   }
}
const save = async () => {
  if (!question.value || !answer.value || !questionType.value) {
    $q.dialog({ title: '알림', message: '필수 정보값을 입력해주세요' })
    return
  }

  const variables: any = {
    dto: {
      questionSeq: questionSeq,
      question: question.value,
      answer: answer.value,
      questionType: questionType.value.value
    }
  }

  $q.dialog({ title: '알림', message: '저장하시겠습니까?', ok: '예', cancel: '아니오' }).onOk(async () => {
    try {
      $q.loading.show()
      console.log('dto', variables.dto)

      await axios.post('/api/question', variables.dto)
      $q.loading.hide()
      router.push({ name: 'QuestionList' })
    } catch (e) {
      console.log(e)
      $q.dialog({ title: '알림', message: '수정에 실패했습니다.' }).onDismiss(() => {
        router.push({ name: 'QuestionDetail', params: { seq: questionSeq } })
      })
      $q.loading.hide()
    }
  })
}

onMounted(async () => {
  if (questionSeq) {
    const response = await axios.get<QuestionDetail>(`/api/question/${questionSeq}`)
    questionDetail.value = response.data
    question.value = questionDetail.value?.question
    answer.value = questionDetail.value?.answer
  }
})
</script>

<template>
  <div class="q-pa-md">
    <q-markup-table flat separator="horizontal">
      <tr class="table-tr-wrap">
        <th class="bb-1-gray" width="10%">고유 코드</th>
        <td>{{ questionDetail?.questionSeq }}</td>
      </tr>
      <tr class="table-tr-wrap">
        <th class="required bb-1-gray" width="10%">질문</th>
        <td><q-input v-model="question" square outlined color="admin-gray1" placeholder="질문을 입력해주세요" /></td>
      </tr>
      <tr class="table-tr-wrap">
        <th width="10%" class="bb-1-gray">딥뱐</th>
        <td><q-input v-model="answer" square outlined color="admin-gray1" placeholder="답변을 입력해주세요" /></td>
      </tr>
      <tr class="table-tr-wrap">
        <th class="required bb-1-gray" width="10%">카테고리명</th>
        <td>
          <q-select v-model="questionType" class="admin-select w-150" color="admin-gray1" square outlined :options="questionTypeList" :option-label="(item: any) => item.display" />
        </td>
      </tr>
    </q-markup-table>
    <div>
      <q-btn square @click="goListPage()" label="목록" />
      <q-btn square @click="save()" label="수정" />
    </div>
  </div>
</template>
