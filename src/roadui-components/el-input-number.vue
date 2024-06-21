<template>
    <el-input :modelValue="_modelValue" @update:modelValue="handleInput" @blur="handleBlur" v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue'

// 定义输入框属性类型
type IObject = {
    [props: string]: RegExp
}

// 定义组件接收的props
const props = defineProps({
    isThousands: {
        type: Boolean,
        default: true
    },
    isInteger: {
        type: Boolean,
        default: false
    },
    isMinus: {
        type: Boolean,
        default: true
    },
    modelValue: {
        type: String,
        default: ''
    }
})

// 定义组件emit的事件
const $emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()


// 使用toRefs转换props为可响应式对象
const { isThousands, isInteger, isMinus, modelValue } = toRefs(props)

/**
 * 格式化数字
 * @param num 要格式化的数字字符串
 * @returns 格式化后的数字字符串
 */
const formatNumber = (num: string) => {
    if (num === null || num === undefined || num === '') {
        return '0'
    }
    let str = num.toString()
    let flag = false
    if (/^-?\d+(.\d+)?$/.test(str)) {
        if (str.includes('.')) {
            str = str.replace(/\.(\d+)$/, ',$1')
        } else {
            str += ',00'
            flag = true
        }
        while (/\d{4}/.test(str)) {
            str = str.replace(/(\d+)(\d{3}\,)/, '$1,$2')
        }
        if (flag) {
            str = str.replace(/\,(\d+)$/, '')
        } else {
            str = str.replace(/\,(\d+)$/, '.$1')
        }
    }
    return str
}

// 计算出真正的modelValue，考虑是否千分位分隔
const _modelValue = computed(() => {
    if (isThousands.value) return formatNumber(modelValue.value)
    return modelValue.value
})

/**
 * 处理输入框失焦事件
 * 主要用于检查并修正输入的数值格式
 */
const handleBlur = () => {
    if (['.', '-'].includes(modelValue.value)) {
        $emit('update:modelValue', '');
    } else {
        const [integer, decimal] = modelValue.value.split('.')
        let _value = modelValue.value
        if (!decimal /* || decimal.length === 2 && decimal === '00' */) {
            _value = integer
        } else if (decimal.length === 1) {
            _value = `${modelValue.value}0`
        }
        if (_value === '-0') {
            _value = '0'
        }
        $emit('update:modelValue', _value)
    }
}

/**
 * 根据传入的参数返回相应的正则表达式，用于限制输入
 * @param a 是否只允许整数
 * @param b 是否允许负数
 * @returns 限制输入的正则表达式
 */
const getRegexp = (a: boolean, b: boolean): RegExp => {
    let key = `${!!a}-${!!b}`
    const map: IObject = {
        'true-true': /[^0-9\-]/g, // 正负整数
        'true-false': /[^0-9]/g, // 正整数
        'false-true': /[^0-9\.-]/g, // 正负数（含整数和小数）
        'false-false': /[^0-9\.]/g // 正数（含整数和小数）
    }
    return map[key]
}

/**
 * 处理输入事件，根据属性限制输入内容
 * @param value 用户输入的值
 */
const handleInput = (value: string) => {
    const regexp = getRegexp(isInteger.value, isMinus.value)
    const _value = value
        .replace(regexp, '') // 限制输入
        .replace(/^(-?[^-]*)-*/g, '$1') // 限制只能开头一个 -
        .replace(/\.{2,}/g, '.') // 限制只能有一个.
        .replace(/(\.\d{1,2})(.*)$/g, '$1') // 格式化小数点后长度
        .replace(/^(-?)\./, '$10.') // 以 . 或 -. 开头的补0
        .replace(/^(-?)0([0-9]+)/, '$1$2') // 去除整数部分开头的0

    $emit('update:modelValue', _value)
}
</script>