<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { axios } from 'src/boot/axios'

const $q = useQuasar()

const pagination = ref({ rowsPerPage: 0 })

const columns: any = [
  { name: 'id', label: '#', field: 'id' },
  { name: 'name', required: true, label: '국가명', align: 'center', field: (row: any) => row.name },
  { name: 'unit', align: 'center', label: '단위', field: (row: any) => row.unit }, //ex) USD, KRW, ..
  { name: 'dealBasR', align: 'right', label: '거래 기준 환율', field: (row: any) => row.dealBasR },
  { name: 'exchangeRate', align: 'right', label: 'Exchange Rate Per 1000 KRW', field: (row: any) => row.exchangeRate + `  ${row.krUnit}` }, // = 전환금액/거래기준환율
  { name: 'favorite', label: '즐겨찾기', align: 'center', field: (row: any) => row.favorite }
]

const rows = ref([])

const updateFavorite = (row: any) => {
  $q.dialog({ title: '알림', message: '즐겨찾기에서 해제하시겠습니까?', ok: '예', cancel: '아니오' })
    .onOk(async () => {
      const indexToRemove = rows.value.findIndex((r) => r === row)
      rows.value.splice(indexToRemove, 1)
      await axios.delete(`/member/fav/${row.unit}`)
    })
    .onCancel(() => {
      row.favorite = true
    })
}

const setData = async () => {
  const result = await axios.get('/member/fav')
  switch (result.data.code) {
    case '1000':
      var i = 1
      rows.value = result.data.memberFavDtoList?.map((it: any) => {
        it.id = i++
        it.favorite = true
        return it
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
      <div class="q-pa-md child">
        <q-table flat bordered title="관심 환율" :rows="rows" :columns="columns" row-key="index" virtual-scroll v-model:pagination="pagination" :rows-per-page-options="[0]">
          <template v-slot:body-cell-favorite="props">
            <q-td :props="props">
              <q-toggle v-model="props.row.favorite" @click="updateFavorite(props.row)" />
            </q-td>
          </template>
        </q-table>
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
  min-width: 300px;
  margin: 4% 3%;
}
</style>
