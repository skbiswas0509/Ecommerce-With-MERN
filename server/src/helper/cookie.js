const setAccessTokenCookie = (res, accessToken) => {
    res.cookie('access_token', accessToken,{
        maxAge: 15* 60 * 1000, // 15 min,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })
}

const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshtoken', refreshToken,{
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })
}

module.exports = {setAccessTokenCookie, setRefreshTokenCookie};