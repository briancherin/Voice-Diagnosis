const Alexa = require('ask-sdk-core');
const request = require('request')


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = "Welcome to Voice Diagnosis. You will tell me your symptoms one at a time, and when you tell me you are done, I will tell you your diagnosis. What is your first symptom?";
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt("What is your first symptom?")
      .getResponse();
    
  }
};

// core functionality for fact skill
const SymptomIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'IntentRequest'
        && request.intent.name === 'SymptomIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    //const user_symptom = handlerInput.requestEnvelope.request.intent.slots.symptom.value;
    
    //Get the user id for the symptom the user states
    const user_symptom_id = handlerInput.requestEnvelope.request.intent.slots.symptom.resolutions.resolutionsPerAuthority[0].values[0].value.id;
    
    if (!requestAttributes.symptomList){    //First time - initialize list
        requestAttributes.symptomList = [];
    }
    
    requestAttributes.symptomList.push(parseInt(user_symptom_id));  //Add symptom to list
    
    handlerInput.attributesManager.setSessionAttributes(requestAttributes); //Update attributes
    
    const speakOutput = "Any other symptoms?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const DoneIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' 
            && (request.intent.name ==="DoneIntent" 
                || request.intent.name === 'AMAZON.NoIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        const symptomList = requestAttributes.symptomList; //Fetch user's symptoms
        
        //Send them to the API
		
		const gender = "male";
		const birth_year = "1998";
		
		const token = process.env.API_TOKEN;
		
		let url = "https://healthservice.priaid.ch/diagnosis?language=en-gb&gender=" + gender + "&year_of_birth=" + birth_year + "&token=" + token;
		url += "&symptoms=[" + symptomList + "]";
		
		console.log("About to send request");
		
		return new Promise((resolve) => {
			
			request.get(url, {json: true}, (err, res, body) => {
				console.log("Inside request");
				let speakOutput = "";
				if (err) {
					speakOutput = "Sorry, something went wrong.";
					console.log("REQUEST ERROR:");
					console.log(err);
					
				} else {
					console.log("Request made successfully.");
					const diagnosis = body[0]["Issue"]["Name"];
					speakOutput = "Here is your diagnosis: " + diagnosis + ".";
				}
				
				 
					//Speak the diagnosis to the user
					
					console.log("Returning response.")
					
					resolve(handlerInput.responseBuilder
						.speak(speakOutput)
						.getResponse());
				
			});
		});
		
		console.log("Returing outer response");
		
		return handlerInput.responseBuilder
					.speak("Sorry, something went wrong.")
					.getResponse();
		
       
    }
}


const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(data.HELP_MESSAGE)
      .reprompt(data.HELP_REPROMPT)
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-Aug-01: AMAZON.FallbackIntent is only currently available in en-* locales.
  //              This handler will not be triggered except in those locales, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(data.FALLBACK_MESSAGE)
      .reprompt(data.FALLBACK_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(data.STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(data.ERROR_MESSAGE)
      .reprompt(data.ERROR_MESSAGE)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    SymptomIntentHandler,
    DoneIntentHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

const data = {
  translation: {
    SKILL_NAME: 'Voice Diagnosis',
    HELP_MESSAGE: 'You can say tell me your symptoms, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'Sorry, I don\'t understand.',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!'
  },
};
