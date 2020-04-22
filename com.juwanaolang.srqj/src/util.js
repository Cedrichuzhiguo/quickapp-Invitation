function createShortcut () {
    const prompt = require('@system.prompt')
    const shortcut = require('@system.shortcut')
    shortcut.hasInstalled({
        success: function (ret) {
            if (ret) {
                prompt.showToast({
                    message: '已创建桌面图标!'
                })
            } else {
                shortcut.install({
                    success: function () {
                        prompt.showToast({
                            message: '成功创建桌面图标！'
                        })
                    },
                    fail: function () {
                        prompt.showToast({
                            message: '添加桌面失败'
                        })
                    }
                })
            }
        }
    })
}
export default {
    createShortcut
}