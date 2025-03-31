import { createI18n } from 'vue-i18n'
import en from './en/index'
import zh from './zh/index'
const messages = {
    en,
    zh
}
const i18n = createI18n({
    legacy: false,
    globalInjection: true,//挂载到全局使用,template可使用$t访问,setup中useI18n(),$i18n已挂载到实例上
    locale: 'zh',
    messages
})

export default i18n
