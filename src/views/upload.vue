<style scoped>
.product {
    margin-top: 10px;
}
.myAlert{
    margin-top:30px;
}
.imageUpload{
    margin-bottom: 30px
}
</style>

<template>
    <div class="content">
        <h2>产品发布</h2>
        <Input v-model="productNumber" placeholder="" class="product">
        <span slot="prepend">产品编号</span>
        </Input>
        <Input v-model="productName" placeholder="" class="product">
        <span slot="prepend">产品名称</span>
        </Input>
        <Input v-model="productPlace" placeholder="" class="product">
        <span slot="prepend">产品关键词</span>
        </Input>
        <Input v-model="productPrice" placeholder="" class="product">
        <span slot="prepend">产品价格</span></Input>
        <Input v-model="productDes" placeholder="" class="product">
        <span slot="prepend">产品描述</span>
        </Input>
        <Input v-model="productStartDate" placeholder="" class="product" >
        <span slot="prepend">生产时间</span>
        </Input>
    
        <Select v-model="productTypeSelected" class="product" placeholder="请选择产品类型">
            <Option v-for="item in productTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Alert  class="myAlert" type="warning">产品详情滚动图（至少传一张)</Alert>
        <image-upload class="product imageUpload" @send-image="getImageArray" :uploadList="imageArray">
           
        </image-upload>
        <div v-for="(richItem, index) in richItems" class="myProduct" :key="index">
            <Alert>{{richItem.placeHolder}}</Alert>
             <rich-editor class="product" :richContent="richItem" :richIndex="index" @send-text="getRichTextArray"></rich-editor>
        </div>
    
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
            richItems: [{ content: '', placeHolder: "产品特色" }, { content: '', placeHolder: "产品参数" }, { content: '', placeHolder: "详细介绍" }, { content: '', placeHolder: "注意事项" },],
           
            productId: '',
            //产品编号
            productNumber: '',
            //产品名称
            productName: '',
            //产品描述
            productDes: '',
            //产品价格
            productPrice: '',
            // 出发城市
            productPlace: '',
            productStartDate: '',
            productEndDate: '',
            //日期格式设置
            dateOption1: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000
                }
            },
            dateOption2: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000
                }
            },
            productTypes: [{
                value: 1,
                label: '巴厘岛'
            },
            {
                value: 2,
                label: '沙巴岛'
            },
            {
                value: 3,
                label: '芽庄'
            },
            {
                value: 4,
                label: '马尔代夫'
            },
            {
                value: 5,
                label: '普吉岛'
            },
            {
                value: 6,
                label: '长滩岛'
            },
            {
                value: 7,
                label: '帕劳'
            },
            {
                value: 8,
                label: '大溪地'
            },
            {
                value: 9,
                label: '苏梅岛'
            }
            ],
            productTypeSelected: '',
            imageArray: [],

        }
    },
    created() {
        var _self = this
        _self.productId = this.$route.params.productId
        network.getThemelist().then(data=>{
            if(data.length) {
                _self.productTypes = []
                data.forEach(obj=>{
                    _self.productTypes.push({label:obj.attributes.name,value:obj.attributes.type})
                })
            }
        })
        network.getTodoDetail(_self.productId, 'Product', (data) => {
            _self.richItems = data.detailContent
            _self.productNumber = data.onleyId
            _self.productPlace = data.place
            _self.productDes = data.describe
            _self.productName = data.name
            _self.productPrice = data.price
            _self.imageArray = data.imageArray
            _self.productStartDate = data.startDate

            // _self.productEndDate = data.endDate
            _self.productTypeSelected = data.type
        }, (error) => {
            _self.$Message.error('获取信息失败,请重试')
        })
    },
    methods: {
        getRichTextArray(data) {
            this.richItems[data.index].content = data.content
        },
        getImageArray(data) {
            this.imageArray = data
        },
        submitData() {
            var _self = this
            var dict = {
                startDate: _self.productStartDate,
                // endDate: _self.productEndDate,
                name: _self.productName,
                describe: _self.productDes,
                type: _self.productTypeSelected,
                place: _self.productPlace,
                onleyId: _self.productNumber,
                price: _self.productPrice,
                imageArray: _self.imageArray,
                detailContent: _self.richItems
            }
            if (!this.imageArray.length) {
                _self.$Message.error('请上传图片至少一张');
            }
            network.uploadProdut(_self.productId, dict, function () {
                _self.$Message.success('保存成功');
                setTimeout(function () {
                    _self.$router.go(0)
                }, 1000)
            })
        }
    }
}
</script>


