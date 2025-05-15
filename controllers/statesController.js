const State = require('../model/State'); 

const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data } 
};


const getAllStates = async (req, res) => {

    
    // put the all the state objects from the statesData.json file in an array 
    const stateObjectsInAnArr = data.states;


    // revise stateObjectsInAnArrcontig if requesting contig or noncontig states
    if (req.query.contig === 'true') {

        stateObjectsInAnArr = stateObjectsInAnArr.filter(state => state.admission_number <= 48);

  
    }
    else if (req.query.contig === 'false') {

        stateObjectsInAnArr = stateObjectsInAnArr.filter(state => state.admission_number >= 48);

    }


    // retrieve the documents from MongoDB and put them in an array 
    const stateDocs = await State.find(); 
    const stateMap = new Map();

    for (let state of stateDocs)
    {
        stateMap.set(state.stateCode, state); // set the stateCode as the key for each state object in the array 

    }

    for (let i = 0; i < stateObjectsInAnArr.length; i++)
    {
        // if the state is found in a MongoDB document, it will be stored in the state object. otherwise, the state object will be undefined. 
        const state = stateMap.get(stateObjectsInAnArr[i].code); 

        // if the funfacts property doesnt exist, initialize it
        if (!stateObjectsInAnArr[i].funfacts)  stateObjectsInAnArr[i].funfacts = [];


        // retrieve the funfacts property value from said state's MongoDB document and create a new funfacts property 
        // for the state object in stateObjectsInAnArr and attach the funfacts array value from 
        // MongoDB as the value for the new funfacts property in stateObjectsInAnArr
        if (state) stateObjectsInAnArr[i].funfacts.push(...state.funfacts);



    }
    
      
    res.json(stateObjectsInAnArr); // will still return all states only if no query of contig is defined 


}




const getState = async (req, res) => {

    
    const state = data.states.find((state) => state.code === req.params.state.toUpperCase());
 

    // put the mongoDB document in an object 
    const stateMongoObj = await State.findOne({ stateCode: state.code });
   
   
   
    if (stateMongoObj) {


        // if the state does not come with a funfacts property, create one and initialize
        if (!state.funfacts) state.funfacts = [];


        state.funfacts.push(...stateMongoObj.funfacts);

      

    }

 
      res.json(state);


}


const getFunFact = async (req, res) => {

    // state will contain the state object
    const state = data.states.find((state) => state.code === req.params.state.toUpperCase());

    
    // put the mongoDB document in an object 
    const stateMongoObj = await State.findOne({ stateCode: state.code});
   
    
   
    if (stateMongoObj) {

        
        // if the state does not come with no fun facts, send error message
        if (!state.funfacts) return res.status(404).json({ 'message': `No fun facts found for ${state.state}`})



        state.funfacts.push(...stateObj.funfacts);
      
      
        const random = Math.floor[Math.random() * state.funfacts.length];

        res.json({ 'funfact': `${state.funfacts[random]}` })

    }
 



}


const getStateCapital = async (req, res) => {


    
    // state will contain the state object
    const state = data.states.find((state) => state.code === req.params.state.toUpperCase());


   
    res.json({ "state": state.state, "capital": state.capital_city});

}



const getStateNickName = (req, res) => {

        
    // state will contain the state object
    const state = data.states.find((state) => state.code === req.params.state.toUpperCase());

   

    res.json({ "state": state.state, "nickname": state.nickname});

   

}


const getStatePopulation = (req, res) => {


    // state will contain the state object
    const state = data.states.find((state) => state.code === req.params.state.toUpperCase());


    res.json({ "state": state.state, "population": state.population});


}


const getStateAdmission = (req, res) => {


    // state will contain the state object
    const state = data.states.find((state) => state.code === req.params.state.toUpperCase());


    res.json({ "state": state.state, "admission": state.admission});


}



const createFunFacts = async (req, res) => {

  
    const { funfacts } = req.body; 

    // to check if a funfacts property was even provided in the body of the request 
    if (!funfacts) return res.status(404).json({ "message": "Fun facts is required." });


    // if the funfaccts property value is not in the form of an array, send error message
    if (!Array.isArray(funfacts)) return res.status(400).json({ "message": "Fun facts value must be an array." });

    const stateCodeParam = req.params.state.toUpperCase();

    
    const stateDoc = await State.findOne({ stateCode: stateCodeParam });
   
       if (stateDoc) {
              
           stateDoc.funfacts.push(...funfacts);
           await stateDoc.save();

           return res.json(stateDoc); 
           
       }
   
   
       try {
           // create and store the fun fact 
           const result = await State.create( {
               "stateCode": stateCodeParam,
               "funfacts": funfacts
   
           });
   
           res.status(201).json(result);
   
   
   
        } catch(err) {
   
           res.status(500).json({ "message": err.message });
        }
   



}


const updateFunFact = async (req, res) => {

    // if index and funfact are required, deconstruct them
     const { index, funfact } = {
        "index": req.body.index, 
        "funfact": req.body.funfact 

    }


    if (!index) return res.status(404).json({ "message": "Index is required." });


    if (!funfact) return res.status(404).json({ "message": "Fun facts is required." });


    // if no index, send error response 
    if (typeof index !== 'number' || index < 1) return res.status(400).json({ "message": "Index must be a number starting from 1." }); 

   
    // put the mongoDB document in an object 
    const stateMongoObj = await State.findOne({ stateCode: req.params.state.toUpperCase() });

    if (!stateMongoObj.funfacts[index - 1]) return res.status(404).json({ 'message': `Fun fact at index position does not exist for ${req.params.state.toUpperCase()}.` });

    stateMongoObj.funfacts[index - 1] = funfact;


    const result = await stateMongoObj.save();
    res.json(result);


                   
}


const deleteFunFact = async (req, res) => {


    const { index } = {
        "index": req.body.index, 
        
    }

    
    // if no index, send error response 
    if (typeof index !== 'number' || index < 1) return res.status(400).json({ "message": "Index must be a number starting from 1." }); 


    // put the mongoDB document in an object 
    const stateMongoObj = await State.findOne({ stateCode: req.params.state.toUpperCase() });

    if (!stateMongoObj.funfacts || stateMongoObj.funfacts[index - 1]) return res.status(404).json({ 'message': `Fun fact at index ${index} does not exist for ${req.params.state.toUpperCase()}.` });


    // remove fun fact at specified index
   stateMongoObj.funfacts.splice(index - 1, 1);

    const result = await stateMongoObj.save();

    res.status(200).json(result);



}


module.exports = {
    getAllStates,
    getState,
    getFunFact,
    getStateCapital,
    getStateNickName,
    getStatePopulation,
    getStateAdmission,
    createFunFacts,
    updateFunFact,
    deleteFunFact

}