const express = require('express');
const router = express.Router(); 
const path = require('path');
const statesController = require('../../controllers/statesController');
const verifyStates = require('../../middleware/verifyStates');   




router.route('/states')
    .get(statesController.getAllStates);




// specific REST API URL route that handles the query param 
router.route('/?contig=true')
    .get(statesController.getAllStates);




// specific REST API URL route that handles the query param
router.route('/?contig=false')
    .get(statesController.getAllStates);




// specific REST API URL route that handles the params param 
router.route('/:state')
    .get(verifyStates, statesController.getState);



// specific REST API URL route that handles the params param followed by a funfact route
router.route('/:state/funfact')
    .get(verifyStates, statesController.getFunFact)
    .post(verifyStates, statesController.createFunFacts)
    .patch(verifyStates, statesController.updateFunFact)
    .delete(verifyStates, statesController.deleteFunFact);




// specific REST API URL route that handles the params param followed by a capital route 
router.route('/:state/capital')
    .get(verifyStates, statesController.getStateCapital);




// specific REST API URL route that handles the param param followed by a nickname route
router.route('/:state/nickname')
    .get(verifyStates, statesController.getStateNickName);




// specific REST API URL route that handles the params param followed by a population route 
router.route('/:state/population')
    .get(verifyStates, statesController.getStatePopulation);




// specific REST API URL route that handles the params param followed by an admission route 
router.route('/:state/admission')
    .get(verifyStates, statesController.getStateAdmission);




module.exports = router;
