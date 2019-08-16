
const api = {

    url: `${location.protocol}//${location.hostname}/api/${localStorage.getItem("auth")}`,

    getList(callback){
        µ.get(`${api.url}/list`, rs => callback(rs.processes));
    },

    process(pm_id){
        return {
            getInfos(callback){
                µ.get(`${api.url}/${pm_id}`, callback);
            },

            /**
              * @param { "restart" | "reload" | "stop" | "delete" } action Action
              * @param { Function } callback Callback when the action is done
              */
            action(action, callback =_=>_){
                console.log("URL = " + `${api.url}/${pm_id}/${action}`)
                µ.post(`${api.url}/${pm_id}/${action}`, callback);
            },
        }
    }

}

const µ = {
    request(url, callback=(rs)=>{}, type = "GET"){
        let xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        xhr.onreadystatechange = function(){
            if (this.readyState === XMLHttpRequest.DONE) {
                try {
                    callback(JSON.parse(xhr.responseText));
                }catch(e){
                    callback(xhr.responseText);
                }
            }
        };
        xhr.send();
    },

    get(url, callback=rs=>rs){
        this.request(url, callback, "GET");
    },

    post(url, callback=rs=>rs){
        this.request(url, callback, "POST");
    },

    hexString: buffer => [...(new Uint8Array(buffer))].map(value => value.toString(16).padStart(2, '0')).join(''),
    encrypt(text, callback){
        window.crypto.subtle.digest('SHA-512', (new TextEncoder().encode(text))).then(buf => callback(this.hexString(buf)));
    }
}

export default api