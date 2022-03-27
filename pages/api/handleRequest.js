const OpenAI = require('openai-api')

async function sendQuery(prompt, operation) {

  const openai = new OpenAI(process.env.OPENAI_API_KEY);
  var gptResponse;

  switch(operation) {
    
    // [Brainstorm] Model for generating an elevator pitch or new business idea
    case 'brainstorm':
      gptResponse = await openai.complete({
        engine: 'davinci',
        prompt: prompt,
        maxTokens: 100,
        temperature: 0.7,
        topP: 1.0,
        presencePenalty: 1,
        frequencyPenalty: 1,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ["stop"]
      });
      break;
    
    // [Idea To Code] Model for generating code from a rough text description
    case 'ideaToCode':
      gptResponse = await openai.complete({
        engine: 'code-davinci-002',
        prompt: prompt,
        maxTokens: 256,
        temperature: 0.1,
        topP: 1.0,
        presencePenalty: 0,
        frequencyPenalty: 0,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ["# Create"]
      });
      break;
    
    // [Transpiler] Model for translating a code snippet into a different language
    case 'transpileCode':
      gptResponse = await openai.complete({
        engine: 'code-davinci-002',
        prompt: prompt,
        maxTokens: 256,
        temperature: 0,
        topP: 1.0,
        presencePenalty: 0,
        frequencyPenalty: 0,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ["# Convert"]
      });
      break;
    
    // [Optimizer] Model for optimizing a code snippet
    case 'optimizeCode':
      gptResponse = await openai.complete({
        engine: 'code-davinci-002',
        prompt: prompt,
        maxTokens: 256,
        temperature: 0,
        topP: 1.0,
        presencePenalty: 0,
        frequencyPenalty: 0,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ["# End"]
      });
      break;
    
    default:
      throw new Error('Invalid operation');
  }

  return gptResponse.data.choices[0].text;

}

export default async function handler(req, res) {

  //Check the request has specified an operation
  if (!req.body.operation) {
    res.status(400).send('No operation specified');
    return;
  }

  //Check the request has specified a prompt
  if(!req.body.prompt){
    res.status(400).json({error: 'No prompt supplied'})
    return;
  }

  //Prompt String passed to the model for completion
  const prompt_string = req.body.prompt;
  const operation = req.body.operation;

  //Send request to OpenAI API
  try{
    const response = await sendQuery(prompt_string, operation);
    res.status(200).json({data: response})  
  }catch(error){
    res.status(500).json({error: error.message})
  }

}
