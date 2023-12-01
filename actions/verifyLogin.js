
const verify = async (page, login) => {
    if(page.url() !== `${process.env.URL}/siafc/gcap`) {
        await login.signIn(page);
    }
}

module.exports = { verify };