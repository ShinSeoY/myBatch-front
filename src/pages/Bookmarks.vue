<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { axios } from 'src/boot/axios'

const $q = useQuasar()

const pagination = ref({ rowsPerPage: 0 })

const columns: any = [
  {
    name: 'id',
    label: '#',
    field: 'id'
  },
  {
    name: 'name',
    required: true,
    label: '', // 나라명 + 통화명 ex) 한국(원), 미국(달러) ..
    align: 'left',
    field: (row: any) => row.name
    // format: (val: any) => `${val}`
  },
  { name: 'unit', align: 'center', label: '단위', field: (row: any) => row.unit }, //ex) USD, KRW, ..
  { name: 'dealBasR', label: '거래 기준 환율', field: (row: any) => row.dealBasR },
  { name: 'exchangeRate', label: 'Exchange Rate Per 1000 KRW', field: (row: any) => row.exchangeRate }, // = 전환금액/거래기준환율
  { name: 'favorite', label: '즐겨찾기', align: 'center', field: (row: any) => row.favorite }
  // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a:any, b:any) => parseInt(a, 10) - parseInt(b, 10) },
  // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a:any, b:any) => parseInt(a, 10) - parseInt(b, 10) }
]

const rows = ref([
  // {
  //   index: 1,
  //   name: '한국 (원)',
  //   unit: 'KRW',
  //   dealBasR: 0,
  //   exchangeRate: 0,
  //   favorite: true
  // },
  // {
  //   index: 2,
  //   name: '미국 (달러)',
  //   unit: 'USD',
  //   dealBasR: 0,
  //   exchangeRate: 0,
  //   favorite: true
  // },
  // {
  //   index: 3,
  //   name: '일본 (엔)',
  //   unit: 'YEN',
  //   dealBasR: 0,
  //   exchangeRate: 0,
  //   favorite: true
  // }
])

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

      rows.value = result.data.memberFavDtoList?.map((it: any) => {
        it.favorite = true
          return it;
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
      <q-table
        style="height: 400px"
        flat
        bordered
        title="내 관심 환율"
        :rows="rows"
        :columns="columns"
        row-key="index"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-favorite="props">
          <q-td :props="props">
            <q-toggle v-model="props.row.favorite" @click="updateFavorite(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-page>
  </div>
</template>

<style>
#app {
  text-align: center;
  color: #2c3e50;
}
</style>
