const api_token = "df3541068dfdbdc2895db305918e6ed5743c74cf";
const company_domain = "testcompany100";
const url = `https://${company_domain}.pipedrive.com/v1/persons?api_token=${api_token}`
//const groupKey = "eba502a1d2a7185f72d5a335ee7b4b75d89d3cd4";
//const localityKey = "588b8754dc0f49dc5aa5f1ad750c3a877f7dd5a1_locality";
//const countryKey = "588b8754dc0f49dc5aa5f1ad750c3a877f7dd5a1_country";
//const orderKey = "4aef6c7aeac722a72f486c85b0fba827f3bea8dd";

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
        "eba502a1d2a7185f72d5a335ee7b4b75d89d3cd4": group,
        org_id: organization,
        email: email,
        phone: phone,
        "4aef6c7aeac722a72f486c85b0fba827f3bea8dd": order,
        "588b8754dc0f49dc5aa5f1ad750c3a877f7dd5a1_formatted_address": address, //Figure out how to properly send an address.     
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