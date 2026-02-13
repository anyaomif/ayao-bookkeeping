<template>
  <view class="ay-tabbar" v-show="visible" :class="{ 
    'is-float': isFloat,
    'is-frosted': frosted 
  }">
    <view class="tabbar-content" :class="{ 'is-frosted': frosted }">
      <view 
        v-for="(item, index) in tabList" 
        :key="index"
        class="tab-item"
        :class="{ 
          active: currentTab === index,
          'text-only': textOnly 
        }"
        @click="switchTab(index)"
      >
        <view class="icon-box" v-if="!textOnly">
          <image class="image" :src="currentTab === index ? item.selectedIconPath : item.iconPath" mode="aspectFit"></image>
        </view>
        <text class="tab-text" :class="{ 'text-only': textOnly }">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ay-tabbar',
  props: {
    currentTab: {
      type: Number,
      default: 0
    },
    isFloat: {
      type: Boolean,
      default: false
    },
    textOnly: {
      type: Boolean,
      default: false
    },
    frosted: {
      type: Boolean,
      default: false
    },
    // 模式：work(工地) / personal(个人记账)
    mode: {
      type: String,
      default: 'work'
    }
  },
  data() {
    return {
      visible: true,
      currentMode: 'work',
      workTabList: [
        {
          text: '首页',
          iconPath: '/static/tabbar/home.png',
          selectedIconPath: '/static/tabbar/home-active.png',
          pagePath: '/pages/index/index'
        },
        {
          text: '统计',
          iconPath: '/static/tabbar/stats.png',
          selectedIconPath: '/static/tabbar/stats-active.png',
          pagePath: '/pages/stats/stats'
        },
        {
          text: '我的',
          iconPath: '/static/tabbar/user.png',
          selectedIconPath: '/static/tabbar/user-active.png',
          pagePath: '/pages/person/person'
        }
      ],
      personalTabList: [
        {
          text: '首页',
          iconPath: '/static/tabbar/home.png',
          selectedIconPath: '/static/tabbar/home-active.png',
          pagePath: '/pages/personal/dashboard'
        },
        {
          text: '明细',
          iconPath: '/static/tabbar/stats.png',
          selectedIconPath: '/static/tabbar/stats-active.png',
          pagePath: '/pages/personal/detail'
        },
        {
          text: '我的',
          iconPath: '/static/tabbar/user.png',
          selectedIconPath: '/static/tabbar/user-active.png',
          pagePath: '/pages/person/person'
        }
      ]
    }
  },
  watch: {
    mode(val) {
      this.currentMode = val;
    }
  },
  computed: {
    tabList() {
      return this.currentMode === 'personal' ? this.personalTabList : this.workTabList;
    }
  },
  methods: {
    switchTab(index) {
      this.$emit('update:currentTab', index)
      const url = this.tabList[index].pagePath;
      if (this.currentMode === 'personal') {
        uni.reLaunch({ url });
      } else {
        uni.switchTab({ url });
      }
    },
    loadMode() {
      this.currentMode = uni.getStorageSync('app_mode') || 'work';
    }
  },
  mounted() {
    this.loadMode();
    uni.$on('toggleTabbar', (show) => {
      this.visible = show
    })
  },
  activated() {
    this.loadMode();
  },
  beforeUnmount() {
    uni.$off('toggleTabbar')
  }
}
</script>

<style lang="scss" scoped>
.ay-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  z-index: 999;
  
  &.is-float {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    
    .tabbar-content {
      border-radius: 30px;
      margin: 0 10px;
    }
  }

  &.is-frosted {
    .tabbar-content {
      background-color: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
  }
  
  .tabbar-content {
    background-color: #ffffff;
    padding: 8px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &.is-frosted {
      .tab-item {
        .tab-text {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        &.active {
          .tab-text {
            text-shadow: 0 1px 3px rgba(255, 103, 0, 0.3);
          }
        }
      }
    }
  }
  
  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4px 0;
    
    &.active {
      .tab-text {
        color: #ff6700;
        font-weight: bold;
      }
    }
    
    &.text-only {
      padding: 8px;
    }
    
    .icon-box {
      width: 24px;
      height: 24px;
      margin-bottom: 4px;
      
      .image {
        width: 100%;
        height: 100%;
      }
    }
    
    .tab-text {
      font-size: 12px;
      color: #666;
      transition: all 0.3s ease;
      
      &.text-only {
        font-size: 14px;
      }
    }
  }
}
</style> 