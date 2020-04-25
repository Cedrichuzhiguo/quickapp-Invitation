import fetch from '@system.fetch'
import storage from '@system.storage'


const SERVER_END_POINT = "https://m.taozhuo.com/fast/createUser";
const SERVER_END_POINT_CREATE_USER = `${SERVER_END_POINT}/fast/createUser`;
const SERVER_END_POINT_LOGIN = `${SERVER_END_POINT}/fast/AjaxLogin`;

class UserTokenService{

    constructor(){
        this.storageKey = "userInfo";
        this.prepareUser();
    }

    async hasInvitations(){
        let invitations = await this.getInvitations();
        return invitations.length>0 ;
    }

    async getToken (){
        let userInfo = await this.getUserInfo();
        return userInfo.token || null;
    }
    /** 
     * {
     * uid: "1732260",
     * token: "547ae77d486c2c1dd9df7a65f4a10260",
     * sessionToken: "ob6032thape5r3sf1oe16q6pu5",
     * "invitations":[{
     * }]
     * }
     * 
     * 
    */
    
    async prepareUser(){
        let userInfo = await this.getUserInfo();
        if (userInfo){
            loginResult = await this.loginUser(userInfo);
            userInfo.sessionToken = loginResult.sessionToken;
            userInfo.user = loginResult.user;
        }else{
            userInfo = await this.createNewUser();
            userInfo.invitations = [];
        }
        await this.saveUserInfo(userInfo);
        return userInfo;
    }

    async getUserInfo(){
        try{
            let userInfo = await storage.get(this.storageKey);
            console.log(`Return userInfo: ${userInfo}`);
            return userInfo || {};
        }catch(e){
            console.log(`Cannot get userInfo: ${e}`);
            return null;
        }
    }

    async saveUserInfo(userInfo){
        await storage.set(this.storageKey, userInfo);
    }


    async createNewUser(){
        const response = await fetch.fetch({
            url: SERVER_END_POINT_CREATE_USER,
            method: 'post'
        });
        const json = await response.json();
        console.log(`User creation response: ${json}`);
    /**
     * Response example:
     * {
    "code": 200,
    "msg": "登录成功",
    "data": {
        "uid": "1732260",
        "token": "547ae77d486c2c1dd9df7a65f4a10260",
        "sessionToken": "ob6032thape5r3sf1oe16q6pu5"
    }
}
    */

        if (json.code == 200 && json.data){
            return json.data ;
        }
        throw 'Create user failed';
    }

    async loginUser({uid, token}){
        const FormData = require('form-data');
        const form = new FormData();
        form.append('uid', uid).append('token', token);

        const response = await fetch.fetch({
            url: SERVER_END_POINT_LOGIN,
            method: 'POST',
            body: form 
        });
        const json = await response.json();
        console.log(`User login response: ${json}`);
        /**
         * {
    "code": 200,
    "msg": "登录成功",
    "data": {
        "sessionToken": "ob6032thape5r3sf1oe16q6pu5",
        "userInfo": {
            "id": "1732260",
            "name": "快易_774123"
        }
    }
}
         */
        if (json.code == 200 && json.data){
            return json.data ;
        }
        throw 'Login user failed!';

    }

    async getInvitations(){
        let userInfo = await this.getUserInfo() || {};
        return userInfo.invitations || [];
    }


    async setInvitations(invitations){

    }
    
    async retrieveInvitationsFromServer(){

    }

    /*
    这里用来异步读取存储了的消息。读取完成之后，回调setStoredData()。
    比如
    key="userInfo",
    */
   readDataFromStorage(){
       return new Promise((resolve, reject) => {
            storage.get({
                key: this.storageKey,
                success: function (data){
                    console.log(`Found user data ${data}`);
                    resolve(data);
                },
                fail: function(data, code) {
                    console.log(`handling fail, code = ${code}`);
                }
            });
        });
    }

    /*
    这里用来存储消息。
    key, value 都只能是字符串。比如
    key="userInfo",
    value="user=K4B3732922&pass=631735"
    */

    saveDataToStorage(){
        storage.set({
            key: this.storageKey,
            value: this.storedMessage})
    }

}

const glb_userTokenService = new UserTokenService();

module.exports = glb_userTokenService;