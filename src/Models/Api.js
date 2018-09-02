const api_token = process.env.REACT_APP_API_KEY;
const orderKey = process.env.REACT_APP_orderKey;
const groupKey = process.env.REACT_APP_groupKey;
const addressKey = process.env.REACT_APP_addressKey;

const company_domain = "testcompany100";
const url = `https://${company_domain}.pipedrive.com/v1/persons?api_token=${api_token}`

export default class Api {
  addPerson(name, group, organization, email, phone, order, address) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        [groupKey]: group,
        org_id: organization,
        email: email,
        phone: phone,
        [orderKey]: order,
        [addressKey]: address,
        visible_to: "1",
      })
    });
  }

  deletePerson(id) {
    return fetch(`https://${company_domain}.pipedrive.com/v1/persons/${id}?api_token=${api_token}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
  }

  updatePersonOrder(id, order) {
    return fetch(`https://${company_domain}.pipedrive.com/v1/persons/${id}?api_token=${api_token}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [process.env.REACT_APP_orderKey]: order,
      })
    });
  }

  findPersons(input) {
    if (input.length > 1)
      return fetch(`https://${company_domain}.pipedrive.com/v1/persons/find?term=${input}&api_token=${api_token}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(response => response.json())
        .then(data => {
          return data.data;
        });
  }

  findById(id) {
    return fetch(`https://${company_domain}.pipedrive.com/v1/persons/${id}?api_token=${api_token}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(response => response.json())
      .then(data => {
        return data.data;
      });
  }

  lastItemOrder() {
    const url = `https://${company_domain}.pipedrive.com/v1/persons?api_token=${api_token} 
    &start=0&limit=1&sort=${orderKey}%20DESC`;

    return fetch(`${url}`)
      .then(response => response.json()).then(data => data.data[0][orderKey])
  }

  findOrg(input) {
    if (input.length > 1)
      return fetch(`https://${company_domain}.pipedrive.com/v1/organizations/find?term=${input}&api_token=${api_token}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(response => response.json())
        .then(data => {
          return data.data;
        });
  }

  addOrg(name) {
    return fetch(`https://${company_domain}.pipedrive.com/v1/organizations?api_token=${api_token}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
      })
    }).then(response => response.json())
      .then(data => {
        return data.data;
      });
  }
}