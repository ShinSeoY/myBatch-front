<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { axios } from 'src/boot/axios'

const $q = useQuasar()
const $router = useRouter()

const email = ref(null)
const phone = ref(null)

const isValidEmail = (val) => {
  const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i
  return email_regex.test(val)
}

const isValidPhone = (val) => {
  const phone_regex = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/
  return phone_regex.test(val)
}

const signup = () => {
  $q.dialog({
    title: '회원가입',
    message: `이메일 : ${email.value} <br/> 핸드폰번호 : ${phone.value} <br/><br/> 위 정보로 회원가입을 진행하시겠습니까?`,
    ok: '예',
    cancel: '아니오',
    html: true
  }).onOk(async () => {
    await axios.post('/member/signup', {
      email: email.value,
      phone: phone.value
    })
    $router.push({ name: 'Login' })
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: '회원가입이 완료되었습니다. \n 로그인을 다시 해주세요!'
    })
  })
}
</script>

<template>
  <div id="app">
    <q-page class="q-pa-md">
      <q-form class="q-gutter-md">
        <q-input filled v-model="email" label="이메일" lazy-rules :rules="[(val) => (val && val.length > 0 && isValidEmail(val)) || '이메일 형식에 맞게 입력해주세요']" />

        <q-input
          filled
          v-model="phone"
          label="핸드폰번호"
          lazy-rules
          :rules="[(val) => (val && val.length > 0 && isValidPhone(val)) || '핸드폰 번호를 형식에 맞게 입력해주세요']"
        />

        <div class="button">
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
