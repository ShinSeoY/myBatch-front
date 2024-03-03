<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'

const $q = useQuasar()
const $router = useRouter()

const username = ref(null)
const password = ref(null)

const onSubmit = async () => {
  if (!username.value || !password.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '아이디 또는 비밀번호를 입력하세요'
    })
  } else {
    const loginResult = await axios.post('/api/login', {
      username: username.value,
      password: password.value
    })

    switch (loginResult.data.code) {
      case '1000':
        $router.push({ name: 'MyHome' })

        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '로그인 성공'
        })

      case '1001':
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: '아이디 또는 비밀번호가 일치하지 않습니다'
        })
    }
  }
}

const onReset = () => {
  username.value = null
  password.value = null
}
</script>

<template>
  <div>
    <h1>Login</h1>
    <!-- <router-link to="/myHome">Home</router-link> -->

    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input filled v-model="username" label="아이디" lazy-rules :rules="[(val) => (val && val.length > 0) || '아이디를 입력하세요']" />

        <q-input filled v-model="password" label="비밀번호" lazy-rules :rules="[(val) => (val && val.length > 0) || '비밀번호를 입력하세요']" />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </div>
</template>
