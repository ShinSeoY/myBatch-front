<script setup lang="ts">
import '../css/page/calculator.scss'
import dayjs from 'dayjs'
import { useQuasar } from 'quasar'
import { axios } from 'src/boot/axios'
import { Column } from 'src/type/bookmarksType'
import { onMounted, ref, watch } from 'vue'

const $q = useQuasar()

const columns: Column[] = [
  { name: 'name', label: '국가명', align: 'center', field: (row: any) => row.name },
  { name: 'unit', align: 'center', label: '단위', field: (row: any) => row.unit },
  { name: 'dealBasR', align: 'right', label: '매매 기준율', field: (row: any) => row.dealBasR },
  { name: 'exchangeRate', align: 'right', label: '1000원 당 환전 금액', field: (row: any) => (1000 / row.dealBasR).toFixed(2) + `  ${row.krUnit}` } // = 전환금액/거래기준환율
]
const rows = ref([])

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
const keyword = ref('')

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
    keyword: keyword.value,
    pageBaseDto: {
      currentPage: currentPage.value,
      perPage: perPage
    }
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
        <div class="list">
          <q-table
            flat
            hide-pagination
            title="오늘의 환율"
            :rows-per-page-options="[0]"
            :rows="rows"
            :columns="columns"
            row-key="name"
            selection="multiple"
            v-model:selected="selectedFav"
          >
            <template v-slot:top-right>
              <q-input v-model="keyword" dense outlined placeholder="나라명 검색" class="search-input" @keyup.enter="setData">
                <template v-slot:append>
                  <q-icon name="search" @click="setData" style="cursor: pointer" />
                </template>
              </q-input>
            </template>
            <template v-slot:bottom>
              <div class="row justify-end full-width q-table__bottom">
                <q-btn flat dense label="즐겨찾기 추가" icon="add" @click="clickFavorite" class="favorite-btn" />
              </div>
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
