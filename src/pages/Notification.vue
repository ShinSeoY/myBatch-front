<script setup lang="ts">
import { axios } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'

const $q = useQuasar()

const name = ref(null)
const age = ref(null)
const accept = ref(false)
const selectedItem: any = ref({ dealBasR: 0 })
const selectOptions: any = ref([])
const goalExchangeRate: any = ref()
const calcTypeItem: any = ref({ name: '이상', value: 'gte' })
const calcTypeOptions: any = [
  { name: '이상', value: 'gte' },
  { name: '이하', value: 'lte' }
]

// const updateGoalExchangeRate = () => {
//     if (goalExchangeRate.value !== null) {
//       // let value = parseFloat(goalExchangeRate.value).toFixed(2);
//       console.log(goalExchangeRate.value.toString().split('.')[1]?.length)
//       if (goalExchangeRate.value.toString().split('.')[1]?.length > 2) {
//         console.log('come')
//         goalExchangeRate.value = parseFloat(goalExchangeRate.value).toFixed(2)

//       }
//     }
// }

const onSubmit = () => {
  // todo 목표환율 소수점 자리수 확인
  if (accept.value !== true) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to accept the license and terms first'
    })
  } else {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Submitted'
    })
  }
}

const onReset = () => {
  name.value = null
  age.value = null
  accept.value = false
}

const setData = async () => {
  const result = await axios.get('/exchange')
  switch (result.data.code) {
    case '1000':
      selectOptions.value = result.data.exchangeDtoList.map((it: any) => {
        const name = it.unit == 'EUR' ? it.name + `(${it.unit})` : it.name + ' ' + it.krUnit + `(${it.unit})`
        if (it.unit == 'USD') {
          selectedItem.value = { name: name, unit: it.unit, dealBasR: it.dealBasR + '원', krUnit: it.krUnit }
        }
        return { name: name, unit: it.unit, dealBasR: it.dealBasR + '원', krUnit: it.krUnit }
      })
  }
}

onMounted(async () => {
  setData()
})
</script>

<template>
  <div id="app">
    <q-page class="q-pa-md">
      <div class="q-pa-md child" style="min-width: 800px">
        <div class="notice-form">
          <div class="notice">
            <div class="notice_title">목표환율 알림 서비스</div>
            <p class="notice-sub-title">목표환율 알림 서비스란?</p>
            <p class="notice-content">일정 기간 내에 고객님께서 등록하신 매매 기준 환율에 도달하는 경우, 문자메시지 또는 이메일로 고객님께 안내 드리는 서비스!</p>
            <p class="notice-sub-title">신청유효기간은</p>
            <p class="notice-content">신청일로부터 3개월 (3개월 경과 시, 서비스 자동종료)</p>
            <p class="notice-sub-title">알림시간과 방법은</p>
            <p class="notice-content">
              알림을 설장한 다음날 오전 9시부터 오후 5시까지 매 시간마다 목표환율과 현재 환율을 비교하여 목표 달성시 알림문자메시지(SMS) 또는 이메일 1회 안내
            </p>
            <p class="notice-sub-title">유의사항</p>
            <ul class="notice-list">
              <li>목표 미달성시 알림은 제공되지 않습니다.</li>
              <li>
                3개월 내 등록하신 환율에 도달하지 않았거나 등록하신 환율에 도달하여 알림안내를 받은 경우 서비스가 자동종료 되므로 추가로 알림을 받고자 하신다면, 다시 서비스를
                신청하시기 바랍니다.
              </li>
              <li>환율알림서비스를 받은 시점과 고객님의 거래 시점의 환율은 다를 수 있으므로 실거래 시 꼭 확인 부탁드립니다.</li>
            </ul>
          </div>
          <h5 style="font-weight: bold">목표환율 알림 설정</h5>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <p class="setting-sub-title">통화</p>
            <q-select filled v-model="selectedItem" :options="selectOptions" option-label="name" />
            <p class="setting-sub-title">현재고시환율</p>
            <q-input filled v-model="selectedItem.dealBasR" label="현재고시환율" disable readonly />

            <p class="setting-sub-title">목표환율</p>
            <div class="goalSetting-container">
              <q-input
                class="goalSetting-item"
                filled
                type="number"
                step="0.01"
                v-model="goalExchangeRate"
                placeholder="직접입력"
                :rules="[(val) => val.toString().split('.')[1].length <= 2 || '소수점 둘째자리까지 입력 부탁드립니다']"
              />

              <q-select class="goalSetting-item" filled v-model="calcTypeItem" :options="calcTypeOptions" option-label="name" />
            </div>

            <div>
              <q-btn label="알림 설정" type="submit" color="primary" />
            </div>
          </q-form>
        </div>
      </div>
    </q-page>
  </div>
</template>

<style scoped>
#app {
  text-align: left;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.notice_title {
  text-align: left;
  font-size: 27px;
  letter-spacing: 0.005em;
  font-weight: bold;
  margin-bottom: 2%;
}

.notice-form {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  padding: 20px;
  max-width: 768px;
}

.notice {
  text-align: left;
  margin: 0 auto;
  margin-bottom: 80px;
}

.notice-sub-title {
  font-size: medium;
  font-weight: bold;
  color: #333;
  margin-top: 0;
}

.notice-list {
  list-style-type: none;
  padding: 0;
}

.notice-list li {
  margin-bottom: 10px;
}

.notice-content {
  margin-bottom: 20px;
}

.notice-content:last-child {
  margin-bottom: 0; /* 마지막 요소에는 하단 마진을 없애줍니다. */
}

.setting-sub-title {
  font-size: medium;
  font-weight: bold;
  color: #333;
  margin-top: 30px;
}

.goalSetting-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.goalSetting-item {
  flex-grow: 1; /* 부모 크기에 맞게 채워짐 */
  margin-right: 10px; /* 간격 조절 */
}

.goalSetting-item:last-child {
  max-width: 20%;
  margin-right: 0; /* 마지막 요소의 오른쪽 마진 제거 */
}
</style>
