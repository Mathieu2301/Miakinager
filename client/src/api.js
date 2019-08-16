import 'izitoast/dist/css/iziToast.min.css'
import izitoast from 'izitoast'
import hash from './hash'

let router;

function geturl(){
    return `${location.protocol}//${location.hostname}/api/${localStorage.getItem("auth")}`
}

export default function(_router){
    router = _router;

    return {

        event: {
            process: false,
            onprocess: function(process){},
            onlist: function(list){},
        },

        login(password){
            password = hash.hash(password)
            µ.post(`${location.protocol}//${location.hostname}/api/${password}/login`, rs => {
                if (!rs.error){
                    localStorage.setItem("auth", password)
                    izitoast.success({ title: "Success !", message: rs.message })
                    router.push("/")
                }
            })
        },

        getList(callback){
            µ.get(`${geturl()}/list`, rs => callback(rs.processes))
        },

        getUnactive(callback){
            µ.get(`${geturl()}/unactive`, rs => callback(rs.unactive))
        },

        setActive(id, callback){
            µ.post(`${geturl()}/unactive/${id}`, rs => callback(rs))
        },
    
        process(pm_id){
            return {
                getInfos(callback){
                    µ.get(`${geturl()}/${pm_id}`, callback)
                },
    
                /**
                  * @param { "restart" | "reload" | "stop" | "delete" } action Action
                  * @param { Function } callback Callback when the action is done
                  */
                action(action, callback =_=>_){
                    µ.post(`${geturl()}/${pm_id}/${action}`, callback)
                },
            }
        },
    }

}

const µ = {
    request(url, callback=(rs)=>{}, type = "GET"){
        let xhr = new XMLHttpRequest()
        xhr.open(type, url, true)
        xhr.onreadystatechange = function(){
            if (this.readyState === XMLHttpRequest.DONE) {
                let rs;
                try {
                    rs = JSON.parse(xhr.responseText)
                }catch(e){
                    console.log(xhr.responseText)
                    izitoast.error({ title: "Error", message: "Can't parse server response" })
                    return
                }

                if (!rs.error) {
                    callback(rs)
                }else{
                    switch (rs.error.code) {
                        case "NO_AUTH":
                            router.replace("/login")
                            localStorage.removeItem("auth")
                            break
                        
                        case "WRONG_AUTH":
                            izitoast.error({title: "Error", message: rs.error.message})
                            break
                        
                        default:
                            let message = "Unknown error"
                            try { message = rs.error.message }catch(e){}
                            izitoast.error({title: "Error", message})
                            break
                    }
                }
            }
        }
        xhr.send()
    },

    get(url, callback=rs=>rs){
        this.request(url, callback, "GET")
    },

    post(url, callback=rs=>rs){
        this.request(url, callback, "POST")
    },

    hexString: buffer => [...(new Uint8Array(buffer))].map(value => value.toString(16).padStart(2, '0')).join(''),
    encrypt(text, callback){
        window.crypto.subtle.digest('SHA-512', (new TextEncoder().encode(text))).then(buf => callback(this.hexString(buf)))
    }
}
