<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { axios } from 'src/boot/axios'

const $q = useQuasar()
const $router = useRouter()

const email = ref(null)
const phone = ref(null)
const emailCheckResult = ref({})
const isSendMsg = ref(false)
const certMsg = ref(null)
const phoneCheckResult = ref({})

const isValidEmail = (val) => {
  const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i
  return email_regex.test(val)
}

const isValidPhone = (val) => {
  const phone_regex = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/
  return phone_regex.test(val)
}

const checkEmailDuplication = async () => {
  const result = await axios.get(`/member/check-email/${email.value}`)
  switch (result.data.code) {
    case '1000':
      if (result.data.isDuplicate) {
        emailCheckResult.value.isValid = false
        emailCheckResult.value.msg = '이미 사용 중인 이메일입니다.'
      } else {
        emailCheckResult.value.isValid = true
        emailCheckResult.value.msg = '사용 가능한 이메일입니다.'
      }
  }
}

const sendCertificationMsg = async () => {
  const result = await axios.post('/member/certification-msg', { phone: phone.value })
  switch (result.data.code) {
    case '1000':
      isSendMsg.value = true
  }
}

const checkCertification = async () => {
  console.log(certMsg.value)
  // const result = await axios.post('/member/certification-msg/check', { phone: phone.value, certMsg: certMsg.value })
  // switch (result.data.code) {
  //   case '1000':
  //   // isSendMsg.value = true
  // }
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
        <div class="email-input-group">
          <q-input filled v-model="email" label="이메일" :rules="[(val) => (val && val.length > 0 && isValidEmail(val)) || '이메일 형식에 맞게 입력해주세요']" />
          <q-btn @click="checkEmailDuplication" label="중복체크" color="primary" :disable="!isValidEmail(email)" />
        </div>
        <div class="email-check-result" v-if="emailCheckResult.msg">{{ emailCheckResult.msg }}</div>
        <div class="phone-input-group">
          <q-input
            filled
            v-model="phone"
            label="핸드폰번호"
            lazy-rules
            :rules="[(val) => (val && val.length > 0 && isValidPhone(val)) || '핸드폰 번호를 형식에 맞게 입력해주세요']"
          />
          <q-btn @click="sendCertificationMsg" label="인증문자 전송" color="primary" :disable="!isValidPhone(phone)" />
        </div>
        <div class="certification-input-group">
          <q-input :disable="!isSendMsg" filled v-model="certMsg" label="인증번호" />
          <q-btn @click="checkCertification" label="인증문자 확인" color="primary" :disable="!isSendMsg" />
        </div>
        <div class="phone-check-result" v-if="phoneCheckResult.msg">{{ phoneCheckResult.msg }}</div>

        <div class="button">
          <q-btn class="signup" label="가입하기" @click="signup" color="primary" :disable="!emailCheckResult.isValid || !isValidPhone(phone)" />
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
.email-input-group,
.phone-input-group,
.certification-input-group {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.email-input-group > .q-input,
.phone-input-group > .q-input,
.certification-input-group > .q-input {
  flex: 8;
  margin-right: 10px;
}

.email-check-result {
  margin-top: 0px;
  text-align: left;
  color: gray;
}
.button {
  margin-top: 50px;
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
