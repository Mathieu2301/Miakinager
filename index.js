const $$ = require("./_miakonfig");
const fs = require('fs');
const pm2 = require('pm2');


const app = require('express')();
const server = ($$.ssl.enabled
    ? require('https').createServer({key: fs.readFileSync($$.ssl.private, 'utf8'), cert: fs.readFileSync($$.ssl.certificate, 'utf8')}, app)
    : require('http').createServer(app)
);

server.listen($$.ssl.enabled ? 433 : 80);

const unactive_p = [];
const Process = require("./process")($$, pm2, unactive_p);

pm2.connect(err => {
    if (err) {
        console.error(err);
        process.exit(2);
    }
      
    if ($$.dir) fs.readdir($$.dir, function(err, projects){
        projects.forEach(project => {
            if (project.toUpperCase() != "MIAKINAGER"){
                new Process(project);
            }
        });
    });
    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('/api/:auth/list/', function(req, res){
        if (auth(req.params.auth)){
            pm2.list((err, processes) => {
                processes = processes.map(processGetter);
                if (!err) res.send({processes});
                else res.status(500).send(err);
            });
        }else res.status(401).send({error:{code: 'NO_AUTH', message:"Not authentificated"}});
    });

    app.post('/api/:auth/startup/:platform/', function(req, res){
        if (auth(req.params.auth)){
            pm2.startup(req.param.platform, function(error, result){
                if (!error) res.send({ success: true, result });
                else res.status(401).send({error});
            });
        }else res.status(401).send({error:{code: 'NO_AUTH', message:"Not authentificated"}});
    });

    app.get('/api/:auth/:process/', function(req, res){
        if (auth(req.params.auth)){
            pm2.describe(req.params.process, function(err, process){
                if (!err && process[0]) {
                    fs.readFile(process[0].pm2_env.pm_out_log_path, "utf8", function(err, logs){
                        if (!err){
                            logs = logs.split("\n");
                            fs.readFile(process[0].pm2_env.pm_err_log_path, "utf8", function(err, err_logs){
                                if (!err){
                                    err_logs = err_logs.split("\n");
                                    res.send({
                                        infos: processGetter(process[0]),
                                        logs,
                                        err_logs
                                    });
                                }else res.status(401).send({error:{code: 'NO_LOGS', message:"Can't read logs"}});
                            });
                        }else res.status(401).send({error:{code: 'NO_LOGS', message:"Can't read logs"}});
                    });                    
                }else res.status(500).send(err);
            });
        }else res.status(401).send({error:{code: 'NO_AUTH', message:"Not authentificated"}});
    });

    app.post('/api/:auth/:process/:action', function(req, res){
        if (auth(req.params.auth)){
            switch (req.params.action) {   

                case "restart":
                    pm2.restart(req.params.process, function(error, _){
                       if (!error) res.send({success: true});
                       else res.status(401).send({error});
                    });
                    break;

                case "reload":
                    pm2.reload(req.params.process, function(error, _){
                       if (!error) res.send({success: true});
                       else res.status(401).send({error});
                    });
                    break;

                case "stop":
                    pm2.stop(req.params.process, function(error, _){
                       if (!error) res.send({success: true});
                       else res.status(401).send({error});
                    });
                    break;
                    
                case "delete":
                    pm2.delete(req.params.process, function(error, _){
                        if (!error) res.send({success: true});
                        else res.status(401).send({error});
                    });
                    break;
            }
            
        }else res.status(401).send({error:{code: 'NO_AUTH', message:"Not authentificated"}});
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

function auth(auth){
    return (auth == $$.password);
}