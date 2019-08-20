const $$ = require("./_miakonfig");
const fs = require('fs');
const pm2 = require('pm2');

const hash = require('./hash');
const unactive_p = {};

const app = require('express')();
const server = ($$.ssl.enabled
    ? require('https').createServer({key: fs.readFileSync($$.ssl.private, 'utf8'), cert: fs.readFileSync($$.ssl.certificate, 'utf8')}, app)
    : require('http').createServer(app)
);

const MIAKI_PORT = process.env['MIAKI_PORT']
const port = $$.ssl.enabled ? 443 : MIAKI_PORT || 80;
server.listen(port, () => {
    console.info(`Listening on port: ${server.address().port}`);
});


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/api/:auth/login/', function(req, res){
    auth(req.params.auth, _=> {
        res.send({success: true, message: "You are logged-in"})
    }, _=> {
        res.send({error: {code: 'WRONG_AUTH', message:"Wrong password"}})
    });
});

pm2.connect(err => {
    if (err) {
        console.error(err);
        process.exit(2);
    }
      
    if ($$.dir) fs.readdir($$.dir, function(err, projects){
        projects.forEach(initProcess);
    });

    app.get('/api/:auth/unactive/', function(req, res){
        auth(req.params.auth, _=> {
            res.send({success: true, unactive: unactive_p})
        }, _=> {
            res.send({error: {code: 'NO_AUTH', message:"Not authentificated"}});
        });
    });

    app.post('/api/:auth/unactive/:id/', function(req, res){
        auth(req.params.auth, _=> {
            pm2.start({
                name: req.params.id,
                script: unactive_p[req.params.id].path,
                autorestart: true,
            })
            delete unactive_p[req.params.id]
            res.send({success: true, message: "Process started"})
        }, _=> {
            res.send({error: {code: 'NO_AUTH', message:"Not authentificated"}});
        });
    });

    app.get('/api/:auth/list/', function(req, res){
        auth(req.params.auth, _=> {
            pm2.list((err, processes) => {
                processes = processes.filter(p=> p.name != "miakinager").map(processGetter);
                if (!err) res.send({processes});
                else res.send(err);
            });
        }, _=> {
            res.send({error: {code: 'NO_AUTH', message:"Not authentificated"}});
        });
    });

    app.post('/api/:auth/startup/:platform/', function(req, res){y
        auth(req.params.auth, _=> {
            pm2.startup(req.param.platform, function(error, result){
                if (!error) res.send({ success: true, result });
                else res.send({error});
            });
        }, _=> {
            res.send({error: {code: 'NO_AUTH', message:"Not authentificated"}});
        });
    });

    app.get('/api/:auth/:process/', function(req, res){
        auth(req.params.auth, _=> {
            pm2.describe(req.params.process, function(error, process){
                if (!error && process[0]) {
                    fs.readFile(process[0].pm2_env.pm_out_log_path, "utf8", function(error, logs){
                        if (!error){
                            logs = crop_array(logs.split("\n"), 20);
                            fs.readFile(process[0].pm2_env.pm_err_log_path, "utf8", function(err, err_logs){
                                if (!err){
                                    err_logs = crop_array(err_logs.split("\n"), 20);
                                    
                                    res.send({
                                        infos: processGetter(process[0]),
                                        logs,
                                        err_logs
                                    });
                                }else res.send({error:{code: 'NO_LOGS', message:"Can't read logs"}});
                            });
                        }else res.send({error:{code: 'NO_LOGS', message:"Can't read logs"}});
                    });                    
                }else res.send({error});
            });
        }, _=> {
            res.send({error: {code: 'NO_AUTH', message:"Not authentificated"}});
        });
    });

    app.post('/api/:auth/:process/:action', function(req, res){
        auth(req.params.auth, _=> {
            switch (req.params.action) {   

                case "restart":
                    pm2.restart(req.params.process, function(error, _){
                       if (!error) res.send({success: true, message: "Process restarted"});
                       else res.send({error});
                    });
                    break;

                case "reload":
                    pm2.reload(req.params.process, function(error, _){
                       if (!error) res.send({success: true, message: "Process reloaded"});
                       else res.send({error});
                    });
                    break;

                case "stop":
                    pm2.stop(req.params.process, function(error, _){
                       if (!error) res.send({success: true, message: "Process stopped"});
                       else res.send({error});
                    });
                    break;
                    
                case "delete":
                    pm2.delete(req.params.process, function(error, _){
                        if (!error) res.send({success: true, message: "Process deleted"});
                        else res.send({error});
                    });
                    break;
            }
            
        }, _=> {
            res.send({error: {code: 'NO_AUTH', message:"Not authentificated"}});
        });
    });

    app.use(require('express').static("web"));

});

function processGetter(p){
    if (p){
        if (!p.pm_id) p.pm_id = "0"; 
        return {
            id: p.pm_id,
            name: p.name,
            username: p.pm2_env.username,
            version: p.pm2_env.version,
    
            memory: p.monit.memory,
            cpu: p.monit.cpu,
    
            restarts: p.pm2_env.restart_time,
            unstable_restarts: p.pm2_env.unstable_restarts,
            interpreter: p.pm2_env.exec_interpreter,
            instances: p.pm2_env.instances,
            uptime: p.pm2_env.pm_uptime,
            status: p.pm2_env.status
        }
    }
}

function crop_array(array, lines = 20){
    array = array.reverse()
    if (array.length > lines) array.length = lines
    return array.reverse()
}

function initProcess(name){
    this.name = name;
    this.path = $$.dir+name;
    fs.exists(`${this.path}/package.json`, packagefile => {
        if (packagefile && name.toUpperCase() != "MIAKINAGER"){
            try{
                let package_json = require(`${this.path}/package.json`);
                if (package_json.name != "MIAKINAGER"){
                    let infos = {
                        name: package_json.name,
                        description: package_json.description,
                        version: package_json.version,
                        startup: package_json.startup,
                        path: this.path
                    }
    
                    if (infos.startup == true) this.start();
                    else unactive_p[name] = infos;
                }
            }catch(e){}
        }
    });

    this.start = () => {
        console.log(`Starting : ${this.name}`);
        pm2.start({
            name: this.name,
            script:       `${this.path}`,         // Script to be run
            autorestart:  true,
        });
    }
}

function auth(auth, _true, _false){
    if (auth == hash.hash($$.password)) _true();
    else _false();
}
