import fetch from '@system.fetch'
import storage from '@system.storage'

class UserTokenService{

    constructor(){
        this.storageKey = "userInfo"
    }

    async hasInvitations(){
        let invitations = await this.getInvitations();
        return invitations.length>0 ;
    }

    async getUserToken (){
        return 'token1233445565';
    }

    async getUserInfo(){
        
    }

    async getInvitations(){
        return [];
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