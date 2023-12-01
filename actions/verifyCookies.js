const verify = async (page) => {
    let cookies = await page.cookies();
    return cookies.filter((cookie) => cookie.value !== '').length ? true : false;
}

module.exports = { verify };
