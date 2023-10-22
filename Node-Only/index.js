import openai from './config/open-ai.js'
import readlineSync from 'readline-sync'
import colors from 'colors'

async function main() {
    // const chatCompletion = await openai.chat.completions.create({
    //     model: 'gpt-3.5-turbo',
    //     messages: [
    //         {role: 'user', content: 'What is the capital of Massachusetts?'},
    //     ],
    // });

    // console.log(chatCompletion.choices[0].message.content);

    // const userName = readlineSync.question('What is your name? ');
    // console.log(`Hello ${userName}!`.green);

    console.log("Hi user! I'm SmartShop Alexa, here it help you with your tasks and to help find you the best deals on AMAZON!".bold.blue)
    const chatHistory = []; //store conversation history
    while (true) {
        const userInput = readlineSync.question(colors.bold.yellow('You: '));
        try {
            // construct messages by iterating over chatHistory
            const chatMessages = chatHistory.map(([role, content]) => ({role,content}))
            // Add latest user input
            chatMessages.push({role: 'user', content: userInput});

            // Call the API with user Input
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: chatMessages,
            });

            //Get completion result
            const completionText = completion.choices[0].message.content;
            
            if(userInput.toLowerCase() === 'exit') {
                console.log(colors.bold.green('Bot: ') + completionText);
                break;
            }

            console.log(colors.bold.green('Bot: ') + completionText);
            // update history with user input and AI response
            chatHistory.push(['user', userInput], ['assistant', completionText]);
        }
        catch (error) {
            console.log('There was an error!'.red);
            console.log(error.red);
        }
    }
}
main();