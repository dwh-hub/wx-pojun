<template>
  <el-upload :on-change="fileChange"></el-upload>
</template>

<script>
export default {
  data() {
    return {
      files: [] //要上传的文件对象
    };
  },
  methods: {
    fileChange(file) {
      this.files.push(file.raw); //上传文件变化时将文件对象push进files数组
    },
    upload() {
      let formData = new FormData();
      formData.append("files", this.files);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      axios.post(uploadUrl, formData, config).then(res => {
        if (res.code === 0) {
          this.submitForm(); //提交表单
        }
      });
    }
  }
};
</script>

   
