<template>
  <div class="scada-entry">
    <img class="app-logo" :src="'./images/icons/ic-main-logo.png'"/>
    <el-form label-width="80px" class="entry-form">
      <el-form-item label="name">
        <el-input v-model="visName" placeholder="资源名称"></el-input>
      </el-form-item>
      <el-form-item label="id">
        <el-input v-model="visId" :controls=false :min="0" label="资源id"/>
      </el-form-item>
      <el-form-item label="uid">
        <el-input-number v-model="userId" :controls=false :min="0" label="用户id"/>
      </el-form-item>
      <el-form-item label="pid">
        <el-input-number v-model="groupId" :controls=false :min="0" label="资源组id"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="enter()" style="width: 120px">ENTER</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        visName: '新组态图',
        visId: '0',
        userId: 0,
        groupId: 1
      }
    },
    name: 'entry',
    methods: {
      enter() {
        // this.$router.push({ name: 'scadaEditor', params: { name: this.visName, id: this.visId } })
        this.$router.push({
          name: 'scadaEditor',
          params: { id: this.visId },
          query: { name: this.visName, uid: this.userId, pid: this.groupId }
        })
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
  .scada-entry {
    .app-logo {
      width: 128px;
      height: 128px;
    }
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .entry-form {
      .el-form-item__label {
        color: #EEE;
      }
      width: 260px;
      margin: 20px 20px 0 20px;
    }
  }
</style>

