module.exports = {
    plugins: [
        {
            // �Ƴ����elementʱ��@charset���棬����element��scss�ַ���������: @charset" must be the first rule in the file
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
                charset: (atRule) => {
                    if (atRule.name === 'charset') {
                        atRule.remove()
                    }
                }
            }
        }
    ]
}