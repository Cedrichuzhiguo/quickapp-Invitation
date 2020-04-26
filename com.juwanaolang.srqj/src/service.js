import fetch from '@system.fetch'
import storage from '@system.storage'


const injectRef = Object.getPrototypeOf(global) || global

// 注入regeneratorRuntime
injectRef.regeneratorRuntime = require('@babel/runtime/regenerator')

const SERVER_END_POINT = "https://m.taozhuo.com";
const SERVER_END_POINT_CREATE_USER = `${SERVER_END_POINT}/fast/createUser`;
const SERVER_END_POINT_LOGIN = `${SERVER_END_POINT}/fast/AjaxLogin`;

class UserTokenService{

    constructor(){
        this.storageKey = "userInfo";
        this.currentUserInfo = null ;
    }

    async hasInvitations(){
        let invitations = await this.getInvitations();
        return invitations.length>0 ;
    }

    async getSessionToken (){
        let userInfo = await this._getUserInfo();
        return userInfo.sessionToken || null;
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
    
    async prepare(){
        let userInfo = await this._getUserInfo();
        if (userInfo){
            console.log('Now login user');
            let loginResult = await this._loginUser(userInfo);

            userInfo.sessionToken = loginResult.sessionToken;
            userInfo.user = loginResult.user;
        }else{
            console.log('Now create user.');
            userInfo = await this._createNewUser();
            console.log('user info:', userInfo);
            userInfo.invitations = [];
        }
        await this._saveUserInfo(userInfo);
        this.Current_Session_Token = userInfo.sessionToken ;
        return userInfo;
    }

    async _getUserInfo(){
        try{
            let storedValue = await storage.get({key: this.storageKey});
            console.log("Return userInfo from storage:", storedValue);
            let userInfo = JSON.parse(storedValue.data);
            return userInfo || {};
        }catch(e){
            console.log(`Cannot get userInfo: ${e.message}`);
            return null;
        }
    }

    async _saveUserInfo(userInfo){
        await storage.set({key: this.storageKey, value: JSON.stringify(userInfo)});
    }


    async _createNewUser(){
        const res = await fetch.fetch({
            url: SERVER_END_POINT_CREATE_USER,
            method: 'post'
        });

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
        const result = res.data;
        console.log('result:', result);
        if(result.code == 200){
            let json = JSON.parse(result.data);
            console.log(`User creation response: ${JSON.stringify(json)}`);

            if (json.code == 200 && json.data){
                return json.data ;
            }
        }

        throw 'Create user failed';
    }

    async _loginUser(userInfo){
        let {uid, token} = userInfo ;
        const res = await fetch.fetch({
            url: SERVER_END_POINT_LOGIN,
            method: 'post',
            data: {uid: uid, token, token} 
        });
        const result = res.data;
        console.log('result:', result);
        if(result.code == 200){
            let json = JSON.parse(result.data);
            console.log(`User login response: `, json);

            if (json.code == 200 && json.data){
                console.log('return success login result:', json.data);
                return json.data;
            }
        }
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
        throw 'Login user failed!';

    }

    async getInvitations(){
        let userInfo = await this._getUserInfo() || {};
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



setTimeout(function(){
    glb_userTokenService.prepare();
}, 100);

const globalRef = Object.getPrototypeOf(global) || global

globalRef.userService = glb_userTokenService;


module.exports = globalRef.userService;