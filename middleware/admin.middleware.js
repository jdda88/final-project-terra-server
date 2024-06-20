function isAdmin(req, res, next) {
    try {
        if(!req.user.isAdmin){
            return res.status(401).json({message: "You are not authorized"});
        }
        next()
    } catch (error) {
        console.log("Error in the admin middlew...", error);
        res.status(500).json(error);
        
    }
}

export default isAdmin;