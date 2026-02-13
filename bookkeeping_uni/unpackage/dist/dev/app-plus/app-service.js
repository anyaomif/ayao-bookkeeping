if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  const ON_SHOW = "onShow";
  const ON_LOAD = "onLoad";
  const ON_READY = "onReady";
  const ON_REACH_BOTTOM = "onReachBottom";
  const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom2) {
    return typeof component === "string" ? easycom2 : component;
  }
  const createLifeCycleHook = (lifecycle, flag = 0) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createLifeCycleHook(
    ON_SHOW,
    1 | 2
    /* HookFlags.PAGE */
  );
  const onLoad = /* @__PURE__ */ createLifeCycleHook(
    ON_LOAD,
    2
    /* HookFlags.PAGE */
  );
  const onReady = /* @__PURE__ */ createLifeCycleHook(
    ON_READY,
    2
    /* HookFlags.PAGE */
  );
  const onReachBottom = /* @__PURE__ */ createLifeCycleHook(
    ON_REACH_BOTTOM,
    2
    /* HookFlags.PAGE */
  );
  const onPullDownRefresh = /* @__PURE__ */ createLifeCycleHook(
    ON_PULL_DOWN_REFRESH,
    2
    /* HookFlags.PAGE */
  );
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$z = {
    name: "ay-tabbar",
    props: {
      // 当前选中的tab索引
      currentTab: {
        type: Number,
        default: 0
      },
      // 是否悬浮
      isFloat: {
        type: Boolean,
        default: false
      },
      // 是否仅显示文字
      textOnly: {
        type: Boolean,
        default: false
      },
      // 是否启用毛玻璃效果
      frosted: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        tabList: [
          {
            text: "首页",
            iconPath: "/static/tabbar/home.png",
            selectedIconPath: "/static/tabbar/home-active.png",
            pagePath: "/pages/index/index"
          },
          {
            text: "统计",
            iconPath: "/static/tabbar/stats.png",
            selectedIconPath: "/static/tabbar/stats-active.png",
            pagePath: "/pages/stats/stats"
          },
          {
            text: "我的",
            iconPath: "/static/tabbar/user.png",
            selectedIconPath: "/static/tabbar/user-active.png",
            pagePath: "/pages/person/person"
          }
        ]
      };
    },
    methods: {
      switchTab(index) {
        this.$emit("update:currentTab", index);
        uni.switchTab({
          url: this.tabList[index].pagePath
        });
      }
    }
  };
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ay-tabbar", {
          "is-float": $props.isFloat,
          "is-frosted": $props.frosted
        }])
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tabbar-content", { "is-frosted": $props.frosted }])
          },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.tabList, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: vue.normalizeClass(["tab-item", {
                    active: $props.currentTab === index,
                    "text-only": $props.textOnly
                  }]),
                  onClick: ($event) => $options.switchTab(index)
                }, [
                  !$props.textOnly ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "icon-box"
                  }, [
                    vue.createElementVNode("image", {
                      class: "image",
                      src: $props.currentTab === index ? item.selectedIconPath : item.iconPath,
                      mode: "aspectFit"
                    }, null, 8, ["src"])
                  ])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["tab-text", { "text-only": $props.textOnly }])
                    },
                    vue.toDisplayString(item.text),
                    3
                    /* TEXT, CLASS */
                  )
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          2
          /* CLASS */
        )
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$y], ["__scopeId", "data-v-c54f9412"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-tabbar/ay-tabbar.vue"]]);
  function fromPairs(pairs) {
    const result = {};
    if (pairs == null) {
      return result;
    }
    for (const pair of pairs) {
      result[pair[0]] = pair[1];
    }
    return result;
  }
  const symbolProto = Symbol ? Symbol.prototype : void 0;
  symbolProto ? symbolProto.toString : void 0;
  const isEmpty = (val) => !val && val !== 0 || shared.isArray(val) && val.length === 0 || shared.isObject(val) && !Object.keys(val).length;
  const tnPropKey = "__tnPropKey";
  const definePropType = (val) => val;
  const isTnProp = (val) => shared.isObject(val) && !!val[tnPropKey];
  const buildProp = (prop, key) => {
    if (!shared.isObject(prop) || isTnProp(prop))
      return prop;
    const { values, required, default: defaultValue, type, validator } = prop;
    const _validator = values || validator ? (val) => {
      let valid = false;
      let allowedValues = [];
      if (values) {
        allowedValues = Array.from(values);
        if (shared.hasOwn(prop, "default")) {
          allowedValues.push(defaultValue);
        }
        valid || (valid = allowedValues.includes(val));
      }
      if (validator)
        valid || (valid = validator(val));
      if (!valid && allowedValues.length > 0) {
        const allowValuesText = [...new Set(allowedValues)].map((value) => JSON.stringify(value)).join(", ");
        vue.warn(
          `Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(
            val
          )}.`
        );
      }
      return valid;
    } : void 0;
    const tnProp = {
      type,
      required: !!required,
      validator: _validator,
      [tnPropKey]: true
    };
    if (shared.hasOwn(prop, "default"))
      tnProp.default = defaultValue;
    return tnProp;
  };
  const buildProps = (props) => fromPairs(
    Object.entries(props).map(([key, option]) => [
      key,
      buildProp(option, key)
    ])
  );
  const iconPropType = definePropType([String]);
  const formatDomSizeValue = (value, unit = "rpx", empty = true) => {
    if (!value)
      return empty ? "" : `0${unit}`;
    if (shared.isString(value) && /(^calc)|(%|vw|vh|px|rpx|auto)$/.test(value))
      return value;
    return `${value}${unit}`;
  };
  const generateId = () => Math.floor(Math.random() * 1e4);
  const componentSizes = ["", "sm", "lg", "xl"];
  const formComponentSizes = ["", "sm", "lg"];
  const componentImgModes = [
    "scaleToFill",
    "aspectFit",
    "aspectFill",
    "widthFix",
    "heightFix",
    "top",
    "bottom",
    "center",
    "left",
    "right",
    "top left",
    "top right",
    "bottom left",
    "bottom right"
  ];
  const componentTypes = [
    "",
    "primary",
    "success",
    "warning",
    "danger",
    "info"
  ];
  buildProp({
    type: [Boolean, void 0],
    default: void 0
  });
  buildProp({
    type: String,
    values: componentSizes,
    required: false
  });
  buildProp({
    type: String,
    values: formComponentSizes,
    required: false
  });
  const useComponentCustomStyleProp = buildProp({
    type: Object,
    default: () => ({})
  });
  buildProp({
    type: definePropType([String, Number]),
    default: () => generateId()
  });
  buildProp({
    type: Boolean,
    default: true
  });
  const iconProps = buildProps({
    /**
     * @description 图标名称，支持图鸟内置图标和图片地址(只支持绝对路径)
     */
    name: {
      type: iconPropType,
      required: true
    },
    /**
     * @description 图标颜色类型
     */
    type: {
      type: String,
      values: componentTypes,
      default: ""
    },
    /**
     * @description 图标颜色, 以tn开头则使用图鸟内置的颜色
     */
    color: String,
    /**
     * @description 图标大小
     */
    size: {
      type: [String, Number]
    },
    /**
     * @description 图标加粗
     */
    bold: Boolean,
    /**
     * @description 图标是否为透明
     */
    transparent: Boolean,
    /**
     * @description 透明图标背景
     */
    transparentBg: String,
    /**
     * @description 图片模式，当name为图片地址时生效
     */
    imgMode: {
      type: String,
      values: componentImgModes,
      default: "aspectFill"
    },
    /**
     * @description 垂直方向上的偏移量
     */
    offsetTop: {
      type: [String, Number]
    },
    /**
     * @description 自定义样式
     */
    customStyle: useComponentCustomStyleProp,
    /**
     * @description 自定义类
     */
    customClass: String
  });
  const iconEmits = {
    /**
     * @description 点击图标时触发
     */
    click: () => true
  };
  const defaultNamespace = "tn";
  const _bem = (namespace, block, blockSuffix, element, modifier) => {
    let cls = `${namespace}-${block}`;
    if (blockSuffix) {
      cls += `-${blockSuffix}`;
    }
    if (element) {
      cls += `__${element}`;
    }
    if (modifier) {
      cls += `--${modifier}`;
    }
    return cls;
  };
  const namespaceContextKey = Symbol("localContextKey");
  const useGetDerivedNamespace = () => {
    const derivedNamespace = vue.inject(namespaceContextKey, vue.ref(defaultNamespace));
    const namespace = vue.computed(() => {
      return vue.unref(derivedNamespace) || defaultNamespace;
    });
    return namespace;
  };
  const useNamespace = (block) => {
    const namespace = useGetDerivedNamespace();
    const b2 = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
    const e2 = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
    const m2 = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
    const be2 = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
    const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
    const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
    const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
    const is2 = (name, ...args) => {
      const state = args.length >= 1 ? args[0] : true;
      return name && state ? `is-${name}` : "";
    };
    const cssVar = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarBlock = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${block}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarName = (name) => `--${namespace.value}-${name}`;
    const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
    return {
      namespace,
      b: b2,
      e: e2,
      m: m2,
      be: be2,
      em,
      bm,
      bem,
      is: is2,
      // css
      cssVar,
      cssVarName,
      cssVarBlock,
      cssVarBlockName
    };
  };
  const useComponentColor = (prop, type = "") => {
    const classColor = vue.ref("");
    const styleColor = vue.ref("");
    const innerColorReg = /^(tn-|gradient)/;
    const styleColorReg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{3})$|^rgb\(\d{1,3}(,\s?\d{1,3}){2}\)$|^rgba\(\d{1,3}(,\s?\d{1,3}){2},\s?0?\.?\d{1,}\)|transparent/i;
    const handleColorValue = (value) => {
      classColor.value = "";
      styleColor.value = "";
      if (value === void 0)
        return;
      if (innerColorReg.test(value)) {
        if (type === "bg" && /.*gradient.*/.test(value)) {
          const gradientValue = value.split("__")[1];
          classColor.value = `tn-gradient-bg__${gradientValue}`;
          return;
        }
        classColor.value = `${value}_${type}`;
      }
      if (styleColorReg.test(value)) {
        styleColor.value = value;
      }
    };
    handleColorValue(prop.value);
    vue.watch(
      () => prop.value,
      (val) => {
        handleColorValue(val);
      }
    );
    const updateColor = (value) => {
      handleColorValue(value);
    };
    return [classColor, styleColor, updateColor];
  };
  const useComponentSize = (size) => {
    const sizeType = vue.computed(() => {
      if (!size)
        return "none";
      return componentSizes.includes(size) ? "inner" : "custom";
    });
    return {
      sizeType
    };
  };
  const useIcon = (props) => {
    const ns2 = useNamespace("icon");
    const [colorClass, colorStyle, updateColor] = useComponentColor(
      vue.toRef(props, "color"),
      "text"
    );
    const [transparentBgClass] = useComponentColor(vue.toRef(props, "transparentBg"), "bg");
    const { sizeType } = useComponentSize(props.size);
    const isImg = vue.computed(
      () => !!(props == null ? void 0 : props.name) && props.name.includes("/")
    );
    const iconClass = vue.computed(() => {
      const cls = [];
      cls.push(ns2.b());
      if (isImg.value) {
        cls.push(ns2.m("image"));
      } else {
        if (props.type)
          cls.push(`tn-type-${props.type}_text`);
        if (props.transparent) {
          cls.push("tn-text-transparent", transparentBgClass.value);
        } else {
          if (colorClass.value)
            cls.push(colorClass.value);
        }
        if (props.bold)
          cls.push("tn-text-bold");
      }
      if (sizeType.value === "inner")
        cls.push(ns2.m(props.size));
      if (props.customClass)
        cls.push(props.customClass);
      return cls.join(" ");
    });
    const iconStyle = vue.computed(() => {
      const style = {};
      if (isImg.value) {
        if (sizeType.value === "custom" && props.size) {
          style.width = style.height = formatDomSizeValue(props.size);
        }
      } else {
        if (colorStyle.value)
          style.color = colorStyle.value;
        if (sizeType.value === "custom" && props.size)
          style.fontSize = formatDomSizeValue(props.size);
      }
      if (props.offsetTop)
        style.transform = `translateY(${formatDomSizeValue(props.offsetTop)})`;
      if (!isEmpty(props.customStyle))
        Object.assign(style, props.customStyle);
      return style;
    });
    return {
      isImg,
      iconClass,
      iconStyle,
      updateColor
    };
  };
  const _sfc_main$y = /* @__PURE__ */ vue.defineComponent({
    __name: "icon",
    props: iconProps,
    emits: iconEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emits = __emit;
      const { isImg, iconClass, iconStyle } = useIcon(props);
      const handleClick = () => {
        emits("click");
      };
      const __returned__ = { props, emits, isImg, iconClass, iconStyle, handleClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass([$setup.iconClass]),
        style: vue.normalizeStyle($setup.iconStyle),
        onClick: $setup.handleClick
      },
      [
        vue.createCommentVNode(" 图片图标 "),
        $setup.isImg ? (vue.openBlock(), vue.createElementBlock("image", {
          key: 0,
          class: "image",
          src: _ctx.name,
          mode: _ctx.imgMode
        }, null, 8, ["src", "mode"])) : (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 1 },
          [
            vue.createCommentVNode(" 正常图标 "),
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass(["icon", `tn-icon-${_ctx.name}`])
              },
              null,
              2
              /* CLASS */
            )
          ],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        ))
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$x], ["__scopeId", "data-v-bcc701d5"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue"]]);
  const _sfc_main$x = {
    name: "ay-title",
    props: {
      // 标题文本
      title: {
        type: String,
        default: ""
      },
      // 标题模式：normal-普通模式，line-带竖线模式，border-带边框模式
      mode: {
        type: String,
        default: "line",
        validator: (value) => ["normal", "line", "border"].includes(value)
      },
      // 对齐方式
      align: {
        type: String,
        default: "left",
        validator: (value) => ["left", "center", "right"].includes(value)
      },
      // 是否显示底部边框
      border: {
        type: Boolean,
        default: false
      },
      // 文字是否加粗
      bold: {
        type: Boolean,
        default: false
      },
      // 标题颜色
      color: {
        type: String,
        default: "#333"
      },
      // 竖线颜色
      line_color: {
        type: String,
        default: "#ff6700"
      },
      // 标题大小
      size: {
        type: [String, Number],
        default: "32rpx"
      },
      // 上下间距
      padding: {
        type: String,
        default: "20rpx"
      },
      // 左右间距
      margin: {
        type: String,
        default: "20rpx"
      }
    },
    computed: {
      // 内容区样式
      contentStyle() {
        return {
          padding: `${this.padding} ${this.margin}`,
          fontSize: this.size
        };
      }
    }
  };
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ay-title", [
          `ay-title--${$props.mode}`,
          `ay-title--align-${$props.align}`,
          {
            "ay-title--border": $props.border,
            "ay-title--bold": $props.bold
          }
        ]])
      },
      [
        vue.createCommentVNode(" 左侧内容区 "),
        vue.createElementVNode("view", { class: "ay-title__left" }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ]),
        vue.createCommentVNode(" 标题区 "),
        vue.createElementVNode(
          "view",
          {
            class: "ay-title__content",
            style: vue.normalizeStyle($options.contentStyle)
          },
          [
            vue.createCommentVNode(" 左侧装饰条 "),
            $props.mode === "line" ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "ay-title__line",
                style: vue.normalizeStyle({ backgroundColor: $props.line_color })
              },
              null,
              4
              /* STYLE */
            )) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 标题文本 "),
            vue.createElementVNode(
              "text",
              {
                class: "ay-title__text",
                style: vue.normalizeStyle({ color: $props.color })
              },
              vue.toDisplayString($props.title),
              5
              /* TEXT, STYLE */
            )
          ],
          4
          /* STYLE */
        ),
        vue.createCommentVNode(" 右侧内容区 "),
        vue.createElementVNode("view", { class: "ay-title__right" }, [
          vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
        ])
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_2$2 = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$w], ["__scopeId", "data-v-817cb5cf"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-title/ay-title.vue"]]);
  const _sfc_main$w = {
    name: "NavbarWrapper",
    props: {
      // 导航栏模式
      mode: {
        type: String,
        default: "default",
        validator: (value) => ["default", "transparent", "custom"].includes(value)
      },
      // 背景颜色
      bgColor: {
        type: String,
        default: "#ffffff"
      },
      // 是否显示阴影
      shadow: {
        type: Boolean,
        default: false
      },
      // 是否启用毛玻璃效果
      frosted: {
        type: Boolean,
        default: false
      },
      // 自定义导航栏高度(不包括状态栏)
      height: {
        type: [String, Number],
        default: "44px"
      },
      // 是否需要右侧胶囊按钮的安全距离
      needCapsule: {
        type: Boolean,
        default: true
      },
      // z-index 层级
      zIndex: {
        type: Number,
        default: 100
      },
      // 是否固定在顶部
      sticky: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        statusBarHeight: 0,
        menuButtonInfo: null,
        rightSafeArea: 0
      };
    },
    computed: {
      // 包装器样式
      wrapperStyle() {
        const style = {
          paddingTop: this.statusBarHeight + "px",
          backgroundColor: this.mode === "transparent" ? "transparent" : this.bgColor,
          zIndex: this.zIndex
        };
        if (this.needCapsule) {
          style.paddingRight = this.rightSafeArea + "px";
        }
        if (this.height) {
          style.height = `calc(${this.height} + ${this.statusBarHeight}px)`;
        }
        if (this.sticky) {
          style.position = "sticky";
          style.top = 0;
        }
        return style;
      }
    },
    created() {
      this.initNavBarInfo();
    },
    methods: {
      // 初始化导航栏信息
      initNavBarInfo() {
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.statusBarHeight = systemInfo.statusBarHeight;
          this.rightSafeArea = 0;
          this.$emit("init", {
            statusBarHeight: this.statusBarHeight,
            menuButtonInfo: this.menuButtonInfo,
            rightSafeArea: this.rightSafeArea
          });
        } catch (error) {
          formatAppLog("error", "at components/NavbarWrapper/NavbarWrapper.vue:134", "获取导航栏信息失败:", error);
        }
      }
    }
  };
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["navbar-wrapper", [
          `navbar-wrapper--${$props.mode}`,
          {
            "navbar-wrapper--shadow": $props.shadow,
            "navbar-wrapper--frosted": $props.frosted
          }
        ]]),
        style: vue.normalizeStyle($options.wrapperStyle)
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_3$1 = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["__scopeId", "data-v-9650f7e1"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/NavbarWrapper/NavbarWrapper.vue"]]);
  const _sfc_main$v = {
    name: "AyTag",
    props: {
      // 标签文本（如果未提供插槽）
      text: {
        type: String,
        default: ""
      },
      // 标签类型/样式
      type: {
        type: String,
        default: "default",
        validator: (value) => ["default", "primary", "success", "warning", "danger"].includes(value)
      },
      // 标签尺寸
      size: {
        type: String,
        default: "medium",
        validator: (value) => ["small", "medium", "large"].includes(value)
      },
      // 标签形状
      shape: {
        type: String,
        default: "rectangle",
        validator: (value) => ["rectangle", "round", "circle"].includes(value)
      },
      // 是否可关闭
      closable: {
        type: Boolean,
        default: false
      },
      // 禁用交互
      disabled: {
        type: Boolean,
        default: false
      },
      // 字体大小
      fontSize: {
        type: [Number, String],
        default: 24
      },
      // 文字是否加粗
      bold: {
        type: Boolean,
        default: false
      },
      // 是否为镂空样式
      plain: {
        type: Boolean,
        default: false
      },
      // 添加自定义颜色属性
      color: {
        type: String,
        default: ""
      }
    },
    computed: {
      // 添加计算属性处理样式
      tagStyle() {
        const style = {
          fontSize: `${this.fontSize}rpx`
        };
        if (this.color) {
          if (this.plain) {
            style.color = this.color;
            style.borderColor = this.color;
            style.backgroundColor = "transparent";
          } else {
            style.color = "#ffffff";
            style.backgroundColor = this.color;
            style.borderColor = this.color;
          }
        }
        return style;
      }
    },
    methods: {
      // 处理标签点击事件
      handleClick(event) {
        if (!this.disabled) {
          this.$emit("click", event);
        }
      },
      // 处理标签关闭事件
      handleClose(event) {
        if (!this.disabled) {
          this.$emit("close", event);
        }
      }
    }
  };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ay-tag", [
          `ay-tag--${$props.type}`,
          `ay-tag--${$props.size}`,
          `ay-tag--${$props.shape}`,
          {
            "ay-tag--closable": $props.closable,
            "ay-tag--disabled": $props.disabled,
            "ay-tag--plain": $props.plain,
            "ay-tag--bold": $props.bold,
            "ay-tag--custom": $props.color
          }
        ]]),
        style: vue.normalizeStyle($options.tagStyle),
        onClick: _cache[1] || (_cache[1] = (...args) => $options.handleClick && $options.handleClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.createTextVNode(
            vue.toDisplayString($props.text),
            1
            /* TEXT */
          )
        ], true),
        $props.closable ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "ay-tag__close",
          onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.handleClose && $options.handleClose(...args), ["stop"]))
        }, " × ")) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_4$2 = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__scopeId", "data-v-b3913bf5"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-tag/ay-tag.vue"]]);
  const _sfc_main$u = {
    name: "ay-swiper-item",
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("swiper-item", null, [
      vue.createElementVNode("view", { class: "ay-swiper-item" }, [
        vue.renderSlot(_ctx.$slots, "default")
      ])
    ]);
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-swiper-item/ay-swiper-item.vue"]]);
  const _sfc_main$t = {
    name: "ay-swiper",
    props: {
      autoHight: {
        type: Boolean,
        default: false
      },
      autoPlay: {
        type: Boolean,
        default: false
      },
      interval: {
        type: Number,
        default: 3e3
      },
      duration: {
        type: Number,
        default: 500
      },
      circular: {
        type: Boolean,
        default: false
      },
      mode: {
        type: String,
        default: "dot"
      },
      indicator: {
        type: Boolean,
        default: true
      },
      indicatorColor: {
        type: String,
        default: "rgba(0, 0, 0, 0.2)"
      },
      indicatorActiveColor: {
        type: String,
        default: "rgba(0, 0, 0, 0.8)"
      },
      current: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        currentIndex: this.current,
        swiperHeight: 0,
        indicatorLength: 0
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.getSwiperHeight();
      });
    },
    computed: {
      swiperStyle() {
        return this.autoHight ? `height:${this.swiperHeight}px;` : "";
      }
    },
    methods: {
      getSwiperHeight() {
        const query = uni.createSelectorQuery().in(this);
        query.selectAll(".ay-swiper-item").boundingClientRect((data) => {
          var _a;
          this.indicatorLength = data.length;
          this.swiperHeight = ((_a = data[this.currentIndex]) == null ? void 0 : _a.height) || 100;
        }).exec();
      },
      changeSwiper(e2) {
        let current = e2.detail.current;
        this.currentIndex = current;
        this.getSwiperHeight();
        this.$emit("change", current);
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "ay-swiper-wrap" }, [
      vue.createElementVNode("swiper", {
        class: "ay-swiper",
        autoplay: $props.autoPlay,
        interval: $props.interval,
        duration: $props.duration,
        circular: $props.circular,
        style: vue.normalizeStyle($options.swiperStyle),
        current: $props.current,
        onChange: _cache[0] || (_cache[0] = (...args) => $options.changeSwiper && $options.changeSwiper(...args))
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 44, ["autoplay", "interval", "duration", "circular", "current"]),
      $props.indicator && $props.mode == "dot" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "ay-swiper-indicator"
      }, [
        (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(2, (i2, x) => {
            return vue.createElementVNode(
              "view",
              {
                class: "ay-indicator-item-dot",
                style: vue.normalizeStyle({
                  background: x === $data.currentIndex ? $props.indicatorActiveColor : $props.indicatorColor
                }),
                key: x
              },
              null,
              4
              /* STYLE */
            );
          }),
          64
          /* STABLE_FRAGMENT */
        ))
      ])) : vue.createCommentVNode("v-if", true),
      $props.indicator && $props.mode == "round" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "ay-swiper-indicator"
      }, [
        (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(2, (i2, x) => {
            return vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["ay-indicator-item-round", x == $data.currentIndex ? "ay-indicator-item-round-active" : ""]),
                style: vue.normalizeStyle({
                  background: x === $data.currentIndex ? $props.indicatorActiveColor : $props.indicatorColor
                }),
                key: x
              },
              null,
              6
              /* CLASS, STYLE */
            );
          }),
          64
          /* STABLE_FRAGMENT */
        ))
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-64f1e802"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-swiper/ay-swiper.vue"]]);
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var LunarCalendar = { exports: {} };
  (function(module, exports) {
    (function() {
      var extend = function(o2, c2) {
        if (o2 && c2 && typeof c2 == "object") {
          for (var p2 in c2) {
            o2[p2] = c2[p2];
          }
        }
        return o2;
      };
      var creatLenArr = function(year, month, len, start) {
        var arr = [];
        start = start || 0;
        if (len < 1)
          return arr;
        var k = start;
        for (var i2 = 0; i2 < len; i2++) {
          arr.push({ year, month, day: k });
          k++;
        }
        return arr;
      };
      var errorCode = {
        //错误码列表
        100: "输入的年份超过了可查询范围，仅支持1891至2100年",
        101: "参数输入错误，请查阅文档"
      };
      var cache = null;
      var cacheUtil = {
        //cache管理工具
        current: "",
        setCurrent: function(year) {
          if (this.current != year) {
            this.current = year;
            this.clear();
          }
        },
        set: function(key, value) {
          if (!cache)
            cache = {};
          cache[key] = value;
          return cache[key];
        },
        get: function(key) {
          if (!cache)
            cache = {};
          return cache[key];
        },
        clear: function() {
          cache = null;
        }
      };
      var formateDayD4 = function(month, day) {
        month = month + 1;
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        return "d" + month + day;
      };
      var minYear = 1890;
      var maxYear = 2100;
      var DATA = {
        heavenlyStems: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
        //天干
        earthlyBranches: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"],
        //地支
        zodiac: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
        //对应地支十二生肖
        solarTerm: ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"],
        //二十四节气
        monthCn: ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
        dateCn: ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十", "卅一"]
      };
      var worktime = {};
      worktime.y2013 = { "d0101": 2, "d0102": 2, "d0103": 2, "d0105": 1, "d0106": 1, "d0209": 2, "d0210": 2, "d0211": 2, "d0212": 2, "d0213": 2, "d0214": 2, "d0215": 2, "d0216": 1, "d0217": 1, "d0404": 2, "d0405": 2, "d0406": 2, "d0407": 1, "d0427": 1, "d0428": 1, "d0429": 2, "d0430": 2, "d0501": 2, "d0608": 1, "d0609": 1, "d0610": 2, "d0611": 2, "d0612": 2, "d0919": 2, "d0920": 2, "d0921": 2, "d0922": 1, "d0929": 1, "d1001": 2, "d1002": 2, "d1003": 2, "d1004": 2, "d1005": 2, "d1006": 2, "d1007": 2, "d1012": 1 };
      worktime.y2014 = { "d0101": 2, "d0126": 1, "d0131": 2, "d0201": 2, "d0202": 2, "d0203": 2, "d0204": 2, "d0205": 2, "d0206": 2, "d0208": 1, "d0405": 2, "d0407": 2, "d0501": 2, "d0502": 2, "d0503": 2, "d0504": 1, "d0602": 2, "d0908": 2, "d0928": 1, "d1001": 2, "d1002": 2, "d1003": 2, "d1004": 2, "d1005": 2, "d1006": 2, "d1007": 2, "d1011": 1 };
      var solarFestival = {
        "d0101": "元旦节",
        "d0202": "世界湿地日",
        "d0210": "国际气象节",
        "d0214": "情人节",
        "d0301": "国际海豹日",
        "d0303": "全国爱耳日",
        "d0305": "学雷锋纪念日",
        "d0308": "妇女节",
        "d0312": "植树节 孙中山逝世纪念日",
        "d0314": "国际警察日",
        "d0315": "消费者权益日",
        "d0317": "中国国医节 国际航海日",
        "d0321": "世界森林日 消除种族歧视国际日 世界儿歌日",
        "d0322": "世界水日",
        "d0323": "世界气象日",
        "d0324": "世界防治结核病日",
        "d0325": "全国中小学生安全教育日",
        "d0330": "巴勒斯坦国土日",
        "d0401": "愚人节 全国爱国卫生运动月(四月) 税收宣传月(四月)",
        "d0407": "世界卫生日",
        "d0422": "世界地球日",
        "d0423": "世界图书和版权日",
        "d0424": "亚非新闻工作者日",
        "d0501": "劳动节",
        "d0504": "青年节",
        "d0505": "碘缺乏病防治日",
        "d0508": "世界红十字日",
        "d0512": "国际护士节",
        "d0515": "国际家庭日",
        "d0517": "世界电信日",
        "d0518": "国际博物馆日",
        "d0520": "全国学生营养日",
        "d0522": "国际生物多样性日",
        "d0523": "国际牛奶日",
        "d0531": "世界无烟日",
        "d0601": "国际儿童节",
        "d0605": "世界环境日",
        "d0606": "全国爱眼日",
        "d0617": "防治荒漠化和干旱日",
        "d0623": "国际奥林匹克日",
        "d0625": "全国土地日",
        "d0626": "国际禁毒日",
        "d0701": "香港回归纪念日 中共诞辰 世界建筑日",
        "d0702": "国际体育记者日",
        "d0707": "抗日战争纪念日",
        "d0711": "世界人口日",
        "d0730": "非洲妇女日",
        "d0801": "建军节",
        "d0808": "中国男子节(爸爸节)",
        "d0815": "抗日战争胜利纪念",
        "d0908": "国际扫盲日 国际新闻工作者日",
        "d0909": "毛泽东逝世纪念",
        "d0910": "中国教师节",
        "d0914": "世界清洁地球日",
        "d0916": "国际臭氧层保护日",
        "d0918": "九一八事变纪念日",
        "d0920": "国际爱牙日",
        "d0927": "世界旅游日",
        "d0928": "孔子诞辰",
        "d1001": "国庆节 世界音乐日 国际老人节",
        "d1002": "国际和平与民主自由斗争日",
        "d1004": "世界动物日",
        "d1006": "老人节",
        "d1008": "全国高血压日 世界视觉日",
        "d1009": "世界邮政日 万国邮联日",
        "d1010": "辛亥革命纪念日 世界精神卫生日",
        "d1013": "世界保健日 国际教师节",
        "d1014": "世界标准日",
        "d1015": "国际盲人节(白手杖节)",
        "d1016": "世界粮食日",
        "d1017": "世界消除贫困日",
        "d1022": "世界传统医药日",
        "d1024": "联合国日 世界发展信息日",
        "d1031": "世界勤俭日",
        "d1107": "十月社会主义革命纪念日",
        "d1108": "中国记者日",
        "d1109": "全国消防安全宣传教育日",
        "d1110": "世界青年节",
        "d1111": "国际科学与和平周(本日所属的一周)",
        "d1112": "孙中山诞辰纪念日",
        "d1114": "世界糖尿病日",
        "d1117": "国际大学生节 世界学生节",
        "d1121": "世界问候日 世界电视日",
        "d1129": "国际声援巴勒斯坦人民国际日",
        "d1201": "世界艾滋病日",
        "d1203": "世界残疾人日",
        "d1205": "国际经济和社会发展志愿人员日",
        "d1208": "国际儿童电视日",
        "d1209": "世界足球日",
        "d1210": "世界人权日",
        "d1212": "西安事变纪念日",
        "d1213": "南京大屠杀(1937年)纪念日！紧记血泪史！",
        "d1220": "澳门回归纪念",
        "d1221": "国际篮球日",
        "d1224": "平安夜",
        "d1225": "圣诞节",
        "d1226": "毛泽东诞辰纪念"
      };
      var lunarFestival = {
        "d0101": "春节",
        "d0115": "元宵节",
        "d0202": "龙抬头节",
        "d0323": "妈祖生辰",
        "d0505": "端午节",
        "d0707": "七夕情人节",
        "d0715": "中元节",
        "d0815": "中秋节",
        "d0909": "重阳节",
        "d1015": "下元节",
        "d1208": "腊八节",
        "d1223": "小年",
        "d0100": "除夕"
      };
      var lunarInfo = [[2, 1, 21, 22184], [0, 2, 9, 21936], [6, 1, 30, 9656], [0, 2, 17, 9584], [0, 2, 6, 21168], [5, 1, 26, 43344], [0, 2, 13, 59728], [0, 2, 2, 27296], [3, 1, 22, 44368], [0, 2, 10, 43856], [8, 1, 30, 19304], [0, 2, 19, 19168], [0, 2, 8, 42352], [5, 1, 29, 21096], [0, 2, 16, 53856], [0, 2, 4, 55632], [4, 1, 25, 27304], [0, 2, 13, 22176], [0, 2, 2, 39632], [2, 1, 22, 19176], [0, 2, 10, 19168], [6, 1, 30, 42200], [0, 2, 18, 42192], [0, 2, 6, 53840], [5, 1, 26, 54568], [0, 2, 14, 46400], [0, 2, 3, 54944], [2, 1, 23, 38608], [0, 2, 11, 38320], [7, 2, 1, 18872], [0, 2, 20, 18800], [0, 2, 8, 42160], [5, 1, 28, 45656], [0, 2, 16, 27216], [0, 2, 5, 27968], [4, 1, 24, 44456], [0, 2, 13, 11104], [0, 2, 2, 38256], [2, 1, 23, 18808], [0, 2, 10, 18800], [6, 1, 30, 25776], [0, 2, 17, 54432], [0, 2, 6, 59984], [5, 1, 26, 27976], [0, 2, 14, 23248], [0, 2, 4, 11104], [3, 1, 24, 37744], [0, 2, 11, 37600], [7, 1, 31, 51560], [0, 2, 19, 51536], [0, 2, 8, 54432], [6, 1, 27, 55888], [0, 2, 15, 46416], [0, 2, 5, 22176], [4, 1, 25, 43736], [0, 2, 13, 9680], [0, 2, 2, 37584], [2, 1, 22, 51544], [0, 2, 10, 43344], [7, 1, 29, 46248], [0, 2, 17, 27808], [0, 2, 6, 46416], [5, 1, 27, 21928], [0, 2, 14, 19872], [0, 2, 3, 42416], [3, 1, 24, 21176], [0, 2, 12, 21168], [8, 1, 31, 43344], [0, 2, 18, 59728], [0, 2, 8, 27296], [6, 1, 28, 44368], [0, 2, 15, 43856], [0, 2, 5, 19296], [4, 1, 25, 42352], [0, 2, 13, 42352], [0, 2, 2, 21088], [3, 1, 21, 59696], [0, 2, 9, 55632], [7, 1, 30, 23208], [0, 2, 17, 22176], [0, 2, 6, 38608], [5, 1, 27, 19176], [0, 2, 15, 19152], [0, 2, 3, 42192], [4, 1, 23, 53864], [0, 2, 11, 53840], [8, 1, 31, 54568], [0, 2, 18, 46400], [0, 2, 7, 46752], [6, 1, 28, 38608], [0, 2, 16, 38320], [0, 2, 5, 18864], [4, 1, 25, 42168], [0, 2, 13, 42160], [10, 2, 2, 45656], [0, 2, 20, 27216], [0, 2, 9, 27968], [6, 1, 29, 44448], [0, 2, 17, 43872], [0, 2, 6, 38256], [5, 1, 27, 18808], [0, 2, 15, 18800], [0, 2, 4, 25776], [3, 1, 23, 27216], [0, 2, 10, 59984], [8, 1, 31, 27432], [0, 2, 19, 23232], [0, 2, 7, 43872], [5, 1, 28, 37736], [0, 2, 16, 37600], [0, 2, 5, 51552], [4, 1, 24, 54440], [0, 2, 12, 54432], [0, 2, 1, 55888], [2, 1, 22, 23208], [0, 2, 9, 22176], [7, 1, 29, 43736], [0, 2, 18, 9680], [0, 2, 7, 37584], [5, 1, 26, 51544], [0, 2, 14, 43344], [0, 2, 3, 46240], [4, 1, 23, 46416], [0, 2, 10, 44368], [9, 1, 31, 21928], [0, 2, 19, 19360], [0, 2, 8, 42416], [6, 1, 28, 21176], [0, 2, 16, 21168], [0, 2, 5, 43312], [4, 1, 25, 29864], [0, 2, 12, 27296], [0, 2, 1, 44368], [2, 1, 22, 19880], [0, 2, 10, 19296], [6, 1, 29, 42352], [0, 2, 17, 42208], [0, 2, 6, 53856], [5, 1, 26, 59696], [0, 2, 13, 54576], [0, 2, 3, 23200], [3, 1, 23, 27472], [0, 2, 11, 38608], [11, 1, 31, 19176], [0, 2, 19, 19152], [0, 2, 8, 42192], [6, 1, 28, 53848], [0, 2, 15, 53840], [0, 2, 4, 54560], [5, 1, 24, 55968], [0, 2, 12, 46496], [0, 2, 1, 22224], [2, 1, 22, 19160], [0, 2, 10, 18864], [7, 1, 30, 42168], [0, 2, 17, 42160], [0, 2, 6, 43600], [5, 1, 26, 46376], [0, 2, 14, 27936], [0, 2, 2, 44448], [3, 1, 23, 21936], [0, 2, 11, 37744], [8, 2, 1, 18808], [0, 2, 19, 18800], [0, 2, 8, 25776], [6, 1, 28, 27216], [0, 2, 15, 59984], [0, 2, 4, 27424], [4, 1, 24, 43872], [0, 2, 12, 43744], [0, 2, 2, 37600], [3, 1, 21, 51568], [0, 2, 9, 51552], [7, 1, 29, 54440], [0, 2, 17, 54432], [0, 2, 5, 55888], [5, 1, 26, 23208], [0, 2, 14, 22176], [0, 2, 3, 42704], [4, 1, 23, 21224], [0, 2, 11, 21200], [8, 1, 31, 43352], [0, 2, 19, 43344], [0, 2, 7, 46240], [6, 1, 27, 46416], [0, 2, 15, 44368], [0, 2, 5, 21920], [4, 1, 24, 42448], [0, 2, 12, 42416], [0, 2, 2, 21168], [3, 1, 22, 43320], [0, 2, 9, 26928], [7, 1, 29, 29336], [0, 2, 17, 27296], [0, 2, 6, 44368], [5, 1, 26, 19880], [0, 2, 14, 19296], [0, 2, 3, 42352], [4, 1, 24, 21104], [0, 2, 10, 53856], [8, 1, 30, 59696], [0, 2, 18, 54560], [0, 2, 7, 55968], [6, 1, 27, 27472], [0, 2, 15, 22224], [0, 2, 5, 19168], [4, 1, 25, 42216], [0, 2, 12, 42192], [0, 2, 1, 53584], [2, 1, 21, 55592], [0, 2, 9, 54560]];
      var termInfo = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];
      function getLunarLeapYear(year) {
        var yearData = lunarInfo[year - minYear];
        return yearData[0];
      }
      function getLunarYearDays(year) {
        var yearData = lunarInfo[year - minYear];
        var leapMonth = yearData[0];
        var monthData = yearData[3].toString(2);
        var monthDataArr = monthData.split("");
        for (var i2 = 0; i2 < 16 - monthDataArr.length; i2++) {
          monthDataArr.unshift(0);
        }
        var len = leapMonth ? 13 : 12;
        var yearDays = 0;
        var monthDays = [];
        for (var i2 = 0; i2 < len; i2++) {
          if (monthDataArr[i2] == 0) {
            yearDays += 29;
            monthDays.push(29);
          } else {
            yearDays += 30;
            monthDays.push(30);
          }
        }
        return {
          yearDays,
          monthDays
        };
      }
      function getLunarDateByBetween(year, between) {
        var lunarYearDays = getLunarYearDays(year);
        var end = between > 0 ? between : lunarYearDays.yearDays - Math.abs(between);
        var monthDays = lunarYearDays.monthDays;
        var tempDays = 0;
        var month = 0;
        for (var i2 = 0; i2 < monthDays.length; i2++) {
          tempDays += monthDays[i2];
          if (tempDays > end) {
            month = i2;
            tempDays = tempDays - monthDays[i2];
            break;
          }
        }
        return [year, month, end - tempDays + 1];
      }
      function getLunarByBetween(year, month, day) {
        var yearData = lunarInfo[year - minYear];
        var zenMonth = yearData[1];
        var zenDay = yearData[2];
        var between = getDaysBetweenSolar(year, zenMonth - 1, zenDay, year, month, day);
        if (between == 0) {
          return [year, 0, 1];
        } else {
          var lunarYear = between > 0 ? year : year - 1;
          return getLunarDateByBetween(lunarYear, between);
        }
      }
      function getDaysBetweenSolar(year, month, day, year1, month1, day1) {
        var date = new Date(year, month, day).getTime();
        var date1 = new Date(year1, month1, day1).getTime();
        return (date1 - date) / 864e5;
      }
      function getDaysBetweenZheng(year, month, day) {
        var lunarYearDays = getLunarYearDays(year);
        var monthDays = lunarYearDays.monthDays;
        var days = 0;
        for (var i2 = 0; i2 < monthDays.length; i2++) {
          if (i2 < month) {
            days += monthDays[i2];
          } else {
            break;
          }
        }
        return days + day - 1;
      }
      function getTerm(y2, n2) {
        var offDate = new Date(315569259747e-1 * (y2 - 1890) + termInfo[n2] * 6e4 + Date.UTC(1890, 0, 5, 16, 2, 31));
        return offDate.getUTCDate();
      }
      function getYearTerm(year) {
        var res = {};
        var month = 0;
        for (var i2 = 0; i2 < 24; i2++) {
          var day = getTerm(year, i2);
          if (i2 % 2 == 0)
            month++;
          res[formateDayD4(month - 1, day)] = DATA.solarTerm[i2];
        }
        return res;
      }
      function getYearZodiac(year) {
        var num = year - 1890 + 25;
        return DATA.zodiac[num % 12];
      }
      function cyclical(num) {
        return DATA.heavenlyStems[num % 10] + DATA.earthlyBranches[num % 12];
      }
      function getLunarYearName(year, offset) {
        offset = offset || 0;
        return cyclical(year - 1890 + 25 + offset);
      }
      function getLunarMonthName(year, month, offset) {
        offset = offset || 0;
        return cyclical((year - 1890) * 12 + month + 12 + offset);
      }
      function getLunarDayName(year, month, day) {
        var dayCyclical = Date.UTC(year, month, day) / 864e5 + 29219 + 18;
        return cyclical(dayCyclical);
      }
      function getSolarMonthDays(year, month) {
        var monthDays = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return monthDays[month];
      }
      function isLeapYear(year) {
        return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
      }
      function formateDate(year, month, day, _minYear) {
        var argsLen = arguments.length;
        var now = /* @__PURE__ */ new Date();
        year = argsLen ? parseInt(year, 10) : now.getFullYear();
        month = argsLen ? parseInt(month - 1, 10) : now.getMonth();
        day = argsLen ? parseInt(day, 10) || now.getDate() : now.getDate();
        if (year < (_minYear ? _minYear : minYear + 1) || year > maxYear)
          return { error: 100, msg: errorCode[100] };
        return {
          year,
          month,
          day
        };
      }
      function lunarToSolar(_year, _month, _day) {
        var inputDate = formateDate(_year, _month, _day);
        if (inputDate.error)
          return inputDate;
        var year = inputDate.year;
        var month = inputDate.month;
        var day = inputDate.day;
        var between = getDaysBetweenZheng(year, month, day);
        var yearData = lunarInfo[year - minYear];
        var zenMonth = yearData[1];
        var zenDay = yearData[2];
        var offDate = new Date(year, zenMonth - 1, zenDay).getTime() + between * 864e5;
        offDate = new Date(offDate);
        return {
          year: offDate.getFullYear(),
          month: offDate.getMonth() + 1,
          day: offDate.getDate()
        };
      }
      function solarToLunar(_year, _month, _day) {
        var inputDate = formateDate(_year, _month, _day, minYear);
        if (inputDate.error)
          return inputDate;
        var year = inputDate.year;
        var month = inputDate.month;
        var day = inputDate.day;
        cacheUtil.setCurrent(year);
        var term2 = cacheUtil.get("term2") ? cacheUtil.get("term2") : cacheUtil.set("term2", getTerm(year, 2));
        var termList = cacheUtil.get("termList") ? cacheUtil.get("termList") : cacheUtil.set("termList", getYearTerm(year));
        var firstTerm = getTerm(year, month * 2);
        var GanZhiYear = month > 1 || month == 1 && day >= term2 ? year + 1 : year;
        var GanZhiMonth = day >= firstTerm ? month + 1 : month;
        var lunarDate = getLunarByBetween(year, month, day);
        var lunarLeapMonth = getLunarLeapYear(lunarDate[0]);
        var lunarMonthName = "";
        if (lunarLeapMonth > 0 && lunarLeapMonth == lunarDate[1]) {
          lunarMonthName = "闰" + DATA.monthCn[lunarDate[1] - 1] + "月";
        } else if (lunarLeapMonth > 0 && lunarDate[1] > lunarLeapMonth) {
          lunarMonthName = DATA.monthCn[lunarDate[1] - 1] + "月";
        } else {
          lunarMonthName = DATA.monthCn[lunarDate[1]] + "月";
        }
        var lunarFtv = "";
        var lunarMonthDays = getLunarYearDays(lunarDate[0]).monthDays;
        if (lunarDate[1] == lunarMonthDays.length - 1 && lunarDate[2] == lunarMonthDays[lunarMonthDays.length - 1]) {
          lunarFtv = lunarFestival["d0100"];
        } else if (lunarLeapMonth > 0 && lunarDate[1] > lunarLeapMonth) {
          lunarFtv = lunarFestival[formateDayD4(lunarDate[1] - 1, lunarDate[2])];
        } else {
          lunarFtv = lunarFestival[formateDayD4(lunarDate[1], lunarDate[2])];
        }
        var res = {
          zodiac: getYearZodiac(GanZhiYear),
          GanZhiYear: getLunarYearName(GanZhiYear),
          GanZhiMonth: getLunarMonthName(year, GanZhiMonth),
          GanZhiDay: getLunarDayName(year, month, day),
          //放假安排：0无特殊安排，1工作，2放假
          worktime: worktime["y" + year] && worktime["y" + year][formateDayD4(month, day)] ? worktime["y" + year][formateDayD4(month, day)] : 0,
          term: termList[formateDayD4(month, day)],
          lunarYear: lunarDate[0],
          lunarMonth: lunarDate[1] + 1,
          lunarDay: lunarDate[2],
          lunarMonthName,
          lunarDayName: DATA.dateCn[lunarDate[2] - 1],
          lunarLeapMonth,
          solarFestival: solarFestival[formateDayD4(month, day)],
          lunarFestival: lunarFtv
        };
        return res;
      }
      function calendar(_year, _month, fill) {
        var inputDate = formateDate(_year, _month);
        if (inputDate.error)
          return inputDate;
        var year = inputDate.year;
        var month = inputDate.month;
        var calendarData = solarCalendar(year, month + 1, fill);
        for (var i2 = 0; i2 < calendarData.monthData.length; i2++) {
          var cData = calendarData.monthData[i2];
          var lunarData = solarToLunar(cData.year, cData.month, cData.day);
          extend(calendarData.monthData[i2], lunarData);
        }
        return calendarData;
      }
      function solarCalendar(_year, _month, fill) {
        var inputDate = formateDate(_year, _month);
        if (inputDate.error)
          return inputDate;
        var year = inputDate.year;
        var month = inputDate.month;
        var firstDate = new Date(year, month, 1);
        var preMonthDays, preMonthData, nextMonthData;
        var res = {
          firstDay: firstDate.getDay(),
          //该月1号星期几
          monthDays: getSolarMonthDays(year, month),
          //该月天数
          monthData: []
        };
        res.monthData = creatLenArr(year, month + 1, res.monthDays, 1);
        if (fill) {
          if (res.firstDay > 0) {
            var preYear = month - 1 < 0 ? year - 1 : year;
            var preMonth = month - 1 < 0 ? 11 : month - 1;
            preMonthDays = getSolarMonthDays(preYear, preMonth);
            preMonthData = creatLenArr(preYear, preMonth + 1, res.firstDay, preMonthDays - res.firstDay + 1);
            res.monthData = preMonthData.concat(res.monthData);
          }
          if (7 * 6 - res.monthData.length != 0) {
            var nextYear = month + 1 > 11 ? year + 1 : year;
            var nextMonth = month + 1 > 11 ? 0 : month + 1;
            var fillLen = 7 * 6 - res.monthData.length;
            nextMonthData = creatLenArr(nextYear, nextMonth + 1, fillLen, 1);
            res.monthData = res.monthData.concat(nextMonthData);
          }
        }
        return res;
      }
      function setWorktime(workData) {
        extend(worktime, workData);
      }
      var LunarCalendar2 = {
        solarToLunar,
        lunarToSolar,
        calendar,
        solarCalendar,
        setWorktime,
        getSolarMonthDays
      };
      {
        module.exports = LunarCalendar2;
      }
    })();
  })(LunarCalendar);
  var LunarCalendarExports = LunarCalendar.exports;
  const lunar = /* @__PURE__ */ getDefaultExportFromCjs(LunarCalendarExports);
  function getLunarDate(date) {
    const lunarDate = lunar.solarToLunar(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    return `${lunarDate.lunarFestival ? lunarDate.lunarFestival : lunarDate.lunarDayName}`;
  }
  const _sfc_main$s = {
    name: "AyCalendar",
    props: {
      startDate: {
        type: [Date, String],
        default() {
          const today = /* @__PURE__ */ new Date();
          return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        },
        validator(value) {
          const minDate = new Date(1970, 0, 1);
          const inputDate = value instanceof Date ? value : new Date(value);
          return !isNaN(inputDate.getTime()) && inputDate >= minDate;
        }
      },
      endDate: {
        type: [Date, String],
        default: null
      }
    },
    data() {
      return {
        currentDate: this.parseDateInput(this.startDate),
        selectedDate: null,
        currentSlide: 0,
        weekdays: ["日", "一", "二", "三", "四", "五", "六"],
        duration: 0,
        // 初始化时动画持续时间为0
        isInitialized: false
        // 添加初始化标志
      };
    },
    computed: {
      processedStartDate() {
        return this.parseDateInput(this.startDate);
      },
      processedEndDate() {
        return this.endDate ? this.parseDateInput(this.endDate) : new Date(this.processedStartDate.getFullYear(), 11, 31);
      },
      currentMonthTitle() {
        const currentMonth = this.monthSlides[this.currentSlide];
        return currentMonth ? currentMonth.title : "";
      },
      monthSlides() {
        const slides = [];
        let currentDate = new Date(this.processedStartDate.getFullYear(), this.processedStartDate.getMonth(), 1);
        while (currentDate <= this.processedEndDate) {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          slides.push({
            title: `${year}年${month + 1}月`,
            days: this.generateCalendarDays(year, month)
          });
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return slides;
      },
      initialSlideIndex() {
        const today = /* @__PURE__ */ new Date();
        const startYear = this.processedStartDate.getFullYear();
        const startMonth = this.processedStartDate.getMonth();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        return (currentYear - startYear) * 12 + (currentMonth - startMonth);
      }
    },
    created() {
      this.$nextTick(() => {
        const validSlideIndex = Math.min(Math.max(this.initialSlideIndex, 0), this.monthSlides.length - 1);
        this.currentSlide = validSlideIndex;
        setTimeout(() => {
          this.duration = 500;
        }, 100);
      });
    },
    methods: {
      parseDateInput(input) {
        if (input instanceof Date) {
          return input;
        }
        if (typeof input === "string") {
          const dateStr = input.replace(/\//g, "-");
          const [year, month, day] = dateStr.split("-").map(Number);
          const parsedDate = new Date(year, month - 1, day || 1);
          const minDate = new Date(1970, 0, 1);
          if (isNaN(parsedDate.getTime()) || parsedDate < minDate) {
            formatAppLog("warn", "at components/ay-calendar/ay-calendar.vue:176", "Invalid date or date before 1970-01-01, using current date instead");
            return /* @__PURE__ */ new Date();
          }
          return parsedDate;
        }
        return /* @__PURE__ */ new Date();
      },
      onSlideChange(e2) {
        this.currentSlide = e2;
      },
      generateCalendarDays(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const today = /* @__PURE__ */ new Date();
        const days = [];
        const startingDay = firstDay.getDay();
        for (let i2 = 0; i2 < startingDay; i2++) {
          const prevMonthDay = new Date(year, month, -startingDay + i2 + 1);
          days.push({
            day: prevMonthDay.getDate(),
            date: prevMonthDay,
            isCurrentMonth: false,
            isToday: this.isSameDay(prevMonthDay, today)
          });
        }
        for (let day = 1; day <= lastDay.getDate(); day++) {
          const date = new Date(year, month, day);
          days.push({
            day,
            date,
            isCurrentMonth: true,
            isToday: this.isSameDay(date, today)
          });
        }
        const remainingCells = 35 - days.length;
        for (let i2 = 1; i2 <= remainingCells; i2++) {
          const nextMonthDay = new Date(year, month + 1, i2);
          days.push({
            day: i2,
            date: nextMonthDay,
            isCurrentMonth: false,
            isToday: this.isSameDay(nextMonthDay, today)
          });
        }
        return days;
      },
      selectDate(date) {
        if (this.isDateInRange(date)) {
          this.selectedDate = date;
          this.$emit("date-selected", date);
          const currentViewMonth = this.monthSlides[this.currentSlide];
          const currentViewDate = new Date(currentViewMonth.title.replace(/年|月/g, "-"));
          if (date.getMonth() !== currentViewDate.getMonth() || date.getFullYear() !== currentViewDate.getFullYear()) {
            const targetSlideIndex = (date.getFullYear() - this.processedStartDate.getFullYear()) * 12 + (date.getMonth() - this.processedStartDate.getMonth());
            const validSlideIndex = Math.min(Math.max(targetSlideIndex, 0), this.monthSlides.length - 1);
            if (validSlideIndex !== this.currentSlide) {
              this.currentSlide = validSlideIndex;
            }
          }
        }
      },
      isSelectedDate(date) {
        return this.selectedDate && this.isSameDay(date, this.selectedDate);
      },
      isSameMonth(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
      },
      isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
      },
      isDateInRange(date) {
        const startTime = this.processedStartDate.getTime();
        const endTime = this.processedEndDate.getTime();
        const dateTime = date.getTime();
        return dateTime >= startTime && dateTime <= endTime;
      },
      getLunarDate(date) {
        return getLunarDate(date);
      },
      prevMonth() {
        if (this.currentSlide > 0) {
          this.currentSlide--;
        }
      },
      nextMonth() {
        if (this.currentSlide < this.monthSlides.length - 1) {
          this.currentSlide++;
        }
      }
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    const _component_ay_swiper_item = resolveEasycom(vue.resolveDynamicComponent("ay-swiper-item"), __easycom_1$1);
    const _component_ay_swiper = resolveEasycom(vue.resolveDynamicComponent("ay-swiper"), __easycom_2$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "ay-calendar-container" }, [
      vue.createElementVNode("view", { class: "calendar-navigation" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["calendar-nav-prev", { "calendar-nav-prev-disabled": $data.currentSlide === 0 }]),
            onClick: _cache[0] || (_cache[0] = (...args) => $options.prevMonth && $options.prevMonth(...args))
          },
          [
            vue.createVNode(_component_tn_icon, {
              class: "calendar-nav-prev-icon",
              name: "left",
              size: "36",
              "offset-top": "2"
            }),
            vue.createElementVNode("text", { class: "calendar-nav-prev-text" }, "上个月")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode("view", { class: "calendar-month-title" }, [
          vue.createElementVNode(
            "text",
            { class: "calendar-month-title-main" },
            vue.toDisplayString($options.currentMonthTitle),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "view",
            { class: "calendar-month-title-background" },
            vue.toDisplayString($options.currentMonthTitle.slice(0, 4)),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["calendar-nav-next", { "calendar-nav-next-disabled": $data.currentSlide === $options.monthSlides.length - 1 }]),
            onClick: _cache[1] || (_cache[1] = (...args) => $options.nextMonth && $options.nextMonth(...args))
          },
          [
            vue.createElementVNode("text", { class: "calendar-nav-next-text" }, "下个月"),
            vue.createVNode(_component_tn_icon, {
              class: "calendar-nav-next-icon",
              name: "right",
              size: "36",
              "offset-top": "2"
            })
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createElementVNode("view", { class: "calendar-weekdays" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.weekdays, (day) => {
            return vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: day,
                class: "weekday"
              },
              vue.toDisplayString(day),
              1
              /* TEXT */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createVNode(_component_ay_swiper, {
        autoHight: "",
        duration: $data.duration,
        indicator: false,
        current: $data.currentSlide,
        onChange: $options.onSlideChange
      }, {
        default: vue.withCtx(() => [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.monthSlides, (monthData, index) => {
              return vue.openBlock(), vue.createBlock(
                _component_ay_swiper_item,
                { key: index },
                {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "calendar" }, [
                      vue.createElementVNode("view", { class: "calendar-days" }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList(monthData.days, (day) => {
                            return vue.openBlock(), vue.createElementBlock("view", {
                              key: day.date.toISOString(),
                              class: vue.normalizeClass([
                                "calendar-day",
                                {
                                  "current-month": day.isCurrentMonth,
                                  "today": day.isToday,
                                  "selected": $options.isSelectedDate(day.date),
                                  "disabled": !$options.isDateInRange(day.date)
                                }
                              ]),
                              onClick: ($event) => $options.selectDate(day.date)
                            }, [
                              vue.createTextVNode(
                                vue.toDisplayString(day.day) + " ",
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "text",
                                { class: "lunar-date" },
                                vue.toDisplayString($options.getLunarDate(day.date)),
                                1
                                /* TEXT */
                              ),
                              vue.renderSlot(_ctx.$slots, "content", { date: day }, void 0, true)
                            ], 10, ["onClick"]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ]),
                      vue.createElementVNode(
                        "view",
                        { class: "background-number" },
                        vue.toDisplayString(/(\d+)月/.exec($options.currentMonthTitle)[1]),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  _: 2
                  /* DYNAMIC */
                },
                1024
                /* DYNAMIC_SLOTS */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["duration", "current", "onChange"])
    ]);
  }
  const __easycom_6 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__scopeId", "data-v-533e3be7"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-calendar/ay-calendar.vue"]]);
  const _sfc_main$r = {
    name: "ay-button",
    props: {
      // 按钮类型：primary, success, warning, danger, info
      type: {
        type: String,
        default: "default"
      },
      // 是否为镂空按钮
      plain: {
        type: Boolean,
        default: false
      },
      // 是否为圆角按钮
      round: {
        type: Boolean,
        default: false
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 是否显示加载状态
      loading: {
        type: Boolean,
        default: false
      },
      // 自定义主题色
      color: {
        type: String,
        default: "#ff6700"
      },
      // 是否为块级元素
      block: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      buttonStyle() {
        if (this.type === "default" && this.color) {
          return {
            "--button-color": this.color,
            "--button-background-color": this.color,
            "--button-border-color": this.color,
            "--button-hover-color": this.plain ? this.color : "#fff",
            "--button-hover-background-color": this.plain ? `${this.color}1a` : this.getLightenColor(this.color, 0.1),
            "--button-hover-border-color": this.getLightenColor(this.color, 0.1)
          };
        }
        return {};
      }
    },
    methods: {
      handleClick(e2) {
        this.$emit("click", e2);
      },
      getLightenColor(color2, level) {
        if (color2.startsWith("#")) {
          const hex = color2.slice(1);
          const rgb = parseInt(hex, 16);
          const r2 = (rgb >> 16) + Math.floor(255 * level);
          const g2 = (rgb >> 8 & 255) + Math.floor(255 * level);
          const b2 = (rgb & 255) + Math.floor(255 * level);
          const newR = Math.min(r2, 255);
          const newG = Math.min(g2, 255);
          const newB = Math.min(b2, 255);
          return `#${(newR << 16 | newG << 8 | newB).toString(16).padStart(6, "0")}`;
        }
        return color2;
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("button", {
      class: vue.normalizeClass(["ay-button", [
        `ay-button--${$props.type}`,
        {
          "is-plain": $props.plain,
          "is-round": $props.round,
          "is-disabled": $props.disabled,
          "is-loading": $props.loading,
          "is-block": $props.block
        }
      ]]),
      style: vue.normalizeStyle($options.buttonStyle),
      disabled: $props.disabled || $props.loading,
      onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args))
    }, [
      $props.loading ? (vue.openBlock(), vue.createElementBlock("i", {
        key: 0,
        class: "ay-icon-loading"
      })) : vue.createCommentVNode("v-if", true),
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ], 14, ["disabled"]);
  }
  const __easycom_5$1 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-a23d8e75"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-button/ay-button.vue"]]);
  const _sfc_main$q = {
    name: "ay-popup",
    props: {
      // v-model 值
      modelValue: {
        type: Boolean,
        default: false
      },
      // 弹出位置
      position: {
        type: String,
        default: "bottom",
        validator: (value) => ["top", "bottom", "left", "right", "center"].includes(value)
      },
      // 是否显示遮罩层
      overlay: {
        type: Boolean,
        default: true
      },
      // 点击遮罩是否关闭
      closeOnClickOverlay: {
        type: Boolean,
        default: true
      },
      // 是否开启动画
      animation: {
        type: Boolean,
        default: true
      },
      // 弹出层圆角
      borderRadius: {
        type: [String, Number],
        default: "24rpx"
      },
      // z-index 层级
      zIndex: {
        type: Number,
        default: 999
      },
      // 动画时长，单位毫秒
      duration: {
        type: Number,
        default: 300
      }
    },
    data() {
      return {
        show: false,
        showOverlay: false,
        showContent: false,
        isAnimating: false
      };
    },
    computed: {
      // 遮罩层样式
      overlayStyle() {
        return {
          transition: `opacity ${this.duration}ms ease-out`,
          opacity: this.showOverlay ? 1 : 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        };
      },
      // 内容区样式
      contentStyle() {
        const style = {
          transition: `all ${this.duration}ms ease-out`
        };
        if (this.position === "bottom") {
          style.borderRadius = `${this.borderRadius} ${this.borderRadius} 0 0`;
        } else if (this.position === "top") {
          style.borderRadius = `0 0 ${this.borderRadius} ${this.borderRadius}`;
        } else if (this.position === "center") {
          style.borderRadius = this.borderRadius;
        }
        return style;
      }
    },
    watch: {
      modelValue: {
        handler(val) {
          if (val) {
            this.open();
          } else {
            this.close();
          }
        },
        immediate: true
      }
    },
    methods: {
      // 打开弹窗
      open() {
        if (this.isAnimating)
          return;
        this.isAnimating = true;
        this.show = true;
        this.$nextTick(() => {
          setTimeout(() => {
            this.showOverlay = true;
            setTimeout(() => {
              this.showContent = true;
              setTimeout(() => {
                this.isAnimating = false;
              }, this.duration);
            }, 50);
          }, 0);
        });
      },
      // 关闭弹窗
      close() {
        if (this.isAnimating)
          return;
        this.isAnimating = true;
        this.showContent = false;
        setTimeout(() => {
          this.showOverlay = false;
          setTimeout(() => {
            this.show = false;
            this.$emit("update:modelValue", false);
            this.isAnimating = false;
          }, this.duration - 100);
        }, this.duration - 100);
      },
      // 点击遮罩层
      handleOverlayClick() {
        if (this.closeOnClickOverlay) {
          this.close();
        }
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "ay-popup",
        style: vue.normalizeStyle({ zIndex: $props.zIndex }),
        onTouchmove: _cache[1] || (_cache[1] = vue.withModifiers(() => {
        }, ["stop", "prevent"]))
      },
      [
        vue.createCommentVNode(" 遮罩层 "),
        vue.withDirectives(vue.createElementVNode(
          "view",
          {
            class: "ay-popup__overlay",
            style: vue.normalizeStyle($options.overlayStyle),
            onClick: _cache[0] || (_cache[0] = (...args) => $options.handleOverlayClick && $options.handleOverlayClick(...args))
          },
          null,
          4
          /* STYLE */
        ), [
          [vue.vShow, $props.overlay]
        ]),
        vue.createCommentVNode(" 内容区 "),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["ay-popup__content", [
              `ay-popup__content--${$props.position}`,
              { "ay-popup__content--show": $data.showContent },
              { "ay-popup__content--no-animation": !$props.animation }
            ]]),
            style: vue.normalizeStyle($options.contentStyle)
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      36
      /* STYLE, NEED_HYDRATION */
    )), [
      [vue.vShow, $data.show]
    ]);
  }
  const __easycom_5 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-32f6fcdb"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-popup/ay-popup.vue"]]);
  const baseUrl = "https://aybks.anyaowl.cn";
  const getNowDate = () => {
    var date = /* @__PURE__ */ new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  };
  const formatDate = (date) => {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  };
  const navigateTo = (url, params) => {
    uni.navigateTo({
      url: !params ? url : `${url}?params=${JSON.stringify(params)}`,
      success: (res) => {
      },
      fail: () => {
      },
      complete: () => {
      }
    });
  };
  const getParams = (data) => {
    if (data && data.params) {
      return JSON.parse(data.params);
    } else {
      return null;
    }
  };
  const formatNumber = (number) => {
    if (!number && number !== 0)
      return "0.00";
    const num = parseFloat(number).toFixed(2);
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };
  const BASE_URL = "https://aybks.anyaowl.cn/api";
  const TIMEOUT = 15e3;
  const request = (options = {}) => {
    return new Promise((resolve, reject) => {
      options.url = `${BASE_URL}${options.url}`;
      options.header = {
        "Content-Type": "application/json",
        ...options.header
      };
      const token = uni.getStorageSync("token");
      if (token) {
        options.header.Authorization = `Bearer ${token}`;
      }
      uni.request({
        ...options,
        timeout: TIMEOUT,
        success: (res) => {
          const { statusCode, data } = res;
          if (statusCode === 200) {
            if (data.success) {
              resolve(data);
            } else {
              uni.showToast({
                title: data.message || "请求失败",
                icon: "none"
              });
              reject(data);
            }
          } else if (statusCode === 401) {
            uni.removeStorageSync("token");
            uni.reLaunch({
              url: "/pages/login/login"
            });
            reject(new Error("未授权，请重新登录"));
          } else {
            uni.showToast({
              title: "网络错误",
              icon: "none"
            });
            reject(new Error("网络错误"));
          }
        },
        fail: (err) => {
          uni.showToast({
            title: "请求失败",
            icon: "none"
          });
          reject(err);
        }
      });
    });
  };
  const http = {
    get(url, data = {}, options = {}) {
      return request({
        url,
        data,
        method: "GET",
        ...options
      });
    },
    post(url, data = {}, options = {}) {
      return request({
        url,
        data,
        method: "POST",
        ...options
      });
    },
    put(url, data = {}, options = {}) {
      return request({
        url,
        data,
        method: "PUT",
        ...options
      });
    },
    delete(url, data = {}, options = {}) {
      return request({
        url,
        data,
        method: "DELETE",
        ...options
      });
    }
  };
  const recordApi = {
    // 创建记工记录
    create(data) {
      return http.post("/records", data);
    },
    // 获取记工列表
    getList(params) {
      return http.get("/records", params);
    },
    // 根据项目获取记工记录
    getListByProject(id, params) {
      return http.get(`/projects/${id}/records`, params);
    },
    // 获取记工详情
    getDetail(id) {
      return http.get(`/records/${id}`);
    },
    // 更新记工记录
    update(id, data) {
      return http.put(`/records/${id}`, data);
    },
    // 删除记工记录
    delete(id) {
      return http.delete(`/records/${id}`);
    }
  };
  const projectApi = {
    // 创建项目
    create(data) {
      return http.post("/projects", data);
    },
    // 获取项目列表
    getList(params) {
      return http.get("/projects", params);
    },
    // 获取项目详情
    getDetail(id) {
      return http.get(`/projects/${id}`);
    },
    // 更新项目
    update(id, data) {
      return http.put(`/projects/${id}`, data);
    },
    // 删除项目
    delete(id) {
      return http.delete(`/projects/${id}`);
    }
  };
  const _sfc_main$p = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const isLoading = vue.ref(true);
      const selectDate = vue.ref("");
      const nowDate = vue.ref(getNowDate());
      const showProjectPopup = vue.ref(false);
      const projectList = vue.ref([]);
      const currentProject = vue.ref({});
      const recordList = vue.ref([]);
      const showDetailPopup = vue.ref(false);
      const currentDayRecord = vue.ref(null);
      const monthlyStats = vue.ref({
        point: {
          workDays: 0,
          // 工作天数
          overtimeCount: 0,
          // 加班次数
          salary: 0,
          // 工资
          overtimeSalary: 0
          // 加班工资
        },
        contract: {
          count: 0,
          // 包工数量
          totalAmount: 0
          // 包工总金额
        }
      });
      const contractOptions = vue.ref([
        {
          label: "砌墙"
        },
        {
          label: "贴砖"
        },
        {
          label: "刷漆"
        },
        {
          label: "其他"
        }
      ]);
      const getWorkText = (record) => {
        if (!record)
          return "";
        if (record.type === "点工") {
          if (record.work_option === 2) {
            return "休息";
          }
          const days = parseFloat(record.work_days);
          if (days === 0.5) {
            return "半个工";
          } else if (days === 1) {
            return "一个工";
          } else if (days === 1.5) {
            return "一个半";
          } else if (days === 2) {
            return "两个工";
          } else if (days === 2.5) {
            return "两个半";
          } else if (days === 3) {
            return "三个工";
          }
          return `${days}个工`;
        } else if (record.type === "包工") {
          if (record.contract_option === 3 && record.contract_content) {
            return record.contract_content;
          }
          return contractOptions.value[record.contract_option].label;
        }
        return "";
      };
      const calculateMonthlyStatistics = () => {
        const currentDate = /* @__PURE__ */ new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        monthlyStats.value = {
          point: {
            workDays: 0,
            overtimeCount: 0,
            salary: 0,
            overtimeSalary: 0
          },
          contract: {
            count: 0,
            totalAmount: 0
          }
        };
        const monthlyRecords = recordList.value.filter((record) => {
          const [recordYear, recordMonth] = record.date.split("-").map(Number);
          return recordYear === year && recordMonth === month;
        });
        monthlyRecords.forEach((record) => {
          var _a;
          if (record.type === "点工") {
            monthlyStats.value.point.workDays += parseFloat(record.work_days) || 0;
            if (record.has_overtime) {
              monthlyStats.value.point.overtimeCount++;
              monthlyStats.value.point.overtimeSalary += parseFloat(record.overtime_amount) || 0;
            }
            const dailyWage = ((_a = currentProject.value) == null ? void 0 : _a.daily_wage) || 0;
            monthlyStats.value.point.salary += dailyWage * parseFloat(record.work_days);
          } else if (record.type === "包工") {
            monthlyStats.value.contract.count++;
            monthlyStats.value.contract.totalAmount += parseFloat(record.amount) || 0;
          }
        });
      };
      const getRecordList = async () => {
        try {
          const res = await recordApi.getListByProject(currentProject.value.id);
          if (res.success) {
            recordList.value = res.data.list;
            calculateMonthlyStatistics();
            currentDayRecord.value = getCurrentDayRecord(/* @__PURE__ */ new Date());
          }
        } catch (error) {
          uni.showToast({
            title: "获取记工记录失败",
            icon: "none"
          });
        }
      };
      const initData = async () => {
        try {
          isLoading.value = true;
          const cachedProject = uni.getStorageSync("current_project");
          const token = uni.getStorageSync("token");
          if (!token) {
            uni.reLaunch({
              url: "/pages/login/login"
            });
            return;
          }
          await getProjectList();
          if (projectList.value.length === 0) {
            uni.showModal({
              title: "提示",
              content: "你还没有创建账本哦，请前往创建",
              confirmText: "去创建",
              success: (res) => {
                if (res.confirm) {
                  navigateTo("/pages/project/form");
                }
              }
            });
            return;
          }
          if (cachedProject) {
            currentProject.value = cachedProject;
          } else {
            currentProject.value = projectList.value[0];
            uni.setStorageSync("current_project", currentProject.value);
          }
          selectDate.value = formatDate(/* @__PURE__ */ new Date());
          await getRecordList();
        } catch (error) {
          uni.showToast({
            title: "数据加载失败",
            icon: "none"
          });
        } finally {
          isLoading.value = false;
        }
      };
      const selectProject = async (project) => {
        currentProject.value = project;
        showProjectPopup.value = false;
        uni.setStorageSync("current_project", project);
        isLoading.value = true;
        try {
          await getRecordList();
          currentDayRecord.value = getCurrentDayRecord(/* @__PURE__ */ new Date());
        } catch (error) {
          formatAppLog("error", "at pages/index/index.vue:432", "刷新记工记录失败:", error);
        } finally {
          isLoading.value = false;
        }
      };
      const getProjectList = async () => {
        try {
          const res = await projectApi.getList();
          if (res.success) {
            projectList.value = res.data.list;
          }
        } catch (error) {
          uni.showToast({
            title: "获取项目列表失败",
            icon: "none"
          });
        }
      };
      const getCurrentDayRecord = (date) => {
        return recordList.value.find((record) => record.date === formatDate(date));
      };
      const showRecordDetail = () => {
        showDetailPopup.value = true;
      };
      const previewImage = (current, urls) => {
        const fullUrls = urls.map((url) => baseUrl + url);
        const currentUrl = baseUrl + current;
        uni.previewImage({
          current: currentUrl,
          urls: fullUrls
        });
      };
      const handleDateSelect = (time) => {
        const formattedDate = formatDate(time);
        selectDate.value = formattedDate;
        currentDayRecord.value = getCurrentDayRecord(time);
      };
      const goProject = () => {
        navigateTo("/pages/project/list");
      };
      const goForm = (state) => {
        const params = {
          state,
          date: selectDate.value ? selectDate.value : nowDate.value
        };
        if (state === "edit" && currentDayRecord.value) {
          params.id = currentDayRecord.value.id;
        }
        navigateTo("/pages/form/accountingForm", params);
      };
      const formatNumber2 = (num) => {
        return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };
      const getTagColor = vue.computed(() => {
        return (record) => {
          if (!record)
            return "#ff6700";
          if (record.type === "点工") {
            if (record.work_option === 2) {
              return "#52c41a";
            }
            return "#ff6700";
          } else if (record.type === "包工") {
            return "#1890ff";
          }
          return "#ff6700";
        };
      });
      onShow(() => {
        if (!isLoading.value) {
          getRecordList();
          getProjectList();
        }
      });
      onLoad(() => {
        vue.nextTick(() => {
          initData();
          uni.hideTabBar();
        });
      });
      const __returned__ = { isLoading, selectDate, nowDate, showProjectPopup, projectList, currentProject, recordList, showDetailPopup, currentDayRecord, monthlyStats, contractOptions, getWorkText, calculateMonthlyStatistics, getRecordList, initData, selectProject, getProjectList, getCurrentDayRecord, showRecordDetail, previewImage, handleDateSelect, goProject, goForm, formatNumber: formatNumber2, getTagColor, get onLoad() {
        return onLoad;
      }, get onShow() {
        return onShow;
      }, nextTick: vue.nextTick, ref: vue.ref, computed: vue.computed, get formatDate() {
        return formatDate;
      }, get getNowDate() {
        return getNowDate;
      }, get navigateTo() {
        return navigateTo;
      }, get baseUrl() {
        return baseUrl;
      }, get recordApi() {
        return recordApi;
      }, get projectApi() {
        return projectApi;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ay_tabbar = resolveEasycom(vue.resolveDynamicComponent("ay-tabbar"), __easycom_0$2);
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    const _component_ay_title = resolveEasycom(vue.resolveDynamicComponent("ay-title"), __easycom_2$2);
    const _component_NavbarWrapper = resolveEasycom(vue.resolveDynamicComponent("NavbarWrapper"), __easycom_3$1);
    const _component_ay_tag = resolveEasycom(vue.resolveDynamicComponent("ay-tag"), __easycom_4$2);
    const _component_ay_calendar = resolveEasycom(vue.resolveDynamicComponent("ay-calendar"), __easycom_6);
    const _component_ay_button = resolveEasycom(vue.resolveDynamicComponent("ay-button"), __easycom_5$1);
    const _component_ay_popup = resolveEasycom(vue.resolveDynamicComponent("ay-popup"), __easycom_5);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createVNode(_component_ay_tabbar, {
        currentTab: 0,
        "is-float": "",
        "text-only": "",
        frosted: ""
      }),
      vue.createCommentVNode(' <view class="app-header-box"></view> '),
      vue.createVNode(_component_NavbarWrapper, { sticky: "" }, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_ay_title, {
            title: "俺要记账",
            class: "ay-title"
          }, {
            right: vue.withCtx(() => {
              var _a;
              return [
                vue.createElementVNode("view", {
                  class: "project-selector",
                  onClick: _cache[0] || (_cache[0] = ($event) => $setup.showProjectPopup = true)
                }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(((_a = $setup.currentProject.name) == null ? void 0 : _a.length) > 7 ? $setup.currentProject.name.slice(0, 7) + "..." : $setup.currentProject.name || "选择项目"),
                    1
                    /* TEXT */
                  ),
                  vue.createVNode(_component_tn_icon, {
                    name: "right-double",
                    color: "#ff6700"
                  })
                ])
              ];
            }),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createCommentVNode(" 添加v-if等待数据加载 "),
      !$setup.isLoading ? (vue.openBlock(), vue.createBlock(_component_ay_calendar, {
        key: 0,
        "start-date": $setup.currentProject.start_date,
        "end-date": $setup.nowDate,
        onDateSelected: $setup.handleDateSelect
      }, {
        content: vue.withCtx(({ date }) => [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.recordList, (record, index) => {
              return vue.openBlock(), vue.createElementBlock("view", { key: index }, [
                $setup.formatDate(date == null ? void 0 : date.date) === (record == null ? void 0 : record.date) ? (vue.openBlock(), vue.createBlock(_component_ay_tag, {
                  key: 0,
                  class: "tag",
                  shape: "round",
                  "font-size": "16",
                  bold: "",
                  size: "small",
                  color: $setup.getTagColor(record)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(
                      vue.toDisplayString($setup.getWorkText(record)),
                      1
                      /* TEXT */
                    )
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["color"])) : vue.createCommentVNode("v-if", true)
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        _: 1
        /* STABLE */
      }, 8, ["start-date", "end-date"])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "loading"
      }, "加载中...")),
      vue.createElementVNode("view", { class: "btns" }, [
        !$setup.currentDayRecord ? (vue.openBlock(), vue.createBlock(_component_ay_button, {
          key: 0,
          round: "",
          block: "",
          class: "btn1",
          onClick: _cache[1] || (_cache[1] = ($event) => $setup.goForm("add"))
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("记一笔")
          ]),
          _: 1
          /* STABLE */
        })) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "tn-flex"
        }, [
          vue.createVNode(_component_ay_button, {
            round: "",
            block: "",
            class: "btn2",
            onClick: _cache[2] || (_cache[2] = ($event) => $setup.goForm("edit"))
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("修改")
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_ay_button, {
            round: "",
            block: "",
            class: "btn2",
            onClick: $setup.showRecordDetail
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("查看")
            ]),
            _: 1
            /* STABLE */
          })
        ]))
      ]),
      vue.createCommentVNode(" 本月统计卡片 "),
      vue.createVNode(_component_ay_title, { title: "本月统计" }),
      vue.createElementVNode("view", { class: "stats-card" }, [
        vue.createCommentVNode(" 点工统计 "),
        vue.createElementVNode("view", { class: "stats-section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "title" }, "点工收入"),
            vue.createElementVNode(
              "text",
              { class: "total" },
              "¥" + vue.toDisplayString($setup.formatNumber($setup.monthlyStats.point.salary + $setup.monthlyStats.point.overtimeSalary)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "section-content" }, [
            vue.createElementVNode("view", { class: "stats-item" }, [
              vue.createElementVNode("text", { class: "label" }, "工作天数"),
              vue.createElementVNode(
                "text",
                { class: "value" },
                vue.toDisplayString($setup.monthlyStats.point.workDays) + "天",
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "stats-item" }, [
              vue.createElementVNode("text", { class: "label" }, "基本工资"),
              vue.createElementVNode(
                "text",
                { class: "value" },
                "¥" + vue.toDisplayString($setup.formatNumber($setup.monthlyStats.point.salary)),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "stats-item" }, [
              vue.createElementVNode("text", { class: "label" }, "加班次数"),
              vue.createElementVNode(
                "text",
                { class: "value" },
                vue.toDisplayString($setup.monthlyStats.point.overtimeCount) + "次",
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "stats-item" }, [
              vue.createElementVNode("text", { class: "label" }, "加班工资"),
              vue.createElementVNode(
                "text",
                { class: "value" },
                "¥" + vue.toDisplayString($setup.formatNumber($setup.monthlyStats.point.overtimeSalary)),
                1
                /* TEXT */
              )
            ])
          ])
        ]),
        vue.createCommentVNode(" 包工统计 "),
        vue.createElementVNode("view", { class: "stats-section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "title" }, "包工收入"),
            vue.createElementVNode(
              "text",
              { class: "total" },
              "¥" + vue.toDisplayString($setup.formatNumber($setup.monthlyStats.contract.totalAmount)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "section-content" }, [
            vue.createElementVNode("view", { class: "stats-item" }, [
              vue.createElementVNode("text", { class: "label" }, "总项目数"),
              vue.createElementVNode(
                "text",
                { class: "value" },
                vue.toDisplayString($setup.monthlyStats.contract.count) + "个",
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "stats-item" }, [
              vue.createElementVNode("text", { class: "label" }, "总金额"),
              vue.createElementVNode(
                "text",
                { class: "value" },
                "¥" + vue.toDisplayString($setup.monthlyStats.contract.totalAmount),
                1
                /* TEXT */
              )
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 项目选择弹出层 "),
      vue.createVNode(_component_ay_popup, {
        modelValue: $setup.showProjectPopup,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.showProjectPopup = $event),
        position: "left"
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "project-popup" }, [
            vue.createElementVNode("view", { class: "popup-header" }, [
              vue.createElementVNode("text", { class: "title" }, "选择项目"),
              vue.createVNode(_component_tn_icon, {
                name: "close",
                onClick: _cache[3] || (_cache[3] = ($event) => $setup.showProjectPopup = false),
                size: "40",
                color: "#666"
              })
            ]),
            vue.createElementVNode("view", { class: "project-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.projectList, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.id,
                    class: vue.normalizeClass(["project-item", { "active": $setup.currentProject.id === item.id }]),
                    onClick: ($event) => $setup.selectProject(item)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "project-name" },
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    ),
                    $setup.currentProject.id === item.id ? (vue.openBlock(), vue.createBlock(_component_tn_icon, {
                      key: 0,
                      name: "check",
                      color: "#ff6700"
                    })) : vue.createCommentVNode("v-if", true)
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("view", {
              class: "project-manage",
              onClick: $setup.goProject
            }, [
              vue.createElementVNode("view", { class: "left" }, [
                vue.createVNode(_component_tn_icon, {
                  name: "set",
                  size: "40",
                  color: "#ff6700"
                }),
                vue.createElementVNode("text", null, "项目管理")
              ]),
              vue.createVNode(_component_tn_icon, {
                name: "right",
                size: "40",
                color: "#666"
              })
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"]),
      vue.createCommentVNode(" 记工详情弹窗 "),
      vue.createVNode(_component_ay_popup, {
        modelValue: $setup.showDetailPopup,
        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.showDetailPopup = $event),
        position: "center",
        overlay: true
      }, {
        default: vue.withCtx(() => {
          var _a, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
          return [
            vue.createElementVNode("view", { class: "record-detail-popup" }, [
              vue.createElementVNode("view", { class: "popup-header" }, [
                vue.createElementVNode("text", { class: "title" }, "记工详情"),
                vue.createVNode(_component_tn_icon, {
                  name: "close",
                  onClick: _cache[5] || (_cache[5] = ($event) => $setup.showDetailPopup = false),
                  size: "40",
                  color: "#666"
                })
              ]),
              vue.createElementVNode("scroll-view", {
                "scroll-y": "",
                class: "popup-content"
              }, [
                vue.createCommentVNode(" 基本信息 "),
                vue.createElementVNode("view", { class: "detail-section" }, [
                  vue.createElementVNode("view", { class: "section-title" }, [
                    vue.createVNode(_component_tn_icon, {
                      name: "image-text",
                      color: "#ff6700",
                      size: "32"
                    }),
                    vue.createElementVNode("text", null, "基本信息")
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "label" }, "日期"),
                    vue.createElementVNode(
                      "text",
                      { class: "value" },
                      vue.toDisplayString((_a = $setup.currentDayRecord) == null ? void 0 : _a.date),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "label" }, "类型"),
                    vue.createElementVNode(
                      "text",
                      { class: "value" },
                      vue.toDisplayString((_b = $setup.currentDayRecord) == null ? void 0 : _b.type),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createCommentVNode(" 工作内容 "),
                ((_c = $setup.currentDayRecord) == null ? void 0 : _c.type) === "点工" ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "detail-section"
                }, [
                  vue.createElementVNode("view", { class: "section-title" }, [
                    vue.createVNode(_component_tn_icon, {
                      name: "job",
                      color: "#ff6700",
                      size: "32"
                    }),
                    vue.createElementVNode("text", null, "工作内容")
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "label" }, "工作量"),
                    vue.createElementVNode(
                      "text",
                      { class: "value" },
                      vue.toDisplayString($setup.getWorkText($setup.currentDayRecord)),
                      1
                      /* TEXT */
                    )
                  ]),
                  ((_d = $setup.currentDayRecord) == null ? void 0 : _d.has_overtime) ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "info-item"
                  }, [
                    vue.createElementVNode("text", { class: "label" }, "有加班"),
                    vue.createElementVNode(
                      "text",
                      { class: "value" },
                      "加班费用" + vue.toDisplayString((_e2 = $setup.currentDayRecord) == null ? void 0 : _e2.overtime_amount) + "元",
                      1
                      /* TEXT */
                    )
                  ])) : vue.createCommentVNode("v-if", true)
                ])) : vue.createCommentVNode("v-if", true),
                vue.createCommentVNode(" 包工内容 "),
                ((_f = $setup.currentDayRecord) == null ? void 0 : _f.type) === "包工" ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "detail-section"
                }, [
                  vue.createElementVNode("view", { class: "section-title" }, [
                    vue.createVNode(_component_tn_icon, {
                      name: "job",
                      color: "#ff6700",
                      size: "32"
                    }),
                    vue.createElementVNode("text", null, "包工内容")
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "label" }, "内容"),
                    vue.createElementVNode(
                      "text",
                      { class: "value" },
                      vue.toDisplayString($setup.currentDayRecord.contract_option === 3 ? $setup.currentDayRecord.contract_content : (_h = $setup.contractOptions[(_g = $setup.currentDayRecord) == null ? void 0 : _g.contract_option]) == null ? void 0 : _h.label),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "label" }, "金额"),
                    vue.createElementVNode(
                      "text",
                      { class: "value" },
                      "¥" + vue.toDisplayString((_i = $setup.currentDayRecord) == null ? void 0 : _i.amount),
                      1
                      /* TEXT */
                    )
                  ])
                ])) : vue.createCommentVNode("v-if", true),
                vue.createCommentVNode(" 备注信息 "),
                ((_j = $setup.currentDayRecord) == null ? void 0 : _j.remark) || ((_l = (_k = $setup.currentDayRecord) == null ? void 0 : _k.image_list) == null ? void 0 : _l.length) ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 2,
                  class: "detail-section"
                }, [
                  vue.createElementVNode("view", { class: "section-title" }, [
                    vue.createVNode(_component_tn_icon, {
                      name: "edit",
                      color: "#ff6700",
                      size: "32"
                    }),
                    vue.createElementVNode("text", null, "备注信息")
                  ]),
                  ((_m = $setup.currentDayRecord) == null ? void 0 : _m.remark) ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 0,
                      class: "remark-content"
                    },
                    vue.toDisplayString((_n = $setup.currentDayRecord) == null ? void 0 : _n.remark),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  ((_p = (_o = $setup.currentDayRecord) == null ? void 0 : _o.image_list) == null ? void 0 : _p.length) ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "image-grid"
                  }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList((_q = $setup.currentDayRecord) == null ? void 0 : _q.image_list, (img, index) => {
                        return vue.openBlock(), vue.createElementBlock("image", {
                          key: index,
                          src: $setup.baseUrl + img,
                          mode: "aspectFill",
                          onClick: ($event) => {
                            var _a2;
                            return $setup.previewImage(img, (_a2 = $setup.currentDayRecord) == null ? void 0 : _a2.image_list);
                          }
                        }, null, 8, ["src", "onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])) : vue.createCommentVNode("v-if", true)
                ])) : vue.createCommentVNode("v-if", true)
              ])
            ])
          ];
        }),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/index/index.vue"]]);
  const userApi = {
    // 用户注册
    register(data) {
      return http.post("/user/register", data);
    },
    // 用户登录
    login(data) {
      return http.post("/user/login", data);
    },
    // 获取用户信息
    getUserInfo() {
      return http.get("/user/info");
    },
    // 更新用户信息
    updateUserInfo(data) {
      return http.put("/user/update", data);
    },
    // 修改密码
    updatePassword(data) {
      return http.put("/user/password", data);
    },
    // 获取工作统计数据
    getWorkStats() {
      return http.get("/user/work-stats");
    },
    // 获取更新
    getUpdate(data) {
      return http.post("/check-update", data);
    }
  };
  const _sfc_main$o = {
    __name: "person",
    setup(__props, { expose: __expose }) {
      __expose();
      const userInfo = vue.ref({
        avatar: "",
        username: "",
        signature: ""
      });
      const statistics = vue.ref({
        totalRecordDays: 0,
        currentConsecutiveDays: 0,
        maxConsecutiveDays: 0,
        averageDailyWage: 0,
        totalIncome: 0
      });
      const isAmountHidden = vue.ref(true);
      const temporaryShow = vue.ref(false);
      let hideTimeout = null;
      const loadUserSettings = () => {
        try {
          const settings = uni.getStorageSync("user_settings");
          if (settings) {
            isAmountHidden.value = settings.amount_display.hide_amount;
          }
        } catch (error) {
          formatAppLog("error", "at pages/person/person.vue:127", "读取用户设置失败:", error);
        }
      };
      const toggleAmountDisplay = () => {
        if (isAmountHidden.value) {
          temporaryShow.value = true;
          isAmountHidden.value = false;
          if (hideTimeout) {
            clearTimeout(hideTimeout);
          }
          hideTimeout = setTimeout(() => {
            if (temporaryShow.value) {
              isAmountHidden.value = true;
              temporaryShow.value = false;
            }
          }, 3e3);
        }
      };
      const getWorkStats = async () => {
        try {
          const res = await userApi.getWorkStats();
          if (res.success) {
            statistics.value = {
              totalRecordDays: res.data.total_record_days || 0,
              currentConsecutiveDays: res.data.current_consecutive_days || 0,
              maxConsecutiveDays: res.data.max_consecutive_days || 0,
              averageDailyWage: res.data.average_daily_wage || 0,
              totalIncome: res.data.total_income || 0
            };
          }
        } catch (error) {
          formatAppLog("error", "at pages/person/person.vue:167", "获取工作统计数据失败:", error);
          uni.showToast({
            title: "获取统计数据失败",
            icon: "none"
          });
        }
      };
      const goToProject = () => {
        uni.navigateTo({
          url: "/pages/project/list"
        });
      };
      const getUserInfo = async () => {
        try {
          const res = await userApi.getUserInfo();
          if (res.success) {
            userInfo.value = res.data;
          }
        } catch (error) {
          formatAppLog("error", "at pages/person/person.vue:189", "获取用户信息失败:", error);
          uni.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
        }
      };
      const goToProfile = () => {
        uni.navigateTo({
          url: "/pages/person/profile"
        });
      };
      const goToAccountSettings = () => {
        uni.navigateTo({
          url: "/pages/person/accountSettings"
        });
      };
      const goToAbout = () => {
        uni.navigateTo({
          url: "/pages/person/about"
        });
      };
      onLoad(() => {
        uni.hideTabBar();
      });
      onShow(() => {
        loadUserSettings();
      });
      onShow(() => {
        getUserInfo();
        getWorkStats();
      });
      vue.onUnmounted(() => {
        if (hideTimeout) {
          clearTimeout(hideTimeout);
        }
      });
      const __returned__ = { userInfo, statistics, isAmountHidden, temporaryShow, get hideTimeout() {
        return hideTimeout;
      }, set hideTimeout(v2) {
        hideTimeout = v2;
      }, loadUserSettings, toggleAmountDisplay, getWorkStats, goToProject, getUserInfo, goToProfile, goToAccountSettings, goToAbout, get onLoad() {
        return onLoad;
      }, get onShow() {
        return onShow;
      }, nextTick: vue.nextTick, ref: vue.ref, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted, get userApi() {
        return userApi;
      }, get baseUrl() {
        return baseUrl;
      }, get formatNumber() {
        return formatNumber;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ay_tabbar = resolveEasycom(vue.resolveDynamicComponent("ay-tabbar"), __easycom_0$2);
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "person-container" }, [
      vue.createVNode(_component_ay_tabbar, {
        currentTab: 2,
        "is-float": "",
        "text-only": "",
        frosted: ""
      }),
      vue.createCommentVNode(' <view class="app-header-box"></view> '),
      vue.createCommentVNode(" 顶部个人信息卡片 "),
      vue.createElementVNode("view", { class: "user-card" }, [
        vue.createElementVNode("view", {
          class: "user-info",
          onClick: $setup.goToProfile
        }, [
          vue.createElementVNode("image", {
            class: "avatar",
            src: $setup.baseUrl + $setup.userInfo.avatar || "/static/tx.jpg",
            mode: "aspectFill"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "info-right" }, [
            vue.createElementVNode(
              "text",
              { class: "username" },
              vue.toDisplayString($setup.userInfo.nickname || "未登录"),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "signature" },
              vue.toDisplayString($setup.userInfo.signature || "开始记录美好生活"),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createCommentVNode(" 统计数据 "),
        vue.createElementVNode("view", { class: "statistics" }, [
          vue.createElementVNode("view", { class: "stat-item" }, [
            vue.createElementVNode("text", { class: "number" }, [
              vue.createTextVNode(
                vue.toDisplayString($setup.statistics.totalRecordDays || 0) + " ",
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "unit" }, "天")
            ]),
            vue.createElementVNode("text", { class: "label" }, "记账天数")
          ]),
          vue.createElementVNode("view", { class: "stat-item" }, [
            vue.createElementVNode("text", { class: "number" }, [
              vue.createTextVNode(
                vue.toDisplayString($setup.statistics.currentConsecutiveDays || 0) + " ",
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "unit" }, "天")
            ]),
            vue.createElementVNode("text", { class: "label" }, "当前连续记账")
          ]),
          vue.createElementVNode("view", { class: "stat-item" }, [
            vue.createElementVNode("text", { class: "number" }, [
              vue.createTextVNode(
                vue.toDisplayString($setup.statistics.maxConsecutiveDays || 0) + " ",
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "unit" }, "天")
            ]),
            vue.createElementVNode("text", { class: "label" }, "最大连续记账")
          ])
        ]),
        vue.createElementVNode("view", {
          class: "statistics",
          style: { "border": "none" }
        }, [
          vue.createElementVNode("view", {
            class: "stat-item",
            onClick: $setup.toggleAmountDisplay
          }, [
            vue.createElementVNode(
              "text",
              { class: "number" },
              "¥" + vue.toDisplayString($setup.isAmountHidden ? "****" : $setup.formatNumber($setup.statistics.totalIncome || 0)),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "label" }, "总收入")
          ]),
          vue.createElementVNode("view", {
            class: "stat-item",
            onClick: $setup.toggleAmountDisplay
          }, [
            vue.createElementVNode(
              "text",
              { class: "number" },
              "¥" + vue.toDisplayString($setup.isAmountHidden ? "****" : $setup.formatNumber($setup.statistics.averageDailyWage || 0)),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "label" }, "平均日薪")
          ])
        ])
      ]),
      vue.createCommentVNode(" 功能菜单 "),
      vue.createElementVNode("view", { class: "menu-list" }, [
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: $setup.goToProject
        }, [
          vue.createElementVNode("view", { class: "left" }, [
            vue.createVNode(_component_tn_icon, {
              name: "order",
              class: "iconfont",
              color: "#ff6700"
            }),
            vue.createElementVNode("text", null, "账本管理")
          ]),
          vue.createElementVNode("text", { class: "iconfont icon-right" })
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: $setup.goToAccountSettings
        }, [
          vue.createElementVNode("view", { class: "left" }, [
            vue.createVNode(_component_tn_icon, {
              name: "set",
              class: "iconfont",
              color: "#ff6700"
            }),
            vue.createElementVNode("text", null, "账户设置")
          ]),
          vue.createElementVNode("text", { class: "iconfont icon-right" })
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: $setup.goToAbout
        }, [
          vue.createElementVNode("view", { class: "left" }, [
            vue.createVNode(_component_tn_icon, {
              name: "at-sign",
              class: "iconfont",
              color: "#ff6700"
            }),
            vue.createElementVNode("text", null, "关于我们")
          ]),
          vue.createElementVNode("text", { class: "iconfont icon-right" })
        ])
      ])
    ]);
  }
  const PagesPersonPerson = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-23e4402d"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/person/person.vue"]]);
  const _sfc_main$n = {
    __name: "list",
    setup(__props, { expose: __expose }) {
      __expose();
      const statusOptions = [
        {
          label: "全部",
          value: 0
        },
        {
          label: "进行中",
          value: 1
        },
        {
          label: "已完成",
          value: 2
        },
        {
          label: "已终止",
          value: 3
        }
      ];
      const projectList = vue.ref([]);
      const page = vue.ref(1);
      const pageSize = vue.ref(10);
      const total = vue.ref(0);
      const hasMore = vue.computed(() => projectList.value.length < total.value);
      const isRefreshing = vue.ref(false);
      const keyword = vue.ref("");
      const status = vue.ref(0);
      const statusText = vue.computed(() => {
        const option = statusOptions.find((item) => item.value === status.value);
        return option ? option.label : "全部";
      });
      const showFilter = vue.ref(false);
      const getList = async (isRefresh = false) => {
        try {
          const params = {
            page: page.value,
            pageSize: pageSize.value,
            keyword: keyword.value,
            status: status.value || ""
          };
          const res = await projectApi.getList(params);
          if (res.success) {
            if (isRefresh) {
              projectList.value = res.data.list;
            } else {
              projectList.value = [...projectList.value, ...res.data.list];
            }
            total.value = res.data.total;
          }
        } catch (error) {
          uni.showToast({
            title: "获取项目列表失败",
            icon: "none"
          });
        }
      };
      const refresh = async () => {
        isRefreshing.value = true;
        page.value = 1;
        await getList(true);
        isRefreshing.value = false;
      };
      const loadMore = () => {
        if (hasMore.value) {
          page.value++;
          getList();
        }
      };
      const handleSearch = () => {
        page.value = 1;
        getList(true);
      };
      const showStatusFilter = () => {
        showFilter.value = true;
      };
      const selectStatus = (value) => {
        status.value = value;
        showFilter.value = false;
        page.value = 1;
        getList(true);
      };
      const getStatusText = (status2) => {
        const option = statusOptions.find((item) => item.value === status2);
        return option ? option.label : "";
      };
      const goToDetail = (item) => {
        navigateTo("/pages/project/detail", {
          id: item.id
        });
      };
      const goToCreate = () => {
        navigateTo("/pages/project/form");
      };
      const editProject = (item) => {
        navigateTo("/pages/project/form", {
          id: item.id
        });
      };
      const deleteProject = (item) => {
        uni.showModal({
          title: "提示",
          content: "确定要删除该项目吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                const res2 = await projectApi.delete(item.id);
                if (res2.success) {
                  uni.showToast({
                    title: "删除成功",
                    icon: "success"
                  });
                  refresh();
                }
              } catch (error) {
                uni.showToast({
                  title: "删除失败",
                  icon: "none"
                });
              }
            }
          }
        });
      };
      onPullDownRefresh(() => {
        refresh().then(() => {
          uni.stopPullDownRefresh();
        });
      });
      onReachBottom(() => {
        loadMore();
      });
      vue.onMounted(() => {
        getList();
      });
      const __returned__ = { statusOptions, projectList, page, pageSize, total, hasMore, isRefreshing, keyword, status, statusText, showFilter, getList, refresh, loadMore, handleSearch, showStatusFilter, selectStatus, getStatusText, goToDetail, goToCreate, editProject, deleteProject, get onPullDownRefresh() {
        return onPullDownRefresh;
      }, get onReachBottom() {
        return onReachBottom;
      }, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, get projectApi() {
        return projectApi;
      }, get formatDate() {
        return formatDate;
      }, get navigateTo() {
        return navigateTo;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    const _component_ay_popup = resolveEasycom(vue.resolveDynamicComponent("ay-popup"), __easycom_5);
    return vue.openBlock(), vue.createElementBlock("view", { class: "project-list" }, [
      vue.createCommentVNode(" 顶部搜索栏 "),
      vue.createElementVNode("view", { class: "search-bar" }, [
        vue.createElementVNode("view", {
          class: "filter-btn",
          onClick: $setup.showStatusFilter
        }, [
          vue.createElementVNode("text", null, "筛选"),
          vue.createVNode(_component_tn_icon, {
            name: "filter",
            size: "30",
            color: "#666"
          })
        ]),
        vue.createElementVNode("view", { class: "search-input" }, [
          vue.createVNode(_component_tn_icon, {
            name: "search",
            size: "40",
            color: "#666"
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.keyword = $event),
              placeholder: "搜索项目名称",
              onConfirm: $setup.handleSearch
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $setup.keyword]
          ]),
          vue.createElementVNode("view", {
            class: "search-btn",
            onClick: $setup.handleSearch
          }, [
            vue.createElementVNode("text", null, "搜索")
          ])
        ])
      ]),
      vue.createCommentVNode(" 项目列表 "),
      vue.createElementVNode("view", { class: "project-list-content" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.projectList, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "project-item",
              key: item.id,
              onClick: ($event) => $setup.goToDetail(item)
            }, [
              vue.createElementVNode("view", { class: "project-header" }, [
                vue.createElementVNode(
                  "text",
                  { class: "project-name" },
                  vue.toDisplayString(item.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["status-tag", "status-" + item.status])
                  },
                  vue.toDisplayString($setup.getStatusText(item.status)),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "project-info" }, [
                vue.createElementVNode("view", { class: "info-row" }, [
                  vue.createElementVNode("text", { class: "label" }, "开始时间："),
                  vue.createElementVNode(
                    "text",
                    { class: "value" },
                    vue.toDisplayString(item.start_date),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-row" }, [
                  vue.createElementVNode("text", { class: "label" }, "日薪："),
                  vue.createElementVNode(
                    "text",
                    { class: "value" },
                    "¥" + vue.toDisplayString(item.daily_wage) + "/天",
                    1
                    /* TEXT */
                  )
                ]),
                item.location ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "info-row"
                }, [
                  vue.createElementVNode("text", { class: "label" }, "地点："),
                  vue.createElementVNode(
                    "text",
                    { class: "value" },
                    vue.toDisplayString(item.location),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("view", { class: "project-footer" }, [
                item.contact_person || item.contact_phone ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "contact"
                }, [
                  item.contact_person ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 0,
                      class: "contact-name"
                    },
                    vue.toDisplayString(item.contact_person),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  item.contact_phone ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 1,
                      class: "contact-phone"
                    },
                    vue.toDisplayString(item.contact_phone),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true)
                ])) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("view", { class: "action-btns" }, [
                  vue.createElementVNode("view", {
                    class: "edit-btn",
                    onClick: vue.withModifiers(($event) => $setup.editProject(item), ["stop"])
                  }, [
                    vue.createVNode(_component_tn_icon, {
                      name: "edit",
                      size: "30"
                    })
                  ], 8, ["onClick"]),
                  vue.createElementVNode("view", {
                    class: "delete-btn",
                    onClick: vue.withModifiers(($event) => $setup.deleteProject(item), ["stop"])
                  }, [
                    vue.createVNode(_component_tn_icon, {
                      name: "close",
                      size: "30"
                    })
                  ], 8, ["onClick"])
                ])
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createCommentVNode(" 空状态 "),
        $setup.projectList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", null, "暂无项目")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 加载更多 "),
        $setup.projectList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "loading-more"
        }, [
          $setup.hasMore ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "加载中...")) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "没有更多了"))
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 新增按钮 "),
      vue.createElementVNode("view", {
        class: "add-btn",
        onClick: $setup.goToCreate
      }, [
        vue.createVNode(_component_tn_icon, {
          name: "add",
          bold: "",
          size: "40",
          color: "#fff"
        })
      ]),
      vue.createCommentVNode(" 状态筛选弹窗 "),
      vue.createVNode(_component_ay_popup, {
        modelValue: $setup.showFilter,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.showFilter = $event),
        position: "left",
        "z-index": 1
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "filter-popup" }, [
            vue.createElementVNode("view", { class: "filter-header" }, [
              vue.createElementVNode("text", { class: "title" }, "项目状态"),
              vue.createVNode(_component_tn_icon, {
                name: "close",
                onClick: _cache[1] || (_cache[1] = ($event) => $setup.showFilter = false),
                size: "40",
                color: "#666"
              })
            ]),
            vue.createElementVNode("view", { class: "filter-content" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.statusOptions, (item, index) => {
                  return vue.createElementVNode("view", {
                    class: vue.normalizeClass(["filter-item", { active: $setup.status === item.value }]),
                    key: index,
                    onClick: ($event) => $setup.selectStatus(item.value)
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.label),
                      1
                      /* TEXT */
                    ),
                    $setup.status === item.value ? (vue.openBlock(), vue.createBlock(_component_tn_icon, {
                      key: 0,
                      name: "check",
                      size: "30",
                      color: "#ff6700"
                    })) : vue.createCommentVNode("v-if", true)
                  ], 10, ["onClick"]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"])
    ]);
  }
  const PagesProjectList = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-8cbf1694"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/project/list.vue"]]);
  const _sfc_main$m = {
    name: "ay-input",
    props: {
      // v-model 值
      modelValue: {
        type: [String, Number],
        default: ""
      },
      // 输入类型
      type: {
        type: String,
        default: "text",
        validator: (value) => [
          "text",
          "number",
          "idcard",
          "digit",
          "password",
          "textarea"
        ].includes(value)
      },
      // 占位文本
      placeholder: {
        type: String,
        default: "请输入"
      },
      // 占位文本样式
      placeholderStyle: {
        type: String,
        default: ""
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 最大长度
      maxlength: {
        type: [String, Number],
        default: -1
      },
      // 是否显示边框
      border: {
        type: Boolean,
        default: false
      },
      // 是否显示下划线
      underline: {
        type: Boolean,
        default: true
      },
      // 边框颜色
      borderColor: {
        type: String,
        default: "#dcdfe6"
      },
      // 文本对齐方式
      align: {
        type: String,
        default: "left",
        validator: (value) => ["left", "center", "right"].includes(value)
      },
      // 高度
      height: {
        type: [String, Number],
        default: "80rpx"
      },
      // 是否自动增高
      autoHeight: {
        type: Boolean,
        default: false
      },
      // 是否显示清除按钮
      clearable: {
        type: Boolean,
        default: false
      },
      // 是否显示字数统计
      showWordLimit: {
        type: Boolean,
        default: false
      },
      // 是否自动获取焦点
      focus: {
        type: Boolean,
        default: false
      },
      // 光标与键盘的距离
      cursorSpacing: {
        type: Number,
        default: 0
      },
      // 输入框内边距
      padding: {
        type: String,
        default: "0 20rpx"
      },
      // 是否只读
      readonly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      // 输入框样式
      inputStyle() {
        return {
          height: this.type === "textarea" ? "auto" : this.height,
          borderColor: this.borderColor,
          padding: this.padding
        };
      },
      // 文本域样式
      textareaStyle() {
        return {
          minHeight: this.height
        };
      }
    },
    methods: {
      // 输入事件
      handleInput(event) {
        const value = event.detail.value;
        this.$emit("update:modelValue", value);
        this.$emit("input", value);
      },
      // 获取焦点事件
      handleFocus(event) {
        this.$emit("focus", event);
      },
      // 失去焦点事件
      handleBlur(event) {
        this.$emit("blur", event);
      },
      // 点击完成按钮事件
      handleConfirm(event) {
        this.$emit("confirm", event);
      },
      // 清除内容
      handleClear() {
        this.$emit("update:modelValue", "");
        this.$emit("clear");
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ay-input", [
          `ay-input--${$props.type}`,
          `ay-input--align-${$props.align}`,
          {
            "ay-input--border": $props.border,
            "ay-input--underline": $props.underline,
            "ay-input--disabled": $props.disabled,
            "ay-input--readonly": $props.readonly
          }
        ]]),
        style: vue.normalizeStyle([$options.inputStyle])
      },
      [
        vue.createCommentVNode(" 前置插槽 "),
        _ctx.$slots.prefix ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "ay-input__prefix"
        }, [
          vue.renderSlot(_ctx.$slots, "prefix", {}, void 0, true)
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 输入区域 "),
        $props.type === "textarea" ? (vue.openBlock(), vue.createElementBlock("textarea", {
          key: 1,
          class: "ay-input__textarea",
          value: $props.modelValue,
          placeholder: $props.placeholder,
          "placeholder-style": $props.placeholderStyle,
          disabled: $props.disabled,
          readonly: $props.readonly,
          maxlength: $props.maxlength,
          focus: $props.focus,
          "auto-height": $props.autoHeight,
          "cursor-spacing": $props.cursorSpacing,
          style: vue.normalizeStyle([$options.textareaStyle]),
          onInput: _cache[0] || (_cache[0] = (...args) => $options.handleInput && $options.handleInput(...args)),
          onFocus: _cache[1] || (_cache[1] = (...args) => $options.handleFocus && $options.handleFocus(...args)),
          onBlur: _cache[2] || (_cache[2] = (...args) => $options.handleBlur && $options.handleBlur(...args)),
          onConfirm: _cache[3] || (_cache[3] = (...args) => $options.handleConfirm && $options.handleConfirm(...args))
        }, null, 44, ["value", "placeholder", "placeholder-style", "disabled", "readonly", "maxlength", "focus", "auto-height", "cursor-spacing"])) : (vue.openBlock(), vue.createElementBlock("input", {
          key: 2,
          class: "ay-input__input",
          type: $props.type,
          value: $props.modelValue,
          placeholder: $props.placeholder,
          "placeholder-style": $props.placeholderStyle,
          disabled: $props.disabled,
          readonly: $props.readonly,
          maxlength: $props.maxlength,
          focus: $props.focus,
          "cursor-spacing": $props.cursorSpacing,
          password: $props.type === "password",
          onInput: _cache[4] || (_cache[4] = (...args) => $options.handleInput && $options.handleInput(...args)),
          onFocus: _cache[5] || (_cache[5] = (...args) => $options.handleFocus && $options.handleFocus(...args)),
          onBlur: _cache[6] || (_cache[6] = (...args) => $options.handleBlur && $options.handleBlur(...args)),
          onConfirm: _cache[7] || (_cache[7] = (...args) => $options.handleConfirm && $options.handleConfirm(...args))
        }, null, 40, ["type", "value", "placeholder", "placeholder-style", "disabled", "readonly", "maxlength", "focus", "cursor-spacing", "password"])),
        vue.createCommentVNode(" 后置插槽 "),
        _ctx.$slots.suffix ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 3,
          class: "ay-input__suffix"
        }, [
          vue.renderSlot(_ctx.$slots, "suffix", {}, void 0, true)
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 清除按钮 "),
        $props.clearable && $props.modelValue && !$props.disabled && !$props.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 4,
          class: "ay-input__clear",
          onClick: _cache[8] || (_cache[8] = vue.withModifiers((...args) => $options.handleClear && $options.handleClear(...args), ["stop"]))
        }, [
          vue.createVNode(_component_tn_icon, {
            name: "clear",
            class: "iconfont",
            color: "#ff6700"
          })
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 字数统计 "),
        $props.showWordLimit && $props.maxlength ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 5,
          class: "ay-input__count"
        }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($props.modelValue.length),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", null, "/"),
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($props.maxlength),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-25db90d5"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-input/ay-input.vue"]]);
  const _sfc_main$l = {
    __name: "ay-textarea",
    props: {
      modelValue: {
        type: String,
        default: ""
      },
      placeholder: {
        type: String,
        default: "请输入"
      },
      placeholderStyle: {
        type: String,
        default: ""
      },
      maxlength: {
        type: [String, Number],
        default: 140
      },
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: true
      },
      showWordLimit: {
        type: Boolean,
        default: true
      },
      auto_height: {
        type: Boolean,
        default: false
      },
      height: {
        type: [String, Number],
        default: "120rpx"
      }
    },
    emits: ["update:modelValue", "input", "focus", "blur", "confirm"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const inputValue = vue.ref("");
      const textareaStyle = vue.computed(() => {
        return {
          height: props.auto_height ? "auto" : props.height
        };
      });
      vue.watch(() => props.modelValue, (newVal) => {
        inputValue.value = newVal;
      }, {
        immediate: true
      });
      function handleInput(event) {
        const {
          value
        } = event.detail;
        emit("update:modelValue", value);
        emit("input", value);
      }
      function handleFocus(event) {
        emit("focus", event);
      }
      function handleBlur(event) {
        emit("blur", event);
      }
      function handleConfirm(event) {
        emit("confirm", event);
      }
      const __returned__ = { props, emit, inputValue, textareaStyle, handleInput, handleFocus, handleBlur, handleConfirm, ref: vue.ref, watch: vue.watch, onMounted: vue.onMounted, computed: vue.computed };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ay-textarea", {
          "ay-textarea--border": $props.border,
          "ay-textarea--disabled": $props.disabled,
          "ay-textarea--readonly": $props.readonly
        }])
      },
      [
        vue.withDirectives(vue.createElementVNode("textarea", {
          class: "ay-textarea__inner",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.inputValue = $event),
          placeholder: $props.placeholder,
          "placeholder-style": $props.placeholderStyle,
          disabled: $props.disabled,
          readonly: $props.readonly,
          maxlength: $props.maxlength,
          "adjust-position": "",
          "auto-height": $props.auto_height,
          style: vue.normalizeStyle($setup.textareaStyle),
          onInput: $setup.handleInput,
          onFocus: $setup.handleFocus,
          onBlur: $setup.handleBlur,
          onConfirm: $setup.handleConfirm
        }, null, 44, ["placeholder", "placeholder-style", "disabled", "readonly", "maxlength", "auto-height"]), [
          [vue.vModelText, $setup.inputValue]
        ]),
        vue.createCommentVNode(" 字数统计 "),
        $props.showWordLimit && $props.maxlength ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "ay-textarea__count"
        }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.inputValue.length),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", null, "/"),
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($props.maxlength),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_4$1 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-7ca846ad"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-textarea/ay-textarea.vue"]]);
  const _sfc_main$k = {
    __name: "form",
    setup(__props, { expose: __expose }) {
      __expose();
      const statusOptions = [
        {
          label: "进行中",
          value: 1
        },
        {
          label: "已完成",
          value: 2
        },
        {
          label: "已终止",
          value: 3
        }
      ];
      const form = vue.ref({
        name: "",
        start_date: "",
        end_date: "",
        daily_wage: "",
        status: 1,
        location: "",
        description: "",
        contact_person: "",
        contact_phone: ""
      });
      const showCalendar = vue.ref(false);
      const dateType = vue.ref("start");
      const calendarStartDate = vue.computed(() => {
        if (dateType.value === "end" && form.value.start_date) {
          return form.value.start_date;
        }
        return "2024-01-01";
      });
      const calendarEndDate = vue.computed(() => {
        if (dateType.value === "start" && form.value.end_date) {
          return form.value.end_date;
        }
        return getNowDate();
      });
      const isEdit = vue.ref(false);
      const projectId = vue.ref("");
      const showDatePicker = (type) => {
        dateType.value = type;
        showCalendar.value = true;
      };
      const handleDateSelect = (date) => {
        const formattedDate = formatDate(date);
        if (dateType.value === "start") {
          form.value.start_date = formattedDate;
          if (form.value.end_date && form.value.end_date < formattedDate) {
            form.value.end_date = "";
          }
        } else {
          form.value.end_date = formattedDate;
        }
        showCalendar.value = false;
      };
      const selectStatus = (value) => {
        form.value.status = value;
      };
      const validateForm = () => {
        if (!form.value.name) {
          uni.showToast({
            title: "请输入项目名称",
            icon: "none"
          });
          return false;
        }
        if (!form.value.start_date) {
          uni.showToast({
            title: "请选择开始时间",
            icon: "none"
          });
          return false;
        }
        if (!form.value.daily_wage) {
          uni.showToast({
            title: "请输入点工日薪",
            icon: "none"
          });
          return false;
        }
        return true;
      };
      const handleSubmit = async () => {
        if (!validateForm())
          return;
        try {
          uni.showLoading({
            title: "提交中...",
            mask: true
          });
          const submitData = {
            ...form.value,
            daily_wage: parseFloat(form.value.daily_wage)
          };
          const res = isEdit.value ? await projectApi.update(projectId.value, submitData) : await projectApi.create(submitData);
          if (res.success) {
            uni.showToast({
              title: isEdit.value ? "修改成功" : "创建成功",
              icon: "success"
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        } catch (error) {
          uni.showToast({
            title: error.message || "提交失败",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      };
      const getProjectDetail = async (id) => {
        try {
          const res = await projectApi.getDetail(id);
          if (res.success) {
            form.value = res.data;
          }
        } catch (error) {
          uni.showToast({
            title: "获取项目详情失败",
            icon: "none"
          });
        }
      };
      onLoad((options) => {
        const params = getParams(options);
        if (params == null ? void 0 : params.id) {
          isEdit.value = true;
          projectId.value = params.id;
          getProjectDetail(params.id);
        }
      });
      const __returned__ = { statusOptions, form, showCalendar, dateType, calendarStartDate, calendarEndDate, isEdit, projectId, showDatePicker, handleDateSelect, selectStatus, validateForm, handleSubmit, getProjectDetail, get onLoad() {
        return onLoad;
      }, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, get projectApi() {
        return projectApi;
      }, get getParams() {
        return getParams;
      }, get formatDate() {
        return formatDate;
      }, get getNowDate() {
        return getNowDate;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ay_title = resolveEasycom(vue.resolveDynamicComponent("ay-title"), __easycom_2$2);
    const _component_ay_input = resolveEasycom(vue.resolveDynamicComponent("ay-input"), __easycom_2);
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    const _component_ay_textarea = resolveEasycom(vue.resolveDynamicComponent("ay-textarea"), __easycom_4$1);
    const _component_ay_calendar = resolveEasycom(vue.resolveDynamicComponent("ay-calendar"), __easycom_6);
    const _component_ay_popup = resolveEasycom(vue.resolveDynamicComponent("ay-popup"), __easycom_5);
    return vue.openBlock(), vue.createElementBlock("view", { class: "project-form" }, [
      vue.createCommentVNode(" 表单内容 "),
      vue.createElementVNode("view", { class: "form-content" }, [
        vue.createCommentVNode(" 基本信息 "),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createVNode(_component_ay_title, {
            title: "基本信息",
            bold: "",
            padding: "0",
            margin: "0"
          }),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label required" }, "项目名称"),
            vue.createVNode(_component_ay_input, {
              class: "form-value",
              modelValue: $setup.form.name,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.form.name = $event),
              placeholder: "请输入项目名称",
              underline: true,
              clearable: true
            }, null, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label required" }, "开始时间"),
            vue.createVNode(_component_ay_input, {
              class: "form-value",
              modelValue: $setup.form.start_date,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.form.start_date = $event),
              placeholder: "请选择开始时间",
              underline: true,
              readonly: "",
              onClick: _cache[3] || (_cache[3] = ($event) => $setup.showDatePicker("start")),
              onFocus: _cache[4] || (_cache[4] = vue.withModifiers(() => {
              }, ["prevent"]))
            }, {
              suffix: vue.withCtx(() => [
                vue.createVNode(_component_tn_icon, {
                  name: "calendar",
                  size: "30",
                  color: "#ff6700",
                  onClick: _cache[1] || (_cache[1] = ($event) => $setup.showDatePicker("start"))
                })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "结束时间"),
            vue.createVNode(_component_ay_input, {
              class: "form-value",
              modelValue: $setup.form.end_date,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.form.end_date = $event),
              placeholder: "请选择结束时间",
              underline: true,
              readonly: "",
              onClick: _cache[7] || (_cache[7] = ($event) => $setup.showDatePicker("end")),
              onFocus: _cache[8] || (_cache[8] = vue.withModifiers(() => {
              }, ["prevent"]))
            }, {
              suffix: vue.withCtx(() => [
                vue.createVNode(_component_tn_icon, {
                  name: "calendar",
                  size: "30",
                  color: "#ff6700",
                  onClick: _cache[5] || (_cache[5] = ($event) => $setup.showDatePicker("end"))
                })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "项目地点"),
            vue.createVNode(_component_ay_input, {
              class: "form-value",
              modelValue: $setup.form.location,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.form.location = $event),
              placeholder: "请输入项目地点",
              underline: true,
              clearable: true
            }, {
              suffix: vue.withCtx(() => [
                vue.createVNode(_component_tn_icon, {
                  name: "location",
                  size: "30",
                  color: "#666"
                })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "项目描述"),
            vue.createVNode(_component_ay_textarea, {
              class: "form-value",
              modelValue: $setup.form.description,
              "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $setup.form.description = $event),
              placeholder: "请输入项目描述",
              border: "",
              auto_height: "",
              showWordLimit: "",
              maxlength: 200
            }, null, 8, ["modelValue"])
          ])
        ]),
        vue.createCommentVNode(" 工资设置 "),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createVNode(_component_ay_title, {
            title: "工资设置",
            bold: "",
            padding: "0",
            margin: "0"
          }),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label required" }, "点工日薪"),
            vue.createVNode(_component_ay_input, {
              class: "form-value",
              modelValue: $setup.form.daily_wage,
              "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $setup.form.daily_wage = $event),
              type: "digit",
              placeholder: "请输入点工日薪",
              underline: true,
              align: "right"
            }, {
              suffix: vue.withCtx(() => [
                vue.createElementVNode("text", { class: "unit" }, "元/天")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ])
        ]),
        vue.createCommentVNode(" 联系人信息 "),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createVNode(_component_ay_title, {
            title: "联系人信息",
            bold: "",
            padding: "0",
            margin: "0"
          }),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "联系人"),
            vue.createVNode(_component_ay_input, {
              class: "form-value",
              modelValue: $setup.form.contact_person,
              "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $setup.form.contact_person = $event),
              placeholder: "请输入联系人",
              underline: true,
              clearable: true
            }, null, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "联系电话"),
            vue.createVNode(_component_ay_input, {
              class: "form-value",
              modelValue: $setup.form.contact_phone,
              "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $setup.form.contact_phone = $event),
              type: "number",
              placeholder: "请输入联系电话",
              underline: true,
              maxlength: 11,
              clearable: true
            }, null, 8, ["modelValue"])
          ])
        ]),
        vue.createCommentVNode(" 项目状态 "),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createVNode(_component_ay_title, {
            title: "项目状态",
            bold: "",
            margin: "0",
            padding: "0"
          }),
          vue.createElementVNode("view", { class: "status-options" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.statusOptions, (item, index) => {
                return vue.createElementVNode("view", {
                  key: index,
                  class: vue.normalizeClass(["status-item", { active: $setup.form.status === item.value }]),
                  onClick: ($event) => $setup.selectStatus(item.value)
                }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item.label),
                    1
                    /* TEXT */
                  )
                ], 10, ["onClick"]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ])
      ]),
      vue.createCommentVNode(" 底部按钮 "),
      vue.createElementVNode("view", { class: "bottom-btn-area" }, [
        vue.createElementVNode(
          "view",
          {
            class: "submit-btn",
            onClick: $setup.handleSubmit
          },
          vue.toDisplayString($setup.isEdit ? "保存" : "创建"),
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 日期选择器 "),
      vue.createVNode(_component_ay_popup, {
        modelValue: $setup.showCalendar,
        "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $setup.showCalendar = $event),
        position: "bottom"
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "calendar-container" }, [
            $setup.showCalendar ? (vue.openBlock(), vue.createBlock(_component_ay_calendar, {
              key: 0,
              startDate: $setup.calendarStartDate,
              endDate: $setup.calendarEndDate,
              onDateSelected: $setup.handleDateSelect
            }, null, 8, ["startDate", "endDate"])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"])
    ]);
  }
  const PagesProjectForm = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-a08f73ef"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/project/form.vue"]]);
  const uploadApi = {
    // 上传图片
    uploadImage(filePath) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: `${"https://aybks.anyaowl.cn"}/upload`,
          filePath,
          name: "file",
          header: {
            Authorization: `Bearer ${uni.getStorageSync("token")}`
          },
          success: (res) => {
            const data = JSON.parse(res.data);
            if (data.code == 200) {
              resolve(data.data);
            } else {
              uni.showToast({
                title: data.message || "上传失败",
                icon: "none"
              });
              reject(data);
            }
          },
          fail: (err) => {
            uni.showToast({
              title: "上传失败",
              icon: "none"
            });
            reject(err);
          }
        });
      });
    }
  };
  const _sfc_main$j = {
    __name: "profile",
    setup(__props, { expose: __expose }) {
      __expose();
      const userInfo = vue.ref({
        avatar: "",
        nickname: "",
        username: ""
      });
      const getUserInfo = async () => {
        try {
          const res = await userApi.getUserInfo();
          if (res.success) {
            userInfo.value = res.data;
          }
        } catch (error) {
          uni.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
        }
      };
      const chooseAvatar = () => {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: async (res) => {
            try {
              uni.showLoading({
                title: "上传中...",
                mask: true
              });
              const uploadRes = await uploadApi.uploadImage(res.tempFilePaths[0]);
              userInfo.value.avatar = uploadRes.url;
              await handleSubmit();
            } catch (error) {
              formatAppLog("error", "at pages/person/profile.vue:100", "上传失败:", error);
            } finally {
              uni.hideLoading();
            }
          }
        });
      };
      const handleSubmit = async () => {
        if (!userInfo.value.nickname.trim()) {
          uni.showToast({
            title: "昵称不能为空",
            icon: "none"
          });
          return;
        }
        try {
          const res = await userApi.updateUserInfo({
            nickname: userInfo.value.nickname,
            avatar: userInfo.value.avatar
          });
          if (res.success) {
            uni.showToast({
              title: "修改成功",
              icon: "success"
            });
            setTimeout(() => {
              goBack();
            }, 1500);
          }
        } catch (error) {
          uni.showToast({
            title: "修改失败",
            icon: "none"
          });
        }
      };
      const goToChangePassword = () => {
        uni.navigateTo({
          url: "/pages/person/changePassword"
        });
      };
      const goBack = () => {
        uni.navigateBack();
      };
      vue.onMounted(() => {
        getUserInfo();
      });
      const __returned__ = { userInfo, getUserInfo, chooseAvatar, handleSubmit, goToChangePassword, goBack, ref: vue.ref, onMounted: vue.onMounted, get userApi() {
        return userApi;
      }, get uploadApi() {
        return uploadApi;
      }, get baseUrl() {
        return baseUrl;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "profile-container" }, [
      vue.createElementVNode("view", { class: "content" }, [
        vue.createCommentVNode(" 头像部分 "),
        vue.createElementVNode("view", {
          class: "avatar-section",
          onClick: $setup.chooseAvatar
        }, [
          vue.createElementVNode("view", { class: "left" }, [
            vue.createElementVNode("text", { class: "label" }, "头像")
          ]),
          vue.createElementVNode("view", { class: "right" }, [
            vue.createElementVNode("image", {
              class: "avatar",
              src: $setup.baseUrl + $setup.userInfo.avatar || "/static/tx.jpg",
              mode: "aspectFill"
            }, null, 8, ["src"]),
            vue.createElementVNode("text", { class: "iconfont icon-right" })
          ])
        ]),
        vue.createCommentVNode(" 信息表单 "),
        vue.createElementVNode("view", { class: "info-section" }, [
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "label" }, "昵称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.userInfo.nickname = $event),
                placeholder: "请输入昵称",
                maxlength: "12"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.userInfo.nickname]
            ])
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "label" }, "账号"),
            vue.createElementVNode(
              "text",
              { class: "value" },
              vue.toDisplayString($setup.userInfo.username || "-"),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createCommentVNode(" 修改密码按钮 "),
        vue.createElementVNode("view", {
          class: "password-section",
          onClick: $setup.goToChangePassword
        }, [
          vue.createElementVNode("text", { class: "label" }, "修改密码"),
          vue.createElementVNode("text", { class: "iconfont icon-right" })
        ])
      ]),
      vue.createCommentVNode(" 保存按钮 "),
      vue.createElementVNode("view", { class: "bottom-btn-area" }, [
        vue.createElementVNode("view", {
          class: "submit-btn",
          onClick: $setup.handleSubmit
        }, " 保存 ")
      ])
    ]);
  }
  const PagesPersonProfile = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/person/profile.vue"]]);
  const _sfc_main$i = {
    __name: "changePassword",
    setup(__props, { expose: __expose }) {
      __expose();
      const formData = vue.ref({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      const validatePassword = (password) => {
        const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        return reg.test(password);
      };
      const handleSubmit = async () => {
        const {
          oldPassword,
          newPassword,
          confirmPassword
        } = formData.value;
        if (!oldPassword || !newPassword || !confirmPassword) {
          uni.showToast({
            title: "请填写完整信息",
            icon: "none"
          });
          return;
        }
        if (!validatePassword(newPassword)) {
          uni.showToast({
            title: "新密码格式不正确",
            icon: "none"
          });
          return;
        }
        if (newPassword !== confirmPassword) {
          uni.showToast({
            title: "两次输入的密码不一致",
            icon: "none"
          });
          return;
        }
        try {
          const res = await userApi.updatePassword({
            oldPassword,
            newPassword
          });
          formatAppLog("log", "at pages/person/changePassword.vue:93", res);
          if (res.success) {
            uni.showToast({
              title: "修改成功",
              icon: "success"
            });
            setTimeout(() => {
              uni.clearStorageSync();
              uni.reLaunch({
                url: "/pages/login/login"
              });
            }, 1500);
          }
        } catch (error) {
          uni.showToast({
            title: error.message || "修改失败",
            icon: "none"
          });
        }
      };
      const __returned__ = { formData, validatePassword, handleSubmit, ref: vue.ref, get userApi() {
        return userApi;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "change-password-container" }, [
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "当前密码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "password",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formData.oldPassword = $event),
                placeholder: "请输入当前密码",
                password: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.formData.oldPassword]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "新密码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "password",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formData.newPassword = $event),
                placeholder: "请输入新密码",
                password: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.formData.newPassword]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "确认密码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "password",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formData.confirmPassword = $event),
                placeholder: "请再次输入新密码",
                password: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.formData.confirmPassword]
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "tips" }, [
          vue.createElementVNode("text", { class: "tip-item" }, "* 密码长度为8-20位"),
          vue.createElementVNode("text", { class: "tip-item" }, "* 必须包含字母和数字")
        ])
      ]),
      vue.createCommentVNode(" 保存按钮 "),
      vue.createElementVNode("view", { class: "bottom-btn-area" }, [
        vue.createElementVNode("view", {
          class: "submit-btn",
          onClick: $setup.handleSubmit
        }, " 确认修改 ")
      ])
    ]);
  }
  const PagesPersonChangePassword = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/person/changePassword.vue"]]);
  const _sfc_main$h = {
    name: "ay-switch",
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      activeColor: {
        type: String,
        default: "#ff6700"
      },
      inactiveColor: {
        type: String,
        default: "#dcdfe6"
      },
      size: {
        type: String,
        default: "medium",
        // small, medium, large
        validator: (value) => ["small", "medium", "large"].includes(value)
      },
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleTap() {
        if (this.disabled || this.loading)
          return;
        const newValue = !this.modelValue;
        this.$emit("update:modelValue", newValue);
        this.$emit("change", newValue);
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ay-switch", [
          $props.modelValue ? "ay-switch--active" : "",
          `ay-switch--${$props.size}`
        ]]),
        style: vue.normalizeStyle({
          backgroundColor: $props.modelValue ? $props.activeColor : $props.inactiveColor,
          borderColor: $props.modelValue ? $props.activeColor : $props.inactiveColor
        }),
        onClick: _cache[0] || (_cache[0] = (...args) => $options.handleTap && $options.handleTap(...args))
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["ay-switch__node", { "ay-switch__node--active": $props.modelValue }])
          },
          [
            $props.loading ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "ay-switch__loading"
            })) : vue.createCommentVNode("v-if", true)
          ],
          2
          /* CLASS */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-c82680ef"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-switch/ay-switch.vue"]]);
  const _sfc_main$g = {
    __name: "accountSettings",
    setup(__props, { expose: __expose }) {
      __expose();
      const settings = vue.ref({
        dailyReminder: true,
        salaryReminder: true,
        showAmount: true,
        fingerprintLock: false
      });
      const cacheSize = vue.ref("0.0MB");
      const version = vue.ref("1.0.0");
      const showProgress = vue.ref(false);
      const downloadProgress = vue.ref(0);
      const loadUserSettings = () => {
        var _a, _b, _c;
        try {
          const userSettings = uni.getStorageSync("user_settings");
          if (userSettings) {
            settings.value = {
              dailyReminder: ((_a = userSettings.notification) == null ? void 0 : _a.enabled) ?? true,
              showAmount: !((_b = userSettings.amount_display) == null ? void 0 : _b.hide_amount),
              fingerprintLock: ((_c = userSettings.fingerprint_unlock) == null ? void 0 : _c.enabled) ?? false
            };
          }
        } catch (error) {
          formatAppLog("error", "at pages/person/accountSettings.vue:125", "加载用户设置失败:", error);
        }
      };
      const saveUserSettings = () => {
        try {
          const userSettings = uni.getStorageSync("user_settings") || {};
          userSettings.notification = {
            ...userSettings.notification,
            enabled: settings.value.dailyReminder
          };
          userSettings.amount_display = {
            ...userSettings.amount_display,
            hide_amount: !settings.value.showAmount
          };
          userSettings.fingerprint_unlock = {
            ...userSettings.fingerprint_unlock,
            enabled: settings.value.fingerprintLock,
            last_updated: (/* @__PURE__ */ new Date()).getTime()
          };
          uni.setStorageSync("user_settings", userSettings);
        } catch (error) {
          formatAppLog("error", "at pages/person/accountSettings.vue:154", "保存用户设置失败:", error);
          uni.showToast({
            title: "设置保存失败",
            icon: "error"
          });
        }
      };
      vue.watch(settings, () => {
        saveUserSettings();
      }, {
        deep: true
      });
      const getCacheSize = async () => {
        try {
          const size = await new Promise((resolve, reject) => {
            plus.cache.calculate((size2) => {
              const formatSize = (size3) => {
                if (size3 < 1024)
                  return size3 + "B";
                if (size3 < 1024 * 1024)
                  return (size3 / 1024).toFixed(2) + "KB";
                return (size3 / 1024 / 1024).toFixed(2) + "MB";
              };
              resolve(formatSize(size2));
            }, (e2) => {
              reject(e2);
            });
          });
          cacheSize.value = size;
        } catch (error) {
          formatAppLog("error", "at pages/person/accountSettings.vue:188", "获取缓存大小失败:", error);
          cacheSize.value = "0B";
        }
      };
      const clearCache = () => {
        uni.showModal({
          title: "提示",
          content: "确定要清除缓存吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                await new Promise((resolve, reject) => {
                  plus.cache.clear(() => {
                    resolve();
                  }, (e2) => {
                    reject(e2);
                  });
                });
                uni.showToast({
                  title: "清除成功",
                  icon: "success"
                });
                getCacheSize();
              } catch (error) {
                formatAppLog("error", "at pages/person/accountSettings.vue:254", "清除缓存失败:", error);
                uni.showToast({
                  title: "清除失败",
                  icon: "error"
                });
              }
            }
          }
        });
      };
      const checkUpdate = async () => {
        uni.showLoading({
          title: "检查中..."
        });
        try {
          const platform = plus.os.name.toLowerCase();
          const currentVersion = plus.runtime.version;
          formatAppLog("log", "at pages/person/accountSettings.vue:274", "当前版本号：", currentVersion);
          const res = await userApi.getUpdate({
            version: currentVersion,
            platform
          });
          uni.hideLoading();
          if (!res.success) {
            throw new Error("获取更新信息失败");
          }
          const updateInfo = res.data;
          if (updateInfo.has_update) {
            uni.showModal({
              title: "发现新版本 " + updateInfo.latest_version,
              content: `更新内容：
${updateInfo.change_log}

安装包大小：${updateInfo.package_size}MB`,
              confirmText: updateInfo.force_update ? "立即更新" : "更新",
              cancelText: "稍后再说",
              showCancel: !updateInfo.force_update,
              success: (result) => {
                if (result.confirm) {
                  showProgress.value = true;
                  downloadProgress.value = 0;
                  const dtask = plus.downloader.createDownload(updateInfo.download_url, {
                    filename: "_doc/update/"
                  }, (d2, status) => {
                    if (status == 200) {
                      showProgress.value = false;
                      uni.showModal({
                        title: "下载完成",
                        content: "新版本已下载完成，是否立即安装？",
                        confirmText: "立即安装",
                        success: (res2) => {
                          if (res2.confirm) {
                            plus.runtime.install(d2.filename, {
                              force: false
                            }, () => {
                              if (updateInfo.force_update) {
                                plus.runtime.restart();
                              }
                            }, (e2) => {
                              uni.showToast({
                                title: "安装失败",
                                icon: "error"
                              });
                            });
                          }
                        }
                      });
                    } else {
                      showProgress.value = false;
                      uni.showToast({
                        title: "下载失败",
                        icon: "error"
                      });
                    }
                  });
                  let lastProgressValue = 0;
                  dtask.addEventListener("statechanged", (task, status) => {
                    if (task.state === 3) {
                      const progress = parseInt(task.downloadedSize / task.totalSize * 100);
                      downloadProgress.value = progress;
                    }
                  });
                  dtask.start();
                }
              }
            });
          } else {
            uni.showToast({
              title: "已是最新版本",
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/person/accountSettings.vue:359", "检查更新失败:", error);
          uni.hideLoading();
          uni.showToast({
            title: "检查更新失败",
            icon: "error"
          });
        }
      };
      const handleLogout = () => {
        uni.showModal({
          title: "提示",
          content: "确定要退出登录吗？",
          success: (res) => {
            if (res.confirm) {
              uni.clearStorageSync();
              uni.reLaunch({
                url: "/pages/login/login"
              });
            }
          }
        });
      };
      onLoad(() => {
        loadUserSettings();
        getCacheSize();
      });
      const __returned__ = { settings, cacheSize, version, showProgress, downloadProgress, loadUserSettings, saveUserSettings, getCacheSize, clearCache, checkUpdate, handleLogout, get onLoad() {
        return onLoad;
      }, ref: vue.ref, onMounted: vue.onMounted, watch: vue.watch, get userApi() {
        return userApi;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ay_title = resolveEasycom(vue.resolveDynamicComponent("ay-title"), __easycom_2$2);
    const _component_ay_switch = resolveEasycom(vue.resolveDynamicComponent("ay-switch"), __easycom_3);
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "settings-container" }, [
      vue.createCommentVNode(" 通知设置 "),
      vue.createElementVNode("view", { class: "settings-section" }, [
        vue.createVNode(_component_ay_title, {
          title: "通知设置",
          bold: ""
        }),
        vue.createElementVNode("view", { class: "settings-item" }, [
          vue.createElementVNode("view", { class: "item-left" }, [
            vue.createElementVNode("text", { class: "label" }, "每日提醒"),
            vue.createElementVNode("text", { class: "desc" }, "每天提醒你记账")
          ]),
          vue.createVNode(_component_ay_switch, {
            modelValue: $setup.settings.dailyReminder,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.settings.dailyReminder = $event),
            "active-color": "#ff6700"
          }, null, 8, ["modelValue"])
        ]),
        vue.createCommentVNode(' <view class="settings-item">\r\n				<view class="item-left">\r\n					<text class="label">工资到账提醒</text>\r\n					<text class="desc">工资到账时通知你</text>\r\n				</view>\r\n				<ay-switch v-model="settings.salaryReminder" active-color="#ff6700"></ay-switch>\r\n			</view> ')
      ]),
      vue.createCommentVNode(" 隐私设置 "),
      vue.createElementVNode("view", { class: "settings-section" }, [
        vue.createVNode(_component_ay_title, {
          title: "隐私设置",
          bold: ""
        }),
        vue.createElementVNode("view", { class: "settings-item" }, [
          vue.createElementVNode("view", { class: "item-left" }, [
            vue.createElementVNode("text", { class: "label" }, "金额显示"),
            vue.createElementVNode("text", { class: "desc" }, "在首页显示具体金额")
          ]),
          vue.createVNode(_component_ay_switch, {
            modelValue: $setup.settings.showAmount,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.settings.showAmount = $event),
            "active-color": "#ff6700"
          }, null, 8, ["modelValue"])
        ]),
        vue.createElementVNode("view", { class: "settings-item" }, [
          vue.createElementVNode("view", { class: "item-left" }, [
            vue.createElementVNode("text", { class: "label" }, "指纹解锁"),
            vue.createElementVNode("text", { class: "desc" }, "使用指纹快速进入应用")
          ]),
          vue.createVNode(_component_ay_switch, {
            modelValue: $setup.settings.fingerprintLock,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.settings.fingerprintLock = $event),
            "active-color": "#ff6700"
          }, null, 8, ["modelValue"])
        ])
      ]),
      vue.createCommentVNode(" 其他设置 "),
      vue.createElementVNode("view", { class: "settings-section" }, [
        vue.createVNode(_component_ay_title, {
          title: "其他设置",
          bold: ""
        }),
        vue.createElementVNode("view", {
          class: "settings-item",
          onClick: $setup.clearCache
        }, [
          vue.createElementVNode("view", { class: "item-left" }, [
            vue.createElementVNode("text", { class: "label" }, "清除缓存"),
            vue.createElementVNode(
              "text",
              { class: "desc" },
              vue.toDisplayString($setup.cacheSize),
              1
              /* TEXT */
            )
          ]),
          vue.createVNode(_component_tn_icon, { name: "right" })
        ]),
        vue.createElementVNode("view", {
          class: "settings-item",
          onClick: $setup.checkUpdate
        }, [
          vue.createElementVNode("view", { class: "item-left" }, [
            vue.createElementVNode("text", { class: "label" }, "检查更新"),
            vue.createElementVNode(
              "text",
              { class: "desc" },
              "当前版本 " + vue.toDisplayString($setup.version),
              1
              /* TEXT */
            )
          ]),
          vue.createVNode(_component_tn_icon, { name: "right" })
        ])
      ]),
      vue.createCommentVNode(" 退出登录按钮 "),
      vue.createElementVNode("view", {
        class: "logout-btn",
        onClick: $setup.handleLogout
      }, " 退出登录 "),
      vue.createCommentVNode(" 下载进度弹窗 "),
      $setup.showProgress ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "download-progress"
      }, [
        vue.createElementVNode("view", { class: "progress-box" }, [
          vue.createElementVNode("view", { class: "progress-title" }, "正在下载新版本"),
          vue.createElementVNode("view", { class: "progress-bar" }, [
            vue.createElementVNode(
              "view",
              {
                class: "progress-inner",
                style: vue.normalizeStyle({ width: `${$setup.downloadProgress}%` })
              },
              [
                vue.createElementVNode(
                  "text",
                  { class: "progress-text" },
                  vue.toDisplayString($setup.downloadProgress) + "%",
                  1
                  /* TEXT */
                )
              ],
              4
              /* STYLE */
            )
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesPersonAccountSettings = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/person/accountSettings.vue"]]);
  const _imports_0 = "/static/logo.png";
  const _sfc_main$f = {
    __name: "about",
    setup(__props, { expose: __expose }) {
      __expose();
      const copyEmail = () => {
        uni.setClipboardData({
          data: "206788568@qq.com"
        });
      };
      const copyWechat = () => {
        uni.setClipboardData({
          data: "ayao110100"
        });
      };
      const __returned__ = { copyEmail, copyWechat };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ay_title = resolveEasycom(vue.resolveDynamicComponent("ay-title"), __easycom_2$2);
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "about-container" }, [
      vue.createCommentVNode(" 应用信息 "),
      vue.createElementVNode("view", { class: "app-info" }, [
        vue.createElementVNode("image", {
          class: "app-logo",
          src: _imports_0,
          mode: "aspectFill"
        }),
        vue.createElementVNode("text", { class: "app-name" }, "俺要记账"),
        vue.createElementVNode("text", { class: "app-version" }, "v1.0.0")
      ]),
      vue.createCommentVNode(" 产品介绍 "),
      vue.createElementVNode("view", { class: "product-intro" }, [
        vue.createElementVNode("text", { class: "intro-text" }, "俺要(安尧)记账是一款简单易用的记账工具，旨在帮助用户轻松记录日常收入和支出，提供清晰的财务统计，助力用户更好地管理个人财务。")
      ]),
      vue.createCommentVNode(" 功能介绍 "),
      vue.createElementVNode("view", { class: "feature-section" }, [
        vue.createVNode(_component_ay_title, {
          title: "主要功能",
          bold: ""
        }),
        vue.createElementVNode("view", { class: "feature-list" }, [
          vue.createElementVNode("view", { class: "feature-item" }, [
            vue.createElementVNode("view", { class: "icon-box" }, [
              vue.createVNode(_component_tn_icon, {
                name: "calendar",
                size: "48",
                color: "#ff6700"
              })
            ]),
            vue.createElementVNode("text", { class: "feature-name" }, "日常记账"),
            vue.createElementVNode("text", { class: "feature-desc" }, "轻松记录每日工作收入")
          ]),
          vue.createElementVNode("view", { class: "feature-item" }, [
            vue.createElementVNode("view", { class: "icon-box" }, [
              vue.createVNode(_component_tn_icon, {
                name: "refund",
                size: "48",
                color: "#ff6700"
              })
            ]),
            vue.createElementVNode("text", { class: "feature-name" }, "收入统计"),
            vue.createElementVNode("text", { class: "feature-desc" }, "清晰掌握收入情况")
          ]),
          vue.createElementVNode("view", { class: "feature-item" }, [
            vue.createElementVNode("view", { class: "icon-box" }, [
              vue.createVNode(_component_tn_icon, {
                name: "bookmark",
                size: "48",
                color: "#ff6700"
              })
            ]),
            vue.createElementVNode("text", { class: "feature-name" }, "项目管理"),
            vue.createElementVNode("text", { class: "feature-desc" }, "多项目分类管理")
          ]),
          vue.createElementVNode("view", { class: "feature-item" }, [
            vue.createElementVNode("view", { class: "icon-box" }, [
              vue.createVNode(_component_tn_icon, {
                name: "time",
                size: "48",
                color: "#ff6700"
              })
            ]),
            vue.createElementVNode("text", { class: "feature-name" }, "工时记录"),
            vue.createElementVNode("text", { class: "feature-desc" }, "准确记录工作时间")
          ])
        ])
      ]),
      vue.createCommentVNode(" 联系我们 "),
      vue.createElementVNode("view", { class: "contact-section" }, [
        vue.createVNode(_component_ay_title, {
          title: "联系我们",
          bold: ""
        }),
        vue.createElementVNode("view", { class: "contact-list" }, [
          vue.createElementVNode("view", {
            class: "contact-item",
            onClick: $setup.copyEmail
          }, [
            vue.createElementVNode("text", { class: "label" }, "邮箱"),
            vue.createElementVNode("text", { class: "value" }, "206788568@qq.com")
          ]),
          vue.createElementVNode("view", {
            class: "contact-item",
            onClick: $setup.copyWechat
          }, [
            vue.createElementVNode("text", { class: "label" }, "微信"),
            vue.createElementVNode("text", { class: "value" }, "ayao110100")
          ])
        ])
      ]),
      vue.createCommentVNode(" 版权信息 "),
      vue.createElementVNode("view", { class: "copyright" }, [
        vue.createElementVNode("text", null, "Copyright © 2025 smallAnYao"),
        vue.createElementVNode("text", null, "All Rights Reserved")
      ])
    ]);
  }
  const PagesPersonAbout = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/person/about.vue"]]);
  const _sfc_main$e = {
    name: "ay-tabs",
    props: {
      // v-model 值
      modelValue: {
        type: [Number, String],
        default: 0
      },
      // 标签页数据
      list: {
        type: Array,
        default: () => []
      },
      // 组件高度
      height: {
        type: String,
        default: "80rpx"
      },
      // 滑块宽度
      barWidth: {
        type: String,
        default: "40rpx"
      },
      // 滑块颜色
      barColor: {
        type: String,
        default: "#ff6700"
      },
      // 默认文字颜色
      color: {
        type: String,
        default: "#666666"
      },
      // 选中文字颜色
      activeColor: {
        type: String,
        default: "#ff6700"
      },
      // 文字大小
      fontSize: {
        type: String,
        default: "28rpx"
      },
      // 是否固定宽度
      fixed: {
        type: Boolean,
        default: false
      },
      // 固定宽度时每个 tab 的宽度
      itemWidth: {
        type: String,
        default: "25%"
      },
      // 是否开启动画
      animation: {
        type: Boolean,
        default: true
      },
      // 滑块高度
      barHeight: {
        type: String,
        default: "6rpx"
      },
      // 底部边框颜色
      borderColor: {
        type: String,
        default: "#f5f5f5"
      },
      // 是否显示底部边框
      border: {
        type: Boolean,
        default: true
      },
      // 字体粗细
      fontWeight: {
        type: [Number, String],
        default: 400
      },
      // 选中字体粗细
      activeFontWeight: {
        type: [Number, String],
        default: 500
      },
      // 是否允许滚动
      scrollable: {
        type: Boolean,
        default: true
      },
      // 背景颜色
      bgColor: {
        type: String,
        default: "#ffffff"
      },
      // 标签项排列方式
      justify: {
        type: String,
        default: "start",
        validator: (value) => ["start", "center", "space-between", "space-around"].includes(value)
      }
    },
    data() {
      return {
        currentValue: this.modelValue,
        scrollLeft: 0,
        tabsRect: null,
        tabRects: [],
        isMoving: false
      };
    },
    computed: {
      // 容器样式
      wrapperStyle() {
        const style = {
          borderBottom: this.border ? `2rpx solid ${this.borderColor}` : "none",
          justifyContent: this.justify
        };
        if (!this.scrollable) {
          style.display = "flex";
          style.width = "100%";
        }
        return style;
      },
      // 滑块样式
      barStyle() {
        if (!this.tabRects[this.currentValue])
          return {};
        const rect = this.tabRects[this.currentValue];
        return {
          width: this.barWidth,
          height: this.barHeight,
          background: this.barColor,
          transform: `translateX(${rect.left + rect.width / 2}px) translateX(-50%)`,
          transition: this.animation ? "transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)" : "none",
          borderRadius: `${parseInt(this.barHeight) / 2}rpx`,
          bottom: "4rpx"
        };
      }
    },
    watch: {
      modelValue: {
        handler(val) {
          this.currentValue = val;
          this.updateTabPosition();
        },
        immediate: true
      },
      list: {
        handler() {
          this.$nextTick(() => {
            this.init();
          });
        },
        immediate: true
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      // 初始化
      async init() {
        await this.$nextTick();
        this.getTabsRect();
      },
      // 获取标签栏尺寸
      getTabsRect() {
        const query = uni.createSelectorQuery().in(this);
        query.select(".ay-tabs__wrapper").boundingClientRect((rect) => {
          this.tabsRect = rect;
          this.getTabRects();
        }).exec();
      },
      // 获取所有标签尺寸
      getTabRects() {
        const query = uni.createSelectorQuery().in(this);
        query.selectAll(".ay-tabs__item").boundingClientRect((rects) => {
          this.tabRects = rects.map((rect) => ({
            ...rect,
            left: rect.left - this.tabsRect.left
          }));
          this.updateTabPosition();
        }).exec();
      },
      // 更新标签位置
      updateTabPosition() {
        if (!this.tabRects[this.currentValue])
          return;
        const rect = this.tabRects[this.currentValue];
        if (this.scrollable) {
          const scrollLeft = rect.left - (this.tabsRect.width - rect.width) / 2;
          this.scrollLeft = scrollLeft < 0 ? 0 : scrollLeft;
        }
      },
      // 标签样式
      itemStyle(index) {
        return {
          color: this.currentValue === index ? this.activeColor : this.color,
          fontSize: this.fontSize,
          fontWeight: this.currentValue === index ? "bold" : this.fontWeight,
          flex: this.fixed ? "0 0 " + this.itemWidth : "0 0 auto",
          padding: this.fixed ? "0" : "0 30rpx"
        };
      },
      // 点击标签
      handleClick(index) {
        if (this.currentValue !== index) {
          this.currentValue = index;
          this.$emit("update:modelValue", index);
          this.$emit("change", index);
        }
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "ay-tabs",
        style: vue.normalizeStyle({ height: $props.height, backgroundColor: $props.bgColor })
      },
      [
        vue.createElementVNode("scroll-view", {
          "scroll-x": "",
          class: "ay-tabs__scroll",
          "scroll-left": $data.scrollLeft,
          "scroll-with-animation": ""
        }, [
          vue.createElementVNode(
            "view",
            {
              class: "ay-tabs__wrapper",
              style: vue.normalizeStyle($options.wrapperStyle)
            },
            [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($props.list, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["ay-tabs__item", { "ay-tabs__item--active": $data.currentValue === index }]),
                    style: vue.normalizeStyle($options.itemStyle(index)),
                    onClick: ($event) => $options.handleClick(index)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "ay-tabs__text" },
                      vue.toDisplayString(item.title || item.name || item),
                      1
                      /* TEXT */
                    )
                  ], 14, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              vue.createCommentVNode(" 滑块 "),
              vue.createElementVNode(
                "view",
                {
                  class: "ay-tabs__bar",
                  style: vue.normalizeStyle($options.barStyle)
                },
                null,
                4
                /* STYLE */
              )
            ],
            4
            /* STYLE */
          )
        ], 8, ["scroll-left"])
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-89c0fa4c"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/components/ay-tabs/ay-tabs.vue"]]);
  const _sfc_main$d = {
    __name: "accountingForm",
    setup(__props, { expose: __expose }) {
      __expose();
      const form = vue.ref({
        date: "",
        type: "点工",
        // 点工 或 包工
        project: null,
        workOption: 0,
        workDays: 1,
        workHours: 0,
        hasOvertime: false,
        overtimeAmount: "",
        contractOption: 0,
        otherContractContent: "",
        pointIncome: "",
        amount: "",
        remark: "",
        imageList: [],
        imageUrls: []
      });
      const currentTab = vue.ref(0);
      const tabs = vue.ref([
        {
          title: "点工",
          value: "点工"
        },
        {
          title: "包工",
          value: "包工"
        }
      ]);
      const workOptions = vue.ref([
        {
          label: "1个工"
        },
        {
          label: "选工天"
        },
        {
          label: "休息"
        }
      ]);
      const contractOptions = vue.ref([
        {
          label: "砌墙"
        },
        {
          label: "贴砖"
        },
        {
          label: "刷漆"
        },
        {
          label: "其他"
        }
      ]);
      const isSubmitting = vue.ref(false);
      const showOtherInput = vue.ref(false);
      const tempOtherContent = vue.ref("");
      const formState = vue.ref("add");
      const recordId = vue.ref("");
      const handleTabChange = (index) => {
        currentTab.value = index;
        if (index === 0) {
          form.value = {
            ...form.value,
            type: "点工",
            workOption: 0,
            workDays: 1,
            hasOvertime: false,
            overtimeAmount: "",
            contractOption: "",
            otherContractContent: "",
            pointIncome: Number(form.value.project.daily_wage).toFixed(0),
            amount: "",
            remark: "",
            imageList: [],
            imageUrls: []
          };
        } else if (index === 1) {
          form.value = {
            ...form.value,
            type: "包工",
            workOption: "",
            workDays: "",
            hasOvertime: false,
            overtimeAmount: "",
            contractOption: 0,
            otherContractContent: "",
            pointIncome: "",
            amount: "",
            remark: "",
            imageList: [],
            imageUrls: []
          };
        }
      };
      const goToProject = () => {
        uni.navigateTo({
          url: "/pages/project/list"
        });
      };
      const selectWorkOption = (index) => {
        form.value.workOption = index;
        if (index === 1) {
          selectWorkDays();
        } else if (index === 0) {
          form.value.workDays = 1;
          form.value.workHours = 0;
          form.value.pointIncome = Number(form.value.project.daily_wage).toFixed(0);
        } else {
          form.value.workDays = 0;
          form.value.workHours = 0;
          form.value.pointIncome = "0";
        }
      };
      const toggleOvertime = (event) => {
        form.value.hasOvertime = event;
      };
      const selectWorkDays = () => {
        uni.showActionSheet({
          itemList: ["0.5", "1", "1.5", "2", "2.5", "3"],
          success: (res) => {
            const days = parseFloat(["0.5", "1", "1.5", "2", "2.5", "3"][res.tapIndex]);
            form.value.workDays = days;
            form.value.pointIncome = (form.value.project.daily_wage * days).toFixed(0);
          }
        });
      };
      const getWorkOptionLabel = (option, index) => {
        if (index === 1 && form.value.workDays) {
          return `${form.value.workDays}工天`;
        }
        if (index === 2 && form.value.workHours) {
          return `${form.value.workHours}小时`;
        }
        return option.label;
      };
      const selectContractOption = (index) => {
        form.value.contractOption = index;
        if (index === 3) {
          showOtherInput.value = true;
        }
      };
      const confirmOtherInput = () => {
        if (tempOtherContent.value.trim()) {
          form.value.otherContractContent = tempOtherContent.value;
          showOtherInput.value = false;
        } else {
          uni.showToast({
            title: "请输入内容",
            icon: "none"
          });
        }
      };
      const cancelOtherInput = () => {
        if (!form.value.otherContractContent) {
          form.value.contractOption = 0;
        }
        showOtherInput.value = false;
        tempOtherContent.value = "";
      };
      const uploadImage = async () => {
        try {
          const res = await uni.chooseImage({
            count: 9,
            sizeType: ["compressed"],
            sourceType: ["album", "camera"]
          });
          uni.showLoading({
            title: "上传中...",
            mask: true
          });
          const currentForm = form.value.type === "点工" ? form : form;
          currentForm.value.imageList = [...currentForm.value.imageList, ...res.tempFilePaths];
          const uploadPromises = res.tempFilePaths.map((filePath) => uploadApi.uploadImage(filePath));
          const uploadResults = await Promise.all(uploadPromises);
          currentForm.value.imageUrls = [...currentForm.value.imageUrls, ...uploadResults.map((res2) => res2.url)];
          uni.hideLoading();
        } catch (error) {
          uni.hideLoading();
          uni.showToast({
            title: "上传失败",
            icon: "none"
          });
        }
      };
      const removeImage = (index) => {
        const currentForm = form.value.type === "点工" ? form : form;
        currentForm.value.imageList.splice(index, 1);
        currentForm.value.imageUrls.splice(index, 1);
      };
      const previewImage = (image) => {
        const currentForm = form.value.type === "点工" ? form : form;
        uni.previewImage({
          urls: currentForm.value.imageList,
          current: image
        });
      };
      const getWorkOptionIcon = (index) => {
        const icons = ["check", "calendar", "emoji-good"];
        return icons[index];
      };
      const confirmRecord = async () => {
        if (isSubmitting.value)
          return;
        if (form.value.type === "包工" && !form.value.amount) {
          uni.showToast({
            title: "请输入包工金额",
            icon: "none"
          });
          return;
        }
        isSubmitting.value = true;
        try {
          uni.showLoading({
            title: "提交中...",
            mask: true
          });
          const requestData = {
            date: form.value.date,
            project: form.value.project.id,
            type: form.value.type,
            work_option: form.value.workOption,
            work_days: form.value.workDays,
            has_overtime: form.value.hasOvertime,
            overtime_amount: form.value.overtimeAmount,
            contract_option: form.value.contractOption,
            contract_content: form.value.otherContractContent,
            point_income: form.value.pointIncome,
            amount: form.value.amount ? parseFloat(form.value.amount) : 0,
            remark: form.value.remark,
            image_list: form.value.imageUrls
          };
          let res;
          if (formState.value === "edit") {
            res = await recordApi.update(recordId.value, requestData);
          } else {
            res = await recordApi.create(requestData);
          }
          if (res.success) {
            uni.showToast({
              title: formState.value === "edit" ? "修改成功" : "记账成功",
              icon: "success"
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            throw new Error(res.message || "操作失败");
          }
        } catch (error) {
          uni.showToast({
            title: error.message || "操作失败",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
          setTimeout(() => {
            isSubmitting.value = false;
          }, 2e3);
        }
      };
      const goBack = () => {
        uni.navigateBack();
      };
      onLoad((option) => {
        const params = getParams(option);
        const currentProject = uni.getStorageSync("current_project");
        if (!currentProject) {
          uni.showModal({
            title: "提示",
            content: "你还没有创建账本哦，请前往创建",
            confirmText: "去创建",
            success: (res) => {
              if (res.confirm) {
                navigateTo("/pages/project/form");
              } else {
                uni.showToast({
                  title: "请先创建第一个项目",
                  icon: "none"
                });
                uni.navigateBack();
              }
            }
          });
          return;
        }
        form.value.project = currentProject;
        form.value.pointIncome = Number(currentProject.daily_wage).toFixed(0);
        form.value.date = params.date;
        formState.value = params.state || "add";
        if (formState.value === "edit" && params.id) {
          recordId.value = params.id;
          getRecordDetail(params.id);
        }
        uni.setNavigationBarTitle({
          title: formState.value === "add" ? "记一笔" : "修改"
        });
      });
      const getRecordDetail = async (id) => {
        try {
          uni.showLoading({
            title: "加载中...",
            mask: true
          });
          const res = await recordApi.getDetail(id);
          if (res.success) {
            res.data.type === "包工" ? currentTab.value = 1 : currentTab.value = 0;
            form.value = {
              ...form.value,
              type: res.data.type,
              workOption: res.data.work_option,
              workDays: res.data.work_days,
              hasOvertime: res.data.has_overtime,
              overtimeAmount: res.data.overtime_amount,
              contractOption: res.data.contract_option,
              otherContractContent: res.data.contract_content,
              pointIncome: res.data.point_income,
              amount: res.data.amount,
              remark: res.data.remark,
              imageList: res.data.image_list.map((item) => baseUrl + item),
              imageUrls: res.data.image_list.map((item) => baseUrl + item)
            };
            tempOtherContent.value = res.data.otherContractContent;
          }
        } catch (error) {
          uni.showToast({
            title: "获取记录详情失败",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      };
      const handleDelete = () => {
        uni.showModal({
          title: "提示",
          content: "确定要删除这条记录吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                const res2 = await recordApi.delete(recordId.value);
                if (res2.success) {
                  uni.showToast({
                    title: "删除成功",
                    icon: "success"
                  });
                  uni.navigateBack();
                }
              } catch (error) {
                formatAppLog("log", "at pages/form/accountingForm.vue:627", error);
                uni.showToast({
                  title: "删除失败",
                  icon: "none"
                });
              }
            }
          }
        });
      };
      const __returned__ = { form, currentTab, tabs, workOptions, contractOptions, isSubmitting, showOtherInput, tempOtherContent, formState, recordId, handleTabChange, goToProject, selectWorkOption, toggleOvertime, selectWorkDays, getWorkOptionLabel, selectContractOption, confirmOtherInput, cancelOtherInput, uploadImage, removeImage, previewImage, getWorkOptionIcon, confirmRecord, goBack, getRecordDetail, handleDelete, ref: vue.ref, computed: vue.computed, watch: vue.watch, nextTick: vue.nextTick, get onLoad() {
        return onLoad;
      }, get getParams() {
        return getParams;
      }, get baseUrl() {
        return baseUrl;
      }, get navigateTo() {
        return navigateTo;
      }, get recordApi() {
        return recordApi;
      }, get uploadApi() {
        return uploadApi;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ay_tabs = resolveEasycom(vue.resolveDynamicComponent("ay-tabs"), __easycom_0$1);
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    const _component_ay_input = resolveEasycom(vue.resolveDynamicComponent("ay-input"), __easycom_2);
    const _component_ay_switch = resolveEasycom(vue.resolveDynamicComponent("ay-switch"), __easycom_3);
    const _component_ay_textarea = resolveEasycom(vue.resolveDynamicComponent("ay-textarea"), __easycom_4$1);
    const _component_ay_button = resolveEasycom(vue.resolveDynamicComponent("ay-button"), __easycom_5$1);
    const _component_ay_popup = resolveEasycom(vue.resolveDynamicComponent("ay-popup"), __easycom_5);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 切换标签 "),
      vue.createVNode(_component_ay_tabs, {
        class: "custom-tabs",
        justify: "space-around",
        modelValue: $setup.currentTab,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.currentTab = $event),
        list: $setup.tabs,
        onChange: $setup.handleTabChange
      }, null, 8, ["modelValue", "list"]),
      vue.createCommentVNode(" 点工模块 "),
      $setup.form.type === "点工" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "work-section"
      }, [
        vue.createCommentVNode(" 上班选项 "),
        vue.createElementVNode("view", { class: "form-card" }, [
          vue.createElementVNode("text", { class: "card-title" }, "工作选项"),
          vue.createElementVNode("view", { class: "options-grid point-grid" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.workOptions, (option, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: vue.normalizeClass(["option-item", { active: $setup.form.workOption === index }]),
                  onClick: ($event) => $setup.selectWorkOption(index)
                }, [
                  vue.createVNode(_component_tn_icon, {
                    name: $setup.getWorkOptionIcon(index),
                    size: "40",
                    color: $setup.form.workOption === index ? "#fff" : "#666"
                  }, null, 8, ["name", "color"]),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass({ "bold": $setup.form.workOption === index && (index === 1 || index === 2) })
                    },
                    vue.toDisplayString($setup.getWorkOptionLabel(option, index)),
                    3
                    /* TEXT, CLASS */
                  )
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createCommentVNode(" 点工金额 "),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "form-card" },
          [
            vue.createElementVNode("text", { class: "card-title" }, "点工金额"),
            vue.createElementVNode("view", { class: "amount-input" }, [
              vue.createVNode(_component_ay_input, {
                modelValue: $setup.form.pointIncome,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.form.pointIncome = $event),
                type: "digit",
                placeholder: "请输入点工金额",
                border: ""
              }, {
                prefix: vue.withCtx(() => [
                  vue.createVNode(_component_tn_icon, {
                    name: "money",
                    size: "32",
                    color: "#ff6700"
                  })
                ]),
                suffix: vue.withCtx(() => [
                  vue.createElementVNode("text", { class: "unit" }, "元")
                ]),
                _: 1
                /* STABLE */
              }, 8, ["modelValue"])
            ])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $setup.form.workDays != 0]
        ]),
        vue.createCommentVNode(" 加班选项 "),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "form-card" },
          [
            vue.createElementVNode("text", { class: "card-title" }, "加班设置"),
            vue.createElementVNode("view", { class: "overtime-section" }, [
              vue.createElementVNode("view", { class: "switch-container" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["switch-label", { "active": $setup.form.hasOvertime }])
                  },
                  vue.toDisplayString($setup.form.hasOvertime ? "有加班" : "无加班"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createVNode(_component_ay_switch, {
                  modelValue: $setup.form.hasOvertime,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.form.hasOvertime = $event),
                  onChange: $setup.toggleOvertime,
                  "active-color": "#ff6700"
                }, null, 8, ["modelValue"])
              ]),
              $setup.form.hasOvertime ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "overtime-input"
              }, [
                vue.createVNode(_component_ay_input, {
                  modelValue: $setup.form.overtimeAmount,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.form.overtimeAmount = $event),
                  type: "digit",
                  placeholder: "请输入加班工资",
                  border: true
                }, {
                  prefix: vue.withCtx(() => [
                    vue.createVNode(_component_tn_icon, {
                      name: "money",
                      size: "32",
                      color: "#ff6700"
                    })
                  ]),
                  suffix: vue.withCtx(() => [
                    vue.createElementVNode("text", { class: "unit" }, "元")
                  ]),
                  _: 1
                  /* STABLE */
                }, 8, ["modelValue"])
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $setup.form.workDays != 0]
        ]),
        vue.createCommentVNode(" 备注 "),
        vue.createElementVNode("view", { class: "form-card" }, [
          vue.createElementVNode("text", { class: "card-title" }, "备注信息"),
          vue.createElementVNode("view", { class: "remark-section" }, [
            vue.createVNode(_component_ay_textarea, {
              modelValue: $setup.form.remark,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.form.remark = $event),
              placeholder: "请输入备注信息",
              border: "",
              auto_height: "",
              showWordLimit: "",
              maxlength: 200
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("view", { class: "upload-section" }, [
              vue.createElementVNode("view", { class: "upload-header" }, [
                vue.createElementVNode("text", { class: "upload-title" }, "图片上传"),
                vue.createElementVNode("text", { class: "upload-desc" }, "最多上传9张图片")
              ]),
              vue.createElementVNode("view", { class: "image-grid" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.form.imageList, (image, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: "image-preview",
                      onClick: ($event) => $setup.previewImage(image)
                    }, [
                      vue.createElementVNode("image", {
                        src: image,
                        mode: "aspectFill",
                        class: "preview-image"
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", {
                        class: "delete-btn",
                        onClick: vue.withModifiers(($event) => $setup.removeImage(index), ["stop"])
                      }, [
                        vue.createVNode(_component_tn_icon, {
                          name: "close",
                          color: "#fff",
                          size: "24"
                        })
                      ], 8, ["onClick"])
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                $setup.form.imageList.length < 9 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "upload-btn",
                  onClick: $setup.uploadImage
                }, [
                  vue.createElementVNode("view", { class: "upload-content" }, [
                    vue.createVNode(_component_tn_icon, {
                      name: "camera",
                      color: "#999",
                      size: "48"
                    }),
                    vue.createElementVNode("text", null, "上传图片")
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ])
            ])
          ])
        ])
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" 包工模块 "),
          vue.createElementVNode("view", { class: "contract-section" }, [
            vue.createCommentVNode(" 包工内容 "),
            vue.createElementVNode("view", { class: "form-card" }, [
              vue.createElementVNode("text", { class: "card-title" }, "包工内容"),
              vue.createElementVNode("view", { class: "options-grid contract-grid" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.contractOptions, (option, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: vue.normalizeClass(["option-item", { active: $setup.form.contractOption === index }]),
                      onClick: ($event) => $setup.selectContractOption(index)
                    }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass({ "bold": $setup.form.contractOption === index })
                        },
                        vue.toDisplayString(index === 3 && $setup.form.otherContractContent ? $setup.form.otherContractContent : option.label),
                        3
                        /* TEXT, CLASS */
                      )
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ]),
            vue.createCommentVNode(" 包工金额 "),
            vue.createElementVNode("view", { class: "form-card" }, [
              vue.createElementVNode("text", { class: "card-title" }, "包工金额"),
              vue.createElementVNode("view", { class: "amount-input" }, [
                vue.createVNode(_component_ay_input, {
                  modelValue: $setup.form.amount,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.form.amount = $event),
                  type: "digit",
                  placeholder: "请输入包工金额",
                  border: true
                }, {
                  prefix: vue.withCtx(() => [
                    vue.createVNode(_component_tn_icon, {
                      name: "money",
                      size: "32",
                      color: "#ff6700"
                    })
                  ]),
                  suffix: vue.withCtx(() => [
                    vue.createElementVNode("text", { class: "unit" }, "元")
                  ]),
                  _: 1
                  /* STABLE */
                }, 8, ["modelValue"])
              ])
            ]),
            vue.createCommentVNode(" 备注 "),
            vue.createElementVNode("view", { class: "form-card" }, [
              vue.createElementVNode("text", { class: "card-title" }, "备注信息"),
              vue.createElementVNode("view", { class: "remark-section" }, [
                vue.createVNode(_component_ay_textarea, {
                  modelValue: $setup.form.remark,
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.form.remark = $event),
                  placeholder: "请输入备注信息",
                  border: "",
                  auto_height: "",
                  showWordLimit: "",
                  maxlength: 200
                }, null, 8, ["modelValue"]),
                vue.createElementVNode("view", { class: "upload-section" }, [
                  vue.createElementVNode("view", { class: "upload-header" }, [
                    vue.createElementVNode("text", { class: "upload-title" }, "图片上传"),
                    vue.createElementVNode("text", { class: "upload-desc" }, "最多上传9张图片")
                  ]),
                  vue.createElementVNode("view", { class: "image-grid" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.form.imageList, (image, index) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: index,
                          class: "image-preview",
                          onClick: ($event) => $setup.previewImage(image)
                        }, [
                          vue.createElementVNode("image", {
                            src: image,
                            mode: "aspectFill",
                            class: "preview-image"
                          }, null, 8, ["src"]),
                          vue.createElementVNode("view", {
                            class: "delete-btn",
                            onClick: vue.withModifiers(($event) => $setup.removeImage(index), ["stop"])
                          }, [
                            vue.createVNode(_component_tn_icon, {
                              name: "close",
                              color: "#fff",
                              size: "24"
                            })
                          ], 8, ["onClick"])
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    $setup.form.imageList.length < 9 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "upload-btn",
                      onClick: $setup.uploadImage
                    }, [
                      vue.createElementVNode("view", { class: "upload-content" }, [
                        vue.createVNode(_component_tn_icon, {
                          name: "camera",
                          color: "#999",
                          size: "48"
                        }),
                        vue.createElementVNode("text", null, "上传图片")
                      ])
                    ])) : vue.createCommentVNode("v-if", true)
                  ])
                ])
              ])
            ])
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      vue.createCommentVNode(" 确认记账按钮 "),
      vue.createElementVNode("view", { class: "btns" }, [
        $setup.formState === "add" ? (vue.openBlock(), vue.createBlock(_component_ay_button, {
          key: 0,
          round: "",
          block: "",
          class: "btn1",
          onClick: $setup.confirmRecord
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("确认记账")
          ]),
          _: 1
          /* STABLE */
        })) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "btn-group"
        }, [
          vue.createElementVNode("view", {
            class: "btn-delete",
            onClick: $setup.handleDelete
          }, [
            vue.createVNode(_component_tn_icon, {
              name: "delete",
              size: "40",
              color: "#ff6700"
            }),
            vue.createElementVNode("text", null, "删除")
          ]),
          vue.createVNode(_component_ay_button, {
            round: "",
            block: "",
            class: "btn-save",
            onClick: $setup.confirmRecord
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("保存")
            ]),
            _: 1
            /* STABLE */
          })
        ]))
      ]),
      vue.createCommentVNode(" 其他包工内容输入弹窗 "),
      vue.createVNode(_component_ay_popup, {
        modelValue: $setup.showOtherInput,
        "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.showOtherInput = $event),
        position: "center",
        closeOnClickOverlay: false
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "other-input-popup" }, [
            vue.createElementVNode("view", { class: "popup-header" }, [
              vue.createElementVNode("text", { class: "title" }, "请输入包工内容")
            ]),
            vue.createElementVNode("view", { class: "popup-content" }, [
              vue.createVNode(_component_ay_input, {
                modelValue: $setup.tempOtherContent,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.tempOtherContent = $event),
                placeholder: "请输入",
                border: true,
                clearable: true
              }, null, 8, ["modelValue"])
            ]),
            vue.createElementVNode("view", { class: "popup-footer" }, [
              vue.createElementVNode("view", {
                class: "btn cancel",
                onClick: $setup.cancelOtherInput
              }, "取消"),
              vue.createElementVNode("view", {
                class: "btn confirm",
                onClick: $setup.confirmOtherInput
              }, "确定")
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"])
    ]);
  }
  const PagesFormAccountingForm = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-a692e380"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/form/accountingForm.vue"]]);
  const _sfc_main$c = {
    __name: "login",
    setup(__props, { expose: __expose }) {
      __expose();
      onLoad(() => {
        uni.startSoterAuthentication({
          requestAuthModes: ["fingerPrint"],
          challenge: (/* @__PURE__ */ new Date()).getTime().toString(),
          authContent: "请用指纹解锁",
          success(res) {
            formatAppLog("log", "at pages/login/login.vue:52", "res", res);
          },
          fail(err) {
            formatAppLog("log", "at pages/login/login.vue:55", "err", err);
          }
        });
      });
      const formData = vue.reactive({
        username: "",
        password: ""
      });
      const showPassword = vue.ref(false);
      const togglePassword = () => {
        showPassword.value = !showPassword.value;
      };
      const handleLogin = async () => {
        if (!formData.username || !formData.password) {
          uni.showToast({
            title: "请输入用户名和密码",
            icon: "none"
          });
          return;
        }
        try {
          uni.showLoading({
            title: "登录中..."
          });
          const res = await userApi.login(formData);
          uni.setStorageSync("token", res.data.token);
          uni.switchTab({
            url: "/pages/index/index"
          });
          uni.showToast({
            title: "登录成功",
            icon: "success"
          });
        } catch (error) {
          formatAppLog("error", "at pages/login/login.vue:107", "登录失败：", error);
        } finally {
          uni.hideLoading();
        }
      };
      const goToRegister = () => {
        uni.navigateTo({
          url: "/pages/register/register"
        });
      };
      const goToForget = () => {
        uni.navigateTo({
          url: "/pages/forget/forget"
        });
      };
      const __returned__ = { formData, showPassword, togglePassword, handleLogin, goToRegister, goToForget, get onLoad() {
        return onLoad;
      }, ref: vue.ref, reactive: vue.reactive, get userApi() {
        return userApi;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createCommentVNode(" Logo区域 "),
      vue.createElementVNode("view", { class: "logo-box" }, [
        vue.createElementVNode("image", {
          class: "logo",
          src: _imports_0,
          mode: "aspectFit"
        }),
        vue.createElementVNode("text", { class: "title" }, "俺要记账")
      ]),
      vue.createCommentVNode(" 表单区域 "),
      vue.createElementVNode("view", { class: "form-box" }, [
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createVNode(_component_tn_icon, {
            name: "my",
            class: "iconfont",
            size: "48",
            color: "#ff6700"
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formData.username = $event),
              placeholder: "请输入用户名",
              "placeholder-class": "placeholder"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.formData.username]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createVNode(_component_tn_icon, {
            name: "lock",
            class: "iconfont",
            size: "48",
            color: "#ff6700"
          }),
          vue.withDirectives(vue.createElementVNode("input", {
            type: $setup.showPassword ? "text" : "password",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formData.password = $event),
            placeholder: "请输入密码",
            "placeholder-class": "placeholder"
          }, null, 8, ["type"]), [
            [vue.vModelDynamic, $setup.formData.password]
          ]),
          vue.createVNode(_component_tn_icon, {
            name: $setup.showPassword ? "eye-close" : "eye-hide",
            class: "iconfont",
            size: "48",
            onClick: $setup.togglePassword
          }, null, 8, ["name"])
        ]),
        vue.createElementVNode("button", {
          class: "login-btn",
          onClick: $setup.handleLogin
        }, "登 录"),
        vue.createElementVNode("view", { class: "options" }, [
          vue.createElementVNode("text", { onClick: $setup.goToRegister }, "注册账号"),
          vue.createElementVNode("text", { onClick: $setup.goToForget }, "忘记密码？")
        ])
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-e4e4508d"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/login/login.vue"]]);
  const _sfc_main$b = {
    __name: "register",
    setup(__props, { expose: __expose }) {
      __expose();
      const formData = vue.reactive({
        username: "",
        password: "",
        phone: "",
        nickname: "",
        captcha: ""
      });
      const showPassword = vue.ref(false);
      const captchaCode = vue.ref("");
      const generateCaptcha = () => {
        let code = "";
        for (let i2 = 0; i2 < 4; i2++) {
          code += Math.floor(Math.random() * 10);
        }
        captchaCode.value = code;
      };
      const refreshCaptcha = () => {
        generateCaptcha();
        formData.captcha = "";
      };
      const togglePassword = () => {
        showPassword.value = !showPassword.value;
      };
      const handleRegister = async () => {
        if (!formData.username || !formData.password || !formData.phone || !formData.nickname || !formData.captcha) {
          uni.showToast({
            title: "请填写完整信息",
            icon: "none"
          });
          return;
        }
        if (formData.captcha !== captchaCode.value) {
          uni.showToast({
            title: "验证码错误",
            icon: "none"
          });
          refreshCaptcha();
          return;
        }
        try {
          uni.showLoading({
            title: "注册中..."
          });
          await userApi.register(formData);
          uni.showToast({
            title: "注册成功",
            icon: "success"
          });
          setTimeout(() => {
            goBack();
          }, 1500);
        } catch (error) {
          formatAppLog("error", "at pages/register/register.vue:128", "注册失败：", error);
        } finally {
          uni.hideLoading();
        }
      };
      const goBack = () => {
        uni.navigateBack();
      };
      const goToLogin = () => {
        uni.redirectTo({
          url: "/pages/login/login"
        });
      };
      const getRandomStyle = () => {
        const rotate = Math.random() * 30 - 15;
        const fontSize = Math.random() * 8 + 28;
        const translateY = Math.random() * 10 - 5;
        return {
          transform: `rotate(${rotate}deg) translateY(${translateY}rpx)`,
          fontSize: `${fontSize}rpx`,
          fontWeight: Math.random() > 0.5 ? "bold" : "normal",
          fontFamily: Math.random() > 0.5 ? "Arial" : "Verdana",
          opacity: Math.random() * 0.3 + 0.7
          // 0.7到1的随机透明度
        };
      };
      const getRandomLine = () => {
        const startX = Math.random() * 100;
        const startY = Math.random() * 60;
        return {
          left: startX + "%",
          top: startY + "%",
          width: Math.random() * 40 + 20 + "rpx",
          transform: `rotate(${Math.random() * 360}deg)`,
          opacity: Math.random() * 0.3 + 0.1
        };
      };
      const getRandomDot = () => {
        return {
          left: Math.random() * 100 + "%",
          top: Math.random() * 100 + "%",
          opacity: Math.random() * 0.5 + 0.1
        };
      };
      vue.onMounted(() => {
        generateCaptcha();
      });
      const __returned__ = { formData, showPassword, captchaCode, generateCaptcha, refreshCaptcha, togglePassword, handleRegister, goBack, goToLogin, getRandomStyle, getRandomLine, getRandomDot, ref: vue.ref, reactive: vue.reactive, onMounted: vue.onMounted, get userApi() {
        return userApi;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "register-container" }, [
      vue.createElementVNode("view", { class: "form-box" }, [
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createVNode(_component_tn_icon, {
            name: "my",
            class: "iconfont",
            size: "48",
            color: "#ff6700"
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formData.username = $event),
              placeholder: "请输入用户名",
              "placeholder-class": "placeholder"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.formData.username]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createVNode(_component_tn_icon, {
            name: "lock",
            class: "iconfont",
            size: "48",
            color: "#ff6700"
          }),
          vue.withDirectives(vue.createElementVNode("input", {
            type: $setup.showPassword ? "text" : "password",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formData.password = $event),
            placeholder: "请输入密码",
            "placeholder-class": "placeholder"
          }, null, 8, ["type"]), [
            [vue.vModelDynamic, $setup.formData.password]
          ]),
          vue.createVNode(_component_tn_icon, {
            name: $setup.showPassword ? "eye-close" : "eye-hide",
            class: "iconfont",
            size: "48",
            onClick: $setup.togglePassword
          }, null, 8, ["name"])
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createVNode(_component_tn_icon, {
            name: "phone",
            class: "iconfont",
            size: "48",
            color: "#ff6700"
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formData.phone = $event),
              placeholder: "请输入手机号",
              "placeholder-class": "placeholder",
              maxlength: "11"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.formData.phone]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createVNode(_component_tn_icon, {
            name: "identity",
            class: "iconfont",
            size: "48",
            color: "#ff6700"
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.formData.nickname = $event),
              placeholder: "请输入昵称",
              "placeholder-class": "placeholder"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.formData.nickname]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createVNode(_component_tn_icon, {
            name: "safe",
            class: "iconfont",
            size: "48",
            color: "#ff6700"
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.formData.captcha = $event),
              placeholder: "请输入验证码",
              "placeholder-class": "placeholder",
              maxlength: "4"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.formData.captcha]
          ]),
          vue.createElementVNode("view", {
            class: "captcha-box",
            onClick: $setup.refreshCaptcha
          }, [
            vue.createElementVNode("view", { class: "captcha-wrap" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.captchaCode, (num, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: index,
                      class: "captcha-digit",
                      style: vue.normalizeStyle($setup.getRandomStyle())
                    },
                    vue.toDisplayString(num),
                    5
                    /* TEXT, STYLE */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              vue.createCommentVNode(" 添加干扰线 "),
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(3, (n2) => {
                  return vue.createElementVNode(
                    "view",
                    {
                      class: "interference-line",
                      key: n2,
                      style: vue.normalizeStyle($setup.getRandomLine())
                    },
                    null,
                    4
                    /* STYLE */
                  );
                }),
                64
                /* STABLE_FRAGMENT */
              )),
              vue.createCommentVNode(" 添加干扰点 "),
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(12, (n2) => {
                  return vue.createElementVNode(
                    "view",
                    {
                      class: "interference-dot",
                      key: n2 + "dot",
                      style: vue.normalizeStyle($setup.getRandomDot())
                    },
                    null,
                    4
                    /* STYLE */
                  );
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ])
        ]),
        vue.createElementVNode("button", {
          class: "submit-btn",
          onClick: $setup.handleRegister
        }, "注 册")
      ]),
      vue.createCommentVNode(" 添加底部登录提示 "),
      vue.createElementVNode("view", { class: "login-tip" }, [
        vue.createTextVNode(" 已有账号？"),
        vue.createElementVNode("text", {
          class: "login-link",
          onClick: $setup.goToLogin
        }, "立即登录")
      ])
    ]);
  }
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-bac4a35d"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/register/register.vue"]]);
  const _sfc_main$a = {
    __name: "forget",
    setup(__props, { expose: __expose }) {
      __expose();
      const formData = vue.reactive({
        phone: "",
        code: "",
        password: ""
      });
      const showPassword = vue.ref(false);
      const counting = vue.ref(false);
      const counter = vue.ref(60);
      const togglePassword = () => {
        showPassword.value = !showPassword.value;
      };
      const sendCode = async () => {
        if (counting.value)
          return;
        if (!formData.phone) {
          uni.showToast({
            title: "请输入手机号",
            icon: "none"
          });
          return;
        }
        try {
          await userApi.sendCode({
            phone: formData.phone
          });
          counting.value = true;
          const timer = setInterval(() => {
            counter.value--;
            if (counter.value <= 0) {
              clearInterval(timer);
              counting.value = false;
              counter.value = 60;
            }
          }, 1e3);
        } catch (error) {
          formatAppLog("error", "at pages/forget/forget.vue:76", "发送验证码失败：", error);
          uni.showToast({
            title: "发送验证码失败\n请联系微信ayao110100",
            icon: "none"
          });
        }
      };
      const handleReset = async () => {
        if (!formData.phone || !formData.code || !formData.password) {
          uni.showToast({
            title: "请填写完整信息",
            icon: "none"
          });
          return;
        }
        try {
          uni.showLoading({
            title: "提交中..."
          });
          await userApi.resetPassword(formData);
          uni.showToast({
            title: "重置成功",
            icon: "success"
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } catch (error) {
          formatAppLog("error", "at pages/forget/forget.vue:106", "重置失败：", error);
        } finally {
          uni.hideLoading();
        }
      };
      const goBack = () => {
        uni.navigateBack();
      };
      const __returned__ = { formData, showPassword, counting, counter, togglePassword, sendCode, handleReset, goBack, ref: vue.ref, reactive: vue.reactive, get userApi() {
        return userApi;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "forget-container" }, [
      vue.createElementVNode("view", { class: "form-box" }, [
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createVNode(_component_tn_icon, {
            name: "phone",
            class: "iconfont",
            size: "48",
            color: "#ff6700"
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formData.phone = $event),
              placeholder: "请输入手机号",
              "placeholder-class": "placeholder"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.formData.phone]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createVNode(_component_tn_icon, {
            name: "safe",
            class: "iconfont",
            size: "48",
            color: "#ff6700"
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formData.code = $event),
              placeholder: "请输入验证码",
              "placeholder-class": "placeholder"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.formData.code]
          ]),
          vue.createElementVNode(
            "text",
            {
              class: vue.normalizeClass(["verify-btn", { disabled: $setup.counting }]),
              onClick: $setup.sendCode
            },
            vue.toDisplayString($setup.counting ? `${$setup.counter}s` : "获取验证码"),
            3
            /* TEXT, CLASS */
          )
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createVNode(_component_tn_icon, {
            name: "lock",
            class: "iconfont",
            size: "48",
            color: "#ff6700"
          }),
          vue.withDirectives(vue.createElementVNode("input", {
            type: $setup.showPassword ? "text" : "password",
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formData.password = $event),
            placeholder: "请输入新密码",
            "placeholder-class": "placeholder"
          }, null, 8, ["type"]), [
            [vue.vModelDynamic, $setup.formData.password]
          ]),
          vue.createVNode(_component_tn_icon, {
            name: $setup.showPassword ? "eye-close" : "eye-hide",
            class: "iconfont",
            size: "48",
            onClick: $setup.togglePassword
          }, null, 8, ["name"])
        ]),
        vue.createElementVNode("button", {
          class: "submit-btn",
          onClick: $setup.handleReset
        }, "重置密码")
      ])
    ]);
  }
  const PagesForgetForget = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-978da12e"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/forget/forget.vue"]]);
  const easycom = {
    custom: {
      "^tn-(.*)-(item|group)$": "@/uni_modules/tuniaoui-vue3/components/$1/src/$1-$2.vue",
      "^tn-(.*)": "@/uni_modules/tuniaoui-vue3/components/$1/src/$1.vue",
      "^qiun-data-charts": "@qiun/ucharts/components/qiun-data-charts/qiun-data-charts"
    }
  };
  const pages = [
    {
      path: "pages/index/index",
      style: {
        navigationBarTitleText: "俺要记账",
        navigationStyle: "custom",
        enablePullDownRefresh: false
      }
    },
    {
      path: "pages/person/person",
      style: {
        navigationBarTitleText: "个人中心",
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/project/list",
      style: {
        navigationBarTitleText: "账本管理",
        "app-plus": {
          bounce: "none"
        }
      }
    },
    {
      path: "pages/project/form",
      style: {
        navigationBarTitleText: "项目信息"
      }
    },
    {
      path: "pages/person/profile",
      style: {
        navigationBarTitleText: "个人信息"
      }
    },
    {
      path: "pages/person/changePassword",
      style: {
        navigationBarTitleText: "修改密码"
      }
    },
    {
      path: "pages/person/accountSettings",
      style: {
        navigationBarTitleText: "账户设置"
      }
    },
    {
      path: "pages/person/about",
      style: {
        navigationBarTitleText: "关于我们"
      }
    },
    {
      path: "pages/form/accountingForm",
      style: {
        navigationBarTitleText: "记一笔"
      }
    },
    {
      path: "pages/login/login",
      style: {
        navigationBarTitleText: "登录",
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/register/register",
      style: {
        navigationBarTitleText: "注册"
      }
    },
    {
      path: "pages/forget/forget",
      style: {
        navigationBarTitleText: "忘记密码"
      }
    },
    {
      path: "pages/stats/stats",
      style: {
        navigationBarTitleText: "收入统计",
        navigationStyle: "custom"
      }
    }
  ];
  const tabBar = {
    custom: true,
    color: "#c1c1c1",
    selectedColor: "#000000",
    borderStyle: "white",
    backgroundColor: "#ffffff",
    fontSize: "16px",
    list: [
      {
        pagePath: "pages/index/index"
      },
      {
        pagePath: "pages/stats/stats"
      },
      {
        pagePath: "pages/person/person"
      }
    ]
  };
  const globalStyle = {
    navigationBarTextStyle: "black",
    navigationBarTitleText: "俺要记账",
    navigationBarBackgroundColor: "#FFFFFF",
    backgroundColor: "#F8F8F8",
    "app-plus": {
      bounce: "none",
      scrollIndicator: "none",
      softinputmode: "adjustResize"
    }
  };
  const uniIdRouter = {};
  const e = {
    easycom,
    pages,
    tabBar,
    globalStyle,
    uniIdRouter
  };
  var define_process_env_UNI_SECURE_NETWORK_CONFIG_default = [];
  function t(e2) {
    return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
  }
  function n(e2, t2, n2) {
    return e2(n2 = { path: t2, exports: {}, require: function(e3, t3) {
      return function() {
        throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
      }(null == t3 && n2.path);
    } }, n2.exports), n2.exports;
  }
  var s = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = n2 || function(e3, t3) {
      var n3 = Object.create || /* @__PURE__ */ function() {
        function e4() {
        }
        return function(t4) {
          var n4;
          return e4.prototype = t4, n4 = new e4(), e4.prototype = null, n4;
        };
      }(), s2 = {}, r2 = s2.lib = {}, i2 = r2.Base = { extend: function(e4) {
        var t4 = n3(this);
        return e4 && t4.mixIn(e4), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
          t4.$super.init.apply(this, arguments);
        }), t4.init.prototype = t4, t4.$super = this, t4;
      }, create: function() {
        var e4 = this.extend();
        return e4.init.apply(e4, arguments), e4;
      }, init: function() {
      }, mixIn: function(e4) {
        for (var t4 in e4)
          e4.hasOwnProperty(t4) && (this[t4] = e4[t4]);
        e4.hasOwnProperty("toString") && (this.toString = e4.toString);
      }, clone: function() {
        return this.init.prototype.extend(this);
      } }, o2 = r2.WordArray = i2.extend({ init: function(e4, n4) {
        e4 = this.words = e4 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e4.length;
      }, toString: function(e4) {
        return (e4 || c2).stringify(this);
      }, concat: function(e4) {
        var t4 = this.words, n4 = e4.words, s3 = this.sigBytes, r3 = e4.sigBytes;
        if (this.clamp(), s3 % 4)
          for (var i3 = 0; i3 < r3; i3++) {
            var o3 = n4[i3 >>> 2] >>> 24 - i3 % 4 * 8 & 255;
            t4[s3 + i3 >>> 2] |= o3 << 24 - (s3 + i3) % 4 * 8;
          }
        else
          for (i3 = 0; i3 < r3; i3 += 4)
            t4[s3 + i3 >>> 2] = n4[i3 >>> 2];
        return this.sigBytes += r3, this;
      }, clamp: function() {
        var t4 = this.words, n4 = this.sigBytes;
        t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e3.ceil(n4 / 4);
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4.words = this.words.slice(0), e4;
      }, random: function(t4) {
        for (var n4, s3 = [], r3 = function(t5) {
          var n5 = 987654321, s4 = 4294967295;
          return function() {
            var r4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
            return r4 /= 4294967296, (r4 += 0.5) * (e3.random() > 0.5 ? 1 : -1);
          };
        }, i3 = 0; i3 < t4; i3 += 4) {
          var a3 = r3(4294967296 * (n4 || e3.random()));
          n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
        }
        return new o2.init(s3, t4);
      } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e4) {
        for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push((i3 >>> 4).toString(16)), s3.push((15 & i3).toString(16));
        }
        return s3.join("");
      }, parse: function(e4) {
        for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
          n4[s3 >>> 3] |= parseInt(e4.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
        return new o2.init(n4, t4 / 2);
      } }, u2 = a2.Latin1 = { stringify: function(e4) {
        for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push(String.fromCharCode(i3));
        }
        return s3.join("");
      }, parse: function(e4) {
        for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3++)
          n4[s3 >>> 2] |= (255 & e4.charCodeAt(s3)) << 24 - s3 % 4 * 8;
        return new o2.init(n4, t4);
      } }, h2 = a2.Utf8 = { stringify: function(e4) {
        try {
          return decodeURIComponent(escape(u2.stringify(e4)));
        } catch (e5) {
          throw new Error("Malformed UTF-8 data");
        }
      }, parse: function(e4) {
        return u2.parse(unescape(encodeURIComponent(e4)));
      } }, l2 = r2.BufferedBlockAlgorithm = i2.extend({ reset: function() {
        this._data = new o2.init(), this._nDataBytes = 0;
      }, _append: function(e4) {
        "string" == typeof e4 && (e4 = h2.parse(e4)), this._data.concat(e4), this._nDataBytes += e4.sigBytes;
      }, _process: function(t4) {
        var n4 = this._data, s3 = n4.words, r3 = n4.sigBytes, i3 = this.blockSize, a3 = r3 / (4 * i3), c3 = (a3 = t4 ? e3.ceil(a3) : e3.max((0 | a3) - this._minBufferSize, 0)) * i3, u3 = e3.min(4 * c3, r3);
        if (c3) {
          for (var h3 = 0; h3 < c3; h3 += i3)
            this._doProcessBlock(s3, h3);
          var l3 = s3.splice(0, c3);
          n4.sigBytes -= u3;
        }
        return new o2.init(l3, u3);
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._data = this._data.clone(), e4;
      }, _minBufferSize: 0 });
      r2.Hasher = l2.extend({ cfg: i2.extend(), init: function(e4) {
        this.cfg = this.cfg.extend(e4), this.reset();
      }, reset: function() {
        l2.reset.call(this), this._doReset();
      }, update: function(e4) {
        return this._append(e4), this._process(), this;
      }, finalize: function(e4) {
        return e4 && this._append(e4), this._doFinalize();
      }, blockSize: 16, _createHelper: function(e4) {
        return function(t4, n4) {
          return new e4.init(n4).finalize(t4);
        };
      }, _createHmacHelper: function(e4) {
        return function(t4, n4) {
          return new d2.HMAC.init(e4, n4).finalize(t4);
        };
      } });
      var d2 = s2.algo = {};
      return s2;
    }(Math), n2);
  }), r = s, i = (n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function(e3) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [];
      !function() {
        for (var t4 = 0; t4 < 64; t4++)
          a2[t4] = 4294967296 * e3.abs(e3.sin(t4 + 1)) | 0;
      }();
      var c2 = o2.MD5 = i2.extend({ _doReset: function() {
        this._hash = new r2.init([1732584193, 4023233417, 2562383102, 271733878]);
      }, _doProcessBlock: function(e4, t4) {
        for (var n3 = 0; n3 < 16; n3++) {
          var s3 = t4 + n3, r3 = e4[s3];
          e4[s3] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8);
        }
        var i3 = this._hash.words, o3 = e4[t4 + 0], c3 = e4[t4 + 1], p2 = e4[t4 + 2], f2 = e4[t4 + 3], g2 = e4[t4 + 4], m2 = e4[t4 + 5], y2 = e4[t4 + 6], _2 = e4[t4 + 7], w2 = e4[t4 + 8], I2 = e4[t4 + 9], v2 = e4[t4 + 10], S2 = e4[t4 + 11], T2 = e4[t4 + 12], b2 = e4[t4 + 13], E2 = e4[t4 + 14], k2 = e4[t4 + 15], A2 = i3[0], P2 = i3[1], C2 = i3[2], O2 = i3[3];
        A2 = u2(A2, P2, C2, O2, o3, 7, a2[0]), O2 = u2(O2, A2, P2, C2, c3, 12, a2[1]), C2 = u2(C2, O2, A2, P2, p2, 17, a2[2]), P2 = u2(P2, C2, O2, A2, f2, 22, a2[3]), A2 = u2(A2, P2, C2, O2, g2, 7, a2[4]), O2 = u2(O2, A2, P2, C2, m2, 12, a2[5]), C2 = u2(C2, O2, A2, P2, y2, 17, a2[6]), P2 = u2(P2, C2, O2, A2, _2, 22, a2[7]), A2 = u2(A2, P2, C2, O2, w2, 7, a2[8]), O2 = u2(O2, A2, P2, C2, I2, 12, a2[9]), C2 = u2(C2, O2, A2, P2, v2, 17, a2[10]), P2 = u2(P2, C2, O2, A2, S2, 22, a2[11]), A2 = u2(A2, P2, C2, O2, T2, 7, a2[12]), O2 = u2(O2, A2, P2, C2, b2, 12, a2[13]), C2 = u2(C2, O2, A2, P2, E2, 17, a2[14]), A2 = h2(A2, P2 = u2(P2, C2, O2, A2, k2, 22, a2[15]), C2, O2, c3, 5, a2[16]), O2 = h2(O2, A2, P2, C2, y2, 9, a2[17]), C2 = h2(C2, O2, A2, P2, S2, 14, a2[18]), P2 = h2(P2, C2, O2, A2, o3, 20, a2[19]), A2 = h2(A2, P2, C2, O2, m2, 5, a2[20]), O2 = h2(O2, A2, P2, C2, v2, 9, a2[21]), C2 = h2(C2, O2, A2, P2, k2, 14, a2[22]), P2 = h2(P2, C2, O2, A2, g2, 20, a2[23]), A2 = h2(A2, P2, C2, O2, I2, 5, a2[24]), O2 = h2(O2, A2, P2, C2, E2, 9, a2[25]), C2 = h2(C2, O2, A2, P2, f2, 14, a2[26]), P2 = h2(P2, C2, O2, A2, w2, 20, a2[27]), A2 = h2(A2, P2, C2, O2, b2, 5, a2[28]), O2 = h2(O2, A2, P2, C2, p2, 9, a2[29]), C2 = h2(C2, O2, A2, P2, _2, 14, a2[30]), A2 = l2(A2, P2 = h2(P2, C2, O2, A2, T2, 20, a2[31]), C2, O2, m2, 4, a2[32]), O2 = l2(O2, A2, P2, C2, w2, 11, a2[33]), C2 = l2(C2, O2, A2, P2, S2, 16, a2[34]), P2 = l2(P2, C2, O2, A2, E2, 23, a2[35]), A2 = l2(A2, P2, C2, O2, c3, 4, a2[36]), O2 = l2(O2, A2, P2, C2, g2, 11, a2[37]), C2 = l2(C2, O2, A2, P2, _2, 16, a2[38]), P2 = l2(P2, C2, O2, A2, v2, 23, a2[39]), A2 = l2(A2, P2, C2, O2, b2, 4, a2[40]), O2 = l2(O2, A2, P2, C2, o3, 11, a2[41]), C2 = l2(C2, O2, A2, P2, f2, 16, a2[42]), P2 = l2(P2, C2, O2, A2, y2, 23, a2[43]), A2 = l2(A2, P2, C2, O2, I2, 4, a2[44]), O2 = l2(O2, A2, P2, C2, T2, 11, a2[45]), C2 = l2(C2, O2, A2, P2, k2, 16, a2[46]), A2 = d2(A2, P2 = l2(P2, C2, O2, A2, p2, 23, a2[47]), C2, O2, o3, 6, a2[48]), O2 = d2(O2, A2, P2, C2, _2, 10, a2[49]), C2 = d2(C2, O2, A2, P2, E2, 15, a2[50]), P2 = d2(P2, C2, O2, A2, m2, 21, a2[51]), A2 = d2(A2, P2, C2, O2, T2, 6, a2[52]), O2 = d2(O2, A2, P2, C2, f2, 10, a2[53]), C2 = d2(C2, O2, A2, P2, v2, 15, a2[54]), P2 = d2(P2, C2, O2, A2, c3, 21, a2[55]), A2 = d2(A2, P2, C2, O2, w2, 6, a2[56]), O2 = d2(O2, A2, P2, C2, k2, 10, a2[57]), C2 = d2(C2, O2, A2, P2, y2, 15, a2[58]), P2 = d2(P2, C2, O2, A2, b2, 21, a2[59]), A2 = d2(A2, P2, C2, O2, g2, 6, a2[60]), O2 = d2(O2, A2, P2, C2, S2, 10, a2[61]), C2 = d2(C2, O2, A2, P2, p2, 15, a2[62]), P2 = d2(P2, C2, O2, A2, I2, 21, a2[63]), i3[0] = i3[0] + A2 | 0, i3[1] = i3[1] + P2 | 0, i3[2] = i3[2] + C2 | 0, i3[3] = i3[3] + O2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        n3[r3 >>> 5] |= 128 << 24 - r3 % 32;
        var i3 = e3.floor(s3 / 4294967296), o3 = s3;
        n3[15 + (r3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), n3[14 + (r3 + 64 >>> 9 << 4)] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
        for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
          var h3 = c3[u3];
          c3[u3] = 16711935 & (h3 << 8 | h3 >>> 24) | 4278255360 & (h3 << 24 | h3 >>> 8);
        }
        return a3;
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._hash = this._hash.clone(), e4;
      } });
      function u2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 & n3 | ~t4 & s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function h2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 & s3 | n3 & ~s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function l2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 ^ n3 ^ s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function d2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (n3 ^ (t4 | ~s3)) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      t3.MD5 = i2._createHelper(c2), t3.HmacMD5 = i2._createHmacHelper(c2);
    }(Math), n2.MD5);
  }), n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, void function() {
      var e3 = n2, t3 = e3.lib.Base, s2 = e3.enc.Utf8;
      e3.algo.HMAC = t3.extend({ init: function(e4, t4) {
        e4 = this._hasher = new e4.init(), "string" == typeof t4 && (t4 = s2.parse(t4));
        var n3 = e4.blockSize, r2 = 4 * n3;
        t4.sigBytes > r2 && (t4 = e4.finalize(t4)), t4.clamp();
        for (var i2 = this._oKey = t4.clone(), o2 = this._iKey = t4.clone(), a2 = i2.words, c2 = o2.words, u2 = 0; u2 < n3; u2++)
          a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
        i2.sigBytes = o2.sigBytes = r2, this.reset();
      }, reset: function() {
        var e4 = this._hasher;
        e4.reset(), e4.update(this._iKey);
      }, update: function(e4) {
        return this._hasher.update(e4), this;
      }, finalize: function(e4) {
        var t4 = this._hasher, n3 = t4.finalize(e4);
        return t4.reset(), t4.finalize(this._oKey.clone().concat(n3));
      } });
    }());
  }), n(function(e2, t2) {
    e2.exports = r.HmacMD5;
  })), o = n(function(e2, t2) {
    e2.exports = r.enc.Utf8;
  }), a = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function() {
      var e3 = n2, t3 = e3.lib.WordArray;
      function s2(e4, n3, s3) {
        for (var r2 = [], i2 = 0, o2 = 0; o2 < n3; o2++)
          if (o2 % 4) {
            var a2 = s3[e4.charCodeAt(o2 - 1)] << o2 % 4 * 2, c2 = s3[e4.charCodeAt(o2)] >>> 6 - o2 % 4 * 2;
            r2[i2 >>> 2] |= (a2 | c2) << 24 - i2 % 4 * 8, i2++;
          }
        return t3.create(r2, i2);
      }
      e3.enc.Base64 = { stringify: function(e4) {
        var t4 = e4.words, n3 = e4.sigBytes, s3 = this._map;
        e4.clamp();
        for (var r2 = [], i2 = 0; i2 < n3; i2 += 3)
          for (var o2 = (t4[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) << 16 | (t4[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255) << 8 | t4[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255, a2 = 0; a2 < 4 && i2 + 0.75 * a2 < n3; a2++)
            r2.push(s3.charAt(o2 >>> 6 * (3 - a2) & 63));
        var c2 = s3.charAt(64);
        if (c2)
          for (; r2.length % 4; )
            r2.push(c2);
        return r2.join("");
      }, parse: function(e4) {
        var t4 = e4.length, n3 = this._map, r2 = this._reverseMap;
        if (!r2) {
          r2 = this._reverseMap = [];
          for (var i2 = 0; i2 < n3.length; i2++)
            r2[n3.charCodeAt(i2)] = i2;
        }
        var o2 = n3.charAt(64);
        if (o2) {
          var a2 = e4.indexOf(o2);
          -1 !== a2 && (t4 = a2);
        }
        return s2(e4, t4, r2);
      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    }(), n2.enc.Base64);
  });
  const c = "uni_id_token", u = "uni_id_token_expired", h = "uniIdToken", l = { DEFAULT: "FUNCTION", FUNCTION: "FUNCTION", OBJECT: "OBJECT", CLIENT_DB: "CLIENT_DB" }, d = "pending", p = "fulfilled", f = "rejected";
  function g(e2) {
    return Object.prototype.toString.call(e2).slice(8, -1).toLowerCase();
  }
  function m(e2) {
    return "object" === g(e2);
  }
  function y(e2) {
    return "function" == typeof e2;
  }
  function _(e2) {
    return function() {
      try {
        return e2.apply(e2, arguments);
      } catch (e3) {
        console.error(e3);
      }
    };
  }
  const w = "REJECTED", I = "NOT_PENDING";
  class v {
    constructor({ createPromise: e2, retryRule: t2 = w } = {}) {
      this.createPromise = e2, this.status = null, this.promise = null, this.retryRule = t2;
    }
    get needRetry() {
      if (!this.status)
        return true;
      switch (this.retryRule) {
        case w:
          return this.status === f;
        case I:
          return this.status !== d;
      }
    }
    exec() {
      return this.needRetry ? (this.status = d, this.promise = this.createPromise().then((e2) => (this.status = p, Promise.resolve(e2)), (e2) => (this.status = f, Promise.reject(e2))), this.promise) : this.promise;
    }
  }
  class S {
    constructor() {
      this._callback = {};
    }
    addListener(e2, t2) {
      this._callback[e2] || (this._callback[e2] = []), this._callback[e2].push(t2);
    }
    on(e2, t2) {
      return this.addListener(e2, t2);
    }
    removeListener(e2, t2) {
      if (!t2)
        throw new Error('The "listener" argument must be of type function. Received undefined');
      const n2 = this._callback[e2];
      if (!n2)
        return;
      const s2 = function(e3, t3) {
        for (let n3 = e3.length - 1; n3 >= 0; n3--)
          if (e3[n3] === t3)
            return n3;
        return -1;
      }(n2, t2);
      n2.splice(s2, 1);
    }
    off(e2, t2) {
      return this.removeListener(e2, t2);
    }
    removeAllListener(e2) {
      delete this._callback[e2];
    }
    emit(e2, ...t2) {
      const n2 = this._callback[e2];
      if (n2)
        for (let e3 = 0; e3 < n2.length; e3++)
          n2[e3](...t2);
    }
  }
  function T(e2) {
    return e2 && "string" == typeof e2 ? JSON.parse(e2) : e2;
  }
  const b = true, E = "app", A = T(define_process_env_UNI_SECURE_NETWORK_CONFIG_default), P = E, C = T(""), O = T("[]") || [];
  let N = "";
  try {
    N = "__UNI__41B1966";
  } catch (e2) {
  }
  let R, L = {};
  function U(e2, t2 = {}) {
    var n2, s2;
    return n2 = L, s2 = e2, Object.prototype.hasOwnProperty.call(n2, s2) || (L[e2] = t2), L[e2];
  }
  function D() {
    return R || (R = function() {
      if ("undefined" != typeof globalThis)
        return globalThis;
      if ("undefined" != typeof self)
        return self;
      if ("undefined" != typeof window)
        return window;
      function e2() {
        return this;
      }
      return void 0 !== e2() ? e2() : new Function("return this")();
    }(), R);
  }
  L = uni._globalUniCloudObj ? uni._globalUniCloudObj : uni._globalUniCloudObj = {};
  const M = ["invoke", "success", "fail", "complete"], q = U("_globalUniCloudInterceptor");
  function F(e2, t2) {
    q[e2] || (q[e2] = {}), m(t2) && Object.keys(t2).forEach((n2) => {
      M.indexOf(n2) > -1 && function(e3, t3, n3) {
        let s2 = q[e3][t3];
        s2 || (s2 = q[e3][t3] = []), -1 === s2.indexOf(n3) && y(n3) && s2.push(n3);
      }(e2, n2, t2[n2]);
    });
  }
  function K(e2, t2) {
    q[e2] || (q[e2] = {}), m(t2) ? Object.keys(t2).forEach((n2) => {
      M.indexOf(n2) > -1 && function(e3, t3, n3) {
        const s2 = q[e3][t3];
        if (!s2)
          return;
        const r2 = s2.indexOf(n3);
        r2 > -1 && s2.splice(r2, 1);
      }(e2, n2, t2[n2]);
    }) : delete q[e2];
  }
  function j(e2, t2) {
    return e2 && 0 !== e2.length ? e2.reduce((e3, n2) => e3.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
  }
  function $(e2, t2) {
    return q[e2] && q[e2][t2] || [];
  }
  function B(e2) {
    F("callObject", e2);
  }
  const W = U("_globalUniCloudListener"), H = { RESPONSE: "response", NEED_LOGIN: "needLogin", REFRESH_TOKEN: "refreshToken" }, J = { CLIENT_DB: "clientdb", CLOUD_FUNCTION: "cloudfunction", CLOUD_OBJECT: "cloudobject" };
  function z(e2) {
    return W[e2] || (W[e2] = []), W[e2];
  }
  function V(e2, t2) {
    const n2 = z(e2);
    n2.includes(t2) || n2.push(t2);
  }
  function G(e2, t2) {
    const n2 = z(e2), s2 = n2.indexOf(t2);
    -1 !== s2 && n2.splice(s2, 1);
  }
  function Y(e2, t2) {
    const n2 = z(e2);
    for (let e3 = 0; e3 < n2.length; e3++) {
      (0, n2[e3])(t2);
    }
  }
  let Q, X = false;
  function Z() {
    return Q || (Q = new Promise((e2) => {
      X && e2(), function t2() {
        if ("function" == typeof getCurrentPages) {
          const t3 = getCurrentPages();
          t3 && t3[0] && (X = true, e2());
        }
        X || setTimeout(() => {
          t2();
        }, 30);
      }();
    }), Q);
  }
  function ee(e2) {
    const t2 = {};
    for (const n2 in e2) {
      const s2 = e2[n2];
      y(s2) && (t2[n2] = _(s2));
    }
    return t2;
  }
  class te extends Error {
    constructor(e2) {
      const t2 = e2.message || e2.errMsg || "unknown system error";
      super(t2), this.errMsg = t2, this.code = this.errCode = e2.code || e2.errCode || "SYSTEM_ERROR", this.errSubject = this.subject = e2.subject || e2.errSubject, this.cause = e2.cause, this.requestId = e2.requestId;
    }
    toJson(e2 = 0) {
      if (!(e2 >= 10))
        return e2++, { errCode: this.errCode, errMsg: this.errMsg, errSubject: this.errSubject, cause: this.cause && this.cause.toJson ? this.cause.toJson(e2) : this.cause };
    }
  }
  var ne = { request: (e2) => uni.request(e2), uploadFile: (e2) => uni.uploadFile(e2), setStorageSync: (e2, t2) => uni.setStorageSync(e2, t2), getStorageSync: (e2) => uni.getStorageSync(e2), removeStorageSync: (e2) => uni.removeStorageSync(e2), clearStorageSync: () => uni.clearStorageSync(), connectSocket: (e2) => uni.connectSocket(e2) };
  function se(e2) {
    return e2 && se(e2.__v_raw) || e2;
  }
  function re() {
    return { token: ne.getStorageSync(c) || ne.getStorageSync(h), tokenExpired: ne.getStorageSync(u) };
  }
  function ie({ token: e2, tokenExpired: t2 } = {}) {
    e2 && ne.setStorageSync(c, e2), t2 && ne.setStorageSync(u, t2);
  }
  let oe, ae;
  function ce() {
    return oe || (oe = uni.getSystemInfoSync()), oe;
  }
  function ue() {
    let e2, t2;
    try {
      if (uni.getLaunchOptionsSync) {
        if (uni.getLaunchOptionsSync.toString().indexOf("not yet implemented") > -1)
          return;
        const { scene: n2, channel: s2 } = uni.getLaunchOptionsSync();
        e2 = s2, t2 = n2;
      }
    } catch (e3) {
    }
    return { channel: e2, scene: t2 };
  }
  let he = {};
  function le() {
    const e2 = uni.getLocale && uni.getLocale() || "en";
    if (ae)
      return { ...he, ...ae, locale: e2, LOCALE: e2 };
    const t2 = ce(), { deviceId: n2, osName: s2, uniPlatform: r2, appId: i2 } = t2, o2 = ["appId", "appLanguage", "appName", "appVersion", "appVersionCode", "appWgtVersion", "browserName", "browserVersion", "deviceBrand", "deviceId", "deviceModel", "deviceType", "osName", "osVersion", "romName", "romVersion", "ua", "hostName", "hostVersion", "uniPlatform", "uniRuntimeVersion", "uniRuntimeVersionCode", "uniCompilerVersion", "uniCompilerVersionCode"];
    for (const e3 in t2)
      Object.hasOwnProperty.call(t2, e3) && -1 === o2.indexOf(e3) && delete t2[e3];
    return ae = { PLATFORM: r2, OS: s2, APPID: i2, DEVICEID: n2, ...ue(), ...t2 }, { ...he, ...ae, locale: e2, LOCALE: e2 };
  }
  var de = { sign: function(e2, t2) {
    let n2 = "";
    return Object.keys(e2).sort().forEach(function(t3) {
      e2[t3] && (n2 = n2 + "&" + t3 + "=" + e2[t3]);
    }), n2 = n2.slice(1), i(n2, t2).toString();
  }, wrappedRequest: function(e2, t2) {
    return new Promise((n2, s2) => {
      t2(Object.assign(e2, { complete(e3) {
        e3 || (e3 = {});
        const t3 = e3.data && e3.data.header && e3.data.header["x-serverless-request-id"] || e3.header && e3.header["request-id"];
        if (!e3.statusCode || e3.statusCode >= 400) {
          const n3 = e3.data && e3.data.error && e3.data.error.code || "SYS_ERR", r3 = e3.data && e3.data.error && e3.data.error.message || e3.errMsg || "request:fail";
          return s2(new te({ code: n3, message: r3, requestId: t3 }));
        }
        const r2 = e3.data;
        if (r2.error)
          return s2(new te({ code: r2.error.code, message: r2.error.message, requestId: t3 }));
        r2.result = r2.data, r2.requestId = t3, delete r2.data, n2(r2);
      } }));
    });
  }, toBase64: function(e2) {
    return a.stringify(o.parse(e2));
  } };
  var pe = class {
    constructor(e2) {
      ["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), this.config = Object.assign({}, { endpoint: 0 === e2.spaceId.indexOf("mp-") ? "https://api.next.bspapp.com" : "https://api.bspapp.com" }, e2), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = ne, this._getAccessTokenPromiseHub = new v({ createPromise: () => this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e3) => {
        if (!e3.result || !e3.result.accessToken)
          throw new te({ code: "AUTH_FAILED", message: "获取accessToken失败" });
        this.setAccessToken(e3.result.accessToken);
      }), retryRule: I });
    }
    get hasAccessToken() {
      return !!this.accessToken;
    }
    setAccessToken(e2) {
      this.accessToken = e2;
    }
    requestWrapped(e2) {
      return de.wrappedRequest(e2, this.adapter.request);
    }
    requestAuth(e2) {
      return this.requestWrapped(e2);
    }
    request(e2, t2) {
      return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e2) : this.requestWrapped(e2).catch((t3) => new Promise((e3, n2) => {
        !t3 || "GATEWAY_INVALID_TOKEN" !== t3.code && "InvalidParameter.InvalidToken" !== t3.code ? n2(t3) : e3();
      }).then(() => this.getAccessToken()).then(() => {
        const t4 = this.rebuildRequest(e2);
        return this.request(t4, true);
      })) : this.getAccessToken().then(() => {
        const t3 = this.rebuildRequest(e2);
        return this.request(t3, true);
      }));
    }
    rebuildRequest(e2) {
      const t2 = Object.assign({}, e2);
      return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = de.sign(t2.data, this.config.clientSecret), t2;
    }
    setupRequest(e2, t2) {
      const n2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      return "auth" !== t2 && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = de.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
    }
    getAccessToken() {
      return this._getAccessTokenPromiseHub.exec();
    }
    async authorize() {
      await this.getAccessToken();
    }
    callFunction(e2) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
      return this.request({ ...this.setupRequest(t2), timeout: e2.timeout });
    }
    getOSSUploadOptionsFromPath(e2) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
      return this.request(this.setupRequest(t2));
    }
    uploadFileToOSS({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, onUploadProgress: i2 }) {
      return new Promise((o2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e3) {
          e3 && e3.statusCode < 400 ? o2(e3) : a2(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          a2(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof i2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
          i2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }
    reportOSSUpload(e2) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
      return this.request(this.setupRequest(t2));
    }
    async uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", cloudPathAsRealPath: s2 = false, onUploadProgress: r2, config: i2 }) {
      if ("string" !== g(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
      if (!(t2 = t2.trim()))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
      if (/:\/\//.test(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不合法" });
      const o2 = i2 && i2.envType || this.config.envType;
      if (s2 && ("/" !== t2[0] && (t2 = "/" + t2), t2.indexOf("\\") > -1))
        throw new te({ code: "INVALID_PARAM", message: "使用cloudPath作为路径时，cloudPath不可包含“\\”" });
      const a2 = (await this.getOSSUploadOptionsFromPath({ env: o2, filename: s2 ? t2.split("/").pop() : t2, fileId: s2 ? t2 : void 0 })).result, c2 = "https://" + a2.cdnDomain + "/" + a2.ossPath, { securityToken: u2, accessKeyId: h2, signature: l2, host: d2, ossPath: p2, id: f2, policy: m2, ossCallbackUrl: y2 } = a2, _2 = { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: h2, Signature: l2, host: d2, id: f2, key: p2, policy: m2, success_action_status: 200 };
      if (u2 && (_2["x-oss-security-token"] = u2), y2) {
        const e3 = JSON.stringify({ callbackUrl: y2, callbackBody: JSON.stringify({ fileId: f2, spaceId: this.config.spaceId }), callbackBodyType: "application/json" });
        _2.callback = de.toBase64(e3);
      }
      const w2 = { url: "https://" + a2.host, formData: _2, fileName: "file", name: "file", filePath: e2, fileType: n2 };
      if (await this.uploadFileToOSS(Object.assign({}, w2, { onUploadProgress: r2 })), y2)
        return { success: true, filePath: e2, fileID: c2 };
      if ((await this.reportOSSUpload({ id: f2 })).success)
        return { success: true, filePath: e2, fileID: c2 };
      throw new te({ code: "UPLOAD_FAILED", message: "文件上传失败" });
    }
    getTempFileURL({ fileList: e2 } = {}) {
      return new Promise((t2, n2) => {
        Array.isArray(e2) && 0 !== e2.length || n2(new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" })), this.getFileInfo({ fileList: e2 }).then((n3) => {
          t2({ fileList: e2.map((e3, t3) => {
            const s2 = n3.fileList[t3];
            return { fileID: e3, tempFileURL: s2 && s2.url || e3 };
          }) });
        });
      });
    }
    async getFileInfo({ fileList: e2 } = {}) {
      if (!Array.isArray(e2) || 0 === e2.length)
        throw new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
      const t2 = { method: "serverless.file.resource.info", params: JSON.stringify({ id: e2.map((e3) => e3.split("?")[0]).join(",") }) };
      return { fileList: (await this.request(this.setupRequest(t2))).result };
    }
  };
  var fe = { init(e2) {
    const t2 = new pe(e2), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  const ge = "undefined" != typeof location && "http:" === location.protocol ? "http:" : "https:";
  var me;
  !function(e2) {
    e2.local = "local", e2.none = "none", e2.session = "session";
  }(me || (me = {}));
  var ye = function() {
  }, _e = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function(e3) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [], c2 = [];
      !function() {
        function t4(t5) {
          for (var n4 = e3.sqrt(t5), s4 = 2; s4 <= n4; s4++)
            if (!(t5 % s4))
              return false;
          return true;
        }
        function n3(e4) {
          return 4294967296 * (e4 - (0 | e4)) | 0;
        }
        for (var s3 = 2, r3 = 0; r3 < 64; )
          t4(s3) && (r3 < 8 && (a2[r3] = n3(e3.pow(s3, 0.5))), c2[r3] = n3(e3.pow(s3, 1 / 3)), r3++), s3++;
      }();
      var u2 = [], h2 = o2.SHA256 = i2.extend({ _doReset: function() {
        this._hash = new r2.init(a2.slice(0));
      }, _doProcessBlock: function(e4, t4) {
        for (var n3 = this._hash.words, s3 = n3[0], r3 = n3[1], i3 = n3[2], o3 = n3[3], a3 = n3[4], h3 = n3[5], l2 = n3[6], d2 = n3[7], p2 = 0; p2 < 64; p2++) {
          if (p2 < 16)
            u2[p2] = 0 | e4[t4 + p2];
          else {
            var f2 = u2[p2 - 15], g2 = (f2 << 25 | f2 >>> 7) ^ (f2 << 14 | f2 >>> 18) ^ f2 >>> 3, m2 = u2[p2 - 2], y2 = (m2 << 15 | m2 >>> 17) ^ (m2 << 13 | m2 >>> 19) ^ m2 >>> 10;
            u2[p2] = g2 + u2[p2 - 7] + y2 + u2[p2 - 16];
          }
          var _2 = s3 & r3 ^ s3 & i3 ^ r3 & i3, w2 = (s3 << 30 | s3 >>> 2) ^ (s3 << 19 | s3 >>> 13) ^ (s3 << 10 | s3 >>> 22), I2 = d2 + ((a3 << 26 | a3 >>> 6) ^ (a3 << 21 | a3 >>> 11) ^ (a3 << 7 | a3 >>> 25)) + (a3 & h3 ^ ~a3 & l2) + c2[p2] + u2[p2];
          d2 = l2, l2 = h3, h3 = a3, a3 = o3 + I2 | 0, o3 = i3, i3 = r3, r3 = s3, s3 = I2 + (w2 + _2) | 0;
        }
        n3[0] = n3[0] + s3 | 0, n3[1] = n3[1] + r3 | 0, n3[2] = n3[2] + i3 | 0, n3[3] = n3[3] + o3 | 0, n3[4] = n3[4] + a3 | 0, n3[5] = n3[5] + h3 | 0, n3[6] = n3[6] + l2 | 0, n3[7] = n3[7] + d2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        return n3[r3 >>> 5] |= 128 << 24 - r3 % 32, n3[14 + (r3 + 64 >>> 9 << 4)] = e3.floor(s3 / 4294967296), n3[15 + (r3 + 64 >>> 9 << 4)] = s3, t4.sigBytes = 4 * n3.length, this._process(), this._hash;
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._hash = this._hash.clone(), e4;
      } });
      t3.SHA256 = i2._createHelper(h2), t3.HmacSHA256 = i2._createHmacHelper(h2);
    }(Math), n2.SHA256);
  }), we = _e, Ie = n(function(e2, t2) {
    e2.exports = r.HmacSHA256;
  });
  const ve = () => {
    let e2;
    if (!Promise) {
      e2 = () => {
      }, e2.promise = {};
      const t3 = () => {
        throw new te({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
      };
      return Object.defineProperty(e2.promise, "then", { get: t3 }), Object.defineProperty(e2.promise, "catch", { get: t3 }), e2;
    }
    const t2 = new Promise((t3, n2) => {
      e2 = (e3, s2) => e3 ? n2(e3) : t3(s2);
    });
    return e2.promise = t2, e2;
  };
  function Se(e2) {
    return void 0 === e2;
  }
  function Te(e2) {
    return "[object Null]" === Object.prototype.toString.call(e2);
  }
  function be(e2 = "") {
    return e2.replace(/([\s\S]+)\s+(请前往云开发AI小助手查看问题：.*)/, "$1");
  }
  function Ee(e2 = 32) {
    const t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let n2 = "";
    for (let s2 = 0; s2 < e2; s2++)
      n2 += t2.charAt(Math.floor(62 * Math.random()));
    return n2;
  }
  var ke;
  function Ae(e2) {
    const t2 = (n2 = e2, "[object Array]" === Object.prototype.toString.call(n2) ? e2 : [e2]);
    var n2;
    for (const e3 of t2) {
      const { isMatch: t3, genAdapter: n3, runtime: s2 } = e3;
      if (t3())
        return { adapter: n3(), runtime: s2 };
    }
  }
  !function(e2) {
    e2.WEB = "web", e2.WX_MP = "wx_mp";
  }(ke || (ke = {}));
  const Pe = { adapter: null, runtime: void 0 }, Ce = ["anonymousUuidKey"];
  class Oe extends ye {
    constructor() {
      super(), Pe.adapter.root.tcbObject || (Pe.adapter.root.tcbObject = {});
    }
    setItem(e2, t2) {
      Pe.adapter.root.tcbObject[e2] = t2;
    }
    getItem(e2) {
      return Pe.adapter.root.tcbObject[e2];
    }
    removeItem(e2) {
      delete Pe.adapter.root.tcbObject[e2];
    }
    clear() {
      delete Pe.adapter.root.tcbObject;
    }
  }
  function xe(e2, t2) {
    switch (e2) {
      case "local":
        return t2.localStorage || new Oe();
      case "none":
        return new Oe();
      default:
        return t2.sessionStorage || new Oe();
    }
  }
  class Ne {
    constructor(e2) {
      if (!this._storage) {
        this._persistence = Pe.adapter.primaryStorage || e2.persistence, this._storage = xe(this._persistence, Pe.adapter);
        const t2 = `access_token_${e2.env}`, n2 = `access_token_expire_${e2.env}`, s2 = `refresh_token_${e2.env}`, r2 = `anonymous_uuid_${e2.env}`, i2 = `login_type_${e2.env}`, o2 = "device_id", a2 = `token_type_${e2.env}`, c2 = `user_info_${e2.env}`;
        this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: r2, loginTypeKey: i2, userInfoKey: c2, deviceIdKey: o2, tokenTypeKey: a2 };
      }
    }
    updatePersistence(e2) {
      if (e2 === this._persistence)
        return;
      const t2 = "local" === this._persistence;
      this._persistence = e2;
      const n2 = xe(e2, Pe.adapter);
      for (const e3 in this.keys) {
        const s2 = this.keys[e3];
        if (t2 && Ce.includes(e3))
          continue;
        const r2 = this._storage.getItem(s2);
        Se(r2) || Te(r2) || (n2.setItem(s2, r2), this._storage.removeItem(s2));
      }
      this._storage = n2;
    }
    setStore(e2, t2, n2) {
      if (!this._storage)
        return;
      const s2 = { version: n2 || "localCachev1", content: t2 }, r2 = JSON.stringify(s2);
      try {
        this._storage.setItem(e2, r2);
      } catch (e3) {
        throw e3;
      }
    }
    getStore(e2, t2) {
      try {
        if (!this._storage)
          return;
      } catch (e3) {
        return "";
      }
      t2 = t2 || "localCachev1";
      const n2 = this._storage.getItem(e2);
      if (!n2)
        return "";
      if (n2.indexOf(t2) >= 0) {
        return JSON.parse(n2).content;
      }
      return "";
    }
    removeStore(e2) {
      this._storage.removeItem(e2);
    }
  }
  const Re = {}, Le = {};
  function Ue(e2) {
    return Re[e2];
  }
  class De {
    constructor(e2, t2) {
      this.data = t2 || null, this.name = e2;
    }
  }
  class Me extends De {
    constructor(e2, t2) {
      super("error", { error: e2, data: t2 }), this.error = e2;
    }
  }
  const qe = new class {
    constructor() {
      this._listeners = {};
    }
    on(e2, t2) {
      return function(e3, t3, n2) {
        n2[e3] = n2[e3] || [], n2[e3].push(t3);
      }(e2, t2, this._listeners), this;
    }
    off(e2, t2) {
      return function(e3, t3, n2) {
        if (n2 && n2[e3]) {
          const s2 = n2[e3].indexOf(t3);
          -1 !== s2 && n2[e3].splice(s2, 1);
        }
      }(e2, t2, this._listeners), this;
    }
    fire(e2, t2) {
      if (e2 instanceof Me)
        return console.error(e2.error), this;
      const n2 = "string" == typeof e2 ? new De(e2, t2 || {}) : e2;
      const s2 = n2.name;
      if (this._listens(s2)) {
        n2.target = this;
        const e3 = this._listeners[s2] ? [...this._listeners[s2]] : [];
        for (const t3 of e3)
          t3.call(this, n2);
      }
      return this;
    }
    _listens(e2) {
      return this._listeners[e2] && this._listeners[e2].length > 0;
    }
  }();
  function Fe(e2, t2) {
    qe.on(e2, t2);
  }
  function Ke(e2, t2 = {}) {
    qe.fire(e2, t2);
  }
  function je(e2, t2) {
    qe.off(e2, t2);
  }
  const $e = "loginStateChanged", Be = "loginStateExpire", We = "loginTypeChanged", He = "anonymousConverted", Je = "refreshAccessToken";
  var ze;
  !function(e2) {
    e2.ANONYMOUS = "ANONYMOUS", e2.WECHAT = "WECHAT", e2.WECHAT_PUBLIC = "WECHAT-PUBLIC", e2.WECHAT_OPEN = "WECHAT-OPEN", e2.CUSTOM = "CUSTOM", e2.EMAIL = "EMAIL", e2.USERNAME = "USERNAME", e2.NULL = "NULL";
  }(ze || (ze = {}));
  class Ve {
    constructor() {
      this._fnPromiseMap = /* @__PURE__ */ new Map();
    }
    async run(e2, t2) {
      let n2 = this._fnPromiseMap.get(e2);
      return n2 || (n2 = new Promise(async (n3, s2) => {
        try {
          await this._runIdlePromise();
          const e3 = t2();
          n3(await e3);
        } catch (e3) {
          s2(e3);
        } finally {
          this._fnPromiseMap.delete(e2);
        }
      }), this._fnPromiseMap.set(e2, n2)), n2;
    }
    _runIdlePromise() {
      return Promise.resolve();
    }
  }
  class Ge {
    constructor(e2) {
      this._singlePromise = new Ve(), this._cache = Ue(e2.env), this._baseURL = `https://${e2.env}.ap-shanghai.tcb-api.tencentcloudapi.com`, this._reqClass = new Pe.adapter.reqClass({ timeout: e2.timeout, timeoutMsg: `请求在${e2.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] });
    }
    _getDeviceId() {
      if (this._deviceID)
        return this._deviceID;
      const { deviceIdKey: e2 } = this._cache.keys;
      let t2 = this._cache.getStore(e2);
      return "string" == typeof t2 && t2.length >= 16 && t2.length <= 48 || (t2 = Ee(), this._cache.setStore(e2, t2)), this._deviceID = t2, t2;
    }
    async _request(e2, t2, n2 = {}) {
      const s2 = { "x-request-id": Ee(), "x-device-id": this._getDeviceId() };
      if (n2.withAccessToken) {
        const { tokenTypeKey: e3 } = this._cache.keys, t3 = await this.getAccessToken(), n3 = this._cache.getStore(e3);
        s2.authorization = `${n3} ${t3}`;
      }
      return this._reqClass["get" === n2.method ? "get" : "post"]({ url: `${this._baseURL}${e2}`, data: t2, headers: s2 });
    }
    async _fetchAccessToken() {
      const { loginTypeKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2, tokenTypeKey: s2 } = this._cache.keys, r2 = this._cache.getStore(e2);
      if (r2 && r2 !== ze.ANONYMOUS)
        throw new te({ code: "INVALID_OPERATION", message: "非匿名登录不支持刷新 access token" });
      const i2 = await this._singlePromise.run("fetchAccessToken", async () => (await this._request("/auth/v1/signin/anonymously", {}, { method: "post" })).data), { access_token: o2, expires_in: a2, token_type: c2 } = i2;
      return this._cache.setStore(s2, c2), this._cache.setStore(t2, o2), this._cache.setStore(n2, Date.now() + 1e3 * a2), o2;
    }
    isAccessTokenExpired(e2, t2) {
      let n2 = true;
      return e2 && t2 && (n2 = t2 < Date.now()), n2;
    }
    async getAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
      return this.isAccessTokenExpired(n2, s2) ? this._fetchAccessToken() : n2;
    }
    async refreshAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, loginTypeKey: n2 } = this._cache.keys;
      return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.setStore(n2, ze.ANONYMOUS), this.getAccessToken();
    }
    async getUserInfo() {
      return this._singlePromise.run("getUserInfo", async () => (await this._request("/auth/v1/user/me", {}, { withAccessToken: true, method: "get" })).data);
    }
  }
  const Ye = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], Qe = { "X-SDK-Version": "1.3.5" };
  function Xe(e2, t2, n2) {
    const s2 = e2[t2];
    e2[t2] = function(t3) {
      const r2 = {}, i2 = {};
      n2.forEach((n3) => {
        const { data: s3, headers: o3 } = n3.call(e2, t3);
        Object.assign(r2, s3), Object.assign(i2, o3);
      });
      const o2 = t3.data;
      return o2 && (() => {
        var e3;
        if (e3 = o2, "[object FormData]" !== Object.prototype.toString.call(e3))
          t3.data = { ...o2, ...r2 };
        else
          for (const e4 in r2)
            o2.append(e4, r2[e4]);
      })(), t3.headers = { ...t3.headers || {}, ...i2 }, s2.call(e2, t3);
    };
  }
  function Ze() {
    const e2 = Math.random().toString(16).slice(2);
    return { data: { seqId: e2 }, headers: { ...Qe, "x-seqid": e2 } };
  }
  class et {
    constructor(e2 = {}) {
      var t2;
      this.config = e2, this._reqClass = new Pe.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `请求在${this.config.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] }), this._cache = Ue(this.config.env), this._localCache = (t2 = this.config.env, Le[t2]), this.oauth = new Ge(this.config), Xe(this._reqClass, "post", [Ze]), Xe(this._reqClass, "upload", [Ze]), Xe(this._reqClass, "download", [Ze]);
    }
    async post(e2) {
      return await this._reqClass.post(e2);
    }
    async upload(e2) {
      return await this._reqClass.upload(e2);
    }
    async download(e2) {
      return await this._reqClass.download(e2);
    }
    async refreshAccessToken() {
      let e2, t2;
      this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
      try {
        e2 = await this._refreshAccessTokenPromise;
      } catch (e3) {
        t2 = e3;
      }
      if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
        throw t2;
      return e2;
    }
    async _refreshAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: r2 } = this._cache.keys;
      this._cache.removeStore(e2), this._cache.removeStore(t2);
      let i2 = this._cache.getStore(n2);
      if (!i2)
        throw new te({ message: "未登录CloudBase" });
      const o2 = { refresh_token: i2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", o2);
      if (a2.data.code) {
        const { code: e3 } = a2.data;
        if ("SIGN_PARAM_INVALID" === e3 || "REFRESH_TOKEN_EXPIRED" === e3 || "INVALID_REFRESH_TOKEN" === e3) {
          if (this._cache.getStore(s2) === ze.ANONYMOUS && "INVALID_REFRESH_TOKEN" === e3) {
            const e4 = this._cache.getStore(r2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e4, refresh_token: t3 });
            return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
          }
          Ke(Be), this._cache.removeStore(n2);
        }
        throw new te({ code: a2.data.code, message: `刷新access token失败：${a2.data.code}` });
      }
      if (a2.data.access_token)
        return Ke(Je), this._cache.setStore(e2, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
      a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
    }
    async getAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
      if (!this._cache.getStore(n2))
        throw new te({ message: "refresh token不存在，登录状态异常" });
      let s2 = this._cache.getStore(e2), r2 = this._cache.getStore(t2), i2 = true;
      return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, r2) && (i2 = false), (!s2 || !r2 || r2 < Date.now()) && i2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: r2 };
    }
    async request(e2, t2, n2) {
      const s2 = `x-tcb-trace_${this.config.env}`;
      let r2 = "application/x-www-form-urlencoded";
      const i2 = { action: e2, env: this.config.env, dataVersion: "2019-08-16", ...t2 };
      let o2;
      if (-1 === Ye.indexOf(e2) && (this._cache.keys, i2.access_token = await this.oauth.getAccessToken()), "storage.uploadFile" === e2) {
        o2 = new FormData();
        for (let e3 in o2)
          o2.hasOwnProperty(e3) && void 0 !== o2[e3] && o2.append(e3, i2[e3]);
        r2 = "multipart/form-data";
      } else {
        r2 = "application/json", o2 = {};
        for (let e3 in i2)
          void 0 !== i2[e3] && (o2[e3] = i2[e3]);
      }
      let a2 = { headers: { "content-type": r2 } };
      n2 && n2.timeout && (a2.timeout = n2.timeout), n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
      const c2 = this._localCache.getStore(s2);
      c2 && (a2.headers["X-TCB-Trace"] = c2);
      const { parse: u2, inQuery: h2, search: l2 } = t2;
      let d2 = { env: this.config.env };
      u2 && (d2.parse = true), h2 && (d2 = { ...h2, ...d2 });
      let p2 = function(e3, t3, n3 = {}) {
        const s3 = /\?/.test(t3);
        let r3 = "";
        for (let e4 in n3)
          "" === r3 ? !s3 && (t3 += "?") : r3 += "&", r3 += `${e4}=${encodeURIComponent(n3[e4])}`;
        return /^http(s)?\:\/\//.test(t3 += r3) ? t3 : `${e3}${t3}`;
      }(ge, "//tcb-api.tencentcloudapi.com/web", d2);
      l2 && (p2 += l2);
      const f2 = await this.post({ url: p2, data: o2, ...a2 }), g2 = f2.header && f2.header["x-tcb-trace"];
      if (g2 && this._localCache.setStore(s2, g2), 200 !== Number(f2.status) && 200 !== Number(f2.statusCode) || !f2.data)
        throw new te({ code: "NETWORK_ERROR", message: "network request error" });
      return f2;
    }
    async send(e2, t2 = {}, n2 = {}) {
      const s2 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
      if (("ACCESS_TOKEN_DISABLED" === s2.data.code || "ACCESS_TOKEN_EXPIRED" === s2.data.code) && -1 === Ye.indexOf(e2)) {
        await this.oauth.refreshAccessToken();
        const s3 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
        if (s3.data.code)
          throw new te({ code: s3.data.code, message: be(s3.data.message) });
        return s3.data;
      }
      if (s2.data.code)
        throw new te({ code: s2.data.code, message: be(s2.data.message) });
      return s2.data;
    }
    setRefreshToken(e2) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
    }
  }
  const tt = {};
  function nt(e2) {
    return tt[e2];
  }
  class st {
    constructor(e2) {
      this.config = e2, this._cache = Ue(e2.env), this._request = nt(e2.env);
    }
    setRefreshToken(e2) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
    }
    setAccessToken(e2, t2) {
      const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
      this._cache.setStore(n2, e2), this._cache.setStore(s2, t2);
    }
    async refreshUserInfo() {
      const { data: e2 } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e2), e2;
    }
    setLocalUserInfo(e2) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e2);
    }
  }
  class rt {
    constructor(e2) {
      if (!e2)
        throw new te({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._envId = e2, this._cache = Ue(this._envId), this._request = nt(this._envId), this.setUserInfo();
    }
    linkWithTicket(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "ticket must be string" });
      return this._request.send("auth.linkWithTicket", { ticket: e2 });
    }
    linkWithRedirect(e2) {
      e2.signInWithRedirect();
    }
    updatePassword(e2, t2) {
      return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e2 });
    }
    updateEmail(e2) {
      return this._request.send("auth.updateEmail", { newEmail: e2 });
    }
    updateUsername(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      return this._request.send("auth.updateUsername", { username: e2 });
    }
    async getLinkedUidList() {
      const { data: e2 } = await this._request.send("auth.getLinkedUidList", {});
      let t2 = false;
      const { users: n2 } = e2;
      return n2.forEach((e3) => {
        e3.wxOpenId && e3.wxPublicId && (t2 = true);
      }), { users: n2, hasPrimaryUid: t2 };
    }
    setPrimaryUid(e2) {
      return this._request.send("auth.setPrimaryUid", { uid: e2 });
    }
    unlink(e2) {
      return this._request.send("auth.unlink", { platform: e2 });
    }
    async update(e2) {
      const { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 } = e2, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 });
      this.setLocalUserInfo(a2);
    }
    async refresh() {
      const e2 = await this._request.oauth.getUserInfo();
      return this.setLocalUserInfo(e2), e2;
    }
    setUserInfo() {
      const { userInfoKey: e2 } = this._cache.keys, t2 = this._cache.getStore(e2);
      ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e3) => {
        this[e3] = t2[e3];
      }), this.location = { country: t2.country, province: t2.province, city: t2.city };
    }
    setLocalUserInfo(e2) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e2), this.setUserInfo();
    }
  }
  class it {
    constructor(e2) {
      if (!e2)
        throw new te({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._cache = Ue(e2);
      const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, r2 = this._cache.getStore(t2), i2 = this._cache.getStore(n2), o2 = this._cache.getStore(s2);
      this.credential = { refreshToken: r2, accessToken: i2, accessTokenExpire: o2 }, this.user = new rt(e2);
    }
    get isAnonymousAuth() {
      return this.loginType === ze.ANONYMOUS;
    }
    get isCustomAuth() {
      return this.loginType === ze.CUSTOM;
    }
    get isWeixinAuth() {
      return this.loginType === ze.WECHAT || this.loginType === ze.WECHAT_OPEN || this.loginType === ze.WECHAT_PUBLIC;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
  }
  class ot extends st {
    async signIn() {
      this._cache.updatePersistence("local"), await this._request.oauth.getAccessToken(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.ANONYMOUS, persistence: "local" });
      const e2 = new it(this.config.env);
      return await e2.user.refresh(), e2;
    }
    async linkAndRetrieveDataWithTicket(e2) {
      const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: r2, ticket: e2 });
      if (i2.refresh_token)
        return this._clearAnonymousUUID(), this.setRefreshToken(i2.refresh_token), await this._request.refreshAccessToken(), Ke(He, { env: this.config.env }), Ke(We, { loginType: ze.CUSTOM, persistence: "local" }), { credential: { refreshToken: i2.refresh_token } };
      throw new te({ message: "匿名转化失败" });
    }
    _setAnonymousUUID(e2) {
      const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.setStore(t2, e2), this._cache.setStore(n2, ze.ANONYMOUS);
    }
    _clearAnonymousUUID() {
      this._cache.removeStore(this._cache.keys.anonymousUuidKey);
    }
  }
  class at extends st {
    async signIn(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "ticket must be a string" });
      const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e2, refresh_token: this._cache.getStore(t2) || "" });
      if (n2.refresh_token)
        return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new it(this.config.env);
      throw new te({ message: "自定义登录失败" });
    }
  }
  class ct extends st {
    async signIn(e2, t2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "email must be a string" });
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token: i2, access_token_expire: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), i2 && o2 ? this.setAccessToken(i2, o2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.EMAIL, persistence: this.config.persistence }), new it(this.config.env);
      throw s2.code ? new te({ code: s2.code, message: `邮箱登录失败: ${s2.message}` }) : new te({ message: "邮箱登录失败" });
    }
    async activate(e2) {
      return this._request.send("auth.activateEndUserMail", { token: e2 });
    }
    async resetPasswordWithToken(e2, t2) {
      return this._request.send("auth.resetPasswordWithToken", { token: e2, newPassword: t2 });
    }
  }
  class ut extends st {
    async signIn(e2, t2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      "string" != typeof t2 && (t2 = "", console.warn("password is empty"));
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: ze.USERNAME, username: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token_expire: i2, access_token: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), o2 && i2 ? this.setAccessToken(o2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.USERNAME, persistence: this.config.persistence }), new it(this.config.env);
      throw s2.code ? new te({ code: s2.code, message: `用户名密码登录失败: ${s2.message}` }) : new te({ message: "用户名密码登录失败" });
    }
  }
  class ht {
    constructor(e2) {
      this.config = e2, this._cache = Ue(e2.env), this._request = nt(e2.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), Fe(We, this._onLoginTypeChanged);
    }
    get currentUser() {
      const e2 = this.hasLoginState();
      return e2 && e2.user || null;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
    anonymousAuthProvider() {
      return new ot(this.config);
    }
    customAuthProvider() {
      return new at(this.config);
    }
    emailAuthProvider() {
      return new ct(this.config);
    }
    usernameAuthProvider() {
      return new ut(this.config);
    }
    async signInAnonymously() {
      return new ot(this.config).signIn();
    }
    async signInWithEmailAndPassword(e2, t2) {
      return new ct(this.config).signIn(e2, t2);
    }
    signInWithUsernameAndPassword(e2, t2) {
      return new ut(this.config).signIn(e2, t2);
    }
    async linkAndRetrieveDataWithTicket(e2) {
      this._anonymousAuthProvider || (this._anonymousAuthProvider = new ot(this.config)), Fe(He, this._onAnonymousConverted);
      return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e2);
    }
    async signOut() {
      if (this.loginType === ze.ANONYMOUS)
        throw new te({ message: "匿名用户不支持登出操作" });
      const { refreshTokenKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e2);
      if (!s2)
        return;
      const r2 = await this._request.send("auth.logout", { refresh_token: s2 });
      return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.removeStore(n2), Ke($e), Ke(We, { env: this.config.env, loginType: ze.NULL, persistence: this.config.persistence }), r2;
    }
    async signUpWithEmailAndPassword(e2, t2) {
      return this._request.send("auth.signUpWithEmailAndPassword", { email: e2, password: t2 });
    }
    async sendPasswordResetEmail(e2) {
      return this._request.send("auth.sendPasswordResetEmail", { email: e2 });
    }
    onLoginStateChanged(e2) {
      Fe($e, () => {
        const t3 = this.hasLoginState();
        e2.call(this, t3);
      });
      const t2 = this.hasLoginState();
      e2.call(this, t2);
    }
    onLoginStateExpired(e2) {
      Fe(Be, e2.bind(this));
    }
    onAccessTokenRefreshed(e2) {
      Fe(Je, e2.bind(this));
    }
    onAnonymousConverted(e2) {
      Fe(He, e2.bind(this));
    }
    onLoginTypeChanged(e2) {
      Fe(We, () => {
        const t2 = this.hasLoginState();
        e2.call(this, t2);
      });
    }
    async getAccessToken() {
      return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
    }
    hasLoginState() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
      return this._request.oauth.isAccessTokenExpired(n2, s2) ? null : new it(this.config.env);
    }
    async isUsernameRegistered(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e2 });
      return t2 && t2.isRegistered;
    }
    getLoginState() {
      return Promise.resolve(this.hasLoginState());
    }
    async signInWithTicket(e2) {
      return new at(this.config).signIn(e2);
    }
    shouldRefreshAccessToken(e2) {
      this._request._shouldRefreshAccessTokenHook = e2.bind(this);
    }
    getUserInfo() {
      return this._request.send("auth.getUserInfo", {}).then((e2) => e2.code ? e2 : { ...e2.data, requestId: e2.seqId });
    }
    getAuthHeader() {
      const { refreshTokenKey: e2, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2);
      return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
    }
    _onAnonymousConverted(e2) {
      const { env: t2 } = e2.data;
      t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
    }
    _onLoginTypeChanged(e2) {
      const { loginType: t2, persistence: n2, env: s2 } = e2.data;
      s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
    }
  }
  const lt = function(e2, t2) {
    t2 = t2 || ve();
    const n2 = nt(this.config.env), { cloudPath: s2, filePath: r2, onUploadProgress: i2, fileType: o2 = "image" } = e2;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
      const { data: { url: a2, authorization: c2, token: u2, fileId: h2, cosFileId: l2 }, requestId: d2 } = e3, p2 = { key: s2, signature: c2, "x-cos-meta-fileid": l2, success_action_status: "201", "x-cos-security-token": u2 };
      n2.upload({ url: a2, data: p2, file: r2, name: s2, fileType: o2, onUploadProgress: i2 }).then((e4) => {
        201 === e4.statusCode ? t2(null, { fileID: h2, requestId: d2 }) : t2(new te({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e4.data}` }));
      }).catch((e4) => {
        t2(e4);
      });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, dt = function(e2, t2) {
    t2 = t2 || ve();
    const n2 = nt(this.config.env), { cloudPath: s2 } = e2;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
      t2(null, e3);
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, pt = function({ fileList: e2 }, t2) {
    if (t2 = t2 || ve(), !e2 || !Array.isArray(e2))
      return { code: "INVALID_PARAM", message: "fileList必须是非空的数组" };
    for (let t3 of e2)
      if (!t3 || "string" != typeof t3)
        return { code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" };
    const n2 = { fileid_list: e2 };
    return nt(this.config.env).send("storage.batchDeleteFile", n2).then((e3) => {
      e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.delete_list, requestId: e3.requestId });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, ft = function({ fileList: e2 }, t2) {
    t2 = t2 || ve(), e2 && Array.isArray(e2) || t2(null, { code: "INVALID_PARAM", message: "fileList必须是非空的数组" });
    let n2 = [];
    for (let s3 of e2)
      "object" == typeof s3 ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是包含fileID和maxAge的对象" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : "string" == typeof s3 ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是字符串" });
    const s2 = { file_list: n2 };
    return nt(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e3) => {
      e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.download_list, requestId: e3.requestId });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, gt = async function({ fileID: e2 }, t2) {
    const n2 = (await ft.call(this, { fileList: [{ fileID: e2, maxAge: 600 }] })).fileList[0];
    if ("SUCCESS" !== n2.code)
      return t2 ? t2(n2) : new Promise((e3) => {
        e3(n2);
      });
    const s2 = nt(this.config.env);
    let r2 = n2.download_url;
    if (r2 = encodeURI(r2), !t2)
      return s2.download({ url: r2 });
    t2(await s2.download({ url: r2 }));
  }, mt = function({ name: e2, data: t2, query: n2, parse: s2, search: r2, timeout: i2 }, o2) {
    const a2 = o2 || ve();
    let c2;
    try {
      c2 = t2 ? JSON.stringify(t2) : "";
    } catch (e3) {
      return Promise.reject(e3);
    }
    if (!e2)
      return Promise.reject(new te({ code: "PARAM_ERROR", message: "函数名不能为空" }));
    const u2 = { inQuery: n2, parse: s2, search: r2, function_name: e2, request_data: c2 };
    return nt(this.config.env).send("functions.invokeFunction", u2, { timeout: i2 }).then((e3) => {
      if (e3.code)
        a2(null, e3);
      else {
        let t3 = e3.data.response_data;
        if (s2)
          a2(null, { result: t3, requestId: e3.requestId });
        else
          try {
            t3 = JSON.parse(e3.data.response_data), a2(null, { result: t3, requestId: e3.requestId });
          } catch (e4) {
            a2(new te({ message: "response data must be json" }));
          }
      }
      return a2.promise;
    }).catch((e3) => {
      a2(e3);
    }), a2.promise;
  }, yt = { timeout: 15e3, persistence: "session" }, _t = 6e5, wt = {};
  class It {
    constructor(e2) {
      this.config = e2 || this.config, this.authObj = void 0;
    }
    init(e2) {
      switch (Pe.adapter || (this.requestClient = new Pe.adapter.reqClass({ timeout: e2.timeout || 5e3, timeoutMsg: `请求在${(e2.timeout || 5e3) / 1e3}s内未完成，已中断` })), this.config = { ...yt, ...e2 }, true) {
        case this.config.timeout > _t:
          console.warn("timeout大于可配置上限[10分钟]，已重置为上限数值"), this.config.timeout = _t;
          break;
        case this.config.timeout < 100:
          console.warn("timeout小于可配置下限[100ms]，已重置为下限数值"), this.config.timeout = 100;
      }
      return new It(this.config);
    }
    auth({ persistence: e2 } = {}) {
      if (this.authObj)
        return this.authObj;
      const t2 = e2 || Pe.adapter.primaryStorage || yt.persistence;
      var n2;
      return t2 !== this.config.persistence && (this.config.persistence = t2), function(e3) {
        const { env: t3 } = e3;
        Re[t3] = new Ne(e3), Le[t3] = new Ne({ ...e3, persistence: "local" });
      }(this.config), n2 = this.config, tt[n2.env] = new et(n2), this.authObj = new ht(this.config), this.authObj;
    }
    on(e2, t2) {
      return Fe.apply(this, [e2, t2]);
    }
    off(e2, t2) {
      return je.apply(this, [e2, t2]);
    }
    callFunction(e2, t2) {
      return mt.apply(this, [e2, t2]);
    }
    deleteFile(e2, t2) {
      return pt.apply(this, [e2, t2]);
    }
    getTempFileURL(e2, t2) {
      return ft.apply(this, [e2, t2]);
    }
    downloadFile(e2, t2) {
      return gt.apply(this, [e2, t2]);
    }
    uploadFile(e2, t2) {
      return lt.apply(this, [e2, t2]);
    }
    getUploadMetadata(e2, t2) {
      return dt.apply(this, [e2, t2]);
    }
    registerExtension(e2) {
      wt[e2.name] = e2;
    }
    async invokeExtension(e2, t2) {
      const n2 = wt[e2];
      if (!n2)
        throw new te({ message: `扩展${e2} 必须先注册` });
      return await n2.invoke(t2, this);
    }
    useAdapters(e2) {
      const { adapter: t2, runtime: n2 } = Ae(e2) || {};
      t2 && (Pe.adapter = t2), n2 && (Pe.runtime = n2);
    }
  }
  var vt = new It();
  function St(e2, t2, n2) {
    void 0 === n2 && (n2 = {});
    var s2 = /\?/.test(t2), r2 = "";
    for (var i2 in n2)
      "" === r2 ? !s2 && (t2 += "?") : r2 += "&", r2 += i2 + "=" + encodeURIComponent(n2[i2]);
    return /^http(s)?:\/\//.test(t2 += r2) ? t2 : "" + e2 + t2;
  }
  class Tt {
    get(e2) {
      const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
      return new Promise((e3, i2) => {
        ne.request({ url: St("https:", t2), data: n2, method: "GET", header: s2, timeout: r2, success(t3) {
          e3(t3);
        }, fail(e4) {
          i2(e4);
        } });
      });
    }
    post(e2) {
      const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
      return new Promise((e3, i2) => {
        ne.request({ url: St("https:", t2), data: n2, method: "POST", header: s2, timeout: r2, success(t3) {
          e3(t3);
        }, fail(e4) {
          i2(e4);
        } });
      });
    }
    upload(e2) {
      return new Promise((t2, n2) => {
        const { url: s2, file: r2, data: i2, headers: o2, fileType: a2 } = e2, c2 = ne.uploadFile({ url: St("https:", s2), name: "file", formData: Object.assign({}, i2), filePath: r2, fileType: a2, header: o2, success(e3) {
          const n3 = { statusCode: e3.statusCode, data: e3.data || {} };
          200 === e3.statusCode && i2.success_action_status && (n3.statusCode = parseInt(i2.success_action_status, 10)), t2(n3);
        }, fail(e3) {
          n2(new Error(e3.errMsg || "uploadFile:fail"));
        } });
        "function" == typeof e2.onUploadProgress && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((t3) => {
          e2.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
        });
      });
    }
  }
  const bt = { setItem(e2, t2) {
    ne.setStorageSync(e2, t2);
  }, getItem: (e2) => ne.getStorageSync(e2), removeItem(e2) {
    ne.removeStorageSync(e2);
  }, clear() {
    ne.clearStorageSync();
  } };
  var Et = { genAdapter: function() {
    return { root: {}, reqClass: Tt, localStorage: bt, primaryStorage: "local" };
  }, isMatch: function() {
    return true;
  }, runtime: "uni_app" };
  vt.useAdapters(Et);
  const kt = vt, At = kt.init;
  kt.init = function(e2) {
    e2.env = e2.spaceId;
    const t2 = At.call(this, e2);
    t2.config.provider = "tencent", t2.config.spaceId = e2.spaceId;
    const n2 = t2.auth;
    return t2.auth = function(e3) {
      const t3 = n2.call(this, e3);
      return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e4) => {
        var n3;
        t3[e4] = (n3 = t3[e4], function(e5) {
          e5 = e5 || {};
          const { success: t4, fail: s2, complete: r2 } = ee(e5);
          if (!(t4 || s2 || r2))
            return n3.call(this, e5);
          n3.call(this, e5).then((e6) => {
            t4 && t4(e6), r2 && r2(e6);
          }, (e6) => {
            s2 && s2(e6), r2 && r2(e6);
          });
        }).bind(t3);
      }), t3;
    }, t2.customAuth = t2.auth, t2;
  };
  var Pt = kt;
  async function Ct(e2, t2) {
    const n2 = `http://${e2}:${t2}/system/ping`;
    try {
      const e3 = await (s2 = { url: n2, timeout: 500 }, new Promise((e4, t3) => {
        ne.request({ ...s2, success(t4) {
          e4(t4);
        }, fail(e5) {
          t3(e5);
        } });
      }));
      return !(!e3.data || 0 !== e3.data.code);
    } catch (e3) {
      return false;
    }
    var s2;
  }
  async function Ot(e2, t2) {
    let n2;
    for (let s2 = 0; s2 < e2.length; s2++) {
      const r2 = e2[s2];
      if (await Ct(r2, t2)) {
        n2 = r2;
        break;
      }
    }
    return { address: n2, port: t2 };
  }
  const xt = { "serverless.file.resource.generateProximalSign": "storage/generate-proximal-sign", "serverless.file.resource.report": "storage/report", "serverless.file.resource.delete": "storage/delete", "serverless.file.resource.getTempFileURL": "storage/get-temp-file-url" };
  var Nt = class {
    constructor(e2) {
      if (["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), !e2.endpoint)
        throw new Error("集群空间未配置ApiEndpoint，配置后需要重新关联服务空间后生效");
      this.config = Object.assign({}, e2), this.config.provider = "dcloud", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.adapter = ne;
    }
    async request(e2, t2 = true) {
      const n2 = t2;
      return e2 = n2 ? await this.setupLocalRequest(e2) : this.setupRequest(e2), Promise.resolve().then(() => n2 ? this.requestLocal(e2) : de.wrappedRequest(e2, this.adapter.request));
    }
    requestLocal(e2) {
      return new Promise((t2, n2) => {
        this.adapter.request(Object.assign(e2, { complete(e3) {
          if (e3 || (e3 = {}), !e3.statusCode || e3.statusCode >= 400) {
            const t3 = e3.data && e3.data.code || "SYS_ERR", s2 = e3.data && e3.data.message || "request:fail";
            return n2(new te({ code: t3, message: s2 }));
          }
          t2({ success: true, result: e3.data });
        } }));
      });
    }
    setupRequest(e2) {
      const t2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), n2 = { "Content-Type": "application/json" };
      n2["x-serverless-sign"] = de.sign(t2, this.config.clientSecret);
      const s2 = le();
      n2["x-client-info"] = encodeURIComponent(JSON.stringify(s2));
      const { token: r2 } = re();
      return n2["x-client-token"] = r2, { url: this.config.requestUrl, method: "POST", data: t2, dataType: "json", header: JSON.parse(JSON.stringify(n2)) };
    }
    async setupLocalRequest(e2) {
      const t2 = le(), { token: n2 } = re(), s2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now(), clientInfo: t2, token: n2 }), { address: r2, servePort: i2 } = this.__dev__ && this.__dev__.debugInfo || {}, { address: o2 } = await Ot(r2, i2);
      return { url: `http://${o2}:${i2}/${xt[e2.method]}`, method: "POST", data: s2, dataType: "json", header: JSON.parse(JSON.stringify({ "Content-Type": "application/json" })) };
    }
    callFunction(e2) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
      return this.request(t2, false);
    }
    getUploadFileOptions(e2) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
      return this.request(t2);
    }
    reportUploadFile(e2) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
      return this.request(t2);
    }
    uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
      if (!t2)
        throw new te({ code: "CLOUDPATH_REQUIRED", message: "cloudPath不可为空" });
      let r2;
      return this.getUploadFileOptions({ cloudPath: t2 }).then((t3) => {
        const { url: i2, formData: o2, name: a2 } = t3.result;
        return r2 = t3.result.fileUrl, new Promise((t4, r3) => {
          const c2 = this.adapter.uploadFile({ url: i2, formData: o2, name: a2, filePath: e2, fileType: n2, success(e3) {
            e3 && e3.statusCode < 400 ? t4(e3) : r3(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
          }, fail(e3) {
            r3(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
          } });
          "function" == typeof s2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
            s2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
          });
        });
      }).then(() => this.reportUploadFile({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
        t3.success ? n3({ success: true, filePath: e2, fileID: r2 }) : s3(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
      }));
    }
    deleteFile({ fileList: e2 }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e2 }) };
      return this.request(t2).then((e3) => {
        if (e3.success)
          return e3.result;
        throw new te({ code: "DELETE_FILE_FAILED", message: "删除文件失败" });
      });
    }
    getTempFileURL({ fileList: e2, maxAge: t2 } = {}) {
      if (!Array.isArray(e2) || 0 === e2.length)
        throw new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
      const n2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e2, maxAge: t2 }) };
      return this.request(n2).then((e3) => {
        if (e3.success)
          return { fileList: e3.result.fileList.map((e4) => ({ fileID: e4.fileID, tempFileURL: e4.tempFileURL })) };
        throw new te({ code: "GET_TEMP_FILE_URL_FAILED", message: "获取临时文件链接失败" });
      });
    }
  };
  var Rt = { init(e2) {
    const t2 = new Nt(e2), n2 = { signInAnonymously: function() {
      return Promise.resolve();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } }, Lt = n(function(e2, t2) {
    e2.exports = r.enc.Hex;
  });
  function Ut() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e2) {
      var t2 = 16 * Math.random() | 0;
      return ("x" === e2 ? t2 : 3 & t2 | 8).toString(16);
    });
  }
  function Dt(e2 = "", t2 = {}) {
    const { data: n2, functionName: s2, method: r2, headers: i2, signHeaderKeys: o2 = [], config: a2 } = t2, c2 = String(Date.now()), u2 = Ut(), h2 = Object.assign({}, i2, { "x-from-app-id": a2.spaceAppId, "x-from-env-id": a2.spaceId, "x-to-env-id": a2.spaceId, "x-from-instance-id": c2, "x-from-function-name": s2, "x-client-timestamp": c2, "x-alipay-source": "client", "x-request-id": u2, "x-alipay-callid": u2, "x-trace-id": u2 }), l2 = ["x-from-app-id", "x-from-env-id", "x-to-env-id", "x-from-instance-id", "x-from-function-name", "x-client-timestamp"].concat(o2), [d2 = "", p2 = ""] = e2.split("?") || [], f2 = function(e3) {
      const t3 = "HMAC-SHA256", n3 = e3.signedHeaders.join(";"), s3 = e3.signedHeaders.map((t4) => `${t4.toLowerCase()}:${e3.headers[t4]}
`).join(""), r3 = we(e3.body).toString(Lt), i3 = `${e3.method.toUpperCase()}
${e3.path}
${e3.query}
${s3}
${n3}
${r3}
`, o3 = we(i3).toString(Lt), a3 = `${t3}
${e3.timestamp}
${o3}
`, c3 = Ie(a3, e3.secretKey).toString(Lt);
      return `${t3} Credential=${e3.secretId}, SignedHeaders=${n3}, Signature=${c3}`;
    }({ path: d2, query: p2, method: r2, headers: h2, timestamp: c2, body: JSON.stringify(n2), secretId: a2.accessKey, secretKey: a2.secretKey, signedHeaders: l2.sort() });
    return { url: `${a2.endpoint}${e2}`, headers: Object.assign({}, h2, { Authorization: f2 }) };
  }
  function Mt({ url: e2, data: t2, method: n2 = "POST", headers: s2 = {}, timeout: r2 }) {
    return new Promise((i2, o2) => {
      ne.request({ url: e2, method: n2, data: "object" == typeof t2 ? JSON.stringify(t2) : t2, header: s2, dataType: "json", timeout: r2, complete: (e3 = {}) => {
        const t3 = s2["x-trace-id"] || "";
        if (!e3.statusCode || e3.statusCode >= 400) {
          const { message: n3, errMsg: s3, trace_id: r3 } = e3.data || {};
          return o2(new te({ code: "SYS_ERR", message: n3 || s3 || "request:fail", requestId: r3 || t3 }));
        }
        i2({ status: e3.statusCode, data: e3.data, headers: e3.header, requestId: t3 });
      } });
    });
  }
  function qt(e2, t2) {
    const { path: n2, data: s2, method: r2 = "GET" } = e2, { url: i2, headers: o2 } = Dt(n2, { functionName: "", data: s2, method: r2, headers: { "x-alipay-cloud-mode": "oss", "x-data-api-type": "oss", "x-expire-timestamp": Date.now() + 6e4 }, signHeaderKeys: ["x-data-api-type", "x-expire-timestamp"], config: t2 });
    return Mt({ url: i2, data: s2, method: r2, headers: o2 }).then((e3) => {
      const t3 = e3.data || {};
      if (!t3.success)
        throw new te({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
      return t3.data || {};
    }).catch((e3) => {
      throw new te({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
    });
  }
  function Ft(e2 = "") {
    const t2 = e2.trim().replace(/^cloud:\/\//, ""), n2 = t2.indexOf("/");
    if (n2 <= 0)
      throw new te({ code: "INVALID_PARAM", message: "fileID不合法" });
    const s2 = t2.substring(0, n2), r2 = t2.substring(n2 + 1);
    return s2 !== this.config.spaceId && console.warn("file ".concat(e2, " does not belong to env ").concat(this.config.spaceId)), r2;
  }
  function Kt(e2 = "") {
    return "cloud://".concat(this.config.spaceId, "/").concat(e2.replace(/^\/+/, ""));
  }
  class jt {
    constructor(e2) {
      this.config = e2;
    }
    signedURL(e2, t2 = {}) {
      const n2 = `/ws/function/${e2}`, s2 = this.config.wsEndpoint.replace(/^ws(s)?:\/\//, ""), r2 = Object.assign({}, t2, { accessKeyId: this.config.accessKey, signatureNonce: Ut(), timestamp: "" + Date.now() }), i2 = [n2, ["accessKeyId", "authorization", "signatureNonce", "timestamp"].sort().map(function(e3) {
        return r2[e3] ? "".concat(e3, "=").concat(r2[e3]) : null;
      }).filter(Boolean).join("&"), `host:${s2}`].join("\n"), o2 = ["HMAC-SHA256", we(i2).toString(Lt)].join("\n"), a2 = Ie(o2, this.config.secretKey).toString(Lt), c2 = Object.keys(r2).map((e3) => `${e3}=${encodeURIComponent(r2[e3])}`).join("&");
      return `${this.config.wsEndpoint}${n2}?${c2}&signature=${a2}`;
    }
  }
  var $t = class {
    constructor(e2) {
      if (["spaceId", "spaceAppId", "accessKey", "secretKey"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), e2.endpoint) {
        if ("string" != typeof e2.endpoint)
          throw new Error("endpoint must be string");
        if (!/^https:\/\//.test(e2.endpoint))
          throw new Error("endpoint must start with https://");
        e2.endpoint = e2.endpoint.replace(/\/$/, "");
      }
      this.config = Object.assign({}, e2, { endpoint: e2.endpoint || `https://${e2.spaceId}.api-hz.cloudbasefunction.cn`, wsEndpoint: e2.wsEndpoint || `wss://${e2.spaceId}.api-hz.cloudbasefunction.cn` }), this._websocket = new jt(this.config);
    }
    callFunction(e2) {
      return function(e3, t2) {
        const { name: n2, data: s2, async: r2 = false, timeout: i2 } = e3, o2 = "POST", a2 = { "x-to-function-name": n2 };
        r2 && (a2["x-function-invoke-type"] = "async");
        const { url: c2, headers: u2 } = Dt("/functions/invokeFunction", { functionName: n2, data: s2, method: o2, headers: a2, signHeaderKeys: ["x-to-function-name"], config: t2 });
        return Mt({ url: c2, data: s2, method: o2, headers: u2, timeout: i2 }).then((e4) => {
          let t3 = 0;
          if (r2) {
            const n3 = e4.data || {};
            t3 = "200" === n3.errCode ? 0 : n3.errCode, e4.data = n3.data || {}, e4.errMsg = n3.errMsg;
          }
          if (0 !== t3)
            throw new te({ code: t3, message: e4.errMsg, requestId: e4.requestId });
          return { errCode: t3, success: 0 === t3, requestId: e4.requestId, result: e4.data };
        }).catch((e4) => {
          throw new te({ code: e4.errCode, message: e4.errMsg, requestId: e4.requestId });
        });
      }(e2, this.config);
    }
    uploadFileToOSS({ url: e2, filePath: t2, fileType: n2, formData: s2, onUploadProgress: r2 }) {
      return new Promise((i2, o2) => {
        const a2 = ne.uploadFile({ url: e2, filePath: t2, fileType: n2, formData: s2, name: "file", success(e3) {
          e3 && e3.statusCode < 400 ? i2(e3) : o2(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          o2(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof r2 && a2 && "function" == typeof a2.onProgressUpdate && a2.onProgressUpdate((e3) => {
          r2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }
    async uploadFile({ filePath: e2, cloudPath: t2 = "", fileType: n2 = "image", onUploadProgress: s2 }) {
      if ("string" !== g(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
      if (!(t2 = t2.trim()))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
      if (/:\/\//.test(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不合法" });
      const r2 = await qt({ path: "/".concat(t2.replace(/^\//, ""), "?post_url") }, this.config), { file_id: i2, upload_url: o2, form_data: a2 } = r2, c2 = a2 && a2.reduce((e3, t3) => (e3[t3.key] = t3.value, e3), {});
      return this.uploadFileToOSS({ url: o2, filePath: e2, fileType: n2, formData: c2, onUploadProgress: s2 }).then(() => ({ fileID: i2 }));
    }
    async getTempFileURL({ fileList: e2 }) {
      return new Promise((t2, n2) => {
        (!e2 || e2.length < 0) && t2({ code: "INVALID_PARAM", message: "fileList不能为空数组" }), e2.length > 50 && t2({ code: "INVALID_PARAM", message: "fileList数组长度不能超过50" });
        const s2 = [];
        for (const n3 of e2) {
          let e3;
          "string" !== g(n3) && t2({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
          try {
            e3 = Ft.call(this, n3);
          } catch (t3) {
            console.warn(t3.errCode, t3.errMsg), e3 = n3;
          }
          s2.push({ file_id: e3, expire: 600 });
        }
        qt({ path: "/?download_url", data: { file_list: s2 }, method: "POST" }, this.config).then((e3) => {
          const { file_list: n3 = [] } = e3;
          t2({ fileList: n3.map((e4) => ({ fileID: Kt.call(this, e4.file_id), tempFileURL: e4.download_url })) });
        }).catch((e3) => n2(e3));
      });
    }
    async connectWebSocket(e2) {
      const { name: t2, query: n2 } = e2;
      return ne.connectSocket({ url: this._websocket.signedURL(t2, n2), complete: () => {
      } });
    }
  };
  var Bt = { init: (e2) => {
    e2.provider = "alipay";
    const t2 = new $t(e2);
    return t2.auth = function() {
      return { signInAnonymously: function() {
        return Promise.resolve();
      }, getLoginState: function() {
        return Promise.resolve(true);
      } };
    }, t2;
  } };
  function Wt({ data: e2 }) {
    let t2;
    t2 = le();
    const n2 = JSON.parse(JSON.stringify(e2 || {}));
    if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
      const { token: e3 } = re();
      e3 && (n2.uniIdToken = e3);
    }
    return n2;
  }
  async function Ht(e2 = {}) {
    await this.__dev__.initLocalNetwork();
    const { localAddress: t2, localPort: n2 } = this.__dev__, s2 = { aliyun: "aliyun", tencent: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], r2 = this.config.spaceId, i2 = `http://${t2}:${n2}/system/check-function`, o2 = `http://${t2}:${n2}/cloudfunctions/${e2.name}`;
    return new Promise((t3, n3) => {
      ne.request({ method: "POST", url: i2, data: { name: e2.name, platform: P, provider: s2, spaceId: r2 }, timeout: 3e3, success(e3) {
        t3(e3);
      }, fail() {
        t3({ data: { code: "NETWORK_ERROR", message: "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下，自动切换为已部署的云函数。" } });
      } });
    }).then(({ data: e3 } = {}) => {
      const { code: t3, message: n3 } = e3 || {};
      return { code: 0 === t3 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
    }).then(({ code: t3, message: n3 }) => {
      if (0 !== t3) {
        switch (t3) {
          case "MODULE_ENCRYPTED":
            console.error(`此云函数（${e2.name}）依赖加密公共模块不可本地调试，自动切换为云端已部署的云函数`);
            break;
          case "FUNCTION_ENCRYPTED":
            console.error(`此云函数（${e2.name}）已加密不可本地调试，自动切换为云端已部署的云函数`);
            break;
          case "ACTION_ENCRYPTED":
            console.error(n3 || "需要访问加密的uni-clientDB-action，自动切换为云端环境");
            break;
          case "NETWORK_ERROR":
            console.error(n3 || "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下");
            break;
          case "SWITCH_TO_CLOUD":
            break;
          default: {
            const e3 = `检测本地调试服务出现错误：${n3}，请检查网络环境或重启客户端再试`;
            throw console.error(e3), new Error(e3);
          }
        }
        return this._callCloudFunction(e2);
      }
      return new Promise((t4, n4) => {
        const r3 = Wt.call(this, { data: e2.data });
        ne.request({ method: "POST", url: o2, data: { provider: s2, platform: P, param: r3 }, timeout: e2.timeout, success: ({ statusCode: e3, data: s3 } = {}) => !e3 || e3 >= 400 ? n4(new te({ code: s3.code || "SYS_ERR", message: s3.message || "request:fail" })) : t4({ result: s3 }), fail(e3) {
          n4(new te({ code: e3.code || e3.errCode || "SYS_ERR", message: e3.message || e3.errMsg || "request:fail" }));
        } });
      });
    });
  }
  const Jt = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "，云函数[{functionName}]在云端不存在，请检查此云函数名称是否正确以及该云函数是否已上传到服务空间", mode: "append" }];
  var zt = /[\\^$.*+?()[\]{}|]/g, Vt = RegExp(zt.source);
  function Gt(e2, t2, n2) {
    return e2.replace(new RegExp((s2 = t2) && Vt.test(s2) ? s2.replace(zt, "\\$&") : s2, "g"), n2);
    var s2;
  }
  const Yt = { NONE: "none", REQUEST: "request", RESPONSE: "response", BOTH: "both" }, Qt = "_globalUniCloudStatus", Xt = "_globalUniCloudSecureNetworkCache__{spaceId}", Zt = "uni-secure-network", en = { SYSTEM_ERROR: { code: 2e4, message: "System error" }, APP_INFO_INVALID: { code: 20101, message: "Invalid client" }, GET_ENCRYPT_KEY_FAILED: { code: 20102, message: "Get encrypt key failed" } };
  function nn(e2) {
    const { errSubject: t2, subject: n2, errCode: s2, errMsg: r2, code: i2, message: o2, cause: a2 } = e2 || {};
    return new te({ subject: t2 || n2 || Zt, code: s2 || i2 || en.SYSTEM_ERROR.code, message: r2 || o2, cause: a2 });
  }
  let Kn;
  function Hn({ secretType: e2 } = {}) {
    return e2 === Yt.REQUEST || e2 === Yt.RESPONSE || e2 === Yt.BOTH;
  }
  function Jn({ name: e2, data: t2 = {} } = {}) {
    return "DCloud-clientDB" === e2 && "encryption" === t2.redirectTo && "getAppClientKey" === t2.action;
  }
  function zn({ provider: e2, spaceId: t2, functionName: n2 } = {}) {
    const { appId: s2, uniPlatform: r2, osName: i2 } = ce();
    let o2 = r2;
    "app" === r2 && (o2 = i2);
    const a2 = function({ provider: e3, spaceId: t3 } = {}) {
      const n3 = A;
      if (!n3)
        return {};
      e3 = /* @__PURE__ */ function(e4) {
        return "tencent" === e4 ? "tcb" : e4;
      }(e3);
      const s3 = n3.find((n4) => n4.provider === e3 && n4.spaceId === t3);
      return s3 && s3.config;
    }({ provider: e2, spaceId: t2 });
    if (!a2 || !a2.accessControl || !a2.accessControl.enable)
      return false;
    const c2 = a2.accessControl.function || {}, u2 = Object.keys(c2);
    if (0 === u2.length)
      return true;
    const h2 = function(e3, t3) {
      let n3, s3, r3;
      for (let i3 = 0; i3 < e3.length; i3++) {
        const o3 = e3[i3];
        o3 !== t3 ? "*" !== o3 ? o3.split(",").map((e4) => e4.trim()).indexOf(t3) > -1 && (s3 = o3) : r3 = o3 : n3 = o3;
      }
      return n3 || s3 || r3;
    }(u2, n2);
    if (!h2)
      return false;
    if ((c2[h2] || []).find((e3 = {}) => e3.appId === s2 && (e3.platform || "").toLowerCase() === o2.toLowerCase()))
      return true;
    throw console.error(`此应用[appId: ${s2}, platform: ${o2}]不在云端配置的允许访问的应用列表内，参考：https://uniapp.dcloud.net.cn/uniCloud/secure-network.html#verify-client`), nn(en.APP_INFO_INVALID);
  }
  function Vn({ functionName: e2, result: t2, logPvd: n2 }) {
    if (this.__dev__.debugLog && t2 && t2.requestId) {
      const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e2, requestId: t2.requestId });
      console.log(`[${n2}-request]${s2}[/${n2}-request]`);
    }
  }
  function Gn(e2) {
    const t2 = e2.callFunction, n2 = function(n3) {
      const s2 = n3.name;
      n3.data = Wt.call(e2, { data: n3.data });
      const r2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], i2 = Hn(n3), o2 = Jn(n3), a2 = i2 || o2;
      return t2.call(this, n3).then((e3) => (e3.errCode = 0, !a2 && Vn.call(this, { functionName: s2, result: e3, logPvd: r2 }), Promise.resolve(e3)), (e3) => (!a2 && Vn.call(this, { functionName: s2, result: e3, logPvd: r2 }), e3 && e3.message && (e3.message = function({ message: e4 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
        for (let s3 = 0; s3 < n4.length; s3++) {
          const { rule: r3, content: i3, mode: o3 } = n4[s3], a3 = e4.match(r3);
          if (!a3)
            continue;
          let c2 = i3;
          for (let e5 = 1; e5 < a3.length; e5++)
            c2 = Gt(c2, `{$${e5}}`, a3[e5]);
          for (const e5 in t3)
            c2 = Gt(c2, `{${e5}}`, t3[e5]);
          return "replace" === o3 ? c2 : e4 + c2;
        }
        return e4;
      }({ message: `[${n3.name}]: ${e3.message}`, formatter: Jt, extraInfo: { functionName: s2 } })), Promise.reject(e3)));
    };
    e2.callFunction = function(t3) {
      const { provider: s2, spaceId: r2 } = e2.config, i2 = t3.name;
      let o2, a2;
      if (t3.data = t3.data || {}, e2.__dev__.debugInfo && !e2.__dev__.debugInfo.forceRemote && O ? (e2._callCloudFunction || (e2._callCloudFunction = n2, e2._callLocalFunction = Ht), o2 = Ht) : o2 = n2, o2 = o2.bind(e2), Jn(t3))
        a2 = n2.call(e2, t3);
      else if (Hn(t3)) {
        a2 = new Kn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapEncryptDataCallFunction(n2.bind(e2))(t3);
      } else if (zn({ provider: s2, spaceId: r2, functionName: i2 })) {
        a2 = new Kn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapVerifyClientCallFunction(n2.bind(e2))(t3);
      } else
        a2 = o2(t3);
      return Object.defineProperty(a2, "result", { get: () => (console.warn("当前返回结果为Promise类型，不可直接访问其result属性，详情请参考：https://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), a2.then((e3) => e3);
    };
  }
  Kn = class {
    constructor() {
      throw nn({ message: `Platform ${P} is not enabled, please check whether secure network module is enabled in your manifest.json` });
    }
  };
  const Yn = Symbol("CLIENT_DB_INTERNAL");
  function Qn(e2, t2) {
    return e2.then = "DoNotReturnProxyWithAFunctionNamedThen", e2._internalType = Yn, e2.inspect = null, e2.__v_raw = void 0, new Proxy(e2, { get(e3, n2, s2) {
      if ("_uniClient" === n2)
        return null;
      if ("symbol" == typeof n2)
        return e3[n2];
      if (n2 in e3 || "string" != typeof n2) {
        const t3 = e3[n2];
        return "function" == typeof t3 ? t3.bind(e3) : t3;
      }
      return t2.get(e3, n2, s2);
    } });
  }
  function Xn(e2) {
    return { on: (t2, n2) => {
      e2[t2] = e2[t2] || [], e2[t2].indexOf(n2) > -1 || e2[t2].push(n2);
    }, off: (t2, n2) => {
      e2[t2] = e2[t2] || [];
      const s2 = e2[t2].indexOf(n2);
      -1 !== s2 && e2[t2].splice(s2, 1);
    } };
  }
  const Zn = ["db.Geo", "db.command", "command.aggregate"];
  function es(e2, t2) {
    return Zn.indexOf(`${e2}.${t2}`) > -1;
  }
  function ts(e2) {
    switch (g(e2 = se(e2))) {
      case "array":
        return e2.map((e3) => ts(e3));
      case "object":
        return e2._internalType === Yn || Object.keys(e2).forEach((t2) => {
          e2[t2] = ts(e2[t2]);
        }), e2;
      case "regexp":
        return { $regexp: { source: e2.source, flags: e2.flags } };
      case "date":
        return { $date: e2.toISOString() };
      default:
        return e2;
    }
  }
  function ns(e2) {
    return e2 && e2.content && e2.content.$method;
  }
  class ss {
    constructor(e2, t2, n2) {
      this.content = e2, this.prevStage = t2 || null, this.udb = null, this._database = n2;
    }
    toJSON() {
      let e2 = this;
      const t2 = [e2.content];
      for (; e2.prevStage; )
        e2 = e2.prevStage, t2.push(e2.content);
      return { $db: t2.reverse().map((e3) => ({ $method: e3.$method, $param: ts(e3.$param) })) };
    }
    toString() {
      return JSON.stringify(this.toJSON());
    }
    getAction() {
      const e2 = this.toJSON().$db.find((e3) => "action" === e3.$method);
      return e2 && e2.$param && e2.$param[0];
    }
    getCommand() {
      return { $db: this.toJSON().$db.filter((e2) => "action" !== e2.$method) };
    }
    get isAggregate() {
      let e2 = this;
      for (; e2; ) {
        const t2 = ns(e2), n2 = ns(e2.prevStage);
        if ("aggregate" === t2 && "collection" === n2 || "pipeline" === t2)
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    get isCommand() {
      let e2 = this;
      for (; e2; ) {
        if ("command" === ns(e2))
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    get isAggregateCommand() {
      let e2 = this;
      for (; e2; ) {
        const t2 = ns(e2), n2 = ns(e2.prevStage);
        if ("aggregate" === t2 && "command" === n2)
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    getNextStageFn(e2) {
      const t2 = this;
      return function() {
        return rs({ $method: e2, $param: ts(Array.from(arguments)) }, t2, t2._database);
      };
    }
    get count() {
      return this.isAggregate ? this.getNextStageFn("count") : function() {
        return this._send("count", Array.from(arguments));
      };
    }
    get remove() {
      return this.isCommand ? this.getNextStageFn("remove") : function() {
        return this._send("remove", Array.from(arguments));
      };
    }
    get() {
      return this._send("get", Array.from(arguments));
    }
    get add() {
      return this.isCommand ? this.getNextStageFn("add") : function() {
        return this._send("add", Array.from(arguments));
      };
    }
    update() {
      return this._send("update", Array.from(arguments));
    }
    end() {
      return this._send("end", Array.from(arguments));
    }
    get set() {
      return this.isCommand ? this.getNextStageFn("set") : function() {
        throw new Error("JQL禁止使用set方法");
      };
    }
    _send(e2, t2) {
      const n2 = this.getAction(), s2 = this.getCommand();
      if (s2.$db.push({ $method: e2, $param: ts(t2) }), b) {
        const e3 = s2.$db.find((e4) => "collection" === e4.$method), t3 = e3 && e3.$param;
        t3 && 1 === t3.length && "string" == typeof e3.$param[0] && e3.$param[0].indexOf(",") > -1 && console.warn("检测到使用JQL语法联表查询时，未使用getTemp先过滤主表数据，在主表数据量大的情况下可能会查询缓慢。\n- 如何优化请参考此文档：https://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- 如果主表数据量很小请忽略此信息，项目发行时不会出现此提示。");
      }
      return this._database._callCloudFunction({ action: n2, command: s2 });
    }
  }
  function rs(e2, t2, n2) {
    return Qn(new ss(e2, t2, n2), { get(e3, t3) {
      let s2 = "db";
      return e3 && e3.content && (s2 = e3.content.$method), es(s2, t3) ? rs({ $method: t3 }, e3, n2) : function() {
        return rs({ $method: t3, $param: ts(Array.from(arguments)) }, e3, n2);
      };
    } });
  }
  function is({ path: e2, method: t2 }) {
    return class {
      constructor() {
        this.param = Array.from(arguments);
      }
      toJSON() {
        return { $newDb: [...e2.map((e3) => ({ $method: e3 })), { $method: t2, $param: this.param }] };
      }
      toString() {
        return JSON.stringify(this.toJSON());
      }
    };
  }
  class os {
    constructor({ uniClient: e2 = {}, isJQL: t2 = false } = {}) {
      this._uniClient = e2, this._authCallBacks = {}, this._dbCallBacks = {}, e2._isDefault && (this._dbCallBacks = U("_globalUniCloudDatabaseCallback")), t2 || (this.auth = Xn(this._authCallBacks)), this._isJQL = t2, Object.assign(this, Xn(this._dbCallBacks)), this.env = Qn({}, { get: (e3, t3) => ({ $env: t3 }) }), this.Geo = Qn({}, { get: (e3, t3) => is({ path: ["Geo"], method: t3 }) }), this.serverDate = is({ path: [], method: "serverDate" }), this.RegExp = is({ path: [], method: "RegExp" });
    }
    getCloudEnv(e2) {
      if ("string" != typeof e2 || !e2.trim())
        throw new Error("getCloudEnv参数错误");
      return { $env: e2.replace("$cloudEnv_", "") };
    }
    _callback(e2, t2) {
      const n2 = this._dbCallBacks;
      n2[e2] && n2[e2].forEach((e3) => {
        e3(...t2);
      });
    }
    _callbackAuth(e2, t2) {
      const n2 = this._authCallBacks;
      n2[e2] && n2[e2].forEach((e3) => {
        e3(...t2);
      });
    }
    multiSend() {
      const e2 = Array.from(arguments), t2 = e2.map((e3) => {
        const t3 = e3.getAction(), n2 = e3.getCommand();
        if ("getTemp" !== n2.$db[n2.$db.length - 1].$method)
          throw new Error("multiSend只支持子命令内使用getTemp");
        return { action: t3, command: n2 };
      });
      return this._callCloudFunction({ multiCommand: t2, queryList: e2 });
    }
  }
  function as(e2, t2 = {}) {
    return Qn(new e2(t2), { get: (e3, t3) => es("db", t3) ? rs({ $method: t3 }, null, e3) : function() {
      return rs({ $method: t3, $param: ts(Array.from(arguments)) }, null, e3);
    } });
  }
  class cs extends os {
    _parseResult(e2) {
      return this._isJQL ? e2.result : e2;
    }
    _callCloudFunction({ action: e2, command: t2, multiCommand: n2, queryList: s2 }) {
      function r2(e3, t3) {
        if (n2 && s2)
          for (let n3 = 0; n3 < s2.length; n3++) {
            const r3 = s2[n3];
            r3.udb && "function" == typeof r3.udb.setResult && (t3 ? r3.udb.setResult(t3) : r3.udb.setResult(e3.result.dataList[n3]));
          }
      }
      const i2 = this, o2 = this._isJQL ? "databaseForJQL" : "database";
      function a2(e3) {
        return i2._callback("error", [e3]), j($(o2, "fail"), e3).then(() => j($(o2, "complete"), e3)).then(() => (r2(null, e3), Y(H.RESPONSE, { type: J.CLIENT_DB, content: e3 }), Promise.reject(e3)));
      }
      const c2 = j($(o2, "invoke")), u2 = this._uniClient;
      return c2.then(() => u2.callFunction({ name: "DCloud-clientDB", type: l.CLIENT_DB, data: { action: e2, command: t2, multiCommand: n2 } })).then((e3) => {
        const { code: t3, message: n3, token: s3, tokenExpired: c3, systemInfo: u3 = [] } = e3.result;
        if (u3)
          for (let e4 = 0; e4 < u3.length; e4++) {
            const { level: t4, message: n4, detail: s4 } = u3[e4];
            let r3 = "[System Info]" + n4;
            s4 && (r3 = `${r3}
详细信息：${s4}`), (console["warn" === t4 ? "error" : t4] || console.log)(r3);
          }
        if (t3) {
          return a2(new te({ code: t3, message: n3, requestId: e3.requestId }));
        }
        e3.result.errCode = e3.result.errCode || e3.result.code, e3.result.errMsg = e3.result.errMsg || e3.result.message, s3 && c3 && (ie({ token: s3, tokenExpired: c3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: c3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: c3 }]), Y(H.REFRESH_TOKEN, { token: s3, tokenExpired: c3 }));
        const h2 = [{ prop: "affectedDocs", tips: "affectedDocs不再推荐使用，请使用inserted/deleted/updated/data.length替代" }, { prop: "code", tips: "code不再推荐使用，请使用errCode替代" }, { prop: "message", tips: "message不再推荐使用，请使用errMsg替代" }];
        for (let t4 = 0; t4 < h2.length; t4++) {
          const { prop: n4, tips: s4 } = h2[t4];
          if (n4 in e3.result) {
            const t5 = e3.result[n4];
            Object.defineProperty(e3.result, n4, { get: () => (console.warn(s4), t5) });
          }
        }
        return function(e4) {
          return j($(o2, "success"), e4).then(() => j($(o2, "complete"), e4)).then(() => {
            r2(e4, null);
            const t4 = i2._parseResult(e4);
            return Y(H.RESPONSE, { type: J.CLIENT_DB, content: t4 }), Promise.resolve(t4);
          });
        }(e3);
      }, (e3) => {
        /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e3.message) && console.warn("clientDB未初始化，请在web控制台保存一次schema以开启clientDB");
        return a2(new te({ code: e3.code || "SYSTEM_ERROR", message: e3.message, requestId: e3.requestId }));
      });
    }
  }
  const us = "token无效，跳转登录页面", hs = "token过期，跳转登录页面", ls = { TOKEN_INVALID_TOKEN_EXPIRED: hs, TOKEN_INVALID_INVALID_CLIENTID: us, TOKEN_INVALID: us, TOKEN_INVALID_WRONG_TOKEN: us, TOKEN_INVALID_ANONYMOUS_USER: us }, ds = { "uni-id-token-expired": hs, "uni-id-check-token-failed": us, "uni-id-token-not-exist": us, "uni-id-check-device-feature-failed": us }, ps = { ...ls, ...ds, default: "用户未登录或登录状态过期，自动跳转登录页面" };
  function fs(e2, t2) {
    let n2 = "";
    return n2 = e2 ? `${e2}/${t2}` : t2, n2.replace(/^\//, "");
  }
  function gs(e2 = [], t2 = "") {
    const n2 = [], s2 = [];
    return e2.forEach((e3) => {
      true === e3.needLogin ? n2.push(fs(t2, e3.path)) : false === e3.needLogin && s2.push(fs(t2, e3.path));
    }), { needLoginPage: n2, notNeedLoginPage: s2 };
  }
  function ms(e2) {
    return e2.split("?")[0].replace(/^\//, "");
  }
  function ys() {
    return function(e2) {
      let t2 = e2 && e2.$page && e2.$page.fullPath;
      return t2 ? ("/" !== t2.charAt(0) && (t2 = "/" + t2), t2) : "";
    }(function() {
      const e2 = getCurrentPages();
      return e2[e2.length - 1];
    }());
  }
  function _s() {
    return ms(ys());
  }
  function ws(e2 = "", t2 = {}) {
    if (!e2)
      return false;
    if (!(t2 && t2.list && t2.list.length))
      return false;
    const n2 = t2.list, s2 = ms(e2);
    return n2.some((e3) => e3.pagePath === s2);
  }
  const Is = !!e.uniIdRouter;
  const { loginPage: vs, routerNeedLogin: Ss, resToLogin: Ts, needLoginPage: bs, notNeedLoginPage: Es, loginPageInTabBar: ks } = function({ pages: t2 = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: r2 = {} } = e) {
    const { loginPage: i2, needLogin: o2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = gs(t2), { needLoginPage: h2, notNeedLoginPage: l2 } = function(e2 = []) {
      const t3 = [], n3 = [];
      return e2.forEach((e3) => {
        const { root: s3, pages: r3 = [] } = e3, { needLoginPage: i3, notNeedLoginPage: o3 } = gs(r3, s3);
        t3.push(...i3), n3.push(...o3);
      }), { needLoginPage: t3, notNeedLoginPage: n3 };
    }(n2);
    return { loginPage: i2, routerNeedLogin: o2, resToLogin: a2, needLoginPage: [...c2, ...h2], notNeedLoginPage: [...u2, ...l2], loginPageInTabBar: ws(i2, r2) };
  }();
  if (bs.indexOf(vs) > -1)
    throw new Error(`Login page [${vs}] should not be "needLogin", please check your pages.json`);
  function As(e2) {
    const t2 = _s();
    if ("/" === e2.charAt(0))
      return e2;
    const [n2, s2] = e2.split("?"), r2 = n2.replace(/^\//, "").split("/"), i2 = t2.split("/");
    i2.pop();
    for (let e3 = 0; e3 < r2.length; e3++) {
      const t3 = r2[e3];
      ".." === t3 ? i2.pop() : "." !== t3 && i2.push(t3);
    }
    return "" === i2[0] && i2.shift(), "/" + i2.join("/") + (s2 ? "?" + s2 : "");
  }
  function Ps(e2) {
    const t2 = ms(As(e2));
    return !(Es.indexOf(t2) > -1) && (bs.indexOf(t2) > -1 || Ss.some((t3) => function(e3, t4) {
      return new RegExp(t4).test(e3);
    }(e2, t3)));
  }
  function Cs({ redirect: e2 }) {
    const t2 = ms(e2), n2 = ms(vs);
    return _s() !== n2 && t2 !== n2;
  }
  function Os({ api: e2, redirect: t2 } = {}) {
    if (!t2 || !Cs({ redirect: t2 }))
      return;
    const n2 = function(e3, t3) {
      return "/" !== e3.charAt(0) && (e3 = "/" + e3), t3 ? e3.indexOf("?") > -1 ? e3 + `&uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3 + `?uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3;
    }(vs, t2);
    ks ? "navigateTo" !== e2 && "redirectTo" !== e2 || (e2 = "switchTab") : "switchTab" === e2 && (e2 = "navigateTo");
    const s2 = { navigateTo: uni.navigateTo, redirectTo: uni.redirectTo, switchTab: uni.switchTab, reLaunch: uni.reLaunch };
    setTimeout(() => {
      s2[e2]({ url: n2 });
    }, 0);
  }
  function xs({ url: e2 } = {}) {
    const t2 = { abortLoginPageJump: false, autoToLoginPage: false }, n2 = function() {
      const { token: e3, tokenExpired: t3 } = re();
      let n3;
      if (e3) {
        if (t3 < Date.now()) {
          const e4 = "uni-id-token-expired";
          n3 = { errCode: e4, errMsg: ps[e4] };
        }
      } else {
        const e4 = "uni-id-check-token-failed";
        n3 = { errCode: e4, errMsg: ps[e4] };
      }
      return n3;
    }();
    if (Ps(e2) && n2) {
      n2.uniIdRedirectUrl = e2;
      if (z(H.NEED_LOGIN).length > 0)
        return setTimeout(() => {
          Y(H.NEED_LOGIN, n2);
        }, 0), t2.abortLoginPageJump = true, t2;
      t2.autoToLoginPage = true;
    }
    return t2;
  }
  function Ns() {
    !function() {
      const e3 = ys(), { abortLoginPageJump: t2, autoToLoginPage: n2 } = xs({ url: e3 });
      t2 || n2 && Os({ api: "redirectTo", redirect: e3 });
    }();
    const e2 = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
    for (let t2 = 0; t2 < e2.length; t2++) {
      const n2 = e2[t2];
      uni.addInterceptor(n2, { invoke(e3) {
        const { abortLoginPageJump: t3, autoToLoginPage: s2 } = xs({ url: e3.url });
        return t3 ? e3 : s2 ? (Os({ api: n2, redirect: As(e3.url) }), false) : e3;
      } });
    }
  }
  function Rs() {
    this.onResponse((e2) => {
      const { type: t2, content: n2 } = e2;
      let s2 = false;
      switch (t2) {
        case "cloudobject":
          s2 = function(e3) {
            if ("object" != typeof e3)
              return false;
            const { errCode: t3 } = e3 || {};
            return t3 in ps;
          }(n2);
          break;
        case "clientdb":
          s2 = function(e3) {
            if ("object" != typeof e3)
              return false;
            const { errCode: t3 } = e3 || {};
            return t3 in ls;
          }(n2);
      }
      s2 && function(e3 = {}) {
        const t3 = z(H.NEED_LOGIN);
        Z().then(() => {
          const n3 = ys();
          if (n3 && Cs({ redirect: n3 }))
            return t3.length > 0 ? Y(H.NEED_LOGIN, Object.assign({ uniIdRedirectUrl: n3 }, e3)) : void (vs && Os({ api: "navigateTo", redirect: n3 }));
        });
      }(n2);
    });
  }
  function Ls(e2) {
    !function(e3) {
      e3.onResponse = function(e4) {
        V(H.RESPONSE, e4);
      }, e3.offResponse = function(e4) {
        G(H.RESPONSE, e4);
      };
    }(e2), function(e3) {
      e3.onNeedLogin = function(e4) {
        V(H.NEED_LOGIN, e4);
      }, e3.offNeedLogin = function(e4) {
        G(H.NEED_LOGIN, e4);
      }, Is && (U(Qt).needLoginInit || (U(Qt).needLoginInit = true, Z().then(() => {
        Ns.call(e3);
      }), Ts && Rs.call(e3)));
    }(e2), function(e3) {
      e3.onRefreshToken = function(e4) {
        V(H.REFRESH_TOKEN, e4);
      }, e3.offRefreshToken = function(e4) {
        G(H.REFRESH_TOKEN, e4);
      };
    }(e2);
  }
  let Us;
  const Ds = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Ms = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
  function qs() {
    const e2 = re().token || "", t2 = e2.split(".");
    if (!e2 || 3 !== t2.length)
      return { uid: null, role: [], permission: [], tokenExpired: 0 };
    let n2;
    try {
      n2 = JSON.parse((s2 = t2[1], decodeURIComponent(Us(s2).split("").map(function(e3) {
        return "%" + ("00" + e3.charCodeAt(0).toString(16)).slice(-2);
      }).join(""))));
    } catch (e3) {
      throw new Error("获取当前用户信息出错，详细错误信息为：" + e3.message);
    }
    var s2;
    return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
  }
  Us = "function" != typeof atob ? function(e2) {
    if (e2 = String(e2).replace(/[\t\n\f\r ]+/g, ""), !Ms.test(e2))
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    var t2;
    e2 += "==".slice(2 - (3 & e2.length));
    for (var n2, s2, r2 = "", i2 = 0; i2 < e2.length; )
      t2 = Ds.indexOf(e2.charAt(i2++)) << 18 | Ds.indexOf(e2.charAt(i2++)) << 12 | (n2 = Ds.indexOf(e2.charAt(i2++))) << 6 | (s2 = Ds.indexOf(e2.charAt(i2++))), r2 += 64 === n2 ? String.fromCharCode(t2 >> 16 & 255) : 64 === s2 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
    return r2;
  } : atob;
  var Fs = n(function(e2, t2) {
    Object.defineProperty(t2, "__esModule", { value: true });
    const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
    function r2(e3, t3) {
      return e3.tempFiles.forEach((e4, n3) => {
        e4.name || (e4.name = e4.path.substring(e4.path.lastIndexOf("/") + 1)), t3 && (e4.fileType = t3), e4.cloudPath = Date.now() + "_" + n3 + e4.name.substring(e4.name.lastIndexOf("."));
      }), e3.tempFilePaths || (e3.tempFilePaths = e3.tempFiles.map((e4) => e4.path)), e3;
    }
    function i2(e3, t3, { onChooseFile: s3, onUploadProgress: r3 }) {
      return t3.then((e4) => {
        if (s3) {
          const t4 = s3(e4);
          if (void 0 !== t4)
            return Promise.resolve(t4).then((t5) => void 0 === t5 ? e4 : t5);
        }
        return e4;
      }).then((t4) => false === t4 ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e4, t5, s4 = 5, r4) {
        (t5 = Object.assign({}, t5)).errMsg = n2;
        const i3 = t5.tempFiles, o2 = i3.length;
        let a2 = 0;
        return new Promise((n3) => {
          for (; a2 < s4; )
            c2();
          function c2() {
            const s5 = a2++;
            if (s5 >= o2)
              return void (!i3.find((e5) => !e5.url && !e5.errMsg) && n3(t5));
            const u2 = i3[s5];
            e4.uploadFile({ provider: u2.provider, filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, cloudPathAsRealPath: u2.cloudPathAsRealPath, onUploadProgress(e5) {
              e5.index = s5, e5.tempFile = u2, e5.tempFilePath = u2.path, r4 && r4(e5);
            } }).then((e5) => {
              u2.url = e5.fileID, s5 < o2 && c2();
            }).catch((e5) => {
              u2.errMsg = e5.errMsg || e5.message, s5 < o2 && c2();
            });
          }
        });
      }(e3, t4, 5, r3));
    }
    t2.initChooseAndUploadFile = function(e3) {
      return function(t3 = { type: "all" }) {
        return "image" === t3.type ? i2(e3, function(e4) {
          const { count: t4, sizeType: n3, sourceType: i3 = ["album", "camera"], extension: o2 } = e4;
          return new Promise((e5, a2) => {
            uni.chooseImage({ count: t4, sizeType: n3, sourceType: i3, extension: o2, success(t5) {
              e5(r2(t5, "image"));
            }, fail(e6) {
              a2({ errMsg: e6.errMsg.replace("chooseImage:fail", s2) });
            } });
          });
        }(t3), t3) : "video" === t3.type ? i2(e3, function(e4) {
          const { camera: t4, compressed: n3, maxDuration: i3, sourceType: o2 = ["album", "camera"], extension: a2 } = e4;
          return new Promise((e5, c2) => {
            uni.chooseVideo({ camera: t4, compressed: n3, maxDuration: i3, sourceType: o2, extension: a2, success(t5) {
              const { tempFilePath: n4, duration: s3, size: i4, height: o3, width: a3 } = t5;
              e5(r2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: i4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: o3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
            }, fail(e6) {
              c2({ errMsg: e6.errMsg.replace("chooseVideo:fail", s2) });
            } });
          });
        }(t3), t3) : i2(e3, function(e4) {
          const { count: t4, extension: n3 } = e4;
          return new Promise((e5, i3) => {
            let o2 = uni.chooseFile;
            if ("undefined" != typeof wx && "function" == typeof wx.chooseMessageFile && (o2 = wx.chooseMessageFile), "function" != typeof o2)
              return i3({ errMsg: s2 + " 请指定 type 类型，该平台仅支持选择 image 或 video。" });
            o2({ type: "all", count: t4, extension: n3, success(t5) {
              e5(r2(t5));
            }, fail(e6) {
              i3({ errMsg: e6.errMsg.replace("chooseFile:fail", s2) });
            } });
          });
        }(t3), t3);
      };
    };
  }), Ks = t(Fs);
  const js = { auto: "auto", onready: "onready", manual: "manual" };
  function $s(e2) {
    return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {}, mixinDatacomError: null }), created() {
      this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
        var e3 = [];
        return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
          e3.push(this[t2]);
        }), e3;
      }, (e3, t2) => {
        if (this.loadtime === js.manual)
          return;
        let n2 = false;
        const s2 = [];
        for (let r2 = 2; r2 < e3.length; r2++)
          e3[r2] !== t2[r2] && (s2.push(e3[r2]), n2 = true);
        e3[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
      });
    }, methods: { onMixinDatacomPropsChange(e3, t2) {
    }, mixinDatacomEasyGet({ getone: e3 = false, success: t2, fail: n2 } = {}) {
      this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomError = null, this.mixinDatacomGet().then((n3) => {
        this.mixinDatacomLoading = false;
        const { data: s2, count: r2 } = n3.result;
        this.getcount && (this.mixinDatacomPage.count = r2), this.mixinDatacomHasMore = s2.length < this.pageSize;
        const i2 = e3 ? s2.length ? s2[0] : void 0 : s2;
        this.mixinDatacomResData = i2, t2 && t2(i2);
      }).catch((e4) => {
        this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e4, this.mixinDatacomError = e4, n2 && n2(e4);
      }));
    }, mixinDatacomGet(t2 = {}) {
      let n2;
      t2 = t2 || {}, n2 = "undefined" != typeof __uniX && __uniX ? e2.databaseForJQL(this.spaceInfo) : e2.database(this.spaceInfo);
      const s2 = t2.action || this.action;
      s2 && (n2 = n2.action(s2));
      const r2 = t2.collection || this.collection;
      n2 = Array.isArray(r2) ? n2.collection(...r2) : n2.collection(r2);
      const i2 = t2.where || this.where;
      i2 && Object.keys(i2).length && (n2 = n2.where(i2));
      const o2 = t2.field || this.field;
      o2 && (n2 = n2.field(o2));
      const a2 = t2.foreignKey || this.foreignKey;
      a2 && (n2 = n2.foreignKey(a2));
      const c2 = t2.groupby || this.groupby;
      c2 && (n2 = n2.groupBy(c2));
      const u2 = t2.groupField || this.groupField;
      u2 && (n2 = n2.groupField(u2));
      true === (void 0 !== t2.distinct ? t2.distinct : this.distinct) && (n2 = n2.distinct());
      const h2 = t2.orderby || this.orderby;
      h2 && (n2 = n2.orderBy(h2));
      const l2 = void 0 !== t2.pageCurrent ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = void 0 !== t2.pageSize ? t2.pageSize : this.mixinDatacomPage.size, p2 = void 0 !== t2.getcount ? t2.getcount : this.getcount, f2 = void 0 !== t2.gettree ? t2.gettree : this.gettree, g2 = void 0 !== t2.gettreepath ? t2.gettreepath : this.gettreepath, m2 = { getCount: p2 }, y2 = { limitLevel: void 0 !== t2.limitlevel ? t2.limitlevel : this.limitlevel, startWith: void 0 !== t2.startwith ? t2.startwith : this.startwith };
      return f2 && (m2.getTree = y2), g2 && (m2.getTreePath = y2), n2 = n2.skip(d2 * (l2 - 1)).limit(d2).get(m2), n2;
    } } };
  }
  function Bs(e2) {
    return function(t2, n2 = {}) {
      n2 = function(e3, t3 = {}) {
        return e3.customUI = t3.customUI || e3.customUI, e3.parseSystemError = t3.parseSystemError || e3.parseSystemError, Object.assign(e3.loadingOptions, t3.loadingOptions), Object.assign(e3.errorOptions, t3.errorOptions), "object" == typeof t3.secretMethods && (e3.secretMethods = t3.secretMethods), e3;
      }({ customUI: false, loadingOptions: { title: "加载中...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
      const { customUI: s2, loadingOptions: r2, errorOptions: i2, parseSystemError: o2 } = n2, a2 = !s2;
      return new Proxy({}, { get(s3, c2) {
        switch (c2) {
          case "toString":
            return "[object UniCloudObject]";
          case "toJSON":
            return {};
        }
        return function({ fn: e3, interceptorName: t3, getCallbackArgs: n3 } = {}) {
          return async function(...s4) {
            const r3 = n3 ? n3({ params: s4 }) : {};
            let i3, o3;
            try {
              return await j($(t3, "invoke"), { ...r3 }), i3 = await e3(...s4), await j($(t3, "success"), { ...r3, result: i3 }), i3;
            } catch (e4) {
              throw o3 = e4, await j($(t3, "fail"), { ...r3, error: o3 }), o3;
            } finally {
              await j($(t3, "complete"), o3 ? { ...r3, error: o3 } : { ...r3, result: i3 });
            }
          };
        }({ fn: async function s4(...u2) {
          let h2;
          a2 && uni.showLoading({ title: r2.title, mask: r2.mask });
          const d2 = { name: t2, type: l.OBJECT, data: { method: c2, params: u2 } };
          "object" == typeof n2.secretMethods && function(e3, t3) {
            const n3 = t3.data.method, s5 = e3.secretMethods || {}, r3 = s5[n3] || s5["*"];
            r3 && (t3.secretType = r3);
          }(n2, d2);
          let p2 = false;
          try {
            h2 = await e2.callFunction(d2);
          } catch (e3) {
            p2 = true, h2 = { result: new te(e3) };
          }
          const { errSubject: f2, errCode: g2, errMsg: m2, newToken: y2 } = h2.result || {};
          if (a2 && uni.hideLoading(), y2 && y2.token && y2.tokenExpired && (ie(y2), Y(H.REFRESH_TOKEN, { ...y2 })), g2) {
            let e3 = m2;
            if (p2 && o2) {
              e3 = (await o2({ objectName: t2, methodName: c2, params: u2, errSubject: f2, errCode: g2, errMsg: m2 })).errMsg || m2;
            }
            if (a2)
              if ("toast" === i2.type)
                uni.showToast({ title: e3, icon: "none" });
              else {
                if ("modal" !== i2.type)
                  throw new Error(`Invalid errorOptions.type: ${i2.type}`);
                {
                  const { confirm: t3 } = await async function({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3 } = {}) {
                    return new Promise((i3, o3) => {
                      uni.showModal({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3, success(e5) {
                        i3(e5);
                      }, fail() {
                        i3({ confirm: false, cancel: true });
                      } });
                    });
                  }({ title: "提示", content: e3, showCancel: i2.retry, cancelText: "取消", confirmText: i2.retry ? "重试" : "确定" });
                  if (i2.retry && t3)
                    return s4(...u2);
                }
              }
            const n3 = new te({ subject: f2, code: g2, message: m2, requestId: h2.requestId });
            throw n3.detail = h2.result, Y(H.RESPONSE, { type: J.CLOUD_OBJECT, content: n3 }), n3;
          }
          return Y(H.RESPONSE, { type: J.CLOUD_OBJECT, content: h2.result }), h2.result;
        }, interceptorName: "callObject", getCallbackArgs: function({ params: e3 } = {}) {
          return { objectName: t2, methodName: c2, params: e3 };
        } });
      } });
    };
  }
  function Ws(e2) {
    return U(Xt.replace("{spaceId}", e2.config.spaceId));
  }
  async function Hs({ openid: e2, callLoginByWeixin: t2 = false } = {}) {
    Ws(this);
    throw new Error(`[SecureNetwork] API \`initSecureNetworkByWeixin\` is not supported on platform \`${P}\``);
  }
  async function Js(e2) {
    const t2 = Ws(this);
    return t2.initPromise || (t2.initPromise = Hs.call(this, e2).then((e3) => e3).catch((e3) => {
      throw delete t2.initPromise, e3;
    })), t2.initPromise;
  }
  function zs(e2) {
    return function({ openid: t2, callLoginByWeixin: n2 = false } = {}) {
      return Js.call(e2, { openid: t2, callLoginByWeixin: n2 });
    };
  }
  function Vs(e2) {
    !function(e3) {
      he = e3;
    }(e2);
  }
  function Gs(e2) {
    const n2 = { getAppBaseInfo: uni.getSystemInfo, getPushClientId: uni.getPushClientId };
    return function(s2) {
      return new Promise((r2, i2) => {
        n2[e2]({ ...s2, success(e3) {
          r2(e3);
        }, fail(e3) {
          i2(e3);
        } });
      });
    };
  }
  class Ys extends S {
    constructor() {
      super(), this._uniPushMessageCallback = this._receivePushMessage.bind(this), this._currentMessageId = -1, this._payloadQueue = [];
    }
    init() {
      return Promise.all([Gs("getAppBaseInfo")(), Gs("getPushClientId")()]).then(([{ appId: e2 } = {}, { cid: t2 } = {}] = []) => {
        if (!e2)
          throw new Error("Invalid appId, please check the manifest.json file");
        if (!t2)
          throw new Error("Invalid push client id");
        this._appId = e2, this._pushClientId = t2, this._seqId = Date.now() + "-" + Math.floor(9e5 * Math.random() + 1e5), this.emit("open"), this._initMessageListener();
      }, (e2) => {
        throw this.emit("error", e2), this.close(), e2;
      });
    }
    async open() {
      return this.init();
    }
    _isUniCloudSSE(e2) {
      if ("receive" !== e2.type)
        return false;
      const t2 = e2 && e2.data && e2.data.payload;
      return !(!t2 || "UNI_CLOUD_SSE" !== t2.channel || t2.seqId !== this._seqId);
    }
    _receivePushMessage(e2) {
      if (!this._isUniCloudSSE(e2))
        return;
      const t2 = e2 && e2.data && e2.data.payload, { action: n2, messageId: s2, message: r2 } = t2;
      this._payloadQueue.push({ action: n2, messageId: s2, message: r2 }), this._consumMessage();
    }
    _consumMessage() {
      for (; ; ) {
        const e2 = this._payloadQueue.find((e3) => e3.messageId === this._currentMessageId + 1);
        if (!e2)
          break;
        this._currentMessageId++, this._parseMessagePayload(e2);
      }
    }
    _parseMessagePayload(e2) {
      const { action: t2, messageId: n2, message: s2 } = e2;
      "end" === t2 ? this._end({ messageId: n2, message: s2 }) : "message" === t2 && this._appendMessage({ messageId: n2, message: s2 });
    }
    _appendMessage({ messageId: e2, message: t2 } = {}) {
      this.emit("message", t2);
    }
    _end({ messageId: e2, message: t2 } = {}) {
      this.emit("end", t2), this.close();
    }
    _initMessageListener() {
      uni.onPushMessage(this._uniPushMessageCallback);
    }
    _destroy() {
      uni.offPushMessage(this._uniPushMessageCallback);
    }
    toJSON() {
      return { appId: this._appId, pushClientId: this._pushClientId, seqId: this._seqId };
    }
    close() {
      this._destroy(), this.emit("close");
    }
  }
  async function Qs(e2) {
    {
      const { osName: e3, osVersion: t3 } = ce();
      "ios" === e3 && function(e4) {
        if (!e4 || "string" != typeof e4)
          return 0;
        const t4 = e4.match(/^(\d+)./);
        return t4 && t4[1] ? parseInt(t4[1]) : 0;
      }(t3) >= 14 && console.warn("iOS 14及以上版本连接uniCloud本地调试服务需要允许客户端查找并连接到本地网络上的设备（仅开发期间需要，发行后不需要）");
    }
    const t2 = e2.__dev__;
    if (!t2.debugInfo)
      return;
    const { address: n2, servePort: s2 } = t2.debugInfo, { address: r2 } = await Ot(n2, s2);
    if (r2)
      return t2.localAddress = r2, void (t2.localPort = s2);
    const i2 = console["error"];
    let o2 = "";
    if ("remote" === t2.debugInfo.initialLaunchType ? (t2.debugInfo.forceRemote = true, o2 = "当前客户端和HBuilderX不在同一局域网下（或其他网络原因无法连接HBuilderX），uniCloud本地调试服务不对当前客户端生效。\n- 如果不使用uniCloud本地调试服务，请直接忽略此信息。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。") : o2 = "无法连接uniCloud本地调试服务，请检查当前客户端是否与主机在同一局域网下。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。", o2 += "\n- 如果在HBuilderX开启的状态下切换过网络环境，请重启HBuilderX后再试\n- 检查系统防火墙是否拦截了HBuilderX自带的nodejs\n- 检查是否错误的使用拦截器修改uni.request方法的参数", 0 === P.indexOf("mp-") && (o2 += "\n- 小程序中如何使用uniCloud，请参考：https://uniapp.dcloud.net.cn/uniCloud/publish.html#useinmp"), !t2.debugInfo.forceRemote)
      throw new Error(o2);
    i2(o2);
  }
  function Xs(e2) {
    e2._initPromiseHub || (e2._initPromiseHub = new v({ createPromise: function() {
      let t2 = Promise.resolve();
      var n2;
      n2 = 1, t2 = new Promise((e3) => {
        setTimeout(() => {
          e3();
        }, n2);
      });
      const s2 = e2.auth();
      return t2.then(() => s2.getLoginState()).then((e3) => e3 ? Promise.resolve() : s2.signInAnonymously());
    } }));
  }
  const Zs = { tcb: Pt, tencent: Pt, aliyun: fe, private: Rt, dcloud: Rt, alipay: Bt };
  let er = new class {
    init(e2) {
      let t2 = {};
      const n2 = Zs[e2.provider];
      if (!n2)
        throw new Error("未提供正确的provider参数");
      t2 = n2.init(e2), function(e3) {
        const t3 = {};
        e3.__dev__ = t3, t3.debugLog = "app" === P;
        const n3 = C;
        n3 && !n3.code && (t3.debugInfo = n3);
        const s2 = new v({ createPromise: function() {
          return Qs(e3);
        } });
        t3.initLocalNetwork = function() {
          return s2.exec();
        };
      }(t2), Xs(t2), Gn(t2), function(e3) {
        const t3 = e3.uploadFile;
        e3.uploadFile = function(e4) {
          return t3.call(this, e4);
        };
      }(t2), function(e3) {
        e3.database = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e3.init(t3).database();
          if (this._database)
            return this._database;
          const n3 = as(cs, { uniClient: e3 });
          return this._database = n3, n3;
        }, e3.databaseForJQL = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e3.init(t3).databaseForJQL();
          if (this._databaseForJQL)
            return this._databaseForJQL;
          const n3 = as(cs, { uniClient: e3, isJQL: true });
          return this._databaseForJQL = n3, n3;
        };
      }(t2), function(e3) {
        e3.getCurrentUserInfo = qs, e3.chooseAndUploadFile = Ks.initChooseAndUploadFile(e3), Object.assign(e3, { get mixinDatacom() {
          return $s(e3);
        } }), e3.SSEChannel = Ys, e3.initSecureNetworkByWeixin = zs(e3), e3.setCustomClientInfo = Vs, e3.importObject = Bs(e3);
      }(t2);
      return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e3) => {
        if (!t2[e3])
          return;
        const n3 = t2[e3];
        t2[e3] = function() {
          return n3.apply(t2, Array.from(arguments));
        }, t2[e3] = (/* @__PURE__ */ function(e4, t3) {
          return function(n4) {
            let s2 = false;
            if ("callFunction" === t3) {
              const e5 = n4 && n4.type || l.DEFAULT;
              s2 = e5 !== l.DEFAULT;
            }
            const r2 = "callFunction" === t3 && !s2, i2 = this._initPromiseHub.exec();
            n4 = n4 || {};
            const { success: o2, fail: a2, complete: c2 } = ee(n4), u2 = i2.then(() => s2 ? Promise.resolve() : j($(t3, "invoke"), n4)).then(() => e4.call(this, n4)).then((e5) => s2 ? Promise.resolve(e5) : j($(t3, "success"), e5).then(() => j($(t3, "complete"), e5)).then(() => (r2 && Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 }), Promise.resolve(e5))), (e5) => s2 ? Promise.reject(e5) : j($(t3, "fail"), e5).then(() => j($(t3, "complete"), e5)).then(() => (Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 }), Promise.reject(e5))));
            if (!(o2 || a2 || c2))
              return u2;
            u2.then((e5) => {
              o2 && o2(e5), c2 && c2(e5), r2 && Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 });
            }, (e5) => {
              a2 && a2(e5), c2 && c2(e5), r2 && Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 });
            });
          };
        }(t2[e3], e3)).bind(t2);
      }), t2.init = this.init, t2;
    }
  }();
  (() => {
    const e2 = O;
    let t2 = {};
    if (e2 && 1 === e2.length)
      t2 = e2[0], er = er.init(t2), er._isDefault = true;
    else {
      const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile"], n2 = ["database", "getCurrentUserInfo", "importObject"];
      let s2;
      s2 = e2 && e2.length > 0 ? "应用有多个服务空间，请通过uniCloud.init方法指定要使用的服务空间" : "应用未关联服务空间，请在uniCloud目录右键关联服务空间", [...t3, ...n2].forEach((e3) => {
        er[e3] = function() {
          if (console.error(s2), -1 === n2.indexOf(e3))
            return Promise.reject(new te({ code: "SYS_ERR", message: s2 }));
          console.error(s2);
        };
      });
    }
    if (Object.assign(er, { get mixinDatacom() {
      return $s(er);
    } }), Ls(er), er.addInterceptor = F, er.removeInterceptor = K, er.interceptObject = B, uni.__uniCloud = er, "app" === P) {
      const e3 = D();
      e3.uniCloud = er, e3.UniCloudError = te;
    }
  })();
  var tr = er;
  const _sfc_main$9 = {
    name: "loading1",
    data() {
      return {};
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading1" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  const Loading1 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-0e645258"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/uni_modules/qiun-data-charts/components/qiun-loading/loading1.vue"]]);
  const _sfc_main$8 = {
    name: "loading2",
    data() {
      return {};
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading2" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  const Loading2 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-3df48dc2"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/uni_modules/qiun-data-charts/components/qiun-loading/loading2.vue"]]);
  const _sfc_main$7 = {
    name: "loading3",
    data() {
      return {};
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading3" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  const Loading3 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-27a8293c"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/uni_modules/qiun-data-charts/components/qiun-loading/loading3.vue"]]);
  const _sfc_main$6 = {
    name: "loading5",
    data() {
      return {};
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading5" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  const Loading4 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-2e7deb83"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/uni_modules/qiun-data-charts/components/qiun-loading/loading4.vue"]]);
  const _sfc_main$5 = {
    name: "loading6",
    data() {
      return {};
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading6" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  const Loading5 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-ef674bbb"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/uni_modules/qiun-data-charts/components/qiun-loading/loading5.vue"]]);
  const _sfc_main$4 = {
    components: { Loading1, Loading2, Loading3, Loading4, Loading5 },
    name: "qiun-loading",
    props: {
      loadingType: {
        type: Number,
        default: 2
      }
    },
    data() {
      return {};
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Loading1 = vue.resolveComponent("Loading1");
    const _component_Loading2 = vue.resolveComponent("Loading2");
    const _component_Loading3 = vue.resolveComponent("Loading3");
    const _component_Loading4 = vue.resolveComponent("Loading4");
    const _component_Loading5 = vue.resolveComponent("Loading5");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      $props.loadingType == 1 ? (vue.openBlock(), vue.createBlock(_component_Loading1, { key: 0 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 2 ? (vue.openBlock(), vue.createBlock(_component_Loading2, { key: 1 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 3 ? (vue.openBlock(), vue.createBlock(_component_Loading3, { key: 2 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 4 ? (vue.openBlock(), vue.createBlock(_component_Loading4, { key: 3 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 5 ? (vue.openBlock(), vue.createBlock(_component_Loading5, { key: 4 })) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/uni_modules/qiun-data-charts/components/qiun-loading/qiun-loading.vue"]]);
  const _sfc_main$3 = {
    name: "qiun-error",
    props: {
      errorMessage: {
        type: String,
        default: null
      }
    },
    data() {
      return {};
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chartsview" }, [
      vue.createElementVNode("view", { class: "charts-error" }),
      vue.createElementVNode(
        "view",
        { class: "charts-font" },
        vue.toDisplayString($props.errorMessage == null ? "请点击重试" : $props.errorMessage),
        1
        /* TEXT */
      )
    ]);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-a99d579b"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/uni_modules/qiun-data-charts/components/qiun-error/qiun-error.vue"]]);
  const color$1 = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"];
  const formatDateTime = (timeStamp, returnType) => {
    var date = /* @__PURE__ */ new Date();
    date.setTime(timeStamp * 1e3);
    var y2 = date.getFullYear();
    var m2 = date.getMonth() + 1;
    m2 = m2 < 10 ? "0" + m2 : m2;
    var d2 = date.getDate();
    d2 = d2 < 10 ? "0" + d2 : d2;
    var h2 = date.getHours();
    h2 = h2 < 10 ? "0" + h2 : h2;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    if (returnType == "full") {
      return y2 + "-" + m2 + "-" + d2 + " " + h2 + ":" + minute + ":" + second;
    }
    if (returnType == "y-m-d") {
      return y2 + "-" + m2 + "-" + d2;
    }
    if (returnType == "h:m") {
      return h2 + ":" + minute;
    }
    if (returnType == "h:m:s") {
      return h2 + ":" + minute + ":" + second;
    }
    return [y2, m2, d2, h2, minute, second];
  };
  const cfu = {
    //demotype为自定义图表类型，一般不需要自定义图表类型，只需要改根节点上对应的类型即可
    "type": ["pie", "ring", "rose", "word", "funnel", "map", "arcbar", "line", "column", "mount", "bar", "area", "radar", "gauge", "candle", "mix", "tline", "tarea", "scatter", "bubble", "demotype"],
    "range": ["饼状图", "圆环图", "玫瑰图", "词云图", "漏斗图", "地图", "圆弧进度条", "折线图", "柱状图", "山峰图", "条状图", "区域图", "雷达图", "仪表盘", "K线图", "混合图", "时间轴折线", "时间轴区域", "散点图", "气泡图", "自定义类型"],
    //增加自定义图表类型，如果需要categories，请在这里加入您的图表类型，例如最后的"demotype"
    //自定义类型时需要注意"tline","tarea","scatter","bubble"等时间轴（矢量x轴）类图表，没有categories，不需要加入categories
    "categories": ["line", "column", "mount", "bar", "area", "radar", "gauge", "candle", "mix", "demotype"],
    //instance为实例变量承载属性，不要删除
    "instance": {},
    //option为opts及eopts承载属性，不要删除
    "option": {},
    //下面是自定义format配置，因除H5端外的其他端无法通过props传递函数，只能通过此属性对应下标的方式来替换
    "formatter": {
      "yAxisDemo1": function(val, index, opts) {
        return val + "元";
      },
      "yAxisDemo2": function(val, index, opts) {
        return val.toFixed(2);
      },
      "xAxisDemo1": function(val, index, opts) {
        return val + "年";
      },
      "xAxisDemo2": function(val, index, opts) {
        return formatDateTime(val, "h:m");
      },
      "seriesDemo1": function(val, index, series, opts) {
        return val + "元";
      },
      "tooltipDemo1": function(item, category, index, opts) {
        if (index == 0) {
          return "随便用" + item.data + "年";
        } else {
          return "其他我没改" + item.data + "天";
        }
      },
      "pieDemo": function(val, index, series, opts) {
        if (index !== void 0) {
          return series[index].name + "：" + series[index].data + "元";
        }
      }
    },
    //这里演示了自定义您的图表类型的option，可以随意命名，之后在组件上 type="demotype" 后，组件会调用这个花括号里的option，如果组件上还存在opts参数，会将demotype与opts中option合并后渲染图表。
    "demotype": {
      //我这里把曲线图当做了自定义图表类型，您可以根据需要随意指定类型或配置
      "type": "line",
      "color": color$1,
      "padding": [15, 10, 0, 15],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2
      },
      "legend": {},
      "extra": {
        "line": {
          "type": "curve",
          "width": 2
        }
      }
    },
    //下面是自定义配置，请添加项目所需的通用配置
    "pie": {
      "type": "pie",
      "color": color$1,
      "padding": [5, 5, 5, 5],
      "extra": {
        "pie": {
          "activeOpacity": 0.5,
          "activeRadius": 10,
          "offsetAngle": 0,
          "labelWidth": 15,
          "border": true,
          "borderWidth": 3,
          "borderColor": "#FFFFFF"
        }
      }
    },
    "ring": {
      "type": "ring",
      "color": color$1,
      "padding": [5, 5, 5, 5],
      "rotate": false,
      "dataLabel": true,
      "legend": {
        "show": true,
        "position": "right",
        "lineHeight": 25
      },
      "title": {
        "name": "收益率",
        "fontSize": 15,
        "color": "#666666"
      },
      "subtitle": {
        "name": "70%",
        "fontSize": 25,
        "color": "#7cb5ec"
      },
      "extra": {
        "ring": {
          "ringWidth": 30,
          "activeOpacity": 0.5,
          "activeRadius": 10,
          "offsetAngle": 0,
          "labelWidth": 15,
          "border": true,
          "borderWidth": 3,
          "borderColor": "#FFFFFF"
        }
      }
    },
    "rose": {
      "type": "rose",
      "color": color$1,
      "padding": [5, 5, 5, 5],
      "legend": {
        "show": true,
        "position": "left",
        "lineHeight": 25
      },
      "extra": {
        "rose": {
          "type": "area",
          "minRadius": 50,
          "activeOpacity": 0.5,
          "activeRadius": 10,
          "offsetAngle": 0,
          "labelWidth": 15,
          "border": false,
          "borderWidth": 2,
          "borderColor": "#FFFFFF"
        }
      }
    },
    "word": {
      "type": "word",
      "color": color$1,
      "extra": {
        "word": {
          "type": "normal",
          "autoColors": false
        }
      }
    },
    "funnel": {
      "type": "funnel",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "extra": {
        "funnel": {
          "activeOpacity": 0.3,
          "activeWidth": 10,
          "border": true,
          "borderWidth": 2,
          "borderColor": "#FFFFFF",
          "fillOpacity": 1,
          "labelAlign": "right"
        }
      }
    },
    "map": {
      "type": "map",
      "color": color$1,
      "padding": [0, 0, 0, 0],
      "dataLabel": true,
      "extra": {
        "map": {
          "border": true,
          "borderWidth": 1,
          "borderColor": "#666666",
          "fillOpacity": 0.6,
          "activeBorderColor": "#F04864",
          "activeFillColor": "#FACC14",
          "activeFillOpacity": 1
        }
      }
    },
    "arcbar": {
      "type": "arcbar",
      "color": color$1,
      "title": {
        "name": "百分比",
        "fontSize": 25,
        "color": "#00FF00"
      },
      "subtitle": {
        "name": "默认标题",
        "fontSize": 15,
        "color": "#666666"
      },
      "extra": {
        "arcbar": {
          "type": "default",
          "width": 12,
          "backgroundColor": "#E9E9E9",
          "startAngle": 0.75,
          "endAngle": 0.25,
          "gap": 2
        }
      }
    },
    "line": {
      "type": "line",
      "color": color$1,
      "padding": [15, 10, 0, 15],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2
      },
      "legend": {},
      "extra": {
        "line": {
          "type": "straight",
          "width": 2,
          "activeType": "hollow"
        }
      }
    },
    "tline": {
      "type": "line",
      "color": color$1,
      "padding": [15, 10, 0, 15],
      "xAxis": {
        "disableGrid": false,
        "boundaryGap": "justify"
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2,
        "data": [
          {
            "min": 0,
            "max": 80
          }
        ]
      },
      "legend": {},
      "extra": {
        "line": {
          "type": "curve",
          "width": 2,
          "activeType": "hollow"
        }
      }
    },
    "tarea": {
      "type": "area",
      "color": color$1,
      "padding": [15, 10, 0, 15],
      "xAxis": {
        "disableGrid": true,
        "boundaryGap": "justify"
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2,
        "data": [
          {
            "min": 0,
            "max": 80
          }
        ]
      },
      "legend": {},
      "extra": {
        "area": {
          "type": "curve",
          "opacity": 0.2,
          "addLine": true,
          "width": 2,
          "gradient": true,
          "activeType": "hollow"
        }
      }
    },
    "column": {
      "type": "column",
      "color": color$1,
      "padding": [15, 15, 0, 5],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "data": [{ "min": 0 }]
      },
      "legend": {},
      "extra": {
        "column": {
          "type": "group",
          "width": 30,
          "activeBgColor": "#000000",
          "activeBgOpacity": 0.08
        }
      }
    },
    "mount": {
      "type": "mount",
      "color": color$1,
      "padding": [15, 15, 0, 5],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "data": [{ "min": 0 }]
      },
      "legend": {},
      "extra": {
        "mount": {
          "type": "mount",
          "widthRatio": 1.5
        }
      }
    },
    "bar": {
      "type": "bar",
      "color": color$1,
      "padding": [15, 30, 0, 5],
      "xAxis": {
        "boundaryGap": "justify",
        "disableGrid": false,
        "min": 0,
        "axisLine": false
      },
      "yAxis": {},
      "legend": {},
      "extra": {
        "bar": {
          "type": "group",
          "width": 30,
          "meterBorde": 1,
          "meterFillColor": "#FFFFFF",
          "activeBgColor": "#000000",
          "activeBgOpacity": 0.08
        }
      }
    },
    "area": {
      "type": "area",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2
      },
      "legend": {},
      "extra": {
        "area": {
          "type": "straight",
          "opacity": 0.2,
          "addLine": true,
          "width": 2,
          "gradient": false,
          "activeType": "hollow"
        }
      }
    },
    "radar": {
      "type": "radar",
      "color": color$1,
      "padding": [5, 5, 5, 5],
      "dataLabel": false,
      "legend": {
        "show": true,
        "position": "right",
        "lineHeight": 25
      },
      "extra": {
        "radar": {
          "gridType": "radar",
          "gridColor": "#CCCCCC",
          "gridCount": 3,
          "opacity": 0.2,
          "max": 200,
          "labelShow": true
        }
      }
    },
    "gauge": {
      "type": "gauge",
      "color": color$1,
      "title": {
        "name": "66Km/H",
        "fontSize": 25,
        "color": "#2fc25b",
        "offsetY": 50
      },
      "subtitle": {
        "name": "实时速度",
        "fontSize": 15,
        "color": "#1890ff",
        "offsetY": -50
      },
      "extra": {
        "gauge": {
          "type": "default",
          "width": 30,
          "labelColor": "#666666",
          "startAngle": 0.75,
          "endAngle": 0.25,
          "startNumber": 0,
          "endNumber": 100,
          "labelFormat": "",
          "splitLine": {
            "fixRadius": 0,
            "splitNumber": 10,
            "width": 30,
            "color": "#FFFFFF",
            "childNumber": 5,
            "childWidth": 12
          },
          "pointer": {
            "width": 24,
            "color": "auto"
          }
        }
      }
    },
    "candle": {
      "type": "candle",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "enableScroll": true,
      "enableMarkLine": true,
      "dataLabel": false,
      "xAxis": {
        "labelCount": 4,
        "itemCount": 40,
        "disableGrid": true,
        "gridColor": "#CCCCCC",
        "gridType": "solid",
        "dashLength": 4,
        "scrollShow": true,
        "scrollAlign": "left",
        "scrollColor": "#A6A6A6",
        "scrollBackgroundColor": "#EFEBEF"
      },
      "yAxis": {},
      "legend": {},
      "extra": {
        "candle": {
          "color": {
            "upLine": "#f04864",
            "upFill": "#f04864",
            "downLine": "#2fc25b",
            "downFill": "#2fc25b"
          },
          "average": {
            "show": true,
            "name": ["MA5", "MA10", "MA30"],
            "day": [5, 10, 20],
            "color": ["#1890ff", "#2fc25b", "#facc14"]
          }
        },
        "markLine": {
          "type": "dash",
          "dashLength": 5,
          "data": [
            {
              "value": 2150,
              "lineColor": "#f04864",
              "showLabel": true
            },
            {
              "value": 2350,
              "lineColor": "#f04864",
              "showLabel": true
            }
          ]
        }
      }
    },
    "mix": {
      "type": "mix",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "disabled": false,
        "disableGrid": false,
        "splitNumber": 5,
        "gridType": "dash",
        "dashLength": 4,
        "gridColor": "#CCCCCC",
        "padding": 10,
        "showTitle": true,
        "data": []
      },
      "legend": {},
      "extra": {
        "mix": {
          "column": {
            "width": 20
          }
        }
      }
    },
    "scatter": {
      "type": "scatter",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "dataLabel": false,
      "xAxis": {
        "disableGrid": false,
        "gridType": "dash",
        "splitNumber": 5,
        "boundaryGap": "justify",
        "min": 0
      },
      "yAxis": {
        "disableGrid": false,
        "gridType": "dash"
      },
      "legend": {},
      "extra": {
        "scatter": {}
      }
    },
    "bubble": {
      "type": "bubble",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "xAxis": {
        "disableGrid": false,
        "gridType": "dash",
        "splitNumber": 5,
        "boundaryGap": "justify",
        "min": 0,
        "max": 250
      },
      "yAxis": {
        "disableGrid": false,
        "gridType": "dash",
        "data": [{
          "min": 0,
          "max": 150
        }]
      },
      "legend": {},
      "extra": {
        "bubble": {
          "border": 2,
          "opacity": 0.5
        }
      }
    }
  };
  const color = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"];
  const cfe = {
    //demotype为自定义图表类型
    "type": ["pie", "ring", "rose", "funnel", "line", "column", "area", "radar", "gauge", "candle", "demotype"],
    //增加自定义图表类型，如果需要categories，请在这里加入您的图表类型例如最后的"demotype"
    "categories": ["line", "column", "area", "radar", "gauge", "candle", "demotype"],
    //instance为实例变量承载属性，option为eopts承载属性，不要删除
    "instance": {},
    "option": {},
    //下面是自定义format配置，因除H5端外的其他端无法通过props传递函数，只能通过此属性对应下标的方式来替换
    "formatter": {
      "tooltipDemo1": function(res) {
        let result = "";
        for (let i2 in res) {
          if (i2 == 0) {
            result += res[i2].axisValueLabel + "年销售额";
          }
          let value = "--";
          if (res[i2].data !== null) {
            value = res[i2].data;
          }
          result += "<br/>" + res[i2].marker + res[i2].seriesName + "：" + value + " 万元";
        }
        return result;
      },
      legendFormat: function(name) {
        return "自定义图例+" + name;
      },
      yAxisFormatDemo: function(value, index) {
        return value + "元";
      },
      seriesFormatDemo: function(res) {
        return res.name + "年" + res.value + "元";
      }
    },
    //这里演示了自定义您的图表类型的option，可以随意命名，之后在组件上 type="demotype" 后，组件会调用这个花括号里的option，如果组件上还存在eopts参数，会将demotype与eopts中option合并后渲染图表。
    "demotype": {
      "color": color
      //在这里填写echarts的option即可
    },
    //下面是自定义配置，请添加项目所需的通用配置
    "column": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "axis"
      },
      "grid": {
        "top": 30,
        "bottom": 50,
        "right": 15,
        "left": 40
      },
      "legend": {
        "bottom": "left"
      },
      "toolbox": {
        "show": false
      },
      "xAxis": {
        "type": "category",
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        },
        "boundaryGap": true,
        "data": []
      },
      "yAxis": {
        "type": "value",
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        }
      },
      "seriesTemplate": {
        "name": "",
        "type": "bar",
        "data": [],
        "barwidth": 20,
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "line": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "axis"
      },
      "grid": {
        "top": 30,
        "bottom": 50,
        "right": 15,
        "left": 40
      },
      "legend": {
        "bottom": "left"
      },
      "toolbox": {
        "show": false
      },
      "xAxis": {
        "type": "category",
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        },
        "boundaryGap": true,
        "data": []
      },
      "yAxis": {
        "type": "value",
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        }
      },
      "seriesTemplate": {
        "name": "",
        "type": "line",
        "data": [],
        "barwidth": 20,
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "area": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "axis"
      },
      "grid": {
        "top": 30,
        "bottom": 50,
        "right": 15,
        "left": 40
      },
      "legend": {
        "bottom": "left"
      },
      "toolbox": {
        "show": false
      },
      "xAxis": {
        "type": "category",
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        },
        "boundaryGap": true,
        "data": []
      },
      "yAxis": {
        "type": "value",
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        }
      },
      "seriesTemplate": {
        "name": "",
        "type": "line",
        "data": [],
        "areaStyle": {},
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "pie": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item"
      },
      "grid": {
        "top": 40,
        "bottom": 30,
        "right": 15,
        "left": 15
      },
      "legend": {
        "bottom": "left"
      },
      "seriesTemplate": {
        "name": "",
        "type": "pie",
        "data": [],
        "radius": "50%",
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "ring": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item"
      },
      "grid": {
        "top": 40,
        "bottom": 30,
        "right": 15,
        "left": 15
      },
      "legend": {
        "bottom": "left"
      },
      "seriesTemplate": {
        "name": "",
        "type": "pie",
        "data": [],
        "radius": ["40%", "70%"],
        "avoidLabelOverlap": false,
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        },
        "labelLine": {
          "show": true
        }
      }
    },
    "rose": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item"
      },
      "legend": {
        "top": "bottom"
      },
      "seriesTemplate": {
        "name": "",
        "type": "pie",
        "data": [],
        "radius": "55%",
        "center": ["50%", "50%"],
        "roseType": "area"
      }
    },
    "funnel": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item",
        "formatter": "{b} : {c}%"
      },
      "legend": {
        "top": "bottom"
      },
      "seriesTemplate": {
        "name": "",
        "type": "funnel",
        "left": "10%",
        "top": 60,
        "bottom": 60,
        "width": "80%",
        "min": 0,
        "max": 100,
        "minSize": "0%",
        "maxSize": "100%",
        "sort": "descending",
        "gap": 2,
        "label": {
          "show": true,
          "position": "inside"
        },
        "labelLine": {
          "length": 10,
          "lineStyle": {
            "width": 1,
            "type": "solid"
          }
        },
        "itemStyle": {
          "bordercolor": "#fff",
          "borderwidth": 1
        },
        "emphasis": {
          "label": {
            "fontSize": 20
          }
        },
        "data": []
      }
    },
    "gauge": {
      "color": color,
      "tooltip": {
        "formatter": "{a} <br/>{b} : {c}%"
      },
      "seriesTemplate": {
        "name": "业务指标",
        "type": "gauge",
        "detail": { "formatter": "{value}%" },
        "data": [{ "value": 50, "name": "完成率" }]
      }
    },
    "candle": {
      "xAxis": {
        "data": []
      },
      "yAxis": {},
      "color": color,
      "title": {
        "text": ""
      },
      "dataZoom": [
        {
          "type": "inside",
          "xAxisIndex": [0, 1],
          "start": 10,
          "end": 100
        },
        {
          "show": true,
          "xAxisIndex": [0, 1],
          "type": "slider",
          "bottom": 10,
          "start": 10,
          "end": 100
        }
      ],
      "seriesTemplate": {
        "name": "",
        "type": "k",
        "data": []
      }
    }
  };
  const block0 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("rdcharts");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["rdcharts"] = "f9cb76fc";
  };
  function deepCloneAssign(origin = {}, ...args) {
    for (let i2 in args) {
      for (let key in args[i2]) {
        if (args[i2].hasOwnProperty(key)) {
          origin[key] = args[i2][key] && typeof args[i2][key] === "object" ? deepCloneAssign(Array.isArray(args[i2][key]) ? [] : {}, origin[key], args[i2][key]) : args[i2][key];
        }
      }
    }
    return origin;
  }
  function formatterAssign(args, formatter) {
    for (let key in args) {
      if (args.hasOwnProperty(key) && args[key] !== null && typeof args[key] === "object") {
        formatterAssign(args[key], formatter);
      } else if (key === "format" && typeof args[key] === "string") {
        args["formatter"] = formatter[args[key]] ? formatter[args[key]] : void 0;
      }
    }
    return args;
  }
  function getFormatDate(date) {
    var seperator = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator + month + seperator + strDate;
    return currentdate;
  }
  const _sfc_main$2 = {
    name: "qiun-data-charts",
    mixins: [tr.mixinDatacom],
    props: {
      type: {
        type: String,
        default: null
      },
      canvasId: {
        type: String,
        default: "uchartsid"
      },
      canvas2d: {
        type: Boolean,
        default: false
      },
      background: {
        type: String,
        default: "rgba(0,0,0,0)"
      },
      animation: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        default() {
          return {
            categories: [],
            series: []
          };
        }
      },
      opts: {
        type: Object,
        default() {
          return {};
        }
      },
      eopts: {
        type: Object,
        default() {
          return {};
        }
      },
      loadingType: {
        type: Number,
        default: 2
      },
      errorShow: {
        type: Boolean,
        default: true
      },
      errorReload: {
        type: Boolean,
        default: true
      },
      errorMessage: {
        type: String,
        default: null
      },
      inScrollView: {
        type: Boolean,
        default: false
      },
      reshow: {
        type: Boolean,
        default: false
      },
      reload: {
        type: Boolean,
        default: false
      },
      disableScroll: {
        type: Boolean,
        default: false
      },
      optsWatch: {
        type: Boolean,
        default: true
      },
      onzoom: {
        type: Boolean,
        default: false
      },
      ontap: {
        type: Boolean,
        default: true
      },
      ontouch: {
        type: Boolean,
        default: false
      },
      onmouse: {
        type: Boolean,
        default: true
      },
      onmovetip: {
        type: Boolean,
        default: false
      },
      echartsH5: {
        type: Boolean,
        default: false
      },
      echartsApp: {
        type: Boolean,
        default: false
      },
      tooltipShow: {
        type: Boolean,
        default: true
      },
      tooltipFormat: {
        type: String,
        default: void 0
      },
      tooltipCustom: {
        type: Object,
        default: void 0
      },
      startDate: {
        type: String,
        default: void 0
      },
      endDate: {
        type: String,
        default: void 0
      },
      textEnum: {
        type: Array,
        default() {
          return [];
        }
      },
      groupEnum: {
        type: Array,
        default() {
          return [];
        }
      },
      pageScrollTop: {
        type: Number,
        default: 0
      },
      directory: {
        type: String,
        default: "/"
      },
      tapLegend: {
        type: Boolean,
        default: true
      },
      menus: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        cid: "uchartsid",
        inWx: false,
        inAli: false,
        inTt: false,
        inBd: false,
        inH5: false,
        inApp: false,
        inWin: false,
        type2d: true,
        disScroll: false,
        openmouse: false,
        pixel: 1,
        cWidth: 375,
        cHeight: 250,
        showchart: false,
        echarts: false,
        echartsResize: {
          state: false
        },
        uchartsOpts: {},
        echartsOpts: {},
        drawData: {},
        lastDrawTime: null
      };
    },
    created() {
      this.cid = this.canvasId;
      if (this.canvasId == "uchartsid" || this.canvasId == "") {
        let t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let len = t2.length;
        let id = "";
        for (let i2 = 0; i2 < 32; i2++) {
          id += t2.charAt(Math.floor(Math.random() * len));
        }
        this.cid = id;
      }
      const systemInfo = uni.getSystemInfoSync();
      if (systemInfo.platform === "windows" || systemInfo.platform === "mac") {
        this.inWin = true;
      }
      this.type2d = false;
      this.disScroll = this.disableScroll;
    },
    mounted() {
      this.inApp = true;
      if (this.echartsApp === true) {
        this.echarts = true;
        this.openmouse = false;
      }
      this.$nextTick(() => {
        this.beforeInit();
      });
    },
    destroyed() {
      if (this.echarts === true) {
        delete cfe.option[this.cid];
        delete cfe.instance[this.cid];
      } else {
        delete cfu.option[this.cid];
        delete cfu.instance[this.cid];
      }
      uni.offWindowResize(() => {
      });
    },
    watch: {
      chartDataProps: {
        handler(val, oldval) {
          if (typeof val === "object") {
            if (JSON.stringify(val) !== JSON.stringify(oldval)) {
              this._clearChart();
              if (val.series && val.series.length > 0) {
                this.beforeInit();
              } else {
                this.mixinDatacomLoading = true;
                this.showchart = false;
                this.mixinDatacomErrorMessage = null;
              }
            }
          } else {
            this.mixinDatacomLoading = false;
            this._clearChart();
            this.showchart = false;
            this.mixinDatacomErrorMessage = "参数错误：chartData数据类型错误";
          }
        },
        immediate: false,
        deep: true
      },
      localdata: {
        handler(val, oldval) {
          if (JSON.stringify(val) !== JSON.stringify(oldval)) {
            if (val.length > 0) {
              this.beforeInit();
            } else {
              this.mixinDatacomLoading = true;
              this._clearChart();
              this.showchart = false;
              this.mixinDatacomErrorMessage = null;
            }
          }
        },
        immediate: false,
        deep: true
      },
      optsProps: {
        handler(val, oldval) {
          if (typeof val === "object") {
            if (JSON.stringify(val) !== JSON.stringify(oldval) && this.echarts === false && this.optsWatch == true) {
              this.checkData(this.drawData);
            }
          } else {
            this.mixinDatacomLoading = false;
            this._clearChart();
            this.showchart = false;
            this.mixinDatacomErrorMessage = "参数错误：opts数据类型错误";
          }
        },
        immediate: false,
        deep: true
      },
      eoptsProps: {
        handler(val, oldval) {
          if (typeof val === "object") {
            if (JSON.stringify(val) !== JSON.stringify(oldval) && this.echarts === true) {
              this.checkData(this.drawData);
            }
          } else {
            this.mixinDatacomLoading = false;
            this.showchart = false;
            this.mixinDatacomErrorMessage = "参数错误：eopts数据类型错误";
          }
        },
        immediate: false,
        deep: true
      },
      reshow(val, oldval) {
        if (val === true && this.mixinDatacomLoading === false) {
          setTimeout(() => {
            this.mixinDatacomErrorMessage = null;
            this.echartsResize.state = !this.echartsResize.state;
            this.checkData(this.drawData);
          }, 200);
        }
      },
      reload(val, oldval) {
        if (val === true) {
          this.showchart = false;
          this.mixinDatacomErrorMessage = null;
          this.reloading();
        }
      },
      mixinDatacomErrorMessage(val, oldval) {
        if (val) {
          this.emitMsg({ name: "error", params: { type: "error", errorShow: this.errorShow, msg: val, id: this.cid } });
          if (this.errorShow) {
            formatAppLog("log", "at uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue:611", "[秋云图表组件]" + val);
          }
        }
      },
      errorMessage(val, oldval) {
        if (val && this.errorShow && val !== null && val !== "null" && val !== "") {
          this.showchart = false;
          this.mixinDatacomLoading = false;
          this.mixinDatacomErrorMessage = val;
        } else {
          this.showchart = false;
          this.mixinDatacomErrorMessage = null;
          this.reloading();
        }
      }
    },
    computed: {
      optsProps() {
        return JSON.parse(JSON.stringify(this.opts));
      },
      eoptsProps() {
        return JSON.parse(JSON.stringify(this.eopts));
      },
      chartDataProps() {
        return JSON.parse(JSON.stringify(this.chartData));
      }
    },
    methods: {
      beforeInit() {
        this.mixinDatacomErrorMessage = null;
        if (typeof this.chartData === "object" && this.chartData != null && this.chartData.series !== void 0 && this.chartData.series.length > 0) {
          this.drawData = deepCloneAssign({}, this.chartData);
          this.mixinDatacomLoading = false;
          this.showchart = true;
          this.checkData(this.chartData);
        } else if (this.localdata.length > 0) {
          this.mixinDatacomLoading = false;
          this.showchart = true;
          this.localdataInit(this.localdata);
        } else if (this.collection !== "") {
          this.mixinDatacomLoading = false;
          this.getCloudData();
        } else {
          this.mixinDatacomLoading = true;
        }
      },
      localdataInit(resdata) {
        if (this.groupEnum.length > 0) {
          for (let i2 = 0; i2 < resdata.length; i2++) {
            for (let j2 = 0; j2 < this.groupEnum.length; j2++) {
              if (resdata[i2].group === this.groupEnum[j2].value) {
                resdata[i2].group = this.groupEnum[j2].text;
              }
            }
          }
        }
        if (this.textEnum.length > 0) {
          for (let i2 = 0; i2 < resdata.length; i2++) {
            for (let j2 = 0; j2 < this.textEnum.length; j2++) {
              if (resdata[i2].text === this.textEnum[j2].value) {
                resdata[i2].text = this.textEnum[j2].text;
              }
            }
          }
        }
        let needCategories = false;
        let tmpData = { categories: [], series: [] };
        let tmpcategories = [];
        let tmpseries = [];
        if (this.echarts === true) {
          needCategories = cfe.categories.includes(this.type);
        } else {
          needCategories = cfu.categories.includes(this.type);
        }
        if (needCategories === true) {
          if (this.chartData && this.chartData.categories && this.chartData.categories.length > 0) {
            tmpcategories = this.chartData.categories;
          } else {
            if (this.startDate && this.endDate) {
              let idate = new Date(this.startDate);
              let edate = new Date(this.endDate);
              while (idate <= edate) {
                tmpcategories.push(getFormatDate(idate));
                idate = idate.setDate(idate.getDate() + 1);
                idate = new Date(idate);
              }
            } else {
              let tempckey = {};
              resdata.map(function(item, index) {
                if (item.text != void 0 && !tempckey[item.text]) {
                  tmpcategories.push(item.text);
                  tempckey[item.text] = true;
                }
              });
            }
          }
          tmpData.categories = tmpcategories;
        }
        let tempskey = {};
        resdata.map(function(item, index) {
          if (item.group != void 0 && !tempskey[item.group]) {
            tmpseries.push({ name: item.group, data: [] });
            tempskey[item.group] = true;
          }
        });
        if (tmpseries.length == 0) {
          tmpseries = [{ name: "默认分组", data: [] }];
          if (needCategories === true) {
            for (let j2 = 0; j2 < tmpcategories.length; j2++) {
              let seriesdata = 0;
              for (let i2 = 0; i2 < resdata.length; i2++) {
                if (resdata[i2].text == tmpcategories[j2]) {
                  seriesdata = resdata[i2].value;
                }
              }
              tmpseries[0].data.push(seriesdata);
            }
          } else {
            for (let i2 = 0; i2 < resdata.length; i2++) {
              tmpseries[0].data.push({ "name": resdata[i2].text, "value": resdata[i2].value });
            }
          }
        } else {
          for (let k = 0; k < tmpseries.length; k++) {
            if (tmpcategories.length > 0) {
              for (let j2 = 0; j2 < tmpcategories.length; j2++) {
                let seriesdata = 0;
                for (let i2 = 0; i2 < resdata.length; i2++) {
                  if (tmpseries[k].name == resdata[i2].group && resdata[i2].text == tmpcategories[j2]) {
                    seriesdata = resdata[i2].value;
                  }
                }
                tmpseries[k].data.push(seriesdata);
              }
            } else {
              for (let i2 = 0; i2 < resdata.length; i2++) {
                if (tmpseries[k].name == resdata[i2].group) {
                  tmpseries[k].data.push(resdata[i2].value);
                }
              }
            }
          }
        }
        tmpData.series = tmpseries;
        this.drawData = deepCloneAssign({}, tmpData);
        this.checkData(tmpData);
      },
      reloading() {
        if (this.errorReload === false) {
          return;
        }
        this.showchart = false;
        this.mixinDatacomErrorMessage = null;
        if (this.collection !== "") {
          this.mixinDatacomLoading = false;
          this.onMixinDatacomPropsChange(true);
        } else {
          this.beforeInit();
        }
      },
      checkData(anyData) {
        let cid = this.cid;
        if (this.echarts === true) {
          cfe.option[cid] = deepCloneAssign({}, this.eopts);
          cfe.option[cid].id = cid;
          cfe.option[cid].type = this.type;
        } else {
          if (this.type && cfu.type.includes(this.type)) {
            cfu.option[cid] = deepCloneAssign({}, cfu[this.type], this.opts);
            cfu.option[cid].canvasId = cid;
          } else {
            this.mixinDatacomLoading = false;
            this.showchart = false;
            this.mixinDatacomErrorMessage = "参数错误：props参数中type类型不正确";
          }
        }
        let newData = deepCloneAssign({}, anyData);
        if (newData.series !== void 0 && newData.series.length > 0) {
          this.mixinDatacomErrorMessage = null;
          if (this.echarts === true) {
            cfe.option[cid].chartData = newData;
            this.$nextTick(() => {
              this.init();
            });
          } else {
            cfu.option[cid].categories = newData.categories;
            cfu.option[cid].series = newData.series;
            this.$nextTick(() => {
              this.init();
            });
          }
        }
      },
      resizeHandler() {
        let currTime = Date.now();
        let lastDrawTime = this.lastDrawTime ? this.lastDrawTime : currTime - 3e3;
        let duration = currTime - lastDrawTime;
        if (duration < 1e3)
          return;
        uni.createSelectorQuery().in(this).select("#ChartBoxId" + this.cid).boundingClientRect((data) => {
          this.showchart = true;
          if (data.width > 0 && data.height > 0) {
            if (data.width !== this.cWidth || data.height !== this.cHeight) {
              this.checkData(this.drawData);
            }
          }
        }).exec();
      },
      getCloudData() {
        if (this.mixinDatacomLoading == true) {
          return;
        }
        this.mixinDatacomLoading = true;
        this.mixinDatacomGet().then((res) => {
          this.mixinDatacomResData = res.result.data;
          this.localdataInit(this.mixinDatacomResData);
        }).catch((err) => {
          this.mixinDatacomLoading = false;
          this.showchart = false;
          this.mixinDatacomErrorMessage = "请求错误：" + err;
        });
      },
      onMixinDatacomPropsChange(needReset, changed) {
        if (needReset == true && this.collection !== "") {
          this.showchart = false;
          this.mixinDatacomErrorMessage = null;
          this._clearChart();
          this.getCloudData();
        }
      },
      _clearChart() {
        let cid = this.cid;
        if (this.echarts !== true && cfu.option[cid] && cfu.option[cid].context) {
          const ctx = cfu.option[cid].context;
          if (typeof ctx === "object" && !!!cfu.option[cid].update) {
            ctx.clearRect(0, 0, this.cWidth * this.pixel, this.cHeight * this.pixel);
            ctx.draw();
          }
        }
      },
      init() {
        let cid = this.cid;
        uni.createSelectorQuery().in(this).select("#ChartBoxId" + cid).boundingClientRect((data) => {
          if (data.width > 0 && data.height > 0) {
            this.mixinDatacomLoading = false;
            this.showchart = true;
            this.lastDrawTime = Date.now();
            this.cWidth = data.width;
            this.cHeight = data.height;
            if (this.echarts !== true) {
              cfu.option[cid].background = this.background == "rgba(0,0,0,0)" ? "#FFFFFF" : this.background;
              cfu.option[cid].canvas2d = this.type2d;
              cfu.option[cid].pixelRatio = this.pixel;
              cfu.option[cid].animation = this.animation;
              cfu.option[cid].width = data.width * this.pixel;
              cfu.option[cid].height = data.height * this.pixel;
              cfu.option[cid].onzoom = this.onzoom;
              cfu.option[cid].ontap = this.ontap;
              cfu.option[cid].ontouch = this.ontouch;
              cfu.option[cid].onmouse = this.openmouse;
              cfu.option[cid].onmovetip = this.onmovetip;
              cfu.option[cid].tooltipShow = this.tooltipShow;
              cfu.option[cid].tooltipFormat = this.tooltipFormat;
              cfu.option[cid].tooltipCustom = this.tooltipCustom;
              cfu.option[cid].inScrollView = this.inScrollView;
              cfu.option[cid].lastDrawTime = this.lastDrawTime;
              cfu.option[cid].tapLegend = this.tapLegend;
            }
            if (this.inH5 || this.inApp) {
              if (this.echarts == true) {
                cfe.option[cid].ontap = this.ontap;
                cfe.option[cid].onmouse = this.openmouse;
                cfe.option[cid].tooltipShow = this.tooltipShow;
                cfe.option[cid].tooltipFormat = this.tooltipFormat;
                cfe.option[cid].tooltipCustom = this.tooltipCustom;
                cfe.option[cid].lastDrawTime = this.lastDrawTime;
                this.echartsOpts = deepCloneAssign({}, cfe.option[cid]);
              } else {
                cfu.option[cid].rotateLock = cfu.option[cid].rotate;
                this.uchartsOpts = deepCloneAssign({}, cfu.option[cid]);
              }
            } else {
              cfu.option[cid] = formatterAssign(cfu.option[cid], cfu.formatter);
              this.mixinDatacomErrorMessage = null;
              this.mixinDatacomLoading = false;
              this.showchart = true;
              this.$nextTick(() => {
                if (this.type2d === true) {
                  const query = uni.createSelectorQuery().in(this);
                  query.select("#" + cid).fields({ node: true, size: true }).exec((res) => {
                    if (res[0]) {
                      const canvas = res[0].node;
                      const ctx = canvas.getContext("2d", { willReadFrequently: true });
                      cfu.option[cid].context = ctx;
                      cfu.option[cid].rotateLock = cfu.option[cid].rotate;
                      if (cfu.instance[cid] && cfu.option[cid] && cfu.option[cid].update === true) {
                        this._updataUChart(cid);
                      } else {
                        canvas.width = data.width * this.pixel;
                        canvas.height = data.height * this.pixel;
                        canvas._width = data.width * this.pixel;
                        canvas._height = data.height * this.pixel;
                        setTimeout(() => {
                          cfu.option[cid].context.restore();
                          cfu.option[cid].context.save();
                          this._newChart(cid);
                        }, 100);
                      }
                    } else {
                      this.showchart = false;
                      this.mixinDatacomErrorMessage = "参数错误：开启2d模式后，未获取到dom节点，canvas-id:" + cid;
                    }
                  });
                } else {
                  if (this.inAli) {
                    cfu.option[cid].rotateLock = cfu.option[cid].rotate;
                  }
                  cfu.option[cid].context = uni.createCanvasContext(cid, this);
                  if (cfu.instance[cid] && cfu.option[cid] && cfu.option[cid].update === true) {
                    this._updataUChart(cid);
                  } else {
                    setTimeout(() => {
                      cfu.option[cid].context.restore();
                      cfu.option[cid].context.save();
                      this._newChart(cid);
                    }, 100);
                  }
                }
              });
            }
          } else {
            this.mixinDatacomLoading = false;
            this.showchart = false;
            if (this.reshow == true) {
              this.mixinDatacomErrorMessage = "布局错误：未获取到父元素宽高尺寸！canvas-id:" + cid;
            }
          }
        }).exec();
      },
      saveImage() {
        uni.canvasToTempFilePath({
          canvasId: this.cid,
          success: (res) => {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function() {
                uni.showToast({
                  title: "保存成功",
                  duration: 2e3
                });
              }
            });
          }
        }, this);
      },
      getImage() {
        if (this.type2d == false) {
          uni.canvasToTempFilePath({
            canvasId: this.cid,
            success: (res) => {
              this.emitMsg({ name: "getImage", params: { type: "getImage", base64: res.tempFilePath } });
            }
          }, this);
        } else {
          const query = uni.createSelectorQuery().in(this);
          query.select("#" + this.cid).fields({ node: true, size: true }).exec((res) => {
            if (res[0]) {
              const canvas = res[0].node;
              this.emitMsg({ name: "getImage", params: { type: "getImage", base64: canvas.toDataURL("image/png") } });
            }
          });
        }
      },
      _error(e2) {
        this.mixinDatacomErrorMessage = e2.detail.errMsg;
      },
      emitMsg(msg) {
        this.$emit(msg.name, msg.params);
      },
      getRenderType() {
        if (this.echarts === true && this.mixinDatacomLoading === false) {
          this.beforeInit();
        }
      },
      toJSON() {
        return this;
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_qiun_loading = resolveEasycom(vue.resolveDynamicComponent("qiun-loading"), __easycom_0);
    const _component_qiun_error = resolveEasycom(vue.resolveDynamicComponent("qiun-error"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "chartsview",
      id: "ChartBoxId" + $data.cid
    }, [
      _ctx.mixinDatacomLoading ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
        vue.createCommentVNode(" 自定义加载状态，请改这里 "),
        vue.createVNode(_component_qiun_loading, { loadingType: $props.loadingType }, null, 8, ["loadingType"])
      ])) : vue.createCommentVNode("v-if", true),
      _ctx.mixinDatacomErrorMessage && $props.errorShow ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        onClick: _cache[0] || (_cache[0] = (...args) => $options.reloading && $options.reloading(...args))
      }, [
        vue.createCommentVNode(" 自定义错误提示，请改这里 "),
        vue.createVNode(_component_qiun_error, { errorMessage: $props.errorMessage }, null, 8, ["errorMessage"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" APP和H5采用renderjs渲染图表 "),
      $data.echarts ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        style: vue.normalizeStyle([{ background: $props.background }, { "width": "100%", "height": "100%" }]),
        "data-directory": $props.directory,
        id: "EC" + $data.cid,
        prop: vue.wp($data.echartsOpts),
        "change:prop": _ctx.rdcharts.ecinit,
        resize: vue.wp($data.echartsResize),
        "change:resize": _ctx.rdcharts.ecresize
      }, null, 12, ["data-directory", "id", "prop", "change:prop", "resize", "change:resize"])), [
        [vue.vShow, $data.showchart]
      ]) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        onClick: _cache[2] || (_cache[2] = (...args) => _ctx.rdcharts.tap && _ctx.rdcharts.tap(...args)),
        onMousemove: _cache[3] || (_cache[3] = (...args) => _ctx.rdcharts.mouseMove && _ctx.rdcharts.mouseMove(...args)),
        onMousedown: _cache[4] || (_cache[4] = (...args) => _ctx.rdcharts.mouseDown && _ctx.rdcharts.mouseDown(...args)),
        onMouseup: _cache[5] || (_cache[5] = (...args) => _ctx.rdcharts.mouseUp && _ctx.rdcharts.mouseUp(...args)),
        onTouchstart: _cache[6] || (_cache[6] = (...args) => _ctx.rdcharts.touchStart && _ctx.rdcharts.touchStart(...args)),
        onTouchmove: _cache[7] || (_cache[7] = (...args) => _ctx.rdcharts.touchMove && _ctx.rdcharts.touchMove(...args)),
        onTouchend: _cache[8] || (_cache[8] = (...args) => _ctx.rdcharts.touchEnd && _ctx.rdcharts.touchEnd(...args)),
        id: "UC" + $data.cid,
        prop: vue.wp($data.uchartsOpts),
        "change:prop": _ctx.rdcharts.ucinit
      }, [
        vue.withDirectives(vue.createElementVNode("canvas", {
          id: $data.cid,
          canvasId: $data.cid,
          style: vue.normalizeStyle({ width: $data.cWidth + "px", height: $data.cHeight + "px", background: $props.background }),
          "disable-scroll": $props.disableScroll,
          onError: _cache[1] || (_cache[1] = (...args) => $options._error && $options._error(...args))
        }, null, 44, ["id", "canvasId", "disable-scroll"]), [
          [vue.vShow, $data.showchart]
        ])
      ], 40, ["id", "prop", "change:prop"])),
      vue.createCommentVNode(" 支付宝小程序 "),
      vue.createCommentVNode(" 其他小程序通过vue渲染图表 ")
    ], 8, ["id"]);
  }
  if (typeof block0 === "function")
    block0(_sfc_main$2);
  const __easycom_4 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-0ca34aee"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue"]]);
  const statisticsApi = {
    // 获取统计数据
    getStatistics(params) {
      return http.post("/statistics", params);
    }
  };
  const _sfc_main$1 = {
    __name: "stats",
    setup(__props, { expose: __expose }) {
      __expose();
      const isLoading = vue.ref(true);
      const showProjectPopup = vue.ref(false);
      const projectList = vue.ref([]);
      const currentProject = vue.ref({});
      const showDatePicker = vue.ref(false);
      const datePickerType = vue.ref("start");
      const startDate = vue.ref("");
      const endDate = vue.ref("");
      const currentRange = vue.ref("month");
      const dateRanges = [
        {
          label: "本月",
          value: "month"
        },
        {
          label: "上月",
          value: "lastMonth"
        },
        {
          label: "本年",
          value: "year"
        },
        {
          label: "自定义",
          value: "custom"
        }
      ];
      const totalIncome = vue.ref(0);
      const monthCompare = vue.ref(0);
      const workDays = vue.ref(0);
      const workCount = vue.ref(0);
      const overtimeCount = vue.ref(0);
      const averageDailyWage = vue.ref(0);
      const totalPointIncome = vue.ref(0);
      const totalContractIncome = vue.ref(0);
      const overtimeIncome = vue.ref(0);
      const monthlyPointIncome = vue.ref(0);
      const monthlyContractIncome = vue.ref(0);
      const pieOpts = vue.ref({
        color: ["#ff6700", "#1890ff"],
        padding: [5, 5, 5, 5],
        legend: {
          show: false
        },
        series: [{
          center: ["50%", "50%"],
          radius: ["50%", "65%"],
          labelLine: {
            show: true,
            length: 10,
            length2: 8,
            lineStyle: {
              color: "#999",
              width: 1
            }
          },
          label: {
            show: true,
            formatter: (val) => {
              return `${val.name}
${val.percent}%`;
            },
            color: "#333",
            fontSize: 12,
            lineHeight: 16,
            align: "center",
            distanceToLabelLine: 5
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: "#fff"
          }
        }]
      });
      const pieData = vue.ref({
        series: [{
          data: []
        }]
      });
      const areaOpts = vue.ref({
        color: ["#ff6700", "#1890ff"],
        padding: [15, 0, 0, 0],
        legend: {
          show: true,
          position: "bottom",
          float: "center",
          itemGap: 20,
          fontSize: 12,
          padding: 10,
          margin: 5
        },
        xAxis: {
          axisLine: true,
          axisLineColor: "#eee",
          gridType: "solid",
          gridColor: "#f5f5f5",
          rotateLabel: true,
          marginTop: 10,
          axisLabel: {
            rotate: 45,
            fontSize: 11,
            color: "#666",
            margin: 5,
            format: (val) => {
              return val.split("-").slice(1).join("-");
            }
          }
        },
        yAxis: {
          gridType: "dash",
          gridColor: "#f5f5f5",
          splitNumber: 4,
          min: 0,
          format: "yAxisDemo",
          fontSize: 11,
          color: "#666",
          margin: 10
        },
        extra: {
          area: {
            type: "curve",
            opacity: 0.15,
            gradient: true,
            addLine: true,
            lineWidth: 2,
            activeType: "hollow"
          },
          tooltip: {
            showBox: true,
            boxPadding: 3,
            boxBorderRadius: 5,
            boxBgColor: "#fff",
            boxBorderColor: "#eee",
            fontSize: 12
          }
        }
      });
      const areaData = vue.ref({
        categories: [],
        series: [{
          name: "点工收入",
          data: []
        }, {
          name: "包工收入",
          data: []
        }]
      });
      const roseOpts = vue.ref({
        padding: [5, 5, 5, 5],
        legend: {
          show: true,
          position: "bottom",
          size: 12
        },
        extra: {
          rose: {
            type: "radius",
            offsetAngle: 0,
            labelWidth: 15,
            border: false,
            borderWidth: 2,
            borderColor: "#FFFFFF"
          }
        }
      });
      const roseData = vue.ref({
        series: [{
          data: []
        }]
      });
      const chartReadyStatus = vue.ref({
        pie: false,
        area: false,
        rose: false
      });
      const tempStatisticsData = vue.ref(null);
      const isAmountHidden = vue.ref(true);
      const temporaryShow = vue.ref(false);
      let hideTimeout = null;
      const goProject = () => {
        navigateTo("/pages/project/list");
      };
      const getProjectList = async () => {
        try {
          const res = await projectApi.getList();
          if (res.success) {
            projectList.value = res.data.list;
          }
        } catch (error) {
          uni.showToast({
            title: "获取项目列表失败",
            icon: "none"
          });
        }
      };
      const selectProject = (project) => {
        currentProject.value = project;
        showProjectPopup.value = false;
        uni.setStorageSync("current_project", project);
        loadStatistics();
      };
      const selectDateRange = (range) => {
        currentRange.value = range;
        const now = /* @__PURE__ */ new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        switch (range) {
          case "month":
            startDate.value = formatDate(new Date(year, month, 1));
            endDate.value = formatDate(now);
            break;
          case "lastMonth":
            startDate.value = formatDate(new Date(year, month - 1, 1));
            endDate.value = formatDate(new Date(year, month, 0));
            break;
          case "year":
            startDate.value = formatDate(new Date(year, 0, 1));
            endDate.value = formatDate(now);
            break;
        }
        if (range !== "custom") {
          loadStatistics();
        }
      };
      const calendarStartDate = vue.computed(() => {
        return "2024-01-01";
      });
      const calendarEndDate = vue.computed(() => {
        return getNowDate();
      });
      const handleDateSelect = (date) => {
        const formattedDate = formatDate(date);
        if (datePickerType.value === "start") {
          startDate.value = formattedDate;
        } else {
          endDate.value = formattedDate;
        }
        showDatePicker.value = false;
        if (startDate.value && endDate.value) {
          currentRange.value = "custom";
          loadStatistics();
        }
      };
      const onChartComplete = (type) => {
        chartReadyStatus.value[type] = true;
        if (Object.values(chartReadyStatus.value).every((status) => status)) {
          if (tempStatisticsData.value) {
            updateChartData(tempStatisticsData.value);
          }
        }
      };
      const loadStatistics = async () => {
        if (!currentProject.value.id || !startDate.value || !endDate.value)
          return;
        try {
          const params = {
            project_id: currentProject.value.id,
            type: currentRange.value
          };
          if (currentRange.value === "custom") {
            params.start_date = startDate.value;
            params.end_date = endDate.value;
          }
          const res = await statisticsApi.getStatistics(params);
          if (res.success) {
            tempStatisticsData.value = res.data;
            updateBasicStats(res.data);
            if (Object.values(chartReadyStatus.value).every((status) => status)) {
              updateChartData(res.data);
            }
          }
        } catch (error) {
          uni.showToast({
            title: "获取统计数据失败",
            icon: "none"
          });
        }
      };
      const updateBasicStats = (data) => {
        totalIncome.value = data.statistics.total_amount;
        workDays.value = data.statistics.work_status.normal_work_count;
        workCount.value = data.statistics.total_work_days;
        monthCompare.value = data.statistics.month_compare;
        overtimeCount.value = data.statistics.overtime_count;
        averageDailyWage.value = data.statistics.average_daily_wage;
        totalPointIncome.value = data.statistics.point_income;
        totalContractIncome.value = data.statistics.contract_income;
        overtimeIncome.value = data.statistics.overtime_income;
        const currentMonthData = data.statistics.daily_income.reduce((acc, curr) => {
          acc.point += curr.point_income;
          acc.contract += curr.contract_income;
          return acc;
        }, {
          point: 0,
          contract: 0
        });
        monthlyPointIncome.value = currentMonthData.point;
        monthlyContractIncome.value = currentMonthData.contract;
      };
      const updateChartData = (data) => {
        pieData.value = {
          series: [{
            data: [{
              name: "点工收入",
              value: data.statistics.point_income
            }, {
              name: "包工收入",
              value: data.statistics.contract_income
            }]
          }]
        };
        const dailyIncome = data.statistics.daily_income;
        const dates = [];
        const pointIncomes = [];
        const contractIncomes = [];
        dailyIncome.forEach((item) => {
          dates.push(item.date.slice(5));
          pointIncomes.push(item.point_income);
          contractIncomes.push(item.contract_income);
        });
        areaData.value = {
          categories: dates,
          series: [{
            name: "点工收入",
            data: pointIncomes
          }, {
            name: "包工收入",
            data: contractIncomes
          }]
        };
        const workStatus = data.statistics.work_status;
        roseData.value = {
          series: [{
            data: [{
              name: "正常工作",
              value: workStatus.normal_work_count
            }, {
              name: "休息",
              value: workStatus.rest_count
            }, {
              name: "加班",
              value: workStatus.overtime_count
            }]
          }]
        };
        tempStatisticsData.value = null;
      };
      const loadUserSettings = () => {
        try {
          const settings = uni.getStorageSync("user_settings");
          if (settings) {
            isAmountHidden.value = settings.amount_display.hide_amount;
          }
        } catch (error) {
          formatAppLog("error", "at pages/stats/stats.vue:609", "读取用户设置失败:", error);
        }
      };
      const toggleAmountDisplay = () => {
        if (isAmountHidden.value) {
          temporaryShow.value = true;
          isAmountHidden.value = false;
          if (hideTimeout) {
            clearTimeout(hideTimeout);
          }
          hideTimeout = setTimeout(() => {
            if (temporaryShow.value) {
              isAmountHidden.value = true;
              temporaryShow.value = false;
            }
          }, 3e3);
        }
      };
      const initData = async () => {
        try {
          const cachedProject = uni.getStorageSync("current_project");
          await getProjectList();
          if (projectList.value.length === 0) {
            uni.showModal({
              title: "提示",
              content: "你还没有创建账本哦，请前往创建",
              confirmText: "去创建",
              success: (res) => {
                if (res.confirm) {
                  uni.navigateTo({
                    url: "/pages/project/form"
                  });
                }
              }
            });
            return;
          }
          currentProject.value = cachedProject || projectList.value[0];
          selectDateRange("month");
        } catch (error) {
          uni.showToast({
            title: "数据加载失败",
            icon: "none"
          });
        } finally {
          isLoading.value = false;
        }
      };
      onLoad(() => {
        uni.hideTabBar();
      });
      onShow(() => {
        loadUserSettings();
        if (!isLoading.value) {
          initData();
        }
      });
      onReady(() => {
        vue.nextTick(() => {
          initData();
        });
      });
      vue.onUnmounted(() => {
        if (hideTimeout) {
          clearTimeout(hideTimeout);
        }
      });
      const __returned__ = { isLoading, showProjectPopup, projectList, currentProject, showDatePicker, datePickerType, startDate, endDate, currentRange, dateRanges, totalIncome, monthCompare, workDays, workCount, overtimeCount, averageDailyWage, totalPointIncome, totalContractIncome, overtimeIncome, monthlyPointIncome, monthlyContractIncome, pieOpts, pieData, areaOpts, areaData, roseOpts, roseData, chartReadyStatus, tempStatisticsData, isAmountHidden, temporaryShow, get hideTimeout() {
        return hideTimeout;
      }, set hideTimeout(v2) {
        hideTimeout = v2;
      }, goProject, getProjectList, selectProject, selectDateRange, calendarStartDate, calendarEndDate, handleDateSelect, onChartComplete, loadStatistics, updateBasicStats, updateChartData, loadUserSettings, toggleAmountDisplay, initData, get onLoad() {
        return onLoad;
      }, get onReady() {
        return onReady;
      }, get onShow() {
        return onShow;
      }, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, nextTick: vue.nextTick, onUnmounted: vue.onUnmounted, get formatDate() {
        return formatDate;
      }, get formatNumber() {
        return formatNumber;
      }, get getNowDate() {
        return getNowDate;
      }, get navigateTo() {
        return navigateTo;
      }, get recordApi() {
        return recordApi;
      }, get projectApi() {
        return projectApi;
      }, get statisticsApi() {
        return statisticsApi;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ay_tabbar = resolveEasycom(vue.resolveDynamicComponent("ay-tabbar"), __easycom_0$2);
    const _component_tn_icon = resolveEasycom(vue.resolveDynamicComponent("tn-icon"), __easycom_1$2);
    const _component_ay_title = resolveEasycom(vue.resolveDynamicComponent("ay-title"), __easycom_2$2);
    const _component_NavbarWrapper = resolveEasycom(vue.resolveDynamicComponent("NavbarWrapper"), __easycom_3$1);
    const _component_qiun_data_charts = resolveEasycom(vue.resolveDynamicComponent("qiun-data-charts"), __easycom_4);
    const _component_ay_popup = resolveEasycom(vue.resolveDynamicComponent("ay-popup"), __easycom_5);
    const _component_ay_calendar = resolveEasycom(vue.resolveDynamicComponent("ay-calendar"), __easycom_6);
    return vue.openBlock(), vue.createElementBlock("view", { class: "stats-container" }, [
      vue.createVNode(_component_ay_tabbar, {
        currentTab: 1,
        "is-float": "",
        "text-only": "",
        frosted: ""
      }),
      vue.createCommentVNode(' <view class="app-header-box"></view> '),
      vue.createVNode(_component_NavbarWrapper, { sticky: "" }, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_ay_title, {
            title: "俺要记账",
            class: "ay-title"
          }, {
            right: vue.withCtx(() => {
              var _a;
              return [
                vue.createElementVNode("view", {
                  class: "project-selector",
                  onClick: _cache[0] || (_cache[0] = ($event) => $setup.showProjectPopup = true)
                }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(((_a = $setup.currentProject.name) == null ? void 0 : _a.length) > 7 ? $setup.currentProject.name.slice(0, 7) + "..." : $setup.currentProject.name || "选择项目"),
                    1
                    /* TEXT */
                  ),
                  vue.createVNode(_component_tn_icon, {
                    name: "right-double",
                    color: "#ff6700"
                  })
                ])
              ];
            }),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createCommentVNode(" 时间范围选择 "),
      vue.createElementVNode("view", { class: "date-range" }, [
        vue.createElementVNode("view", { class: "range-header" }, [
          vue.createElementVNode("text", { class: "title" }, "统计时间"),
          vue.createElementVNode("view", { class: "range-tabs" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.dateRanges, (item, index) => {
                return vue.createElementVNode("view", {
                  key: index,
                  class: vue.normalizeClass(["tab-item", { active: $setup.currentRange === item.value }]),
                  onClick: ($event) => $setup.selectDateRange(item.value)
                }, vue.toDisplayString(item.label), 11, ["onClick"]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "range-picker" }, [
          vue.createElementVNode(
            "view",
            {
              class: "date-input",
              onClick: _cache[1] || (_cache[1] = ($event) => ($setup.showDatePicker = true, $setup.datePickerType = "start"))
            },
            vue.toDisplayString($setup.startDate || "开始日期"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "separator" }, "至"),
          vue.createElementVNode(
            "view",
            {
              class: "date-input",
              onClick: _cache[2] || (_cache[2] = ($event) => ($setup.showDatePicker = true, $setup.datePickerType = "end"))
            },
            vue.toDisplayString($setup.endDate || "结束日期"),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createCommentVNode(" 总收入卡片 "),
      vue.createElementVNode("view", {
        class: "total-income",
        onClick: $setup.toggleAmountDisplay
      }, [
        vue.createElementVNode("text", { class: "income-title" }, "总收入（元）"),
        vue.createElementVNode(
          "view",
          { class: "income-amount" },
          "¥" + vue.toDisplayString($setup.isAmountHidden ? "********" : $setup.formatNumber($setup.totalIncome)),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "income-compare" }, [
          vue.createTextVNode(" 较上月 "),
          vue.createElementVNode(
            "text",
            {
              class: vue.normalizeClass(["percent", $setup.monthCompare >= 0 ? "up" : "down"])
            },
            vue.toDisplayString($setup.monthCompare >= 0 ? "+" : "") + vue.toDisplayString($setup.isAmountHidden ? "**" : $setup.monthCompare) + "% ",
            3
            /* TEXT, CLASS */
          )
        ])
      ]),
      vue.createCommentVNode(" 收入构成 "),
      vue.createElementVNode("view", { class: "chart-section" }, [
        vue.createVNode(_component_ay_title, {
          title: "收入构成",
          bold: "",
          padding: "0",
          class: "title"
        }),
        vue.createElementVNode("view", {
          class: "composition-chart",
          style: { "height": "300rpx" }
        }, [
          vue.createVNode(_component_qiun_data_charts, {
            type: "pie",
            canvas2d: "",
            canvasId: "pieChart",
            opts: $setup.pieOpts,
            chartData: $setup.pieData,
            onComplete: _cache[3] || (_cache[3] = ($event) => $setup.onChartComplete("pie"))
          }, null, 8, ["opts", "chartData"])
        ]),
        vue.createElementVNode("view", { class: "income-info" }, [
          vue.createElementVNode("view", {
            class: "income-item",
            onClick: $setup.toggleAmountDisplay
          }, [
            vue.createElementVNode("text", { class: "label" }, "点工收入"),
            vue.createElementVNode(
              "text",
              { class: "value" },
              "¥" + vue.toDisplayString($setup.isAmountHidden ? "****" : $setup.formatNumber($setup.totalPointIncome)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", {
            class: "income-item",
            onClick: $setup.toggleAmountDisplay
          }, [
            vue.createElementVNode("text", { class: "label" }, "加班收入"),
            vue.createElementVNode(
              "text",
              { class: "value" },
              "¥" + vue.toDisplayString($setup.isAmountHidden ? "****" : $setup.formatNumber($setup.overtimeIncome)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", {
            class: "income-item",
            onClick: $setup.toggleAmountDisplay
          }, [
            vue.createElementVNode("text", { class: "label" }, "包工收入"),
            vue.createElementVNode(
              "text",
              { class: "value" },
              "¥" + vue.toDisplayString($setup.isAmountHidden ? "****" : $setup.formatNumber($setup.totalContractIncome)),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createCommentVNode(" 收入趋势 "),
      vue.createElementVNode("view", { class: "chart-section" }, [
        vue.createVNode(_component_ay_title, {
          title: "收入趋势",
          bold: "",
          padding: "0",
          class: "title"
        }),
        vue.createElementVNode("view", {
          class: "trend-chart",
          style: { "height": "440rpx" }
        }, [
          vue.createVNode(_component_qiun_data_charts, {
            type: "area",
            canvas2d: "",
            canvasId: "areaChart",
            opts: $setup.areaOpts,
            chartData: $setup.areaData,
            onComplete: _cache[4] || (_cache[4] = ($event) => $setup.onChartComplete("area"))
          }, null, 8, ["opts", "chartData"])
        ])
      ]),
      vue.createCommentVNode(" 工作状态分析 "),
      vue.createElementVNode("view", { class: "chart-section" }, [
        vue.createVNode(_component_ay_title, {
          title: "工作状态分析",
          bold: "",
          padding: "0",
          class: "title"
        }),
        vue.createElementVNode("view", {
          class: "status-chart",
          style: { "height": "400rpx" }
        }, [
          vue.createVNode(_component_qiun_data_charts, {
            type: "rose",
            canvas2d: "",
            canvasId: "roseChart",
            opts: $setup.roseOpts,
            chartData: $setup.roseData,
            onComplete: _cache[5] || (_cache[5] = ($event) => $setup.onChartComplete("rose"))
          }, null, 8, ["opts", "chartData"])
        ])
      ]),
      vue.createCommentVNode(" 工作详情 "),
      vue.createElementVNode("view", { class: "work-details" }, [
        vue.createElementVNode("view", { class: "details-header" }, [
          vue.createElementVNode("text", { class: "title" }, "工作详情")
        ]),
        vue.createElementVNode("view", { class: "details-grid" }, [
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "工作天数"),
            vue.createElementVNode(
              "text",
              { class: "item-value" },
              vue.toDisplayString($setup.workDays) + "天",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "总点工数"),
            vue.createElementVNode(
              "text",
              { class: "item-value" },
              vue.toDisplayString($setup.workCount) + "个",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "加班次数"),
            vue.createElementVNode("br"),
            vue.createElementVNode(
              "text",
              { class: "item-value" },
              vue.toDisplayString($setup.overtimeCount) + "次",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", {
            class: "detail-item",
            onClick: $setup.toggleAmountDisplay
          }, [
            vue.createElementVNode("text", { class: "item-label" }, "平均日薪"),
            vue.createElementVNode("br"),
            vue.createElementVNode(
              "text",
              { class: "item-value" },
              "¥" + vue.toDisplayString($setup.isAmountHidden ? "****" : $setup.formatNumber($setup.averageDailyWage)),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createCommentVNode(" 项目选择弹出层 "),
      vue.createVNode(_component_ay_popup, {
        modelValue: $setup.showProjectPopup,
        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.showProjectPopup = $event),
        position: "left"
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "project-popup" }, [
            vue.createElementVNode("view", { class: "popup-header" }, [
              vue.createElementVNode("text", { class: "title" }, "选择项目"),
              vue.createVNode(_component_tn_icon, {
                name: "close",
                onClick: _cache[6] || (_cache[6] = ($event) => $setup.showProjectPopup = false),
                size: "40",
                color: "#666"
              })
            ]),
            vue.createElementVNode("view", { class: "project-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.projectList, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.id,
                    class: vue.normalizeClass(["project-item", { "active": $setup.currentProject.id === item.id }]),
                    onClick: ($event) => $setup.selectProject(item)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "project-name" },
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    ),
                    $setup.currentProject.id === item.id ? (vue.openBlock(), vue.createBlock(_component_tn_icon, {
                      key: 0,
                      name: "check",
                      color: "#ff6700"
                    })) : vue.createCommentVNode("v-if", true)
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("view", {
              class: "project-manage",
              onClick: $setup.goProject
            }, [
              vue.createElementVNode("view", { class: "left" }, [
                vue.createVNode(_component_tn_icon, {
                  name: "set",
                  size: "40",
                  color: "#ff6700"
                }),
                vue.createElementVNode("text", null, "项目管理")
              ]),
              vue.createVNode(_component_tn_icon, {
                name: "right",
                size: "40",
                color: "#666"
              })
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"]),
      vue.createCommentVNode(" 日期选择器 "),
      vue.createVNode(_component_ay_popup, {
        modelValue: $setup.showDatePicker,
        "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.showDatePicker = $event),
        position: "bottom"
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "calendar-container" }, [
            $setup.showDatePicker ? (vue.openBlock(), vue.createBlock(_component_ay_calendar, {
              key: 0,
              "start-date": $setup.calendarStartDate,
              "end-date": $setup.calendarEndDate,
              onDateSelected: $setup.handleDateSelect
            }, null, 8, ["start-date", "end-date"])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"])
    ]);
  }
  const PagesStatsStats = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-3598459f"], ["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/pages/stats/stats.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/person/person", PagesPersonPerson);
  __definePage("pages/project/list", PagesProjectList);
  __definePage("pages/project/form", PagesProjectForm);
  __definePage("pages/person/profile", PagesPersonProfile);
  __definePage("pages/person/changePassword", PagesPersonChangePassword);
  __definePage("pages/person/accountSettings", PagesPersonAccountSettings);
  __definePage("pages/person/about", PagesPersonAbout);
  __definePage("pages/form/accountingForm", PagesFormAccountingForm);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/forget/forget", PagesForgetForget);
  __definePage("pages/stats/stats", PagesStatsStats);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
      this.initializeApp();
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:8", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:11", "App Hide");
    },
    methods: {
      initializeApp() {
        try {
          const isFirstLaunch = !uni.getStorageSync("app_initialized");
          if (isFirstLaunch) {
            const defaultUserSettings = {
              fingerprint_unlock: {
                enabled: false,
                // 指纹解锁开关
                last_updated: null
                // 最后更新时间
              },
              amount_display: {
                hide_amount: false,
                // 是否隐藏金额
                show_decimals: true
                // 是否显示小数点
              },
              notification: {
                enabled: false
                // 通知开关
              },
              theme: {
                dark_mode: false,
                // 深色模式
                color_scheme: "default"
                // 配色方案
              }
            };
            uni.setStorageSync("user_settings", defaultUserSettings);
            uni.setStorageSync("app_initialized", true);
            uni.setStorageSync("first_launch_time", (/* @__PURE__ */ new Date()).getTime());
            formatAppLog("log", "at App.vue:48", "App initialized with default settings");
          } else {
          }
        } catch (error) {
          formatAppLog("error", "at App.vue:53", "App initialization failed:", error);
          const basicSettings = {
            fingerprint_unlock: {
              enabled: false
            },
            amount_display: {
              hide_amount: false
            }
          };
          uni.setStorageSync("user_settings", basicSettings);
        }
      }
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/2025/personal_project/bookkeeping/uni_bookkeeping/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
