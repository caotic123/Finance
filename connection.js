import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://server.5dev.com.br:1337',
  responseType: 'json'
});

// Valida se há messagens de erros na resposta do servidor ou se é apenas um erro de inalcance.
export const validError = (res, error_messages, error) => {
  const { response } = res
  if (response == null) {
    // Servidor não deu nenhuma resposta...
    error_messages()
    return;
  }

  const { data } = response

  const messages = data.message.map(({ messages }) => messages.map(({ message }) => message).join(", "))
  // Passe as messagens de erros concatenadas
  error(messages.join("\n"))
}

export const try_register = (register, r, error) =>
  client.post("auth/local/register", {
    username: register.user,
    email: register.email,
    password: register.password
  }).then(() => r()).catch(err => error(err))

// Requisita o login para o servidor e executa uma clausura especificamente para sucesso e falha
export const do_login = (login_input, r, error) => {
  client.post("auth/local/", {
    identifier: login_input.user,
    password: login_input.password
  })
    .then((res) =>
      r(res))
    .catch(err => error(err))
}

export const createOperation = (user, { description, value, bank, type }, r, error) => {
  client.post("/operations", {
    description: description,
    value: value,
    bank: bank,
    type : type,

  }, {headers: { Authorization: `Bearer ${user.jwt}`}})
    .then((res) =>
      r(res))
    .catch(err => error(err))
}