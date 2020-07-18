// trigger que descreve a realização da request do user para o servidor com os eventos se é bem sucedido ou não
export const getBanks = user => (
  {
    type: 'GET_BANKS',
    method: "GET",
    payload: {
      request: {
        url: "/bank-accounts/",
        headers: { Authorization: `Bearer ${user.jwt}` },
      }

    },
  }
);

export const getOperations = user => (
  {
    type: 'GET_OPERATIONS',
    method: "GET",
    payload: {
      request: {
        url: "/operations",
        headers: { Authorization: `Bearer ${user.jwt}` },
      }

    },
  }
);

/*
export const createOperation = (user, { description, value, bank, type }) => (
  {
    type: 'CREATE_OPERATION',
    payload: {
      request: {
        url: "/operations",
        method: "POST",
        headers: { Authorization: `Bearer ${user.jwt}` },
        data: {
          description: description,
          value: value,
          bank: bank,
          type : type
        }
      }
    },
  }
);
*/