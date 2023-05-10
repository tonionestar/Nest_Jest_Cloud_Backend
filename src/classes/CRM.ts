import axios from "axios";
interface CRMResponse {
    "id": string,
    "resourceUri": string,
    "createdDate": string,
    "updatedDate": string,
    "version": number
}

class CRMClient {
    private CRM_URL_ADDRESS ="https://api.lexoffice.io/v1/contacts";

    //CRMclient Token
    private crmToken="gWaawzgN5qZ0TnmQ7XkoN6pcDukHh1jsmbsaIcUQ8du_t14T";

    public async createContact (firstName: string, lastName: string): Promise<string> {
        const data = JSON.stringify({
            "version": 0,
            "roles": {
                "customer": {}
            },
            "person": {
                "salutation": "",
                "firstName": firstName,
                "lastName": lastName
            },
            "note": "Notizen"
        });

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: this.CRM_URL_ADDRESS,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.crmToken}`
            },
            data : data
        };

        const contactResponse = await axios.request<CRMResponse>(config);
        const response = contactResponse.data;

        return response.id;
    }

    public async updateContact (id: string, firstName: string, lastName: string) {
        const configGet = {
            method: "get",
            url: `${this.CRM_URL_ADDRESS}/${id}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.crmToken}`
            },
        };

        try {
            const response = await axios.request(configGet);
            const contactGet = response.data;
            const config = {
                method: "put",
                url: `${this.CRM_URL_ADDRESS}/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.crmToken}`
                },
                data: JSON.stringify({
                    ...contactGet,
                    person: {
                        ...contactGet.person,
                        firstName: firstName,
                        lastName: lastName
                    }
                })
            };

            await axios.request<CRMResponse>(config);
        } catch (err) {
            console.log(err.response.data.IssueList);
            throw err;
        }
    }
}

export default CRMClient;
