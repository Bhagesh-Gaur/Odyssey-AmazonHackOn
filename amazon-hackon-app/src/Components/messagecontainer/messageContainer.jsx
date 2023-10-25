import React from "react"
import styles2 from './msgC.module.css'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './main.scss'
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator

} from "@chatscope/chat-ui-kit-react";
import { useState } from 'react';
import { Link } from "react-router-dom";


const API_KEY = "YOUR API KEY HERE";

const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": ` 
        Custom Instructions:
      --------
      You are a Assistive Alexa Feature in the Amazon platform and your name is SmartShop Alexa. The user tells you about the activity and task they are thinking about and potentially telling you the context surrounding it. As an assistant you will discuss users's needs and give suggestions, ask questions to understand the requirements keeping in mind that the end goal is to get users a comprehensive checklist of products they would require to complete this task or organise any particular event.
      When asked who you are, you say you are SmartShop Alexa and not chatgpt.

      --------
      In the response you would initially introduce yourself as Amazon's SmartShop Alexa, following which you would enquire about any additional requirements for the event while also presenting a preliminary checklist of products required to complete the task or organise that particular event. Then ask followups or give suggestions. Finally end by asking if the user seems satisfied with the list curated. 

      Following would be the format of the checklist generated:
      For a sample case in which user is going on a date and asking SmartShop AI the forllowing:
      ' I am going on a date suggest something for me'

      The initial checklist would look like:

      Checklist Name: Untitled Checklist
      o Flowers
      o Table Cloth
      o candles
      o wine glass
      o napkins
      o room freshers 

      Note that if the scenario seems to showcase that user might need a streamming service, you can recommend Amazon Prime Video and if user might need music streamming recommend amazon services like Amazon Prime Music in case required.
      Don't include explannaions in the checklist. Just the list of items.
      Don't include multiple items in one line. Each item should be in a separate line.
      Only include items which you can buy on Amazon.
      You must strictly follow these conditions.
  `
}

const MessageContainer = () =>{
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm SmartShop! What's on your mind today?",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isInputActive, setInputActive] = useState(false);


  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    setInputActive(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      // console.log(data);

  
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setInputActive(false);
      setIsTyping(false);
    });
  }

  const finalClickHandler = async () => {
      if (!isTyping) {
        const finalMessage = `Give me the final list of items from the last message in the following format: [item1, item2, item3]. 
        Don't include any other text like any further help or here is your list. Only return the list in teh required format.`;
          
          const newMessage = {
              message: finalMessage,
              direction: 'outgoing',
              sender: "user"
          };

          const newMessages = [...messages, newMessage];

          // Process the message and print the response in the console
          const response = await getfinallist(newMessages);
          window.open(`http://localhost:3000/checklist?items=${response}`)
        }

  };

  async function getfinallist(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
        let role = "";
        if (messageObject.sender === "ChatGPT") {
          role = "assistant";
        } else {
          role = "user";
        }
        return { role: role, content: messageObject.message}
      });


      // Get the request body set up with the model we plan to use
      // and the messages which we formatted above. We add a system message in the front to'
      // determine how we want chatGPT to act. 
      const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
          systemMessage,  // The system message DEFINES the logic of our chatGPT
          ...apiMessages // The messages from our chat with ChatGPT
        ]
      }

      let responseData;
      await fetch("https://api.openai.com/v1/chat/completions", 
      {
          method: "POST",
          headers: {
              "Authorization": "Bearer " + API_KEY,
              "Content-Type": "application/json"
          },
          body: JSON.stringify(apiRequestBody)
      }).then((data) => {
          return data.json();
      }).then((data) => {
          responseData = data.choices[0].message.content;
          setInputActive(false);
          setIsTyping(false);
      });

      return responseData; // Return the data to be printed in the console
  }

  const talkMoreClickHandler = () =>{
    setInputActive(false)
  }
  return (
    <div className="App">
      
      <div style={{ position:"relative", height: "450px", width: "550px"  }}>
      
        <MainContainer className={styles2.mainBg} >
          
          <ChatContainer >   
                
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="SmartShop Alexa is typing" /> : null}
            >
              {messages.map((message, i) => {
                // console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
          
            <MessageInput  disabled={isInputActive} attachButton={false} placeholder={!isTyping ? "Write message here" : "Wait..."} onSend={handleSend} />   
            
          </ChatContainer>
          
        </MainContainer>
        <div className={styles2.finArea}>
          <button  className={styles2.btn} onClick={finalClickHandler}>
            Add Items to CheckList
          </button>
          
        </div>
      </div>
      
    
    </div>
  
    )
}

export default  MessageContainer