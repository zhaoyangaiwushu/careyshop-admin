<template>
  <div class="cs-page-cover">
    <div class="cs-page-cover__logo">
      <slot/>
    </div>
    <p class="cs-page-cover__title">{{title}}</p>
    <p class="cs-page-cover__sub-title cs-mt-0">{{subTitle}} {{$version}}</p>
    <p class="cs-page-cover__contact">
      <span class="cs-pr-10">CareyShop 交流群（QQ）：<span class="link" @click="$open('shang.qq.com/wpa/qunwpa?idkey=3fe095a4a8c53953990860f53bbef1145f8c85658a55a0539066fd6d4f153417')">714593455</span></span>
      <span>咨询QQ ：<span class="link" @click="$open('wpa.qq.com/msgrd?v=3&uin=252404501&site=qq&menu=yes')">252404501</span></span>
    </p>
    <slot name="footer"/>
    <p class="cs-page-cover__build-time">Build：{{$buildTime}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: 'Title'
    },
    subTitle: {
      type: String,
      required: false,
      default: 'subTitle'
    }
  }
}
</script>

<style lang="scss" scoped>
  .cs-page-cover {
    @extend %full;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    .cs-page-cover__logo {
      img {
        width: 200px;
      }
    }

    .cs-page-cover__title {
      color: $color-text-main;
    }

    .cs-page-cover__sub-title {
      font-size: 18px;
      color: $color-text-sub;
    }

    .cs-page-cover__build-time {
      font-size: 12px;
      line-height: 12px;
      color: $color-text-placehoder;
    }

    .cs-page-cover__contact {
      margin: 0 0 10px;
      font-size: 13px;
      color: $color-info;

      .link {
        &:hover {
          color: $color-primary;
          cursor: pointer;
        }
      }
    }
  }
</style>
