<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { axios } from 'src/boot/axios'
const $q = useQuasar()
const $router = useRouter()

const email = ref(null)
const phone = ref(null)

const onSubmit = async () => {
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
        $router.push({ name: 'Bookmarks' })

        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '로그인 성공'
        })

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
  <div>
    <h1>로그인 및 회원가입</h1>
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input filled v-model="email" label="이메일" lazy-rules :rules="[(val) => (val && val.length > 0) || '이메일을 입력하세요']" />

        <q-input filled v-model="phone" label="핸드폰번호" lazy-rules :rules="[(val) => (val && val.length > 0) || '핸드폰번호를 입력하세요']" />

        <div>
          <q-btn label="로그인 및 회원가입" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<style></style>
