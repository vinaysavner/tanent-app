module.exports={
    login:(req,res)=>{
        res.render('pages/auth/login')
    },
    dashboard:(req,res)=>{
        res.render('pages/frontend/dashboard')
    },
    signUp:(req,res)=>{
        res.render('pages/auth/register')
    },
    verify:(req,res)=>{
        res.render('pages/auth/verify')
    },
    query:(req,res)=>{
        res.render('pages/frontend/query')
    },

}