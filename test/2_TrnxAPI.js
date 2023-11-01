const axios = require("axios");
const fs = require('fs');
const jsonObj = require('../env.json');
const { expect } = require('chai');
const userObj = require('../users.json');


describe("Dmoney Transaction API Testing", () => {
    before("Admin can Login Successfully", async () => {
        const response = await axios.post(`${jsonObj.baseUrl}/user/login`, {
            "email": "salman@roadtocareer.net",
            "password": "1234"
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.data);
        console.log(response);
        fs.writeFileSync('./env.json', JSON.stringify({
            ...jsonObj, token: response.token
        }));
    });

    it("Deposit 2000tk from System account to Agent account", async () => {
        const agentAccountNo = userObj[userObj.length - 3].phone_number;

        const response = await axios.post(`${jsonObj.baseUrl}/transaction/deposit`, {
            "from_account": "SYSTEM",
            "to_account": agentAccountNo,
            "amount": 2000
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jsonObj.token,
                'X-AUTH-SECRET-KEY': jsonObj.secretKey
            }
        }).then((res) => res.data);
        console.log(response);
        expect(response.message).contains("Deposit successful");
    });

    it("Deposit 1500tk from Agent account to Customer01 account", async () => {
        const agentAccountNo = userObj[userObj.length - 3].phone_number;
        const customer01AccountNo = userObj[userObj.length - 2].phone_number;

        const response = await axios.post(`${jsonObj.baseUrl}/transaction/deposit`, {
            "from_account": agentAccountNo,
            "to_account": customer01AccountNo,
            "amount": 1500
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jsonObj.token,
                'X-AUTH-SECRET-KEY': jsonObj.secretKey
            }
        }).then((res) => res.data);
        console.log(response);
        expect(response.message).contains("Deposit successful");
    });

    it("Withdraw 500tk by the Customer01 account to Agent account", async () => {

        const customer01AccountNo = userObj[userObj.length - 2].phone_number;
        const agentAccountNo = userObj[userObj.length - 3].phone_number;

        const response = await axios.post(`${jsonObj.baseUrl}/transaction/withdraw`, {
            "from_account": customer01AccountNo,
            "to_account": agentAccountNo,
            "amount": 500
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jsonObj.token,
                'X-AUTH-SECRET-KEY': jsonObj.secretKey
            }
        }).then((res) => res.data);
        console.log(response);
        expect(response.message).contains("Withdraw successful");
    });

    it("Send money 500tk from Customer01 account to Customer02 account", async () => {

        const customer01AccountNo = userObj[userObj.length - 2].phone_number;
        const customer02AccountNo = userObj[userObj.length - 1].phone_number;

        const response = await axios.post(`${jsonObj.baseUrl}/transaction/sendmoney`, {
            "from_account": customer01AccountNo,
            "to_account": customer02AccountNo,
            "amount": 500
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jsonObj.token,
                'X-AUTH-SECRET-KEY': jsonObj.secretKey
            }
        }).then((res) => res.data);
        console.log(response);
        expect(response.message).contains("Send money successful");
    });

    it("Payment 100tk from Customer02 account to a Merchant account", async () => {

        const customer02AccountNo = userObj[userObj.length - 1].phone_number;
        const merchantAccountNo = "01686606905";

        const response = await axios.post(`${jsonObj.baseUrl}/transaction/payment`, {
            "from_account": customer02AccountNo,
            "to_account": merchantAccountNo,
            "amount": 100
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jsonObj.token,
                'X-AUTH-SECRET-KEY': jsonObj.secretKey
            }
        }).then((res) => res.data);
        console.log(response);
        expect(response.message).contains("Payment successful");
    });


    it("Check balance of the Customer02 account", async () => {

        const response = await axios.get(`${jsonObj.baseUrl}/transaction/balance/${userObj[userObj.length - 1].phone_number}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jsonObj.token,
                'X-AUTH-SECRET-KEY': jsonObj.secretKey
            }
        }).then((res) => res.data);
        console.log(response);
        expect(response.message).contains("User balance");
    });
})