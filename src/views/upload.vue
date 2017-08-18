<style scoped>
.product {
    margin-top: 10px;
}
</style>

<template>
    <div class="content">
        <h2>产品发布</h2>
        <Input v-model="productName" placeholder="产品名称" class="product"></Input>
        <Input v-model="productIntro" placeholder="产品简介" class="product"></Input>
        <Input v-model="productPrice" placeholder="产品价格" class="product"></Input>
        <Select v-model="productTypeSelected" class="product" placeholder="请选择产品类型">
            <Option v-for="item in productTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <image-upload class="product" @send-image="getImageArray" :uploadList="imageArray"></image-upload>
        
            <rich-editor class="product" :richContent="richItem"  @send-text="getRichTextArray"></rich-editor>

    
        <Button type="success" long @click="submitData" class="product">确认提交</Button>
    </div>
</template>

<script>
import imageUpload from './imageUpload'
import network from '../tools/network.js'
import richEditor from './richEditor'
export default {
    components: {
        imageUpload,
        richEditor,
    },
    data() {
        return {
            richItem: { content: '', placeHolder: "产品介绍" },
            productId: '',
            //产品名称
            productName: '',
            productPrice: '',
            productIntro:'',
            productTypes: [
            ],
            productTypeSelected: 0,
            imageArray: [],

        }
    },
    created() {
        var _self = this
        _self.productId = this.$route.params.productId
        network.getThemelist().then(data=>{
            _self.productTypes = data.map(obj=>{

                return {
                    value:obj.attributes.type,
                    label:obj.attributes.brief,
                }
            })
        })
        if (_self.productId == 'new') {
            return
        }
        network.getProductDetail('Product',_self.productId).then((data)=>{
            let dataAttr = data.attributes
            _self.productName = dataAttr.name
            _self.productPrice = dataAttr.price
            _self.productTypeSelected = dataAttr.typeSelected
            _self.productIntro = dataAttr.briefIntro
            _self.richItem.content = dataAttr.detailContent
            _self.imageArray = dataAttr.imageArray
           
        },(error)=>{
            _self.$Message.error('获取数据失败')
        })
    },
    methods: {
        getRichTextArray(data) {
            this.richItem.content = data.content
        },
        getImageArray(data) {
            this.imageArray = data
        },
        submitData() {
            var _self = this
            var dict = {
                name: _self.productName,
                price: _self.productPrice,
                imageArray: _self.imageArray,
                detailContent: _self.richItem.content,
                briefIntro:_self.productIntro,
                type:_self.productTypes[_self.productTypeSelected-1].label,
                typeSelected:_self.productTypeSelected
            }

             network.uploadProduct(dict,_self.productId).then((data)=>{
                _self.$Message.success('保存成功')
                setTimeout(function(){
                _self.$router.go(0)
                },500)
             },(error)=>{

             })


        }
    }
}
</script>


