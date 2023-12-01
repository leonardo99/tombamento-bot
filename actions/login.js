require('dotenv').config();

const signIn = async (page) => {
await page.goto(`${process.env.URL}/siafc/login`);

    await page.type(process.env.AUTH_INPUT_1, process.env.LOGIN);
    await page.type(process.env.AUTH_INPUT_2, process.env.PASSWORD);
    await page.waitForSelector(process.env.AUTH_INPUT_3);
    await page.select(process.env.AUTH_INPUT_3, process.env.AUTH_INPUT_3_VALUE);
    await page.waitForSelector(process.env.AUTH_INPUT_4)

    let captchaValue = await page.$(process.env.AUTH_INPUT_4);
    let getCaptcha = await page.evaluate(el => el.textContent, captchaValue);
    let captcha = getCaptcha.trim();

    await page.type(process.env.AUTH_INPUT_5, captcha);
    await page.click(process.env.AUTH_BUTTON_1);
}

module.exports = { signIn };