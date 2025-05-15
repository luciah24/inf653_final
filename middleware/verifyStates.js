const data = require('../model/statesData.json');

const verifyStates = (req, res, next) => {   

    console.log("verifyStates middleware triggered");


    // create an array containing only the state codes
    const stateCodesArr = data.map(state => state.code); 

    const stateCode = stateCodesArr.find(codeElement => codeElement === req.params.state.toUpperCase());

    

    if (!stateCode) return res.status(400).json({ "message" : "Invalid state abbreviation parameter." });


    
    req.code = stateCode;
    next();
    

}     




module.exports = verifyStates;

