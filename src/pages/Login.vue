<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { axios } from 'src/boot/axios'

const $q = useQuasar()
const $router = useRouter()

const email = ref(null)
const phone = ref(null)

const signup = () => {
  console.log('sign up...')
}

const login = async () => {
  if (!email.value || !phone.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '이메일, 핸드폰번호를 확인해주세요'
    })
  } else {
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
        $q.dialog({
          title: '회원가입',
          message: `회원가입 되어있지 않은 사용자 입니다. <br/> <br/> 이메일 : ${email.value} <br/> 핸드폰번호 : ${phone.value} <br/><br/> 위 정보로 회원가입을 진행하시겠습니까?`,
          ok: '예',
          cancel: '아니오',
          html: true
        })
          .onOk(async () => {
            await axios.post('/member/signup', {
              email: email.value,
              phone: phone.value
            })
            $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '회원가입이 완료되었습니다. \n 로그인을 다시 해주세요!'
            })
          })
          .onCancel(() => {
            email.value = null
            phone.value = null
          })
    }
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
          <q-btn class="login" label="로그인" @click="login" color="primary" />
          <div class="or">or</div>
          <q-btn class="signup" label="회원가입" @click="signup" color="primary" />
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
</style>
