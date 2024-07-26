<script setup lang="ts">
import dayjs from 'dayjs'
import { useQuasar } from 'quasar'
import { axios } from 'src/boot/axios'
import { onMounted, ref, watch } from 'vue'

const $q = useQuasar()

const columns: any = [
  { name: 'name', label: '국가명', align: 'center', field: (row: any) => row.name },
  { name: 'unit', align: 'center', label: '단위', field: (row: any) => row.unit },
  { name: 'dealBasR', align: 'right', label: '매매 기준율', field: (row: any) => row.dealBasR },
  { name: 'exchangeRate', align: 'right', label: '1000원 당 환산율', field: (row: any) => (1000 / row.dealBasR).toFixed(2) + `  ${row.krUnit}` } // = 전환금액/거래기준환율
]

const rows: any = ref([])

const baseDate = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const selectedFav = ref([])
const firstAmount = ref(0)
const secondAmount = ref(0)
const selectedFirstItem = ref()
const selectedSecondItem = ref()
const selectFirstOptions: any = ref([])
const selectSecondOptions: any = ref([])

const dense = ref(false)
const currentPage = ref(1)
const totalCnt = ref()
const pageCnt = ref(0)
const perPage = 5

const clickFavorite = async () => {
  $q.dialog({ title: '알림', message: '즐겨찾기에 추가하시겠습니까?', ok: '예', cancel: '아니오' }).onOk(async () => {
    await axios.post(
      '/member/fav',
      selectedFav.value.map((it: any) => it.unit)
    )
    selectedFav.value = []
  })
}

const convertCurrency = (direction: 'first' | 'second') => {
  if (!selectedFirstItem.value || !selectedSecondItem.value) return

  const firstRate = selectedFirstItem.value.dealBasR
  const secondRate = selectedSecondItem.value.dealBasR
  if (direction === 'first' && firstAmount.value !== null) {
    const krwAmount = firstAmount.value * firstRate
    secondAmount.value = Math.round((krwAmount / secondRate) * 100) / 100
  } else if (direction === 'second' && secondAmount.value !== null) {
    const krwAmount = secondAmount.value * secondRate
    firstAmount.value = Math.round((krwAmount / firstRate) * 100) / 100
  }
}

watch([selectedFirstItem, selectedSecondItem], () => {
  if (firstAmount.value !== null) {
    convertCurrency('first')
  } else if (secondAmount.value !== null) {
    convertCurrency('second')
  }
})

const paging = async (n: number) => {
  currentPage.value = n
  await setData(true)
}

const setData = async (isCache = false) => {
  const resultByPage = await axios.post('/exchange', {
    currentPage: currentPage.value,
    perPage: perPage
  })
  const totalResult = await axios.get('/exchange')
  const totalCntRes = await axios.get('/exchange/count')
  totalCnt.value = totalCntRes.data
  switch (resultByPage.data.code) {
    case '1000':
      baseDate.value = dayjs(resultByPage.data.exchangeDtoList[0]?.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      rows.value = resultByPage.data.exchangeDtoList
      const options = totalResult.data.exchangeDtoList.map((it: any) => {
        const name = it.name + ' ' + it.unit
        return { name: name, unit: it.unit, dealBasR: it.dealBasR, krUnit: it.krUnit }
      })
      selectFirstOptions.value = options
      selectedFirstItem.value = options.filter((v: any) => v.unit === 'KRW')[0]
      selectSecondOptions.value = options
      selectedSecondItem.value = options.filter((v: any) => v.unit === 'USD')[0]
  }
  pageCnt.value = Math.ceil(totalCnt.value / perPage)
}

onMounted(async () => {
  setData()
})
</script>

<template>
  <div id="app">
    <q-page class="q-pa-md">
      <div class="q-pa-md child">
        <div class="calc">
          <div class="calc_title">환율 계산기</div>
          <div class="base-date" style="text-align: left">기준 날짜 : {{ baseDate }}</div>
          <div class="input-container">
            <div class="input-group">
              <div class="input-div">
                <q-input class="custom-input" outlined v-model="firstAmount" label="" :dense="dense" @update:model-value="convertCurrency('first')">
                  <template v-slot:append>
                    <div class="currency-label">{{ selectedFirstItem?.krUnit }}</div>
                  </template>
                </q-input>
              </div>
              <div class="input-div select">
                <q-select calss="custom-input" v-model="selectedFirstItem" :options="selectFirstOptions" option-label="name" outlined />
              </div>
            </div>
            <div class="input-div img">
              <img class="spacer" src="/icons/exchange.png" />
            </div>
            <div class="input-group">
              <div class="input-div">
                <q-input class="custom-input" outlined v-model="secondAmount" label="" :dense="dense" @update:model-value="convertCurrency('second')">
                  <template v-slot:append>
                    <div class="currency-label">{{ selectedSecondItem?.krUnit }}</div>
                  </template>
                </q-input>
              </div>
              <div class="input-div select">
                <q-select calss="custom-input" v-model="selectedSecondItem" :options="selectSecondOptions" option-label="name" outlined />
              </div>
            </div>
          </div>
        </div>
        <div>
          <q-table
            flat
            bordered
            hide-pagination
            :rows-per-page-options="[0]"
            title="오늘의 환율"
            :rows="rows"
            :columns="columns"
            row-key="name"
            selection="multiple"
            v-model:selected="selectedFav"
          >
            <template v-slot:top-right>
              <q-btn icon="add" label="즐겨찾기 추가" @click="clickFavorite" />
            </template>
          </q-table>
        </div>
        <div class="q-pa-lg flex flex-center">
          <q-pagination v-model="currentPage" :max="pageCnt" :max-pages="5" direction-links boundary-links @update:model-value="paging" />
        </div>
      </div>
    </q-page>
  </div>
</template>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.q-page {
  padding-left: auto;
}

.q-pa-md {
  width: 100%;
  margin: auto;
}

.q-table__title {
  color: #2c3e50;
  text-align: left;
  font-size: 27px;
  letter-spacing: 0.005em;
  font-weight: bold;
  margin-bottom: 2%;
}

.calc {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  padding: 3%;
  margin-bottom: 5%;
}
.calc_title {
  text-align: left;
  font-size: 27px;
  letter-spacing: 0.005em;
  font-weight: bold;
  margin-bottom: 2%;
}
.spacer {
  width: 50px;
  height: 50px;
}
.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group {
  display: flex;
  width: 100%;
  justify-content: center;
}

.input-div {
  flex: 1;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-div.img {
  width: 100%;
  display: flex;
  justify-content: center;
}

.input-div.select {
  flex: 0 0 auto;
  min-width: 200px;
}

.q-select {
  width: 100%;
}

@media screen and (max-width: 600px) {
  .input-group {
    flex-direction: column;
  }

  .input-div,
  .input-div.select {
    width: 100%;
  }
}
.custom-input {
  position: relative;
  width: 100%;
}

.custom-input .q-field__native,
.custom-input .q-field__input {
  text-align: right !important;
  padding-right: 40px !important;
  font-size: 18px !important;
  font-weight: bold !important;
}

.currency-label {
  position: absolute;
  bottom: 2px;
  right: 8px;
  font-size: 12px;
  color: gray;
  font-weight: bold;
}

.pagination-container {
  justify-content: center;
}
</style>
