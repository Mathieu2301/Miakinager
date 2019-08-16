const fs = require('fs');

module.exports = function($$, pm2, unactive_p){
    return function(name){
        this.name = name;
        this.path = $$.dir+name;
        fs.exists(`${this.path}/.miakinager`, autostart => {
            this.autostart = autostart;
            if (autostart) this.start();
            else unactive_p.push(name);
        });
    
        this.start = () => {
            console.log(`Starting : ${this.name}`);
            pm2.start({
                name: this.name,
                script:       `${this.path}`,         // Script to be run
                autorestart:  true,
            });
        }
        
        this.stop = () => {
            pm2.stop(this.name);
        }
    }
}