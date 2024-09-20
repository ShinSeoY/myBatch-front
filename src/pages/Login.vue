<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { Ref, ref } from 'vue'
import { axios } from 'src/boot/axios'

const $q = useQuasar()
const $router = useRouter()

const email: Ref<string | null> = ref(null)
const phone: Ref<string | null> = ref(null)

const login = async (isTest: boolean) => {
  if (isTest) {
    email.value = 'test'
    phone.value = '0000'
  } else if (!email.value || !phone.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '이메일, 핸드폰번호를 확인해주세요'
    })
    return
  }
  const loginResult = await axios.post('/member/login', {
    email: email.value,
    phone: phone.value
  })

  switch (loginResult.data.code) {
    case '1000':
      localStorage.setItem('token', loginResult.data.jwtToken)

      axios.defaults.headers.common['Authorization'] = `Bearer ${loginResult.data.jwtToken}`

      $router.push({ name: 'Bookmarks' })

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: '로그인 완료'
      })
      break
    default:
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: '이메일, 핸드폰번호를 확인해주세요'
      })
  }
}
</script>

<template>
  <div id="app">
    <q-page class="q-pa-md">
      <q-form class="q-gutter-md">
        <q-input filled v-model="email" label="이메일" lazy-rules :rules="[(val) => (val && val.length > 0) || '이메일을 입력하세요']" />

        <q-input filled v-model="phone" label="핸드폰번호" lazy-rules :rules="[(val) => (val && val.length > 0) || '핸드폰번호를 입력하세요']" />

        <div class="button">
          <q-btn class="login" label="로그인" @click="login(false)" color="primary" />
          <div class="or">OR</div>
          <q-btn class="signup" label="회원가입" @click="$router.push({ name: 'Signup' })" color="primary" />
          <q-btn class="test-login" label="테스트용 로그인" @click="login(true)" flat>
            <q-tooltip :offset="[0, 8]">
              테스트 계정으로 로그인합니다. <br />
              해당 계정으로는 알림설정이 불가합니다.
            </q-tooltip>
          </q-btn>
        </div>
      </q-form>
    </q-page>
  </div>
</template>

<style scoped>
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
  display: flex;
  justify-content: center;
}
.q-gutter-md {
  margin-top: 5%;
  width: 60%;
}
.button {
  display: flex;
  flex-direction: column;
}
.login,
.signup {
  flex: 1;
  font-weight: bold;
}
.or {
  font-size: 15px;
  color: gray;
  text-align: center;
  margin: 15px;
}
.test-login {
  width: 20%;
  margin-top: 3%;
  align-self: flex-end;
  color: rgba(107, 107, 107, 0.87);
  background-color: rgba(0, 0, 0, 0.05);
  box-shadow: none; /* 그림자 제거 */
}
.test-login:hover {
  background-color: rgba(0, 0, 0, 0.1); /* 호버 시 배경색 변경 */
}
</style>
