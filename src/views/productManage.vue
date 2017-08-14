<style scoped>

</style>
<template>
    <div class="content">
        <Table height="500" :columns="columns" :data="dataArray"></Table>
        <Modal v-model="modal1" title="删除操作" @on-ok="removeProdcut">
            <p>确认将名称为{{productNumber}}的产品删除吗</p>
        </Modal>
    
    </div>
</template>
<script>
import network from '../tools/network.js'
export default {
    data() {
        return {
            uid: '',
            productNumber: '',
            modal1: false,
            columns: [
                {
                    title: '名称',
                    key: 'name'
                },
                {
                    title: '品牌',
                    key: 'type'
                },
                {
                    title: '价格',
                    key: 'price'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.modfifyProduct(params)
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.deleteProduct(params)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            dataArray: [],
        }
    },
    created() {
        this.configData()
    },
    methods: {
        configData() {
            var _self = this
            network.getProductList().then((response) => {
                if (response.length) {
                    response.forEach(function (obj) {
                        let objAttr = obj.attributes
                        let dict = {
                            'name': objAttr.name,
                            'price': objAttr.price,
                            'type': objAttr.type,
                            'uid': obj.id
                        }
                        _self.dataArray.push(dict)
                    }, this);
                }
            }, (error) => {
                _self.$Message.error('获取数据失败')
            })
        },
        //修改
        modfifyProduct(params) {
            let productId = params.row.uid
            this.$router.push({ name: 'upload', params: { 'productId': productId } })
        },
        //删除
        deleteProduct(params) {

            this.modal1 = true
            this.productNumber = params.row.name
            this.uid = params.row.uid
        },
        removeProdcut(uid) {
            var _self = this
            network.deleteProductWithId(this.uid).then((data) => {
                _self.$Message.success('删除成功')
                _self.configData()
            }, () => {
                _self.$Message.error('删除失败')
            })
        },
    },

}    
</script>