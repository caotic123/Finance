// trigger que descreve a realização da request do user para o servidor com os eventos se é bem sucedido ou não
export const insert_login = local => (
    {
      type: 'INSERT_LOGIN',
      payload: {
        events : local,
        request : {
            url : "/auth/local",
            method : "POST",
            data : {
                identifier : local.user,
                password : local.password
            }
        }
      },
    }
  );