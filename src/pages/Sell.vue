<template >
  <div class="root">
      <div class="top-context">
        <div class="NFTInfor-box">
            <div class="title-box">
                <h3>Preview</h3>
            </div>
            <div class="picture-box"></div>

            <div class="desc-box">
                <div class="desc-left">
                    <p><span>Collection By </span><span class="owner">0x123......fff</span></p>
                    <strong><span>Collection #</span><span class="id">456</span></strong>
                </div>
                <div class="desc-right">
                    <p>Price</p>
                    <i class="el-icon-d-caret">
                        <span class="current-price"><strong> 0.22 </strong></span>
                    </i>
                </div>
            </div> 

            <div class="desc-box-bottom">
                <i class="el-icon-d-caret"></i>
            </div>
        </div>

        <div class="NFTSale-box">
            <div class="title-box">
                <h1>List Item for Sale</h1>
            </div>
            <div class="form-box">
                <el-form :label-position="labelPosition" ref="form" :model="form" label-width="80px" size="large">
                    
                    <el-form-item>
                        <div class="type-title-box">
                            <div class="type-title">
                                <strong><span>Type</span></strong>
                            </div>
                            <i class="el-icon-warning-outline"></i>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-radio-group v-model="form.radio" fill="#56dcf5">
                            <el-radio-button label="Fixed-Price">
                                <i class="el-icon-lock"></i>
                                <p>Fixed Price</p>
                            </el-radio-button>
                            <el-radio-button label="Timeed-Auction">
                                <i class="el-icon-unlock"></i>
                                <p>Timeed Auction</p>
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item>
                        <div class="type-title-box">
                            <div class="type-title">
                                <strong><span>Price</span></strong>
                            </div>
                            <i class="el-icon-warning-outline"></i>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-select v-model="form.token" placeholder="Token">
                            <el-option label="ETH" value="ETH"></el-option>
                        </el-select>
                        <el-input v-model="form.amount" placeholder="Amount"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <div class="type-title-box">
                            <div class="type-title">
                                <strong><span>Duration</span></strong>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="">
                        <el-date-picker
                            v-model="form.time"
                            type="datetimerange"
                            range-separator="To"
                            start-placeholder="Start Date and Time"
                            end-placeholder="End Date and Time">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item>
                        <div class="type-title-box">
                            <div class="type-title">
                                <strong><span>Sell as a Bundle</span></strong>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-switch 
                            v-model="form.bundle"
                            active-color="#56dcf5"></el-switch>
                    </el-form-item>


                    <el-form-item>
                        <div class="type-title-box">
                            <div class="type-title">
                                <strong><span>Reserve for Special Buyer</span></strong>
                                <p>This item can be purchased as soon as it's listed</p>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-switch 
                            v-model="form.reserve"
                            active-color="#56dcf5"></el-switch>
                    </el-form-item>

                    
                    <el-form-item>
                        <div class="type-title-box">
                            <div class="type-title">
                                <strong><span>Fees</span></strong>
                            </div>
                            <i class="el-icon-warning-outline"></i>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <div class="fees-box">
                            <div class="fee-desc">
                                <p>Service Fee</p>
                                <p>Creator Fee</p>
                            </div>
                            <div class="fee-fee">
                                <p>2.5%</p>
                                <p>5.0%</p>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">Complete Listing</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
      </div>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        labelPosition:'top',
        activeNames: ['1'],
        show:true,
        // TODO:用户登陆 + 用户拥有该 NFT，show = false
        //radio1:'Fixed-Price',
        options: [{
          value: '选项1',
          label: 'ETH'
        }],
        value: '',
        input:'',
        dateValue:'',
        timevalue1: new Date(2022, 4, 1, 17, 20),
        timevalue2: new Date(2022, 4, 1, 17, 21),
        sellAsBundelValue:false,
        resrveValue:false,
        form: {
          radio:'Fixed-Price',
          token: '',
          amount: '',       
          time: '',
          bundle: false,
          reserve: false
        }
      };
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
      onSubmit() {
        console.log('submit!');
      }
    },
  }
</script>
<style lang="scss" scoped>

    .root{
        margin-top: 2%;
        margin-left: 20%;
        margin-right: 20%;

        .NFTInfor-box {
              width: 35%;
              float: right;
            .picture-box {
                border-top-right-radius: 10px;
                border-top-left-radius: 10px;
                height: 380px;
                width: 100%;
                border: 1.5px inset rgb(162, 139, 245);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-image: url("https://lh3.googleusercontent.com/UMOy3Fzgia8dTXu85F8wha1b7JJO_cZcAG_TWUj_LfHfIAcKJwijZU_VPlu5Rx7nU3f-fOarY8VVSP2YQyVWyHOR3SHKckymhQgU=w600");
            }
            .desc-box {
                width: 94%;
                height: 40px;
                border: 1.5px inset rgb(162, 139, 245);
                border-top: none;
                border-bottom: none;
                padding: 3%;
                .desc-left {
                    float: left;
                }
                .desc-right {
                    float: right;
                }
            }
            .desc-box-bottom {
                width: 96%;
                height: 20px;
                padding: 2%;
                border: 1.5px inset rgb(162, 139, 245);
                border-bottom-right-radius: 10px;
                border-bottom-left-radius: 10px;
            }
        }
        .NFTSale-box {
            width: 65%;
            float: right;
            .form-box {
                width: 90%;

                .el-form-item{
                    margin-bottom: 0px;
                    .el-button {
                        color: white;
                        border: 0;
                        background: -webkit-linear-gradient(left, #49e4f5, #d049f5);
                    }
                }

                .type-title-box{
                    width: 100%;
                    .type-title {
                        float: left;
                    }
                    .el-icon-warning-outline{
                        float: right;
                    } 
                }
                .fees-box {
                    width: 100%;
                    .fee-desc {
                        float: left;
                    }
                    .fee-fee {
                        float: right;
                    }
                }
            }
            
        }
        
    }

    

    

</style>