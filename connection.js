import axios from 'axios';

export const client = axios.create({ //all axios can be used, shown in axios documentation
    baseURL: 'http://server.5dev.com.br:1337',
    responseType: 'json'
  });
  

export const validError = (res, error_messages, error) => {
    const {response} = res
    if (response == null) {
      error_messages()
      return;
    }

    const {data} = response
  
    const messages = data.message.map(({messages}) => messages.map(({message}) => message).join(", "))
   
    error(messages.join("\n"))
}