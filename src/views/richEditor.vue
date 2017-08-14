<style>

</style>
<template>
  <div>
  
     <quill-editor ref="richContent"
                    :options="editorOption"
                    v-model="richContent.content"
                    @change="richTextChange"
                      >
        </quill-editor>
  </div>
</template>
<script>
import quillEditor from 'vue-quill-editor'

export default {
    props:['richContent','richIndex'],
    data() {
      return {
        editorOption: {
          placeholder: this.richContent.placeHolder,
          imageImport: true,
            imageResize: {
              displaySize: true
            }
       
        },
        // content:this.richContent.content,
      }
    },
    created(){
      
    },
    watch:{
        richContent(newVal,oldVal){
            this.content = newVal
        }
    },
    methods: {
      richTextChange(editor, html, text){
        
         this.$emit('send-text',{'content':this.richContent.content})
      },
    },
    computed: {
      editor() {
        return this.$refs.firstEditor.quill
      },

    },
    mounted() {
      
    }
}
</script>

