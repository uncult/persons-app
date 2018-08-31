const api_token = process.env.REACT_APP_API_KEY;
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
        [process.env.REACT_APP_groupKey]: group,
        org_id: organization,
        email: email,
        phone: phone,
        [process.env.REACT_APP_orderKey]: order,
        [process.env.REACT_APP_addressKey]: address,
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
}